const pool = require('../db/pool');

// POST /usuarios/:id/tarjetas
const createCard = async (req, res) => {
  const { id: usuario_id } = req.params;
  const { numero_tarjeta, titular, fecha_vencimiento, tipo } = req.body;

  if (!numero_tarjeta || !titular || !fecha_vencimiento) {
    return res.status(400).json({ error: 'numero_tarjeta, titular y fecha_vencimiento son requeridos' });
  }
  if (numero_tarjeta.length !== 16) {
    return res.status(400).json({ error: 'El número de tarjeta debe tener 16 dígitos' });
  }

  try {
    const user = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuario_id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const result = await pool.query(
      `INSERT INTO tarjetas (usuario_id, numero_tarjeta, titular, fecha_vencimiento, tipo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [usuario_id, numero_tarjeta, titular, fecha_vencimiento, tipo || 'credito']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /usuarios/:id/tarjetas
const getUserCards = async (req, res) => {
  const { id: usuario_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM tarjetas WHERE usuario_id = $1 ORDER BY id',
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { createCard, getUserCards };