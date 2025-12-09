import { useState, useEffect, useCallback } from 'react';
import { Loader2, X, UserPlus, LogIn, LogOut } from 'lucide-react';
import { ApartmentsService } from '../../../api/services/ApartmentsService';
import { ResidentsService } from '../../../api/services/ResidentsService';

type Visitor = {
  id: string;
  name: string;
  phone: string;
  apartmentId: string;
  apartmentName: string;
  purpose: string;
  vehicle: string;
  registeredAt: string;
};

type AccessLog = {
  id: string;
  name: string;
  apartment: string;
  type: 'Cư dân' | 'Khách' | 'Dịch vụ';
  time: string;
  direction: 'Vào' | 'Ra';
  vehicle: string;
  visitorId?: string;
};

const STORAGE_KEY_VISITORS = 'guard_visitors';
const STORAGE_KEY_ACCESS_LOGS = 'guard_access_logs';

export default function AccessView() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    apartmentId: '',
    purpose: '',
    vehicle: '',
  });

  // Load data from localStorage
  useEffect(() => {
    const savedVisitors = localStorage.getItem(STORAGE_KEY_VISITORS);
    const savedLogs = localStorage.getItem(STORAGE_KEY_ACCESS_LOGS);
    
    if (savedVisitors) {
      try {
        setVisitors(JSON.parse(savedVisitors));
      } catch (e) {
        console.error('Failed to parse visitors', e);
      }
    }
    
    if (savedLogs) {
      try {
        setAccessLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse access logs', e);
      }
    }
  }, []);

  // Load apartments and residents
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [apartmentsData, residentsData] = await Promise.all([
          ApartmentsService.apartmentControllerFindAll(),
          ResidentsService.residentControllerFindAll(),
        ]);
        
        setApartments(Array.isArray(apartmentsData) ? apartmentsData : apartmentsData?.data || []);
        setResidents(Array.isArray(residentsData) ? residentsData : residentsData?.data || []);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save to localStorage
  const saveVisitors = useCallback((newVisitors: Visitor[]) => {
    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(newVisitors));
    setVisitors(newVisitors);
  }, []);

  const saveAccessLogs = useCallback((newLogs: AccessLog[]) => {
    localStorage.setItem(STORAGE_KEY_ACCESS_LOGS, JSON.stringify(newLogs));
    setAccessLogs(newLogs);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      apartmentId: '',
      purpose: '',
      vehicle: '',
    });
    setError('');
  };

  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.apartmentId) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const apartment = apartments.find((apt) => apt.id === formData.apartmentId);
    if (!apartment) {
      setError('Căn hộ không hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newVisitor: Visitor = {
        id: `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        apartmentId: formData.apartmentId,
        apartmentName: apartment.name || apartment.Name || `Căn hộ ${formData.apartmentId}`,
        purpose: formData.purpose.trim() || 'Thăm',
        vehicle: formData.vehicle.trim() || 'Đi bộ',
        registeredAt: new Date().toISOString(),
      };

      const updatedVisitors = [...visitors, newVisitor];
      saveVisitors(updatedVisitors);

      // Create access log for entry
      const newLog: AccessLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newVisitor.name,
        apartment: newVisitor.apartmentName,
        type: 'Khách',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        direction: 'Vào',
        vehicle: newVisitor.vehicle,
        visitorId: newVisitor.id,
      };

      const updatedLogs = [newLog, ...accessLogs];
      saveAccessLogs(updatedLogs);

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Register visitor failed', err);
      setError('Không thể đăng ký khách. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordAccess = (direction: 'Vào' | 'Ra', name: string, apartment: string, vehicle: string = 'Đi bộ') => {
    const newLog: AccessLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      apartment,
      type: 'Khách',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      direction,
      vehicle,
    };

    const updatedLogs = [newLog, ...accessLogs];
    saveAccessLogs(updatedLogs);
  };

  const handleResidentAccess = (direction: 'Vào' | 'Ra', resident: any) => {
    const newLog: AccessLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: resident.fullName,
      apartment: resident.apartment?.name || '—',
      type: 'Cư dân',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      direction,
      vehicle: '—',
    };

    const updatedLogs = [newLog, ...accessLogs];
    saveAccessLogs(updatedLogs);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý ra vào</h2>
          <p className="text-gray-600 mt-1">Theo dõi người và phương tiện ra vào</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Đăng ký khách
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-900 text-sm font-semibold mb-3">Khách đã đăng ký hôm nay</h3>
          {visitors.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa có khách nào đăng ký</p>
          ) : (
            <div className="space-y-2">
              {visitors.slice(0, 5).map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm text-gray-900">{visitor.name}</p>
                    <p className="text-xs text-gray-500">{visitor.apartmentName}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleRecordAccess('Vào', visitor.name, visitor.apartmentName, visitor.vehicle)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Ghi nhận vào"
                    >
                      <LogIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRecordAccess('Ra', visitor.name, visitor.apartmentName, visitor.vehicle)}
                      className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                      title="Ghi nhận ra"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-900 text-sm font-semibold mb-3">Cư dân thường xuyên</h3>
          {residents.length === 0 ? (
            <p className="text-gray-500 text-sm">Đang tải...</p>
          ) : (
            <div className="space-y-2">
              {residents.slice(0, 5).map((resident) => (
                <div key={resident.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm text-gray-900">{resident.fullName}</p>
                    <p className="text-xs text-gray-500">{resident.apartment?.name || '—'}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleResidentAccess('Vào', resident)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Ghi nhận vào"
                    >
                      <LogIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleResidentAccess('Ra', resident)}
                      className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                      title="Ghi nhận ra"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Access Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Căn hộ</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Chiều</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Phương tiện</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Chưa có lịch sử ra vào
                  </td>
                </tr>
              ) : (
                accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.apartment}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          log.type === 'Cư dân'
                            ? 'bg-blue-100 text-blue-800'
                            : log.type === 'Khách'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          log.direction === 'Vào'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {log.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.vehicle}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Visitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-gray-900 text-lg font-semibold mb-1">
                  Đăng ký khách
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Điền thông tin khách đến thăm
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0901234567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Căn hộ đến thăm <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.apartmentId}
                  onChange={(e) => setFormData({ ...formData, apartmentId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn căn hộ --</option>
                  {apartments.map((apt) => (
                    <option key={apt.id || apt.ID_Apartment || apt.ID_apartment} value={apt.id || apt.ID_Apartment || apt.ID_apartment}>
                      {apt.name || apt.Name || `Căn hộ ${apt.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Mục đích</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Ví dụ: Thăm người thân, Giao hàng..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Phương tiện</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                >
                  <option value="Đi bộ">Đi bộ</option>
                  <option value="Xe máy">Xe máy</option>
                  <option value="Ô tô">Ô tô</option>
                  <option value="Xe đạp">Xe đạp</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
