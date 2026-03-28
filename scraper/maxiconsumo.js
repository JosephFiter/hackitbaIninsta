import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

puppeteer.use(StealthPlugin());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://maxiconsumo.com/sucursal_moreno/almacen.html';
const OUTPUT_FILE = path.join(__dirname, '..', 'productos_almacen.json');
const PER_PAGE = 96;
const DEBUG = process.argv.includes('--debug');

async function scrape() {
  console.log('Lanzando browser con stealth...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  });

  const allProducts = [];
  let currentPage = 1;

  try {
    while (true) {
      const url = `${BASE_URL}?p=${currentPage}&product_list_limit=${PER_PAGE}`;
      console.log(`Página ${currentPage}: navegando...`);

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Wait for the product grid to load
      await page.waitForSelector('ol.product-items', { timeout: 20000 }).catch(() => null);
      await new Promise((r) => setTimeout(r, 3000));

      if (DEBUG) {
        await page.screenshot({
          path: path.join(__dirname, `debug_page_${currentPage}.png`),
          fullPage: true,
        });
      }

      // Get total count on first page
      if (currentPage === 1) {
        const total = await page.evaluate(() => {
          const toolbarAmount = document.querySelector('.toolbar-amount');
          const match = toolbarAmount?.textContent?.match(/de\s+([\d.]+)/);
          return match ? match[1] : 'desconocido';
        });
        console.log(`Total de productos en el catálogo: ${total}`);
      }

      // Extract products
      const products = await page.evaluate(() => {
        const items = document.querySelectorAll('ol.product-items > li.product-item');
        return Array.from(items).map((item) => {
          const nameEl = item.querySelector('a.product-item-link');
          const imgEl  = item.querySelector('img.product-image-photo');
          const linkEl = item.querySelector('a.product-item-link');

          // Estrategias de precio (de más específica a más general).
          // Bug original: '.price-wrapper [data-price-amount]' (con espacio) busca
          // un DESCENDIENTE con ese atributo, pero en Magento el atributo está en
          // el propio .price-wrapper → el selector correcto no lleva espacio.
          let precio = null;

          // 1. data-price-amount en el propio .price-wrapper (caso más común en Magento)
          const priceWrapper = item.querySelector('.price-wrapper[data-price-amount]');
          if (priceWrapper) {
            precio = priceWrapper.getAttribute('data-price-amount');
          }

          // 2. precio final explícito (Magento configurable/bundle)
          if (!precio) {
            const finalPrice = item.querySelector('[data-price-type="finalPrice"][data-price-amount]');
            if (finalPrice) precio = finalPrice.getAttribute('data-price-amount');
          }

          // 3. meta itemprop (schema.org, presente en muchos Magento)
          if (!precio) {
            const metaEl = item.querySelector('meta[itemprop="price"]');
            if (metaEl) precio = metaEl.getAttribute('content');
          }

          // 4. Texto del precio como último recurso
          const precioTexto = item.querySelector('.price-box .price')?.textContent?.trim() || null;
          if (!precio && precioTexto) precio = precioTexto;

          return {
            nombre: nameEl?.textContent?.trim() || null,
            precio,
            precioTexto,
            imagen: imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || null,
            link: linkEl?.getAttribute('href') || null,
          };
        });
      });

      if (products.length === 0) {
        console.log(`Página ${currentPage}: sin productos. Fin.`);
        break;
      }

      const sinPrecio = products.filter((p) => !p.precio);
      console.log(
        `Página ${currentPage}: ${products.length} productos extraídos` +
        (sinPrecio.length ? ` (⚠️  ${sinPrecio.length} sin precio)` : ' ✓')
      );

      if (DEBUG && sinPrecio.length) {
        // Muestra el HTML del price-box del primer producto sin precio para diagnóstico
        const htmlSinPrecio = await page.evaluate(() => {
          const item = document.querySelector('ol.product-items > li.product-item');
          return item?.querySelector('.price-box')?.innerHTML ?? '(no encontrado)';
        });
        console.log('DEBUG price-box HTML:', htmlSinPrecio);
      }
      allProducts.push(...products);

      // Check if there's a next page
      const hasNext = await page.evaluate(() => {
        return !!document.querySelector('li.pages-item-next a');
      });

      if (!hasNext) {
        console.log('Última página alcanzada.');
        break;
      }

      currentPage++;
      // Delay between pages to be respectful
      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error('Error:', err.message);
    if (DEBUG) {
      await page.screenshot({
        path: path.join(__dirname, 'error_screenshot.png'),
        fullPage: true,
      }).catch(() => {});
    }
  } finally {
    await browser.close();
  }

  console.log(`\nTotal productos scrapeados: ${allProducts.length}`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2), 'utf-8');
  console.log(`Guardado en: ${OUTPUT_FILE}`);
}

scrape();
