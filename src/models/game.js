const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('Game', {
  title: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  review: { type: DataTypes.TEXT },
});

module.exports = Game;
