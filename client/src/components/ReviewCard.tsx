import {useState, useEffect} from 'react';
import { ReviewData } from '../types/Reviews';
import { deleteReview, updateReview }from '../services/api'
import { getCurrentUserFromToken } from '../services/auth';
import Button from './UI_Elements/Button'

interface ReviewCardProps {
    review: ReviewData;
    gameId: number;
    onDeleteReview: (reviewId: number) => void;
    onUpdateReview: (updatedReview: ReviewData) => void;
  }

const RevieweCard: React.FC<ReviewCardProps> = ({ review, gameId, onDeleteReview, onUpdateReview }) => {

  const currentUser = getCurrentUserFromToken();
  const [userId, getUserId] = useState<number>();


  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(review.comment);
  const [updatedRating, setUpdatedRating] = useState(review.rating);


  useEffect(() => {
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  }, [review]); // ✅ Ensure UI updates when review changes
  
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

  const handleEdit = async () => {
  
    setIsEditing(true); // Toggle edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  };

  const handleUpdate = async () => {
    try {
      const updatedReview = await updateReview(gameId, review.id, updatedComment, updatedRating);
      onUpdateReview(updatedReview); // Update state in parent component
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update review:", error);
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
      {/* Edit Mode */}
      {(isMine && isEditing) ? (
        <div className="flex flex-col gap-2">
          <textarea
            className="border rounded p-2 w-full"
            onChange={(e) => setUpdatedComment(e.target.value)}
            value={updatedComment}
          />
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={updatedRating}
            min="1"
            max="5"
            onChange={(e) => setUpdatedRating(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              onClick={handleUpdate} 
              className="text-white bg-blue-500 hover:bg-blue-400">
              Update
            </Button>
            <Button 
              onClick={handleCancelEdit} 
              className="bg-gray-300 hover:bg-gray-400">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">{review.comment}</p>
      )}

      {/* Delete button shown conditionally if the review belongs to the logged-in user */}
      {isMine && (
        <div className="flex justify-end gap-2 mt-2" >
          <Button 
            onClick={handleEdit} 
            className=" text-gray-600 bg-gray-300 hover:bg-gray-400 mt-4"
          >             
            Edit ✎
          </Button>  
          <Button 
            onClick={handleDelete} 
            className=" text-white  bg-red-500 hover:bg-red-600 mt-4"
          >             
            Delete
          </Button>
        
        </div>
      )}
      </div>
    </div>
  );
};

export default RevieweCard;