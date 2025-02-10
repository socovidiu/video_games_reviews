const express = require('express');
const { getAllGames, addGame, getGameDetails } = require('../controllers/gameController');
const authenticateToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/rolesMiddleware')
const updateAllGameRatings = require('../utils/updateRatings');

const router = express.Router();

// Route to the game control functions
router.get('/', getAllGames);
router.post('/addGame', authenticateToken, authorizeRoles('admin'), addGame);
router.get('/:id', getGameDetails)
router.put('/update-all-ratings', async (req, res) => {
    try {
        await updateAllGameRatings();
        res.json({ message: 'All game ratings updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ratings' });
    }
});
module.exports = router;