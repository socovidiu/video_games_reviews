import React, { useState } from 'react';
import { addReview } from '../services/api';
import { ReviewData } from '../types/Reviews'

interface AddReviewFormProps {
  gameId: number;
  onReviewAdded: (newReview: ReviewData) => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ gameId, onReviewAdded }) => {
  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await addReview(gameId,comment,rating);
      if (response) {
        onReviewAdded(response); // Update with the latest reviews
        setComment('');
        setRating(0);
      } else {
        console.error('Failed to add review');
      }
    } catch (error) {
      setError('Failed to add review. Please try again.');
    }
  };




  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Add a Review</h2>
      {error && <p className="text-red-500">{error}</p>}
      <textarea
        className="w-full p-2 border rounded-md"
        rows={3}
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        min={1}
        max={5}
        required
        className="w-full border p-2 mb-2 rounded-lg"
        placeholder="Rating (1 to 5)"
      />
      <button type="submit" className="bg-blue-500 text-grey px-4 py-2 rounded-lg">
        Submit Review
      </button>
    </form>
  );
};

export default AddReviewForm;
