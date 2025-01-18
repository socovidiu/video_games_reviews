const express = require('express');
const { getAllGames, addGame } = require('../controllers/gameController');

const router = express.Router();

router.get('/', getAllGames);
router.post('/', addGame);

module.exports = router;
