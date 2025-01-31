const express = require('express');
const { getAllGames, addGame, getGameDetails } = require('../controllers/gameController');
const authenticateToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/rolesMiddleware')


const router = express.Router();

// Route to the game control functions
router.get('/', getAllGames);
router.post('/addGame', authenticateToken, authorizeRoles('admin'), addGame);
router.get('/:id', getGameDetails)

module.exports = router;