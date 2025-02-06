import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails, } from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { ReviewData } from '../types/Reviews';
import { GameData, GameDetails, GameImage } from "../types/Game";



const GameDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();

    // State to store game details
    // const [gameData, setGameata] = React.useState<GameData>();
    // const [gameDetails, setGameDetails] = React.useState<GameDetails>();
    // const [gameImages, setGameImages] = React.useState<GameImage[]>([]);
    // const [reviews, setReviews] = React.useState<ReviewData[]>([]);
    const [gameDetails, setGameDetails] = React.useState<any>(null);


    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);



    const [showFullDescription, setShowFullDescription] = React.useState(false);

    React.useEffect(() => {

        if (!id) {
            console.error('Error: id is undefined');
            setError('Invalid game ID.');
            setLoading(false);
            return;
        }

        const loadGameDetails = async () => {
            try {
            const data = await fetchGameDetails(id);

            // setGameata(data.gameData);
            setGameDetails(data);
            // Handle game images directly as an array
            // setGameImages(data.gameImages);             
            // setReviews(data.reviewData);

            } catch (err: any) {
            setError(err.message);
            } finally {
            setLoading(false);
            }
        };

        loadGameDetails();
    }, [id]);

    if (loading) {
    return <div className="text-center text-lg">Loading game details...</div>;
    }

    if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (!gameDetails ) {
    return <div className="text-center text-gray-500">No game details found.</div>;
    }

    // const description = gameDetails.description;
    // const platforms = gameDetails.platforms;
    const description = gameDetails.gamedetals.description;
    const platforms = gameDetails.gamedetals.platforms;
    
    return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section: Game Details */}
        <div className="col-span-2">
            <h1 className="text-2xl font-bold mb-4 ">{gameDetails?.title}</h1>
            <div>
                {/* Description Section */}
                <h2 className="text-xl font-semibold mb-2 text-left">Description</h2>
                <p className={`mb-4 ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                {   description}
                </p>
                <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-400 hover:underline"
                >
                {showFullDescription ? 'Show less' : 'Read more'}
                </button>
            </div>
            {/* Game details */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                    <p><strong>Genre</strong></p>
                    <p> {gameDetails?.genre}</p>
                </div>
                <div>
                    <p><strong>Release Date</strong></p>
                    <p> {gameDetails?.released}</p>
                </div>
                <div>
                    <p><strong>Rating</strong></p>
                    <p className="text-yellow-500">⭐ {gameDetails?.rating}/5</p>

                </div>
                <div>
                    <p><strong>Platforms</strong></p>
                    <p> {platforms}</p>
                </div>
            </div>
            {/* Game reviews */}
            <div className="mt-4">
                {gameDetails.reviews.map((review: any) => (
                    // <ReviewCard key={review.id} review={reviews} />
                    <li
                    key={review.id}
                    className="border p-4 rounded shadow-sm bg-gray-50"
                    >
                    <p><strong>{review.username}</strong> rated it {review.rating}/5</p>
                    <p>{review.comment}</p>
                    </li>
                ))}
            </div>
        </div>

        {/* Right Section: Images */}
        <div className="col-span-1 space-y-4">
            {gameDetails.gameImages.map((image:GameImage, index: number) => (
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
