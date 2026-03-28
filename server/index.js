import express from 'express';
import supabase from './db.js';

const app = express();
const PORT = 3001;

app.use(express.json());

// GET /oferta — listar todas las ofertas
app.get('/oferta', async (req, res) => {
  const { data, error } = await supabase.from('ofertas').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /oferta/:id — obtener una oferta por id
app.get('/oferta/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('ofertas')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Oferta no encontrada' });
  res.json(data);
});

// POST /oferta — crear una nueva oferta
app.post('/oferta', async (req, res) => {
  const { data, error } = await supabase
    .from('ofertas')
    .insert([req.body])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /oferta/:id — actualizar una oferta
app.put('/oferta/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('ofertas')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /oferta/:id — eliminar una oferta
app.delete('/oferta/:id', async (req, res) => {
  const { error } = await supabase.from('ofertas').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
