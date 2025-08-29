/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import api from "../api/axios";

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // Add isLoading
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start in a loading state

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // The cookie is sent automatically by the browser
        const response = await api.get("/auth/verify");
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // End loading state
      }
    };
    verifyUser();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    // You should also have a backend call here to invalidate the cookie
    setIsAuthenticated(false);
  };

  const providerValue = { isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
