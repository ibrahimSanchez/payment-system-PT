const { Usuario } = require('../models');
const { validateUserPayload, validateUserUpdatePayload, validateIdParam } = require('../helpers/validation');

// POST /usuarios
const createUser = async (req, res) => {
  const { nombre, email } = req.body;
  const errors = validateUserPayload({ nombre, email });
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await Usuario.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const user = await Usuario.create({ nombre: nombre.trim(), email: normalizedEmail });
    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PATCH /usuarios/:id
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const idErrors = validateIdParam(id, 'id');
  if (idErrors.length) {
    return res.status(400).json({ errors: idErrors });
  }

  const payloadErrors = validateUserUpdatePayload(req.body);
  if (payloadErrors.length) {
    return res.status(400).json({ errors: payloadErrors });
  }

  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updates = {};
    if (req.body.nombre !== undefined) updates.nombre = req.body.nombre.trim();
    if (req.body.email !== undefined) {
      const normalizedEmail = req.body.email.trim().toLowerCase();
      const existingUser = await Usuario.findOne({ where: { email: normalizedEmail } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }
      updates.email = normalizedEmail;
    }

    await user.update(updates);
    res.json(user);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /usuarios
const getUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({ order: [['id', 'ASC']] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /usuarios/:id
const getUserById = async (req, res) => {
  const { id } = req.params;
  const errors = validateIdParam(id, 'id');
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /usuarios/:id
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const errors = validateIdParam(id, 'id');
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const deletedRows = await Usuario.destroy({
      where: { id },
    });
    if (!deletedRows) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ deletedRows });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUserById, deleteUserById };