import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import { ShiftsService, type CreateShiftDto, type ShiftResponseDto } from '../../../api/services/ShiftsService';
import { ApiError } from '../../../api';

type Guard = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

export default function ShiftsView() {
  const [shifts, setShifts] = useState<ShiftResponseDto[]>([]);
  const [guardList, setGuardList] = useState<Guard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftResponseDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
  const [formData, setFormData] = useState<CreateShiftDto>({
    date: '',
    shiftType: 'morning',
    guardId: '',
  });

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ShiftsService.shiftControllerFindAll(startDate, endDate);
      setShifts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch shifts', err);
      let errorMessage = 'Không thể tải lịch trực. Vui lòng thử lại sau.';
      if (err instanceof ApiError) {
        const errorBody = err.body as any;
        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody?.message) {
          errorMessage = errorBody.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const fetchGuardList = useCallback(async () => {
    try {
      const data = await ShiftsService.shiftControllerGetGuardList();
      setGuardList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch guard list', err);
      // Show error but don't block the UI
      if (err instanceof ApiError) {
        const errorBody = err.body as any;
        const errorMessage = typeof errorBody === 'string' ? errorBody : errorBody?.message || 'Không thể tải danh sách bảo vệ';
        console.error('Guard list error:', errorMessage);
      }
    }
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  useEffect(() => {
    fetchGuardList();
  }, [fetchGuardList]);

  const resetForm = () => {
    setFormData({
      date: '',
      shiftType: 'morning',
      guardId: '',
    });
    setEditingShift(null);
    setError('');
  };

  const handleOpenModal = (shift?: ShiftResponseDto) => {
    if (shift) {
      setEditingShift(shift);
      // Parse date safely
      const dateStr = typeof shift.date === 'string' ? shift.date : new Date(shift.date).toISOString();
      setFormData({
        date: dateStr.split('T')[0],
        shiftType: shift.shiftType as 'morning' | 'afternoon' | 'night',
        guardId: shift.guardId,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.date || !formData.guardId) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      if (editingShift) {
        await ShiftsService.shiftControllerUpdate(editingShift.id, {
          guardId: formData.guardId,
          date: formData.date,
          shiftType: formData.shiftType as 'morning' | 'afternoon' | 'night',
        });
        setSuccessMessage('Cập nhật ca trực thành công!');
      } else {
        await ShiftsService.shiftControllerCreate(formData);
        setSuccessMessage('Tạo ca trực thành công!');
      }
      handleCloseModal();
      fetchShifts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to submit shift', err);
      if (err instanceof ApiError) {
        const errorBody = err.body as any;
        let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody?.message) {
          errorMessage = errorBody.message;
        } else if (Array.isArray(errorBody?.message)) {
          errorMessage = errorBody.message.join(', ');
        }
        setError(errorMessage);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ca trực này?')) {
      return;
    }

    setDeletingId(id);
    try {
      await ShiftsService.shiftControllerRemove(id);
      setSuccessMessage('Xóa ca trực thành công!');
      fetchShifts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete shift', err);
      if (err instanceof ApiError) {
        const errorBody = err.body as any;
        let errorMessage = 'Không thể xóa ca trực. Vui lòng thử lại.';
        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody?.message) {
          errorMessage = errorBody.message;
        } else if (Array.isArray(errorBody?.message)) {
          errorMessage = errorBody.message.join(', ');
        }
        setError(errorMessage);
      } else {
        setError('Không thể xóa ca trực. Vui lòng thử lại.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning':
        return 'Ca sáng (6h-14h)';
      case 'afternoon':
        return 'Ca chiều (14h-22h)';
      case 'night':
        return 'Ca đêm (22h-6h)';
      default:
        return type;
    }
  };

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
    // Parse date safely
    const dateStr = typeof shift.date === 'string' ? shift.date : new Date(shift.date).toISOString();
    const dateKey = dateStr.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = { morning: null, afternoon: null, night: null };
    }
    acc[dateKey][shift.shiftType as 'morning' | 'afternoon' | 'night'] = shift;
    return acc;
  }, {} as Record<string, { morning: ShiftResponseDto | null; afternoon: ShiftResponseDto | null; night: ShiftResponseDto | null }>);

  const sortedDates = Object.keys(groupedShifts).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Quản lý lịch trực bảo vệ</h2>
          <p className="text-gray-600 mt-1">Phân công và theo dõi ca trực của bảo vệ</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm ca trực</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

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
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {shiftsForDate.morning ? (
                          <div className="text-sm text-gray-900">{shiftsForDate.morning.guard?.fullName || 'N/A'}</div>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa phân công</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {shiftsForDate.afternoon ? (
                          <div className="text-sm text-gray-900">{shiftsForDate.afternoon.guard?.fullName || 'N/A'}</div>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa phân công</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {shiftsForDate.night ? (
                          <div className="text-sm text-gray-900">{shiftsForDate.night.guard?.fullName || 'N/A'}</div>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa phân công</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {shiftsForDate.morning && (
                            <>
                              <button
                                onClick={() => handleOpenModal(shiftsForDate.morning!)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(shiftsForDate.morning!.id)}
                                disabled={deletingId === shiftsForDate.morning!.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Xóa"
                              >
                                {deletingId === shiftsForDate.morning!.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          {shiftsForDate.afternoon && (
                            <>
                              <button
                                onClick={() => handleOpenModal(shiftsForDate.afternoon!)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(shiftsForDate.afternoon!.id)}
                                disabled={deletingId === shiftsForDate.afternoon!.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Xóa"
                              >
                                {deletingId === shiftsForDate.afternoon!.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          {shiftsForDate.night && (
                            <>
                              <button
                                onClick={() => handleOpenModal(shiftsForDate.night!)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(shiftsForDate.night!.id)}
                                disabled={deletingId === shiftsForDate.night!.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Xóa"
                              >
                                {deletingId === shiftsForDate.night!.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal thêm/sửa ca trực */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingShift ? 'Sửa ca trực' : 'Thêm ca trực mới'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trực</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ca trực</label>
                  <select
                    value={formData.shiftType}
                    onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as any })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="morning">Ca sáng (6h-14h)</option>
                    <option value="afternoon">Ca chiều (14h-22h)</option>
                    <option value="night">Ca đêm (22h-6h)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bảo vệ</label>
                  <select
                    value={(formData as any).guardId}
                    onChange={(e) => setFormData({ ...formData, guardId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn bảo vệ</option>
                    {guardList.map((guard) => (
                      <option key={guard.id} value={guard.id}>
                        {guard.fullName} - {guard.phone}
                      </option>
                    ))}
                  </select>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                    {error}
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingShift ? 'Cập nhật' : 'Tạo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}