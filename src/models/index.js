const sequelize = require('../config/db');
const Game = require('./game');

// Sync Models with Database:
sequelize.sync()
  .then(() => console.log('Database synced successfully.'))
  .catch((err) => console.error('Failed to sync database:', err));

module.exports = { Game };
