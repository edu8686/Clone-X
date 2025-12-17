import { useEffect, useState, createContext } from 'react';
import { login } from '../services/loginService';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [loginUser, setLoginUser] = useState(() => {
    const storedUser = localStorage.getItem("loginUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [usersToFollow, setUsersToFollow] = useState(null);
  
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  

  async function handleUsersToFollow(newUsers) {
    setUsersToFollow([...newUsers]);
  }

useEffect(() => {
  const storedUser = localStorage.getItem("loginUser");
  if (storedUser) {
    setLoginUser(JSON.parse(storedUser));
  }
}, []);


  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  

  return (
    <UserContext.Provider value={{ loginUser, setLoginUser, setToken, login, usersToFollow, handleUsersToFollow }}>
      {children}
    </UserContext.Provider>
  );
}


export {UserContext}