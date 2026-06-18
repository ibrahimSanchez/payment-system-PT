const { Usuario, Tarjeta } = require('../models');
const { validateCardPayload, validateCardUpdatePayload, validateIdParam } = require('../helpers/validation');

// POST /usuarios/:id/tarjetas
const createCard = async (req, res) => {
  const { id: usuario_id } = req.params;
  const { numero_tarjeta, fecha_vencimiento, tipo } = req.body;

  const paramErrors = validateIdParam(usuario_id, 'usuario_id');
  if (paramErrors.length) {
    return res.status(400).json({ errors: paramErrors });
  }

  const cleanNumeroTarjeta = typeof numero_tarjeta === 'string' ? numero_tarjeta.trim() : numero_tarjeta;
  const cleanFechaVencimiento = typeof fecha_vencimiento === 'string' ? fecha_vencimiento.trim() : fecha_vencimiento;

  const errors = validateCardPayload({ numero_tarjeta: cleanNumeroTarjeta, fecha_vencimiento: cleanFechaVencimiento, tipo });
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await Usuario.findByPk(usuario_id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const existingCard = await Tarjeta.findOne({ where: { numero_tarjeta: cleanNumeroTarjeta } });
    if (existingCard) {
      return res.status(409).json({ error: 'El número de tarjeta ya existe' });
    }

    const tarjeta = await Tarjeta.create({
      usuario_id,
      numero_tarjeta: cleanNumeroTarjeta,
      titular: user.nombre,
      fecha_vencimiento: cleanFechaVencimiento,
      tipo: tipo ? tipo.toLowerCase() : 'credito',
    });

    res.status(201).json(tarjeta);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El número de tarjeta ya existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /usuarios/:id/tarjetas
const getUserCards = async (req, res) => {
  const { id: usuario_id } = req.params;
  const errors = validateIdParam(usuario_id, 'usuario_id');
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const tarjetas = await Tarjeta.findAll({
      where: { usuario_id },
      order: [['id', 'ASC']],
    });
    res.json(tarjetas);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /usuarios/:id/tarjetas/:tarjeta_id
const getUserCardById = async (req, res) => {
  const { id: usuario_id, tarjeta_id } = req.params;
  const errors = [
    ...validateIdParam(usuario_id, 'usuario_id'),
    ...validateIdParam(tarjeta_id, 'tarjeta_id'),
  ];
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const tarjeta = await Tarjeta.findOne({
      where: { id: tarjeta_id, usuario_id },
    });
    if (!tarjeta) {
      return res.status(404).json({ error: 'Tarjeta no encontrada' });
    }
    res.json(tarjeta);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PATCH /usuarios/:id/tarjetas/:tarjeta_id
const updateUserCardById = async (req, res) => {
  const { id: usuario_id, tarjeta_id } = req.params;
  const errors = [
    ...validateIdParam(usuario_id, 'usuario_id'),
    ...validateIdParam(tarjeta_id, 'tarjeta_id'),
    ...validateCardUpdatePayload(req.body),
  ];
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const tarjeta = await Tarjeta.findOne({
      where: { id: tarjeta_id, usuario_id },
    });
    if (!tarjeta) {
      return res.status(404).json({ error: 'Tarjeta no encontrada' });
    }

    const updates = {};
    if (req.body.numero_tarjeta !== undefined) {
      const existingCard = await Tarjeta.findOne({ where: { numero_tarjeta: req.body.numero_tarjeta } });
      if (existingCard && existingCard.id !== tarjeta.id) {
        return res.status(409).json({ error: 'El número de tarjeta ya existe' });
      }
      updates.numero_tarjeta = req.body.numero_tarjeta;
    }
    if (req.body.titular !== undefined) updates.titular = req.body.titular;
    if (req.body.fecha_vencimiento !== undefined) updates.fecha_vencimiento = req.body.fecha_vencimiento;
    if (req.body.tipo !== undefined) updates.tipo = req.body.tipo;

    await tarjeta.update(updates);
    res.json(tarjeta);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El número de tarjeta ya existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { createCard, getUserCards, getUserCardById, updateUserCardById };