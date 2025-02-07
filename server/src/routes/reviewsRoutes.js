const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { addReview, getAllReviews, updateReview, deleteReview } = require('../controllers/reviewController')

const router = express.Router();


/* 
POST /api/reviews/:gameId/reviews
*/
router.post('/:gameId/reviews', authenticateToken, addReview);

/* 
GET /api/games/:gameId/reviews
*/
router.get('/:gameId/reviews', getAllReviews);

/*
// PUT /api/games/:gameId/reviews/:id
*/
router.put('/:gameId/reviews/:id', authenticateToken, updateReview);

/*
// DELETE /api/games/:id
*/
router.delete('/:gameId/reviews/:id', authenticateToken, deleteReview);

module.exports = router;