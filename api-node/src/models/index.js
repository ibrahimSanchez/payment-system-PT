const sequelize = require('../db/sequelize');
const defineUsuario = require('./Usuario');
const defineTarjeta = require('./Tarjeta');
const definePago = require('./Pago');

const Usuario = defineUsuario(sequelize);
const Tarjeta = defineTarjeta(sequelize);
const Pago = definePago(sequelize);

Usuario.hasMany(Tarjeta, {
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Tarjeta.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Usuario.hasMany(Pago, {
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Pago.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Tarjeta.hasMany(Pago, {
  foreignKey: 'tarjeta_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Pago.belongsTo(Tarjeta, {
  foreignKey: 'tarjeta_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = { sequelize, Usuario, Tarjeta, Pago };
