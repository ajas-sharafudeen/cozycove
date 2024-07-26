/* original code - video part 1:30:30*/

import { createContext, useState } from "react";

export const UserContext = createContext({})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function UserContextProvider({ children }) {
  const [user,setUser] = useState(null)
  return (
    <UserContext.Provider value={{user,setUser}}>
      { children }
    </UserContext.Provider>
  )
}

// chatgpt code
// import { createContext, ReactNode } from "react";

// export const UserContext = createContext({})

// interface UserContextProviderProps {
//   children: ReactNode;
// }

// export function UserContextProvider({ children }: UserContextProviderProps) {
//   return (
//     { children }
//   )
// }