const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const { sequelize } = require('./models');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { getUserPayments } = require('./controllers/paymentController');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.redirect('/docs'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión con la base de datos establecida.');
  } catch (err) {
    console.error('No se pudo conectar a la base de datos:', err);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
};

startServer();