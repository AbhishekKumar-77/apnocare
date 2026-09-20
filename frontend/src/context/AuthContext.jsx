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
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('apnocare_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Initialize: If no user is logged in, auto-login as family user so anyone who opens the link sees the project immediately!
  useEffect(() => {
    if (!user) {
      demoLogin('family_user');
    }
  }, []);

  // Login: No authorization blockers — ANY email or password (or empty) immediately enters!
  const login = async (email = '', password = '') => {
    setLoading(true);
    try {
      // Try real backend API first if available
      const data = await api.login({ email, password });
      if (data?.token && data?.user) {
        localStorage.setItem('apnocare_token', data.token);
        localStorage.setItem('apnocare_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }
    } catch (e) {
      // Backend not running / offline — continue without authorization check
    } finally {
      setLoading(false);
    }

    // Bypass authorization: generate active session for whatever they entered
    const cleanEmail = (email || 'abhishek@apnocare.com').trim().toLowerCase();
    const isAdmin = cleanEmail.includes('admin');
    const isRep = cleanEmail.includes('rep') || cleanEmail.includes('care') || cleanEmail.includes('rajesh');
    const role = isAdmin ? 'admin' : isRep ? 'care_representative' : 'family_user';

    const fallbackUser = {
      _id: 'user_' + role,
      id: 'user_' + role,
      name: isAdmin ? 'ApnoCare Ops Admin' : isRep ? 'Rajesh Kumar (Care Associate)' : (cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Abhishek Sharma'),
      email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@apnocare.com`,
      role: role,
      phone: isRep ? '+91 98722 34567' : '+1 (647) 555-0192',
      location: isRep ? 'Model Town, Jalandhar' : 'Toronto, Canada (Family in Jalandhar, Punjab)'
    };

    localStorage.setItem('apnocare_token', 'mock_token_' + role);
    localStorage.setItem('apnocare_user', JSON.stringify(fallbackUser));
    setUser(fallbackUser);
    return fallbackUser;
  };

  // Instant demo login for any role
  const demoLogin = async (roleKey = 'family_user') => {
    const creds = DEMO_ACCOUNTS[roleKey] || DEMO_ACCOUNTS.family_user;
    try {
      const data = await api.login({ email: creds.email, password: creds.password });
      if (data?.token && data?.user) {
        localStorage.setItem('apnocare_token', data.token);
        localStorage.setItem('apnocare_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }
    } catch (err) {}

    const fallbackUser = {
      _id: 'demo_' + roleKey,
      id: 'demo_' + roleKey,
      name: roleKey === 'admin' ? 'ApnoCare Ops Admin' : roleKey === 'care_representative' ? 'Rajesh Kumar' : 'Abhishek Sharma',
      email: creds.email,
      role: creds.role,
      phone: creds.role === 'care_representative' ? '+91 98722 34567' : '+1 (647) 555-0192',
      location: creds.role === 'care_representative' ? 'Model Town, Jalandhar' : 'Toronto, Canada (Family in Jalandhar, Punjab)'
    };

    localStorage.setItem('apnocare_token', 'demo_token_' + roleKey);
    localStorage.setItem('apnocare_user', JSON.stringify(fallbackUser));
    setUser(fallbackUser);
    return fallbackUser;
  };

  // Register: Anyone can register and enter directly
  const register = async (formData) => {
    try {
      const data = await api.register(formData);
      if (data?.token && data?.user) {
        localStorage.setItem('apnocare_token', data.token);
        localStorage.setItem('apnocare_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }
    } catch (err) {}

    const registeredUser = {
      _id: 'user_reg_' + Date.now(),
      id: 'user_reg_' + Date.now(),
      name: formData.name || 'ApnoCare Member',
      email: formData.email || 'user@apnocare.com',
      role: formData.role || 'family_user',
      phone: formData.phone || '+91 98000 00000',
      location: formData.location || 'Jalandhar, Punjab'
    };

    localStorage.setItem('apnocare_token', 'token_reg_' + Date.now());
    localStorage.setItem('apnocare_user', JSON.stringify(registeredUser));
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('apnocare_token');
    localStorage.removeItem('apnocare_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const u = await api.getMe();
      if (u) setUser(u);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
