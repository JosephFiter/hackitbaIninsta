create table if not exists ofertas (
  id          bigint primary key generated always as identity,
  titulo      text not null,
  tienda      text not null,
  tipo_oferta text not null,
  precio_original numeric not null,
  precio_split    numeric not null,
  categoria   text not null,
  descripcion text,
  publicado_por text,
  fecha       date default current_date,
  estado      text default 'buscando',
  ubicacion   text
);

-- Datos iniciales
insert into ofertas (titulo, tienda, tipo_oferta, precio_original, precio_split, categoria, descripcion, publicado_por, fecha, estado, ubicacion) values
  ('Zapatillas Nike Air Max 90', 'Nike Store - Unicenter', '2x1', 89990, 44995, 'Zapatillas', 'Promo 2x1 en zapatillas Nike Air Max 90 seleccionadas.', 'María G.', '2026-03-25', 'buscando', 'Buenos Aires'),
  ('Remeras Adidas Originals', 'Adidas Outlet - Dot', '2x1', 35990, 17995, 'Ropa', 'Llevá 2 remeras Adidas Originals al precio de 1.', 'Lucas T.', '2026-03-24', 'buscando', 'Buenos Aires'),
  ('Auriculares Sony WH-1000XM5', 'Musimundo - Alto Palermo', '50% 2da unidad', 249990, 187492, 'Electro', '50% de descuento en la segunda unidad.', 'Sofía R.', '2026-03-23', 'buscando', 'CABA'),
  ('Pack Cerveza Patagonia', 'Carrefour - Caballito', '3x2', 8990, 5993, 'Supermercado', 'Promo 3x2 en packs de 6 cervezas Patagonia.', 'Martín L.', '2026-03-26', 'buscando', 'Buenos Aires'),
  ('Zapatillas New Balance 574', 'Dexter - Abasto', '2x1', 94990, 47495, 'Zapatillas', '2x1 en New Balance 574 clásicas.', 'Ana P.', '2026-03-22', 'completo', 'CABA');
