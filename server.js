const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let productos = [
  { id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
  { id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
  { id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
  { id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

app.get('/', (req, res) => {
  res.send('¡Bienvenida a la API de la Cafetería del CRUI!');
});

app.get('/api/productos', (req, res) => {
  res.status(200).json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.status(200).json(producto);
});

app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '' || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  const nuevoProducto = { id: nuevoId, nombre: nombre.trim(), precio, categoria: categoria || 'general' };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

app.put('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  
  const { nombre, precio, categoria } = req.body;
  if ((nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) || 
      (precio !== undefined && (typeof precio !== 'number' || precio <= 0))) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  productos[index] = {
    id,
    nombre: nombre !== undefined ? nombre.trim() : productos[index].nombre,
    precio: precio !== undefined ? precio : productos[index].precio,
    categoria: categoria !== undefined ? categoria : productos[index].categoria
  };
  res.status(200).json(productos[index]);
});

app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  
  const eliminado = productos.splice(index, 1);
  res.status(200).json({ mensaje: 'Eliminado correctamente', producto: eliminado[0] });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});