import axios from 'axios';
import { GameData, GameDetails, GameImage } from '../types/Game';
import { ReviewData } from '../types/Reviews';
export const API_BASE_URL = 'http://localhost:3000/api';

export interface FetchGameData {
  gameData: GameData;
  gameImages: GameImage[];
}

export interface FetchGameDetailsData {
  gameData: GameData;
  gameDetails: GameDetails;
  gameReviews: ReviewData[];
  gameImages: GameImage[];
}

//Get the games to list them in the homepage
export const fetchGames = async (): Promise<FetchGameData[]> => {
  const response = await axios.get<FetchGameData[]>(`${API_BASE_URL}/games`);
  const data = response.data;
  console.log("Raw API response:", data[0].gameData); // Check backend response
  return data;
};

// Get the etails of the specified game
export const fetchGameDetails = async (id: string | number): Promise<FetchGameDetailsData> => {
 
  const response = await axios.get<FetchGameDetailsData>(`${API_BASE_URL}/games/${id}`);
  // Log the response before parsing it
  console.debug('Raw response: ', response);
  return response.data;
};

// add a review for a specified game 
export const addReview = async (gameId:  string | number, comment: string, rating: number) => {

  const token = localStorage.getItem('token'); // Assuming token storage in localStorage

  const response = await axios.post(`${API_BASE_URL}/games/${gameId}/reviews`,
  { comment, rating },
  {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  
  console.debug('Raw response: ', response);
  return response.data;
};

// delete reviews that user added
export const deleteReview = async (gameId: string | number, reviewId: string | number) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.delete(`${API_BASE_URL}/games/${gameId}/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data;
};


// delete reviews that user added
export const updateReview = async (gameId: string | number, reviewId: string | number,  comment: string, rating: number) => {
  const token = localStorage.getItem('token');

  console.log("Token being sent:", token); // Log the token

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.put(`${API_BASE_URL}/games/${gameId}/reviews/${reviewId}`,
    { comment, rating }, 
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data;
};