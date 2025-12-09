import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { InvoicesService } from '../../../api/services/InvoicesService';
import type { InvoiceResponseDto } from '../../../api/models/InvoiceResponseDto';

export default function RevenueView() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await InvoicesService.invoiceControllerFindAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setInvoices(list);
    } catch (err) {
      console.error('Failed to load invoices', err);
      setError('Không thể tải danh sách hóa đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.money || 0), 0);
  const paidAmount = invoices.reduce(
    (sum, inv) => sum + (inv.status === 'paid' ? inv.money || 0 : 0),
    0,
  );
  const unpaidAmount = totalAmount - paidAmount;
  const unpaidCount = invoices.filter(
    (inv) => inv.status !== 'paid',
  ).length;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý doanh thu</h2>
        <p className="text-gray-600 mt-1">Theo dõi thu nhập từ phí quản lý và dịch vụ</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng phải thu</p>
          <p className="text-gray-900 text-2xl mt-2">{formatPrice(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Đã thu</p>
          <p className="text-green-600 text-2xl mt-2">{formatPrice(paidAmount)}</p>
          <p className="text-green-600 text-sm mt-1">
            {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}% tổng số
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Chưa thu</p>
          <p className="text-red-600 text-2xl mt-2">{formatPrice(unpaidAmount)}</p>
          <p className="text-red-600 text-sm mt-1">{unpaidCount} hóa đơn</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Đang tải hóa đơn...
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-6 text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(invoice.money)}
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
                          ? 'Đã thu'
                          : invoice.status === 'overdue'
                          ? 'Quá hạn'
                          : 'Chưa thu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

