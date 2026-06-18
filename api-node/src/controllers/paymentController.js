const axios = require('axios');
const { Usuario, Tarjeta, Pago } = require('../models');
const { validatePaymentPayload, validatePaymentUpdatePayload, validateIdParam } = require('../helpers/validation');

// POST /pagos
const createPayment = async (req, res) => {
  const { usuario_id, tarjeta_id, monto, descripcion } = req.body;

  const errors = validatePaymentPayload({ usuario_id, tarjeta_id, monto, descripcion });
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await Usuario.findByPk(usuario_id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const card = await Tarjeta.findOne({
      where: { id: tarjeta_id, usuario_id },
    });
    if (!card) {
      return res.status(404).json({ error: 'Tarjeta no encontrada o no pertenece al usuario' });
    }

    const paymentResponse = await axios.post(
      `${process.env.PAYMENT_SERVICE_URL}/procesar-pago`,
      { monto, tarjeta_id: parseInt(tarjeta_id, 10), usuario_id: parseInt(usuario_id, 10) }
    );

    const { aprobado, mensaje, codigo } = paymentResponse.data;
    const estado = aprobado ? 'aprobado' : 'rechazado';

    const pago = await Pago.create({
      usuario_id,
      tarjeta_id,
      monto,
      descripcion: descripcion || '',
      estado,
    });

    res.status(201).json({
      pago,
      procesador: { aprobado, mensaje, codigo },
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
  const errors = validateIdParam(usuario_id, 'usuario_id');
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await Usuario.findByPk(usuario_id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const pagos = await Pago.findAll({
      where: { usuario_id },
      order: [['created_at', 'DESC']],
      include: [{
        model: Tarjeta,
        attributes: ['numero_tarjeta', 'titular'],
      }],
    });

    const response = pagos.map((pago) => ({
      ...pago.toJSON(),
      numero_tarjeta: pago.Tarjeta?.numero_tarjeta,
      titular: pago.Tarjeta?.titular,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { createPayment, getUserPayments };