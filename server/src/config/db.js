const { Sequelize } = require('sequelize');
// Connect to the Database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Disable query logging
});

module.exports = sequelize;
