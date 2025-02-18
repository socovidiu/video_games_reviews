import { UserData } from "../types/User"



export interface AuthContextProps {
  user: UserData | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (formData: FormData) => void;
  updateUser: (updatedFields: FormData) => void;
  isAuthenticated: boolean;
}
