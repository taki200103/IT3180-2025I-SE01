import React from 'react';
import { Wrench } from 'lucide-react';

export default function ServicesView() {
  const requests = [
    { id: 1, type: 'Sửa điện', description: 'Đèn phòng khách bị hỏng', date: '25/11/2025', status: 'Đang xử lý' },
    { id: 2, type: 'Sửa nước', description: 'Vòi nước nhà bếp rò rỉ', date: '23/11/2025', status: 'Đang xử lý' },
    { id: 3, type: 'Vệ sinh', description: 'Dọn dẹp sau sửa chữa', date: '20/11/2025', status: 'Hoàn thành' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Yêu cầu dịch vụ</h2>
          <p className="text-gray-600 mt-1">Gửi và theo dõi yêu cầu sửa chữa, bảo trì</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Tạo yêu cầu mới
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-gray-900">{request.type}</h3>
                    <p className="text-gray-600 text-sm mt-1">{request.description}</p>
                    <p className="text-gray-500 text-sm mt-1">📅 {request.date}</p>
                  </div>
                </div>
              </div>
              <span className={`mt-3 sm:mt-0 px-3 py-1 text-sm rounded-full ${
                request.status === 'Hoàn thành' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {request.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

