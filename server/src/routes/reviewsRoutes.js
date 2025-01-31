const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { addReview, getAllReviews, updateReview, deleteReview } = require('../controllers/reviewController')

const router = express.Router();


/* 
POST /api/reviews/:gameId 
*/
router.post('/:gameId', authenticateToken, addReview);

/* 
GET /api/reviews/:gameId
*/
router.get('/:gameId', getAllReviews);

/*
// PUT /api/reviews/:id
*/
router.put('/:id', authenticateToken, updateReview);

/*
// DELETE /api/reviews/:id
*/
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;