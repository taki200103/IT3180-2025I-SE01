import React, { useState, useEffect, useCallback } from 'react';
import { Wrench, Loader2, X } from 'lucide-react';
import { ServicesService } from '../../../api/services/ServicesService';
import type { CreateServiceDto } from '../../../api/models/CreateServiceDto';
import type { UpdateServiceDto } from '../../../api/models/UpdateServiceDto';

type Service = {
  id: number;
  name: string;
  month: string;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  createdAt?: string;
};

export default function ServicesView() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    month: '',
    totalAmount: '',
  });

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ServicesService.serviceControllerFindAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setServices(list);
    } catch (err) {
      console.error('Failed to load services', err);
      setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const resetForm = () => {
    setFormData({
      name: '',
      month: '',
      totalAmount: '',
    });
    setEditingService(null);
    setError('');
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      month: service.month,
      totalAmount: String(service.totalAmount),
    });
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên dịch vụ.');
      return;
    }
    if (!formData.month) {
      setError('Vui lòng chọn tháng.');
      return;
    }
    const totalAmount = Number(formData.totalAmount);
    if (!formData.totalAmount || Number.isNaN(totalAmount) || totalAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingService) {
        // Update existing service
        const payload: UpdateServiceDto = {
          name: formData.name.trim(),
          month: formData.month,
          totalAmount,
        };
        await ServicesService.serviceControllerUpdate(
          String(editingService.id),
          payload,
        );
      } else {
        // Create new service
        const payload: CreateServiceDto = {
          name: formData.name.trim(),
          month: formData.month,
          totalAmount,
          status: 'unpaid', // Default value since backend requires it
        };
        await ServicesService.serviceControllerCreate(payload);
      }
      await loadServices();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Save service failed', err);
      setError(
        editingService
          ? 'Không thể cập nhật dịch vụ. Vui lòng thử lại.'
          : 'Không thể tạo dịch vụ. Vui lòng thử lại.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const formatMonth = (month: string) => {
    if (!month) return '';
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return `${monthNames[parseInt(monthNum) - 1]}/${year}`;
  };

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý dịch vụ</h2>
          <p className="text-gray-600 mt-1">Cấu hình các dịch vụ của chung cư</p>
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={handleOpenCreateModal}
        >
          Thêm dịch vụ mới
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Đang tải dịch vụ...
        </div>
      ) : error && !isModalOpen ? (
        <div className="bg-white rounded-lg shadow p-6 text-red-600">{error}</div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
          Chưa có dịch vụ nào. Hãy thêm dịch vụ mới để bắt đầu.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Wrench className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-gray-900 font-semibold">{service.name}</h3>
              <p className="text-gray-600 mt-1">{formatPrice(service.totalAmount)}</p>
              <p className="text-gray-500 text-sm mt-1">{formatMonth(service.month)}</p>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenEditModal(service)}
                  className="flex-1 text-sm text-indigo-600 hover:text-indigo-700 py-2 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                >
                  Chỉnh sửa
                </button>
                <button className="flex-1 text-sm text-gray-600 hover:text-gray-700 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="bg-yellow-50 rounded-2xl shadow-2xl w-full max-w-5xl p-6 relative"
            style={{ width: '50%' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-gray-900 text-lg font-semibold leading-tight mb-1">
                  {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
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
              {editingService
                ? 'Cập nhật thông tin dịch vụ.'
                : 'Điền thông tin dịch vụ cần tạo.'}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Phí điện, Phí nước, Phí quản lý..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Các loại phí: Phí thuê, Phí điện, Phí nước, Phí gửi xe, Phí vệ sinh, Phí dịch vụ, Phí nhà ở
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Tháng <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.month || getCurrentMonth()}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Số tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="3000000"
                  required
                />
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
                  {editingService ? 'Cập nhật' : 'Tạo dịch vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
