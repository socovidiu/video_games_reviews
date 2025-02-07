const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const reviewRoutes = require('./routes/reviewsRoutes')
const sequelize = require('./config/db');

const { Game, GameDetails, GameImage, GameReview, User } = require('./models/game');


// Define the Express App
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allow credentials
}));

app.use(express.json());

(async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully.');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  })();


app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/games', reviewRoutes)

module.exports = app;
