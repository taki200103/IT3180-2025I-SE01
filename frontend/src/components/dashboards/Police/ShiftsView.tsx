import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ShiftsService, type ShiftResponseDto } from '../../../api/services/ShiftsService';

export default function ShiftsView() {
  const [shifts, setShifts] = useState<ShiftResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + 1); // Thứ 2 của tuần này
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + 7); // Chủ nhật của tuần này
    return date.toISOString().split('T')[0];
  });

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ShiftsService.shiftControllerFindAll(startDate, endDate);
      setShifts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch shifts', err);
      setError('Không thể tải lịch trực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return {
      day: days[date.getDay()],
      date: date.toLocaleDateString('vi-VN'),
    };
  };

  // Nhóm ca trực theo ngày
  const groupedShifts = shifts.reduce((acc, shift) => {
    const dateKey = shift.date.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = { morning: null, afternoon: null, night: null };
    }
    acc[dateKey][shift.shiftType as 'morning' | 'afternoon' | 'night'] = shift;
    return acc;
  }, {} as Record<string, { morning: ShiftResponseDto | null; afternoon: ShiftResponseDto | null; night: ShiftResponseDto | null }>);

  const sortedDates = Object.keys(groupedShifts).sort();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Lịch trực</h2>
        <p className="text-gray-600 mt-1">Phân công và theo dõi ca trực</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={fetchShifts}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"

          >
            Lọc
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Không có ca trực nào trong khoảng thời gian này.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca sáng (6h-14h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca chiều (14h-22h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca đêm (22h-6h)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDates.map((dateKey) => {
                  const shiftsForDate = groupedShifts[dateKey];
                  const { day, date } = formatDate(dateKey);
                  return (
                    <tr key={dateKey} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{day}</div>
                        <div className="text-xs text-gray-500">{date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shiftsForDate.morning?.police?.fullName || <span className="text-gray-400">Chưa phân công</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shiftsForDate.afternoon?.police?.fullName || <span className="text-gray-400">Chưa phân công</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shiftsForDate.night?.police?.fullName || <span className="text-gray-400">Chưa phân công</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

