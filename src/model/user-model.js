const { DataTypes } = require('sequelize');
const sequelize = require('./db-config');
const User = sequelize.define(
  'User',
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: false, // Si no usas createdAt y updatedAt
  }
);

module.exports = User;
