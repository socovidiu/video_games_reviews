import {useState, useEffect} from 'react';
import { ReviewData } from '../types/Reviews';
import { deleteReview, updateReview }from '../services/api'
import { getCurrentUserFromToken } from '../services/auth';
// interface ReviewCardProps {
//     review: ReviewData;
// }

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
  }, [review]); // This re-syncs the state when the review prop changes

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
      {isEditing ? (
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
            <button onClick={handleUpdate} 
              style={{backgroundColor: '#3333FF',}}//set background color as blue
              className="text-white px-4 py-1 rounded">
              Update
            </button>
            <button onClick={handleCancelEdit} className="bg-gray-300 px-4 py-1 rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">{review.comment}</p>
      )}

      {/* Delete button shown conditionally if the review belongs to the logged-in user */}
      {isMine && (
        <div className="text-right" >
        <button 
          onClick={handleEdit} 
          className=" text-gray-600 font-bold py-1 px-3 rounded-lg mt-4"
          style={{backgroundColor: '#D3D3D3',}}//set background color as grey
        >             
          Edit ✎
        </button>  
        <button 
          onClick={handleDelete} 
          className=" text-white font-bold py-1 px-3 rounded-lg mt-4"
          style={{backgroundColor: '#f2401a',}}//set background color as red
        >             
          Delete
        </button>
        
        </div>
      )}
      </div>
      </div>
  );
};

export default RevieweCard;