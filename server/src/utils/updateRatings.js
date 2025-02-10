const { Game, GameReview } = require('../models/game'); // Adjust based on your project structure
const { Sequelize } = require('sequelize');

async function updateAllGameRatings() {
    try {
        // Fetch all games
        const games = await Game.findAll();

        for (const game of games) {
            // Calculate the new average rating for each game
            const reviews = await GameReview.findAll({
                where: { gameId: game.id },
                attributes: ['rating'],
            });

            let newAverageRating = 0;
            if (reviews.length > 0) {
                const total = reviews.reduce((sum, review) => sum + review.rating, 0);
                newAverageRating = (total / reviews.length).toFixed(2);
            }

            // Update the game's rating
            await Game.update(
                { rating: newAverageRating },
                { where: { id: game.id } }
            );

            console.log(`Updated Game ID ${game.id} -> New Rating: ${newAverageRating}`);
        }

        console.log('✅ All game ratings updated successfully!');
    } catch (error) {
        console.error('❌ Error updating game ratings:', error);
    }
}

// Run the function
module.exports = updateAllGameRatings;