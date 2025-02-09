import React from 'react';
import { ReviewData } from '../types/Reviews';
import { deleteReview }from '../services/api'
import { getCurrentUserFromToken } from '../services/auth';
// interface ReviewCardProps {
//     review: ReviewData;
// }

interface ReviewCardProps {
    review: ReviewData;
    gameId: number;
    onDeleteReview: (reviewId: number) => void;
  }

const RevieweCard: React.FC<ReviewCardProps> = ({ review, gameId, onDeleteReview }) => {

  const currentUser = getCurrentUserFromToken();
  const [userId, getUserId] = React.useState<number>();
  const handleDelete = async () => {
    try {
      console.log(review);

      await deleteReview(gameId, review.id);
      onDeleteReview(review.id);
      getUserId(review.userId);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };
  const isMine = currentUser && currentUser.userId === userId;

  return (
      <div className="mt-6">
      <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex items-center mb-2">
          <span className="font-semibold text-lg text-gray-800">
          {review.username}
          </span>
          <span className="ml-2 text-yellow-500 flex items-center">
          {"★".repeat(review.rating)}
          <span className="ml-1 text-sm text-gray-600">({review.rating}/5)</span>
          </span>
      </div>
      <p className="text-gray-600">{review.comment}</p>
      {/* Delete button shown conditionally if the review belongs to the logged-in user */}
      {isMine && (
        <div className="text-right">
        <button 
          onClick={handleDelete} 
          className=" text-black font-bold py-1 px-3 rounded-lg mt-4 bg-red-600"
        >             
          Delete
        </button>
        <button className="text-black font-bold py-1 px-3 rounded-lg mt-4">Update</button>
        </div>
      )}
      </div>
      </div>
  );
};

export default RevieweCard;