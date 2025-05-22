import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoadingUser: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: User = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token inválido:", err);
        setUser(null);
      }
    }
    setIsLoadingUser(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
