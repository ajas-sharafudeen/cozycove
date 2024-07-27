import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function UserContextProvider({ children }) {
  const [user,setUser] = useState(null)
  useEffect(() => {
    if(!user) {
      axios.get('/profile')
    }
  }, [])
  return (
    <UserContext.Provider value={{user,setUser}}>
      { children }
    </UserContext.Provider>
  )
}