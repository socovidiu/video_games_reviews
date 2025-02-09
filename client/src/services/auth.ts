import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  userId: number;
  username: string;
  // other claims if available
}

export const getCurrentUserFromToken = (): DecodedToken | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};