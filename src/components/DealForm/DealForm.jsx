import { useState } from 'react';
import styles from './DealForm.module.css';

const categorias = ['Zapatillas', 'Ropa', 'Electro', 'Supermercado', 'Otro'];
const tiposOferta = ['2x1', '3x2', '50% 2da unidad'];

const emojisCategoria = {
  Zapatillas: '👟',
  Ropa: '👕',
  Electro: '🎧',
  Supermercado: '🛒',
  Otro: '📦',
};

export default function DealForm({ onSubmit }) {
  const [form, setForm] = useState({
    titulo: '',
    tienda: '',
    tipoOferta: '2x1',
    precioOriginal: '',
    categoria: 'Zapatillas',
    descripcion: '',
    publicadoPor: '',
    ubicacion: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function calcularPrecioSplit(precio, tipo) {
    const p = Number(precio);
    if (!p) return 0;
    if (tipo === '2x1') return Math.round(p / 2);
    if (tipo === '3x2') return Math.round((p * 2) / 3);
    if (tipo === '50% 2da unidad') return Math.round((p + p * 0.5) / 2);
    return p;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const precioSplit = calcularPrecioSplit(form.precioOriginal, form.tipoOferta);
    onSubmit({
      ...form,
      precioOriginal: Number(form.precioOriginal),
      precioSplit,
      imageEmoji: emojisCategoria[form.categoria] || '📦',
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="titulo">Producto</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          placeholder="Ej: Zapatillas Nike Air Max 90"
          value={form.titulo}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="tienda">Tienda</label>
        <input
          id="tienda"
          name="tienda"
          type="text"
          placeholder="Ej: Nike Store - Unicenter"
          value={form.tienda}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="tipoOferta">Tipo de oferta</label>
          <select id="tipoOferta" name="tipoOferta" value={form.tipoOferta} onChange={handleChange}>
            {tiposOferta.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" value={form.categoria} onChange={handleChange}>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="precioOriginal">Precio original (ARS)</label>
        <input
          id="precioOriginal"
          name="precioOriginal"
          type="number"
          min="0"
          placeholder="89990"
          value={form.precioOriginal}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="publicadoPor">Tu nombre</label>
          <input
            id="publicadoPor"
            name="publicadoPor"
            type="text"
            placeholder="Ej: María G."
            value={form.publicadoPor}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            id="ubicacion"
            name="ubicacion"
            type="text"
            placeholder="Ej: Buenos Aires"
            value={form.ubicacion}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="4"
          placeholder="Contá los detalles de la promo: talles, colores, hasta cuándo dura..."
          value={form.descripcion}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Publicar oferta
      </button>
    </form>
  );
}
