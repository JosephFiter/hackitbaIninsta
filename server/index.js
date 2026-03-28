import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import supabase from './db.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

// ── Auth middleware ────────────────────────────────────────────────────────────
async function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'No autorizado' });
  const token = auth.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ message: 'Token inválido o expirado' });
  req.user = data.user;
  next();
}

// ── Field transforms ──────────────────────────────────────────────────────────

// Aplana compra_grupal + productos anidado en un solo objeto camelCase
function compraACamel(c) {
  const p = c.productos ?? {};
  return {
    id:               c.id,
    productoId:       c.producto_id,
    // datos del producto
    nombre:           p.nombre,
    descripcion:      p.descripcion,
    imageEmoji:       p.image_emoji,
    imagenUrl:        p.imagen_url,
    categoria:        p.categoria,
    unidad:           p.unidad,
    precioMinorista:  p.precio_minorista,
    cantidadPorBulto: p.cantidad_por_bulto,
    // datos de la compra
    cantidadObjetivo: c.cantidad_objetivo,
    cantidadActual:   c.cantidad_actual,
    precioParticipante: c.precio_por_unidad,
    estado:           c.estado,
    fechaLimite:      c.fecha_limite,
    fechaCreacion:    c.fecha_creacion,
  };
}

function productoACamel(p) {
  return {
    id:               p.id,
    nombre:           p.nombre,
    descripcion:      p.descripcion,
    imageEmoji:       p.image_emoji,
    imagenUrl:        p.imagen_url,
    categoria:        p.categoria,
    unidad:           p.unidad,
    precioMayorista:  p.precio_mayorista,
    precioMinorista:  p.precio_minorista,
    cantidadPorBulto: p.cantidad_por_bulto,
    urlOrigen:        p.url_origen,
    activo:           p.activo,
    ultimaActualizacion: p.ultima_actualizacion,
  };
}

// ── AUTH ───────────────────────────────────────────────────────────────────────

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return res.status(400).json({ message: error.message });
  if (!data.session)
    return res.status(201).json({ message: 'Revisá tu email para confirmar la cuenta' });

  res.status(201).json({
    token: data.session.access_token,
    user: { id: data.user.id, name: data.user.user_metadata.name, email: data.user.email },
  });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ message: 'Email o contraseña incorrectos' });

  res.json({
    token: data.session.access_token,
    user: { id: data.user.id, name: data.user.user_metadata.name, email: data.user.email },
  });
});

app.get('/auth/google', (req, res) => {
  const redirectTo = encodeURIComponent(
    `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/auth/callback`
  );
  res.redirect(
    `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`
  );
});

app.get('/auth/me', requireAuth, (req, res) => {
  const { id, email, user_metadata } = req.user;
  res.json({ id, email, name: user_metadata?.name ?? null });
});

// ── PRODUCTOS (scrapeados) ─────────────────────────────────────────────────────

// GET /productos — todos los productos activos
app.get('/productos', async (req, res) => {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data.map(productoACamel));
});

// GET /productos/:id
app.get('/productos/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(productoACamel(data));
});

// ── COMPRAS GRUPALES ───────────────────────────────────────────────────────────

// GET /compras — todas las compras grupales abiertas (con datos del producto)
app.get('/compras', async (req, res) => {
  const { data, error } = await supabase
    .from('compras_grupales')
    .select('*, productos(*)')
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data.map(compraACamel));
});

// GET /compras/:id
app.get('/compras/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('compras_grupales')
    .select('*, productos(*)')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ message: 'Compra no encontrada' });
  res.json(compraACamel(data));
});

// POST /compras/:id/unirse — usuario se suma con una cantidad de unidades
app.post('/compras/:id/unirse', requireAuth, async (req, res) => {
  const compraId = Number(req.params.id);
  const cantidad = Number(req.body.cantidad) || 1;

  // Verificar que la compra existe y está abierta
  const { data: compra, error: fetchErr } = await supabase
    .from('compras_grupales')
    .select('id, estado, cantidad_actual, cantidad_objetivo')
    .eq('id', compraId)
    .single();

  if (fetchErr) return res.status(404).json({ message: 'Compra no encontrada' });
  if (compra.estado !== 'abierta') return res.status(400).json({ message: 'Esta compra ya está cerrada' });

  // Registrar la participación
  const { error: partErr } = await supabase
    .from('participaciones')
    .insert([{ compra_id: compraId, user_id: req.user.id, cantidad, estado: 'pendiente' }]);

  if (partErr) return res.status(400).json({ message: partErr.message });

  // Actualizar cantidad_actual y, si corresponde, cerrar la compra
  const nuevaCantidad = compra.cantidad_actual + cantidad;
  const nuevoEstado = nuevaCantidad >= compra.cantidad_objetivo ? 'completa' : 'abierta';

  const { data: updated, error: updateErr } = await supabase
    .from('compras_grupales')
    .update({ cantidad_actual: nuevaCantidad, estado: nuevoEstado })
    .eq('id', compraId)
    .select('*, productos(*)')
    .single();

  if (updateErr) return res.status(500).json({ message: updateErr.message });
  res.json(compraACamel(updated));
});

// POST /compras — crear una compra grupal (admin / uso interno)
app.post('/compras', requireAuth, async (req, res) => {
  const { productoId, cantidadObjetivo, precioParticipante, fechaLimite } = req.body;
  if (!productoId || !cantidadObjetivo || !precioParticipante)
    return res.status(400).json({ message: 'productoId, cantidadObjetivo y precioParticipante son requeridos' });

  const { data, error } = await supabase
    .from('compras_grupales')
    .insert([{
      producto_id:       productoId,
      cantidad_objetivo: cantidadObjetivo,
      precio_por_unidad: precioParticipante,
      fecha_limite:      fechaLimite ?? null,
    }])
    .select('*, productos(*)')
    .single();

  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(compraACamel(data));
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
