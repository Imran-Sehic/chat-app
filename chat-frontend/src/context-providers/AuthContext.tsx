import { ReactNode, createContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username?: string;
  login?: (username: string) => void;
  logout?: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("username") ? true : false
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const login = (username: string) => {
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
