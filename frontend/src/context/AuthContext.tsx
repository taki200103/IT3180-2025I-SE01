import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OpenAPI } from '../api/core/OpenAPI';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'resident' | 'police' | 'accountant';
  apartment?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginFromAPI: (userData: any) => Promise<void>;
  register: (email: string, password: string, name: string, role: string, apartment?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Cấu hình API base URL
    // @ts-ignore - Vite env variable
<<<<<<< HEAD
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'https://trustworthy-solace-production-cc18.up.railway.app';
=======
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || '/api';
>>>>>>> 8d44c9ea9aa37a6ba1af236cbf47c8cc33afc152
    OpenAPI.BASE = apiBaseUrl;
    console.log('AuthContext: API Base URL được set thành:', OpenAPI.BASE);

    // Load token nếu có
    const token = localStorage.getItem('token');
    if (token) {
      OpenAPI.TOKEN = token;
    }
    // Load user từ localStorage (fallback)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
  };

  const loginFromAPI = async (userData: any) => {
    // Map dữ liệu từ API response sang User interface
    const user: User = {
      id: userData.id || userData._id || '',
      email: userData.email || '',
      name: userData.name || userData.fullName || '',
      role: userData.role || 'resident',
      apartment: userData.apartment || userData.apartmentId || undefined,
    };
    
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (email: string, password: string, name: string, role: string, apartment?: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email đã được sử dụng');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      apartment: role === 'resident' ? apartment : undefined,
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginFromAPI, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
