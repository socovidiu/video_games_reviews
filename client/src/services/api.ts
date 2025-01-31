import axios from 'axios';
import { Game } from '../types/Game';

export const API_BASE_URL = 'http://localhost:3000/api';

export const fetchGames = async (): Promise<Game[]> => {
  const response = await axios.get<Game[]>(`${API_BASE_URL}/games`);
  return response.data;
};

export const fetchGameDetails = async (id: string | number): Promise<Game[]> => {
 
  const response = await axios.get<Game[]>(`${API_BASE_URL}/games/${id}`);
  // Log the response before parsing it
  console.debug('Raw response: ', response);
  return response.data;
};
