const { DataTypes } = require('sequelize');
const sequelize = require('./db-config');

const UserContact = sequelize.define(
  'UserContact',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // Asegúrate de que los emails sean únicos
    },
  },
  {
    tableName: 'phones', // Nombre de la tabla en la base de datos
    timestamps: false,
  }
);

module.exports = UserContact;
