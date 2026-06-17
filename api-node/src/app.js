const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { getUserPayments } = require('./controllers/paymentController');

const app = express();
app.use(express.json());

// Rutas
app.use('/usuarios', userRoutes);
app.use('/usuarios/:id/tarjetas', cardRoutes);
app.use('/usuarios/:id/pagos', (req, res) => getUserPayments(req, res));
app.use('/pagos', paymentRoutes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment-api' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));