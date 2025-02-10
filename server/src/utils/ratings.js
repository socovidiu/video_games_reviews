const { GameReview, Game } = require('../models/game');


async function getGameRating(gameId) {
    const ratings = await GameReview.findAll({
        where: { gameId },
        attributes: ['rating'],
    });

    if (ratings.length === 0) {
        return 0; // No reviews, default rating is 0
    }

    // Calculate the average rating
    const total = ratings.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = total / ratings.length;

    return averageRating.toFixed(2); // Round to 2 decimal places
}

async function updateGameRating(gameId) {
    const averageRating = await getGameRating(gameId);

    await Game.update(
        { rating: averageRating },
        { where: { id: gameId } }
    );

    return averageRating;
}

module.exports = {updateGameRating };