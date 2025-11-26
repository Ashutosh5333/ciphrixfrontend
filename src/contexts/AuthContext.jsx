import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [user, token]);
  const signin = (userData, jwt) => { setUser(userData); setToken(jwt); };
  const signout = () => { setUser(null); setToken(null); };
  return <AuthContext.Provider value={{ user, token, signin, signout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
