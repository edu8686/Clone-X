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
  
  const [loading, setLoading] = useState(true);

  async function handleUsersToFollow(newUsers) {
    setUsersToFollow([...newUsers]);
  }

  // Guarda en storage cuando loginUser cambie
  useEffect(() => {
    if (loginUser) {
      localStorage.setItem("loginUser", JSON.stringify(loginUser));
    } else {
      localStorage.removeItem("loginUser");
    }
    setLoading(false); 
  }, [loginUser]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  

  return (
    <UserContext.Provider value={{ loginUser, setLoginUser, setToken, login, usersToFollow, handleUsersToFollow, loading }}>
      {children}
    </UserContext.Provider>
  );
}


export {UserContext}