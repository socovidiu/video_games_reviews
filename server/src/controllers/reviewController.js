const { GameReview, Game } = require('../models/game');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult }= require('express-validator');
const {updateGameRating} = require('../utils/ratings');



//Add a Review
const addReview = async (req, res) => {
    const { gameId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user.id; // Assumes authenticateToken middleware sets req.user
    const username = req.user.username; // Assumes req.user contains the username
    
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Validate the parameter and body elements
    const parsedGameId = parseInt(gameId, 10);
    if (isNaN(parsedGameId)) {
        return res.status(400).json({ message: 'Invalid game ID' });
    }
    if (!comment || typeof comment !== 'string') {
        return res.status(400).json({ message: 'Invalid or missing comment' });
    }
    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    console.log(userId);
    try {
        
        // Check if the game exists
        const game = await Game.findByPk(parsedGameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        

        // Add the review
        const review = await GameReview.create({
            gameId: parsedGameId,
            userId,
            username,
            comment,
            rating,
        });
    
        const response = {
            id:  review.id,
            userId: review.userId,
            username: review.username,
            comment: review.comment,
            rating: review.rating,
            createdAt: review.createdAt,
        }
        //update game rating
        const newAverageRating = await updateGameRating(parsedGameId);
        console.log("New rating:", newAverageRating);
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add review' });
    }
};

//Get All Reviews for a Game
const getAllReviews = async (req, res) => {
    const { gameId } = req.params;
  
    try {
        const reviews = await GameReview.findAll({
            where: { gameId },
            attributes: ['id', 'userId', 'username', 'comment', 'rating', 'createdAt'], // Include desired fields
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
}

//update  Review
const updateReview = async (req, res) => {
    const {id} = req.params;
    const {comment, rating} = req.body;
    const userId = req.user.id;

    try {
        // Check if the review exists
        const review  = await GameReview.findByPk(id);
        if (!review ) {
            return res.status(404).json({ message: 'Review not found' });
        }
 
        if (review.userId !== userId) {
            return res.status(403).json({ message: 'You can only update your own reviews' });
        }
        
        review.comment = comment;
        review.rating = rating;
        await review.save();
        // Get gameId before deleting
        const gameId = review.gameId;
        //update game rating
        const newAverageRating = await updateGameRating(gameId);
        console.log("New rating:", newAverageRating);

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update review' });
    }

};

//delete  Review
const deleteReview = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    try {
        // Check if the review exists
        const review  = await GameReview.findByPk(id);
        if (!review ) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userId !== userId && !['admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'You can only delete your own reviews' });
        }
        // Get gameId before deleting
        const gameId = review.gameId;
        await review.destroy();
        //update game rating
        const newAverageRating = await updateGameRating(gameId);
        console.log("New rating:", newAverageRating);
        res.status(200).json({ message: 'Review deleted successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete review' });
    }

};

module.exports = { addReview, getAllReviews, updateReview, deleteReview }