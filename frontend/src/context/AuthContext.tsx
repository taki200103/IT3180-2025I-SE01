import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OpenAPI } from '../api/core/OpenAPI';
import { AuthService } from '../api/services/AuthService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'resident' | 'police' | 'guard' | 'accountant';
  apartment?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginFromAPI: (userData: any) => Promise<void>;
  register: (email: string, password: string, name: string, role: string, apartment?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cấu hình API base URL
    // Lưu ý: KHÔNG để dấu "/" ở cuối để tránh bị "//auth/login"
    // @ts-ignore - Vite env variable
    const apiBaseUrl =
      import.meta.env?.VITE_API_BASE_URL || 'https://backendhost-production-91ab.up.railway.app';
    OpenAPI.BASE = apiBaseUrl;
    console.log('AuthContext: API Base URL được set thành:', OpenAPI.BASE);

    // Validate token và restore user session khi reload
    const validateAndRestoreSession = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Set token vào OpenAPI để sử dụng cho các request
        OpenAPI.TOKEN = token;
        
        try {
          // Validate token bằng cách gọi API profile
          const userProfile = await AuthService.authControllerGetProfile();
          
          // Nếu token hợp lệ, cập nhật user từ API response
          const user: User = {
            id: userProfile.id || userProfile._id || '',
            email: userProfile.email || '',
            name: userProfile.name || userProfile.fullName || '',
            role: userProfile.role || 'resident',
            apartment: userProfile.apartment || userProfile.apartmentId || undefined,
          };
          
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          // Token không hợp lệ hoặc đã hết hạn
          console.error('Token không hợp lệ hoặc đã hết hạn:', error);
          // Xóa token và user khỏi localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          OpenAPI.TOKEN = undefined;
          setUser(null);
        }
      } else {
        // Không có token, xóa user nếu có
        localStorage.removeItem('user');
        setUser(null);
      }
      
      setIsLoading(false);
    };

    validateAndRestoreSession();
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
    <AuthContext.Provider value={{ user, login, loginFromAPI, register, logout, isLoading }}>
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
