import React, { ReactNode, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  menuItems: Array<{
    icon: ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
  }>;
}

export default function DashboardLayout({ children, title, menuItems }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels: Record<string, string> = {
    admin: 'Quản trị viên',
    resident: 'Cư dân',
    police: 'Công an',
    guard: 'Bảo vệ',
    accountant: 'Kế toán',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center text-white">🏢</div>
            </div>
            <div className="ml-3">
              <h2 className="text-gray-900">Quản Lý Chung Cư</h2>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                  item.active
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex-shrink-0 px-3 pb-4">
            <div 
              className="bg-gray-50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-600">{roleLabels[user?.role || '']}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Đóng menu"
                title="Đóng menu"
              >
                <span className="sr-only">Đóng menu</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center text-white">🏢</div>
                </div>
                <div className="ml-3">
                  <h2 className="text-gray-900">Quản Lý Chung Cư</h2>
                </div>
              </div>

              <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                      item.active
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="flex-shrink-0 px-3 pb-4">
                <div 
                  className="bg-gray-50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    navigate('/profile');
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-600">{roleLabels[user?.role || '']}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            aria-label="Mở menu"
            title="Mở menu"
          >
            <span className="sr-only">Mở menu</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex items-center justify-between">
            <h1 className="text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
