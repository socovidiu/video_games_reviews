const express = require('express');
const { getAllGames, addGame } = require('../controllers/gameController');
const { fetchGameDetails } = require('../../services/rawgService');

const router = express.Router();

// Route to the game control functions
router.get('/', getAllGames);
router.post('/', addGame);

// Route to fetch game details by name
router.get('/fetch-game', async (req, res) => {
const { name } = req.query; // Query parameter for game name
    if (!name) {
        return res.status(400).json({ error: 'Game name is required' });
    }

    try {
        const gameDetails = await fetchGameDetails(name);
        res.json(gameDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

module.exports = router;
