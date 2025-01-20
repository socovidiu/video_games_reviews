const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
// Define the Express App
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/games', gameRoutes);

module.exports = app;
