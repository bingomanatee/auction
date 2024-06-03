import {createContext, useState} from "react";

export const UserContext = createContext({
  user: '', setCurrentUser: () => {

  }
});

export function Layout({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <div className='layout'>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
        {children}
      </UserContext.Provider>
    </div>
  )
}