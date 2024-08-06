import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  ready: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axios.get('/profile').then(({ data }) => {
      setUser(data);
      setReady(true);
    }).catch(() => {
      setReady(true);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
