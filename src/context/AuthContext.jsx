import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      const response = await authApi.getMe();
      setUser(response.data.user || response.data);
    } catch (error) {
      console.error('Session verification failed', error);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const loginAdmin = async (credentials) => {
    const res = await authApi.adminLogin(credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      await fetchMe();
    }
    return res.data;
  };

  const loginMember = async (credentials) => {
    const res = await authApi.memberLogin(credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      await fetchMe();
    }
    return res.data;
  };

  const logout = async () => {
    try {
      if (user?.role === 'admin') {
        await authApi.adminLogout();
      } else {
        await authApi.memberLogout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginMember, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
