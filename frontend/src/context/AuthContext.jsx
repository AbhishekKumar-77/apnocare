import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  family_user: {
    email: 'abhishek@apnocare.com',
    password: 'password123',
    label: 'Family User (Abhishek - Living in Toronto)',
    role: 'family_user'
  },
  care_representative: {
    email: 'rajesh.care@apnocare.com',
    password: 'password123',
    label: 'Care Associate (Rajesh - Jalandhar)',
    role: 'care_representative'
  },
  admin: {
    email: 'admin@apnocare.com',
    password: 'admin123',
    label: 'Platform Admin',
    role: 'admin'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('apnocare_token');
    const hasBackend = !!import.meta.env.VITE_API_URL;

    if (token) {
      api.getMe()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('apnocare_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else if (hasBackend) {
      // Only attempt demo login if a live backend URL is configured
      demoLogin('family_user').finally(() => setLoading(false));
    } else {
      // No backend configured (static frontend deploy) — just show landing page
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('apnocare_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const data = await api.register(formData);
    localStorage.setItem('apnocare_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('apnocare_token');
    setUser(null);
  };

  const demoLogin = async (roleKey) => {
    const creds = DEMO_ACCOUNTS[roleKey];
    if (!creds) return;
    try {
      const data = await api.login({ email: creds.email, password: creds.password });
      localStorage.setItem('apnocare_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  const refreshUser = async () => {
    try {
      const u = await api.getMe();
      setUser(u);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
