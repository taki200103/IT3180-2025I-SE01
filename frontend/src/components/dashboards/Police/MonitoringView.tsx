import React from 'react';
import { Camera } from 'lucide-react';

export default function MonitoringView() {
  const cameras = [
    { id: 1, location: 'Cổng chính', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 2, location: 'Bãi xe tầng 1', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 3, location: 'Thang máy A', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 4, location: 'Thang máy B', status: 'Bảo trì', lastCheck: '2 giờ trước' },
    { id: 5, location: 'Hành lang tầng 5', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 6, location: 'Sảnh chính', status: 'Hoạt động', lastCheck: '5 phút trước' },
  ];

  // Sử dụng placeholder images từ picsum.photos
  const getCameraImage = (id: number) => {
    // Sử dụng seed để có ảnh cố định cho mỗi camera
    return `https://picsum.photos/seed/camera-${id}/400/300`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Hệ thống giám sát</h2>
        <p className="text-gray-600 mt-1">Quản lý camera an ninh</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <div key={camera.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
              {camera.status === 'Hoạt động' ? (
                <img
                  src={getCameraImage(camera.id)}
                  alt={camera.location}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback nếu ảnh không load được
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div>';
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 font-medium">{camera.location}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  camera.status === 'Hoạt động' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {camera.status}
                </span>
                <span className="text-xs text-gray-500">{camera.lastCheck}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

