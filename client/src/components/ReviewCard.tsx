import React from 'react';
import { ReviewData } from '../types/Reviews';

interface ReviewCardProps {
    review: ReviewData;
}

const RevieweCard: React.FC<ReviewCardProps> = ({ review }) => {

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
    </div>
  </div>
    );
};

export default RevieweCard;