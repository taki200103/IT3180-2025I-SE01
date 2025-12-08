import { useState, useEffect, useCallback } from 'react';
import { Loader2, X } from 'lucide-react';
import { InvoicesService } from '../../../api/services/InvoicesService';
import { ServicesService } from '../../../api/services/ServicesService';
import { ResidentsService } from '../../../api/services/ResidentsService';
import type { CreateInvoiceDto } from '../../../api/models/CreateInvoiceDto';
import type { InvoiceResponseDto } from '../../../api/models/InvoiceResponseDto';
import type { ResidentRecord } from './types';

export default function FeesView() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [residents, setResidents] = useState<ResidentRecord[]>([]);
  const [formData, setFormData] = useState({
    residentId: '',
    serviceId: '',
    name: '',
    money: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await InvoicesService.invoiceControllerFindAll();
      setInvoices(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('Failed to load invoices', err);
      setError('Không thể tải danh sách phiếu thu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const ensureReferenceData = useCallback(async () => {
    try {
      if (services.length === 0) {
        const serviceData = await ServicesService.serviceControllerFindAll();
        setServices(Array.isArray(serviceData) ? serviceData : serviceData?.data || []);
      }
      if (residents.length === 0) {
        const residentData = await ResidentsService.residentControllerFindAll();
        setResidents(Array.isArray(residentData) ? residentData : residentData?.data || []);
      }
    } catch (err) {
      console.error('Failed to load reference data', err);
    }
  }, [services.length, residents.length]);

  useEffect(() => {
    if (isModalOpen) {
      ensureReferenceData();
    }
  }, [isModalOpen, ensureReferenceData]);

  const resetForm = () => {
    setFormData({
      residentId: '',
      serviceId: '',
      name: '',
      money: '',
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceId = Number(formData.serviceId);
    const money = Number(formData.money);

    if (!formData.residentId || !serviceId || !formData.name.trim() || Number.isNaN(money)) {
      setError('Vui lòng nhập đầy đủ thông tin hợp lệ.');
      return;
    }

    const payload: CreateInvoiceDto = {
      residentId: formData.residentId,
      serviceId,
      name: formData.name.trim(),
      money,
    };

    setIsSubmitting(true);
    try {
      const created = await InvoicesService.invoiceControllerCreate(payload);
      setInvoices((prev) => [created, ...prev]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Create invoice failed', err);
      setError('Không thể tạo phiếu thu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.money || 0), 0);
  const paidAmount = invoices.reduce(
    (sum, inv) => sum + (inv.status === 'paid' ? inv.money || 0 : 0),
    0,
  );
  const pendingAmount = totalAmount - paidAmount;

  const handleServiceChange = (value: string) => {
    const selected = services.find((svc) => String(svc.id ?? svc.ID_khoan_thu) === value);
    setFormData((prev) => ({
      ...prev,
      serviceId: value,
      name: prev.name || (selected ? `Hóa đơn ${selected.name}` : ''),
      money: prev.money || (selected && selected.totalAmount ? String(selected.totalAmount) : ''),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý thu phí</h2>
          <p className="text-gray-600 mt-1">Theo dõi thanh toán phí quản lý</p>
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Tạo phiếu thu
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng phải thu</p>
          <p className="text-gray-900 text-2xl mt-2">{totalAmount.toLocaleString('vi-VN')} đ</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Đã thu</p>
          <p className="text-green-600 text-2xl mt-2">{paidAmount.toLocaleString('vi-VN')} đ</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Còn nợ</p>
          <p className="text-red-600 text-2xl mt-2">{pendingAmount.toLocaleString('vi-VN')} đ</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 flex items-center text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Đang tải phiếu thu...
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Cư dân</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Tên phiếu</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.resident?.fullName || invoice.residentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {invoice.service?.name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.money.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invoice.status === 'paid'
                          ? 'Đã thanh toán'
                          : invoice.status === 'overdue'
                            ? 'Quá hạn'
                            : 'Chưa thanh toán'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-gray-900 text-lg font-semibold leading-tight list-none">Tạo phiếu thu</h3>
            <p className="text-gray-500 text-sm mb-4">Chọn cư dân và dịch vụ cần thu.</p>

            {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cư dân</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.residentId}
                  onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                >
                  <option value="">-- Chọn cư dân --</option>
                  {residents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.fullName} ({resident.apartment?.name || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Khoản thu</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  <option value="">-- Chọn khoản thu --</option>
                  {services.map((service) => (
                    <option key={service.id || service.ID_khoan_thu} value={service.id || service.ID_khoan_thu}>
                      {service.name} ({service.totalAmount?.toLocaleString('vi-VN')} đ)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tên phiếu thu</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Phí dịch vụ tháng 12"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Số tiền</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.money}
                    onChange={(e) => setFormData({ ...formData, money: e.target.value })}
                    placeholder="3000000"
                  />
                </div>
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
                  Tạo phiếu thu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

