const sequelize = require('../config/db');
const Game = require('./game');

// Sync Models with Database:
sequelize.sync({force:true})
  .then(() => console.log('Database synced successfully.'))
  .catch((err) => console.error('Failed to sync database:', err));

module.exports = { Game };
