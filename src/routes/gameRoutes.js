const express = require('express');
const { getAllGames, addGame } = require('../controllers/gameController');


const router = express.Router();

// Route to the game control functions
router.get('/', getAllGames);
router.post('/addGame', addGame);


module.exports = router;
