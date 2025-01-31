import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';

const GameDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();

    // State to store game details
    const [gameDetails, setGameDetails] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

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
            setGameDetails(data);
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

    if (!gameDetails) {
    return <div className="text-center text-gray-500">No game details found.</div>;
    }

    const decription = gameDetails.gamedetals.description;
    const platforms = gameDetails.gamedetals.platforms;
    return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{gameDetails.title}</h1>
        <p><strong>Genre:</strong> {gameDetails.genre}</p>
        <p><strong>Rating:</strong> {gameDetails.rating}</p>
        <p><strong>Release Date:</strong> {gameDetails.released}</p>
        <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Descriprion</h2>
        <p> {decription} </p>
        <p><strong>Platforms:</strong> {platforms}</p>
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        {gameDetails.reviews && gameDetails.reviews.length > 0 ? (
            <ul className="space-y-4">
            {gameDetails.reviews.map((review: any) => (
                <li
                key={review.id}
                className="border p-4 rounded shadow-sm bg-gray-50"
                >
                <p><strong>{review.username}</strong> rated it {review.rating}/5</p>
                <p>{review.comment}</p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500">No reviews yet.</p>
        )}
        </div>
    </div>
    );
};

export default GameDetailsPage;
