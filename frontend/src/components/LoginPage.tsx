import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail } from 'lucide-react';
import { AuthService, OpenAPI } from '../api';
import { ApiError } from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginFromAPI } = useAuth();

  // Cấu hình API base URL (có thể lấy từ env variable)
  useEffect(() => {
    // @ts-ignore - Vite env variable
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || '/api';
    OpenAPI.BASE = apiBaseUrl;
    console.log('API Base URL được set thành:', OpenAPI.BASE);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Gọi API login
      const loginResponse = await AuthService.authControllerLogin({
        email,
        password,
      });

      // Lưu token nếu có trong response
      if (loginResponse?.access_token || loginResponse?.token) {
        const token = loginResponse.access_token || loginResponse.token;
        OpenAPI.TOKEN = token;
        localStorage.setItem('token', token);
      }

      // Lấy thông tin user profile
      const userProfile = await AuthService.authControllerGetProfile();
      
      // Cập nhật user vào context
      await loginFromAPI(userProfile);
      
      navigate('/');
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.body?.message || err.message || 'Đăng nhập thất bại');
      } else {
        setError(err.message || 'Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 text-center">Hệ Thống Quản Lý Chung Cư</h1>
          <p className="text-gray-600 text-center mt-2">Đăng nhập vào tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 text-gray-600 mt-6">
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 transition">
            Đăng ký ngay
          </Link>
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 transition">
            Quên mật khẩu
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center mb-3">Tài khoản demo:</p>
          <div className="space-y-2 text-xs text-gray-600">
            <p>👑 Admin: admin@apartment.com / admin123</p>
            <p>🏠 Cư dân: resident@apartment.com / resident123</p>
            <p>🛡️ Bảo vệ: police@apartment.com / police123</p>
            <p>💰 Kế toán: accountant@apartment.com / accountant123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
