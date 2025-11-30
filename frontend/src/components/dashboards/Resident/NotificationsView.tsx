import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsView() {
  const notifications = [
    { id: 1, title: 'Bảo trì thang máy', content: 'Thang máy tòa A sẽ bảo trì vào sáng thứ 7 ngày 30/11', date: '27/11/2025', read: false },
    { id: 2, title: 'Nhắc thanh toán phí', content: 'Phí quản lý tháng 12 hạn thanh toán đến 05/12/2025', date: '25/11/2025', read: false },
    { id: 3, title: 'Họp cư dân quý IV', content: 'Cuộc họp sẽ diễn ra vào 15h ngày 15/12 tại hội trường tầng 1', date: '23/11/2025', read: true },
    { id: 4, title: 'Thông báo cúp nước', content: 'Tạm ngưng cấp nước vào sáng CN để sửa chữa đường ống', date: '20/11/2025', read: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Thông báo</h2>
        <p className="text-gray-600 mt-1">Các thông báo từ ban quản lý</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`bg-white rounded-lg shadow p-6 ${!notification.read ? 'border-l-4 border-indigo-600' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-900">{notification.title}</h3>
                  {!notification.read && (
                    <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                      Mới
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{notification.content}</p>
                <p className="text-gray-500 text-sm mt-2">📅 {notification.date}</p>
              </div>
              <Bell className={`w-5 h-5 ${!notification.read ? 'text-indigo-600' : 'text-gray-400'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

