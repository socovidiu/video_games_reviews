import { UserData } from "../types/User"



export interface AuthContextProps {
  user: UserData | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, email: string, password: string, bio: string) => void;
  isAuthenticated: boolean;
}
