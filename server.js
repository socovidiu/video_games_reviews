require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/db');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
