import React from 'react';

export default function FeesView() {
  const fees = [
    { month: 'Tháng 11/2025', amount: 2500000, status: 'Đã thanh toán', date: '05/11/2025', breakdown: { management: 1200000, water: 300000, electric: 800000, parking: 200000 } },
    { month: 'Tháng 10/2025', amount: 2300000, status: 'Đã thanh toán', date: '03/10/2025', breakdown: { management: 1200000, water: 280000, electric: 620000, parking: 200000 } },
    { month: 'Tháng 9/2025', amount: 2400000, status: 'Đã thanh toán', date: '07/09/2025', breakdown: { management: 1200000, water: 290000, electric: 710000, parking: 200000 } },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý chi phí</h2>
        <p className="text-gray-600 mt-1">Theo dõi các khoản phí và thanh toán</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng đã thanh toán</p>
          <p className="text-green-600 text-2xl mt-2">7.2 triệu</p>
          <p className="text-gray-600 text-sm mt-1">3 tháng gần nhất</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Chi phí trung bình</p>
          <p className="text-gray-900 text-2xl mt-2">2.4 triệu</p>
          <p className="text-gray-600 text-sm mt-1">Mỗi tháng</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tiếp theo</p>
          <p className="text-orange-600 text-2xl mt-2">2.5 triệu</p>
          <p className="text-gray-600 text-sm mt-1">Hạn: 05/12/2025</p>
        </div>
      </div>

      <div className="space-y-4">
        {fees.map((fee, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900">{fee.month}</h3>
                <p className="text-gray-600 text-sm mt-1">Thanh toán: {fee.date}</p>
              </div>
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <span className="text-gray-900 text-xl">{fee.amount.toLocaleString('vi-VN')} đ</span>
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  {fee.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-gray-600 text-sm">Phí quản lý</p>
                <p className="text-gray-900">{fee.breakdown.management.toLocaleString('vi-VN')} đ</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tiền nước</p>
                <p className="text-gray-900">{fee.breakdown.water.toLocaleString('vi-VN')} đ</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tiền điện</p>
                <p className="text-gray-900">{fee.breakdown.electric.toLocaleString('vi-VN')} đ</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Gửi xe</p>
                <p className="text-gray-900">{fee.breakdown.parking.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

