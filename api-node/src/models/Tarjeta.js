const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Tarjeta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numero_tarjeta: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  titular: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.STRING(7),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'credito',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tarjetas',
});
