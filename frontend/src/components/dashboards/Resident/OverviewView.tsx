import React from 'react';
import { DollarSign, Users, Wrench, Bell } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function OverviewView() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-white">Xin chào, {user?.name}! 👋</h2>
        <p className="mt-2 text-indigo-100">Căn hộ: {user?.apartment || 'Chưa cập nhật'}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Phí tháng này</p>
              <p className="text-gray-900 text-2xl mt-2">2.5 triệu</p>
              <p className="text-green-600 text-sm mt-1">Đã thanh toán</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Thành viên</p>
              <p className="text-gray-900 text-2xl mt-2">4 người</p>
              <p className="text-gray-600 text-sm mt-1">Trong gia đình</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Yêu cầu</p>
              <p className="text-gray-900 text-2xl mt-2">2</p>
              <p className="text-orange-600 text-sm mt-1">Đang xử lý</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Thông báo mới</h3>
        <div className="space-y-3">
          {[
            { title: 'Bảo trì thang máy', time: '2 giờ trước', type: 'info' },
            { title: 'Nhắc thanh toán phí tháng 12', time: '1 ngày trước', type: 'warning' },
            { title: 'Họp cư dân quý IV', time: '3 ngày trước', type: 'info' },
          ].map((notification, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 text-sm">{notification.title}</p>
                <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

