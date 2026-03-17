import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    console.log('AuthContext: fetchMe starting...');
    const token = localStorage.getItem('token');
    
    if (!token || token === 'null' || token === 'undefined') {
      console.log('AuthContext: No valid token');
      setUser(null);
      setLoading(false);
      return;
    }

    // Safety timeout to prevent infinite loading (increased for slow DBs)
    const timeoutId = setTimeout(() => {
      console.warn('AuthContext: fetchMe timed out after 30s');
      setLoading(false);
    }, 30000);

    try {
      setLoading(true);
      console.log('AuthContext: Fetching from API...');
      const response = await authApi.getMe();
      clearTimeout(timeoutId);
      console.log('AuthContext: Success!', response.data.user?.role);
      setUser(response.data.user || response.data);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('AuthContext: API error', error.message);
      setUser(null);
      // Only remove token if it's definitely invalid (e.g. 401)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      console.log('AuthContext: fetchMe finished');
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

  const registerMember = async (data) => {
    const res = await authApi.memberRegister(data);
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
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginMember, registerMember, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
