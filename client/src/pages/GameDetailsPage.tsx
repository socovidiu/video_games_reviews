import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails, } from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { ReviewData } from '../types/Reviews';
import { GameData, GameDetails, GameImage } from "../types/Game";
import AddReviewForm from '../components/AddReviewForm';
import Button from '../components/UI_Elements/Button'



const GameDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();
    const gameId = id as string;

    // State to store game details
    const [gameData, setGameData] = React.useState<GameData>();
    const [gameDetails, setGameDetails] = React.useState<GameDetails>();
    const [gameImages, setGameImages] = React.useState<GameImage[]>([]);
    const [reviews, setReviews] = React.useState<ReviewData[]>([]);

    // Ensure unique reviews by using the review `id`
    const uniqueReviews = Array.from(new Map(reviews.map(r => [r.id, r])).values());


    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);



    const [showFullDescription, setShowFullDescription] = React.useState(false);

    React.useEffect(() => {

        if (!gameId) {
            console.error('Error: id is undefined');
            setError('Invalid game ID.');
            setLoading(false);
            return;
        }

        const loadGameDetails = async () => {
            try {
            const data = await fetchGameDetails(gameId);

            setGameData(data.gameData);
            setGameDetails(data.gameDetails);
            setGameImages(data.gameImages);             
            setReviews(data.gameReviews);
            } catch (err: any) {
            setError(err.message);
            } finally {
            setLoading(false);
            }
        };

        loadGameDetails();
    }, [gameId]);

    // Ation to add new review
    const handleReviewAdded = (newReview: ReviewData) => {
        
        // Ensure no duplicate reviews by checking review IDs
        setReviews((prevReviews) => {
            if (!prevReviews.find((review) => review.id === newReview.id)) {
            return [...prevReviews, newReview];
            }
            return prevReviews;
        });

    };
    // Action to delete review
    const handleReviewDeleted = (reviewId: number) => {
        setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
    };

    const handleUpdateReview = (updatedReview: ReviewData) => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.id === updatedReview.id ? { ...review, ...updatedReview } : review
            )
        );
    
        // ✅ Recalculate average rating dynamically
        const newReviews = reviews.map((review) =>
            review.id === updatedReview.id ? { ...review, ...updatedReview } : review
        );
        const newAverageRating =
            newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
    
        // ✅ Update game data with the new rating
        setGameData((prevGameData) =>
            prevGameData ? { ...prevGameData, rating: newAverageRating } : prevGameData
        );
    
        console.log("Updated Reviews:", newReviews);
        console.log("New Average Rating:", newAverageRating);
    };
       

    if (loading) {
    return <div className="text-center text-lg">Loading game details...</div>;
    }

    if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (!gameDetails || !gameData) {
    return <div className="text-center text-gray-500">No game details found.</div>;
    }


    const description = gameDetails.description;
    const platforms = gameDetails.platforms;

    return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section: Game Details */}
        <div className="col-span-2">
            <h1 className="text-3xl font-bold text-center mt-4 ">{gameData.title}</h1>
            <div>
                {/* Description Section */}
                <h2 className="text-xl font-semibold mb-2 text-left">Description</h2>
                <p className={`mb-4 text-left ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                {   description}
                </p>
                <Button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-400 hover:underline"
                >
                {showFullDescription ? 'Show less' : 'Read more'}
                </Button>
            </div>
            {/* Game details */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                    <p><strong>Genre</strong></p>
                    <p> {gameData?.genre}</p>
                </div>
                <div>
                    <p><strong>Release Date</strong></p>
                    <p> {gameData?.released}</p>
                </div>
                <div>
                    <p><strong>Rating</strong></p>
                    <p className="text-yellow-500">⭐ {gameData?.rating}/5</p>

                </div>
                <div>
                    <p><strong>Platforms</strong></p>
                    <p> {platforms}</p>
                </div>
            </div>
            {/* Render reviews */}
            <div className="mt-4">
                {uniqueReviews.map((review: ReviewData) => (
                    <ReviewCard 
                        key={review.id}
                        review={review}
                        gameId={gameData.id}
                        onDeleteReview={handleReviewDeleted}
                        onUpdateReview={handleUpdateReview} 
                    />
                ))}
            </div>
            {/* Add Review Form */}
            <AddReviewForm gameId={gameData.id} onReviewAdded={handleReviewAdded} />
        </div>

        {/* Right Section: Images */}
        <div className="col-span-1 space-y-4">
            {gameImages.map((image:GameImage, index: number) => (
            <img
              key={index}
              src={image.imageUrl}
              alt={`Screenshot ${index + 1}`}
              className="w-full h-auto rounded-md shadow-sm"
            />
            ))}
        </div>
      </div>
    </div>
    );
};

export default GameDetailsPage;
