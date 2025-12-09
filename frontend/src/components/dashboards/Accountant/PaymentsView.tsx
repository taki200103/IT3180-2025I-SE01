import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { InvoicesService } from '../../../api/services/InvoicesService';
import type { InvoiceResponseDto } from '../../../api/models/InvoiceResponseDto';

export default function PaymentsView() {
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
      setError('Không thể tải danh sách thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  const unpaidInvoices = invoices.filter((inv) => inv.status !== 'paid');

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý thanh toán</h2>
        <p className="text-gray-600 mt-1">Theo dõi các giao dịch thanh toán</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Đã thanh toán ({paidInvoices.length})</h3>
          {loading ? (
            <div className="flex items-center justify-center text-gray-600 py-4">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Đang tải...
            </div>
          ) : paidInvoices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có giao dịch nào</p>
          ) : (
            <div className="space-y-3">
              {paidInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{invoice.name}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {invoice.resident?.fullName || invoice.residentId}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {formatPrice(invoice.money)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Chưa thanh toán ({unpaidInvoices.length})</h3>
          {loading ? (
            <div className="flex items-center justify-center text-gray-600 py-4">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Đang tải...
            </div>
          ) : unpaidInvoices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Tất cả đã thanh toán</p>
          ) : (
            <div className="space-y-3">
              {unpaidInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{invoice.name}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {invoice.resident?.fullName || invoice.residentId}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span className="text-yellow-600 font-semibold">
                      {formatPrice(invoice.money)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

