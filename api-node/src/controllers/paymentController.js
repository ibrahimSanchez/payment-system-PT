const pool = require('../db/pool');
const axios = require('axios');

// POST /pagos
const createPayment = async (req, res) => {
  const { usuario_id, tarjeta_id, monto, descripcion } = req.body;

  if (!usuario_id || !tarjeta_id || !monto) {
    return res.status(400).json({ error: 'usuario_id, tarjeta_id y monto son requeridos' });
  }
  if (monto <= 0) {
    return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
  }

  try {
    // Validaciones básicas:
    const user = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const card = await pool.query(
      'SELECT id FROM tarjetas WHERE id = $1 AND usuario_id = $2',
      [tarjeta_id, usuario_id]
    );
    if (card.rows.length === 0) {
      return res.status(404).json({ error: 'Tarjeta no encontrada o no pertenece al usuario' });
    }

    // Aquí uso el servicio en Python para procesar el pago
    const paymentResponse = await axios.post(
      `${process.env.PAYMENT_SERVICE_URL}/procesar-pago`,
      { monto, tarjeta_id: parseInt(tarjeta_id), usuario_id: parseInt(usuario_id) }
    );

    const { aprobado, mensaje, codigo } = paymentResponse.data;
    const estado = aprobado ? 'aprobado' : 'rechazado';

    const result = await pool.query(
      `INSERT INTO pagos (usuario_id, tarjeta_id, monto, descripcion, estado)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [usuario_id, tarjeta_id, monto, descripcion || '', estado]
    );

    res.status(201).json({
      pago: result.rows[0],
      procesador: { aprobado, mensaje, codigo }
    });

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'El servicio de pagos no está disponible' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /usuarios/:id/pagos
const getUserPayments = async (req, res) => {
  const { id: usuario_id } = req.params;
  try {
    const user = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const result = await pool.query(
      `SELECT p.*, t.numero_tarjeta, t.titular
       FROM pagos p
       JOIN tarjetas t ON p.tarjeta_id = t.id
       WHERE p.usuario_id = $1
       ORDER BY p.created_at DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { createPayment, getUserPayments };