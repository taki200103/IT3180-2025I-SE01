import React from 'react';
import { Camera } from 'lucide-react';

export default function MonitoringView() {
  const cameras = [
    { id: 1, location: 'Cổng chính', status: 'Hoạt động', lastCheck: '5 phút trước', videoId: 'zpCZ9OFjb3U' },
    { id: 2, location: 'Bãi xe tầng 1', status: 'Hoạt động', lastCheck: '5 phút trước', videoId: 'xpmeu4USkTY' },
    { id: 3, location: 'Thang máy A', status: 'Hoạt động', lastCheck: '5 phút trước', videoId: 'xPgeZzojY5o' },
    { id: 4, location: 'Thang máy B', status: 'Hoạt động', lastCheck: '5 phút trước', videoId: 'zhRcRgZEoQw' },
    { id: 5, location: 'Hành lang tầng 5', status: 'Hoạt động', lastCheck: '5 phút trước', videoId: 'z8HYmP_gOhY' },
    { id: 6, location: 'Sảnh chính', status: 'Hoạt động', lastCheck: '5 phút trước', videoId: 'yXfcL7DqlR4' },
  ];

  // Lấy YouTube embed URL từ video ID
  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
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
              {camera.status === 'Hoạt động' && camera.videoId ? (
                <iframe
                  src={getYouTubeEmbedUrl(camera.videoId)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Camera ${camera.location}`}
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

