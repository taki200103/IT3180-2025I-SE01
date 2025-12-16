import React, { useState, useEffect } from 'react';
import { Loader2, X, Copy, Check, Download } from 'lucide-react';
import QRCodeSVG from 'react-qr-code';
import * as XLSX from 'xlsx';
import { useAuth } from '../../../context/AuthContext';
import { InvoicesService, OpenAPI, ApiError } from '../../../api';
import type { InvoiceResponseDto } from '../../../api/models/InvoiceResponseDto';

interface FeeGroup {
  month: string;
  monthKey: string;
  amount: number;
  status: string;
  date: string;
  invoices: InvoiceResponseDto[];
}

export default function FeesView() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>([]);
  const [stats, setStats] = useState({
    totalPaid: 0,
    averageAmount: 0,
    nextAmount: 0,
    nextDueDate: '',
  });
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<FeeGroup | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          OpenAPI.TOKEN = token;
        }

        const residentId = user.id;
        const invoicesData = await InvoicesService.invoiceControllerGetAllByResidentId(residentId);
        
        setInvoices(Array.isArray(invoicesData) ? invoicesData : []);

        // Nhóm hóa đơn theo tháng
        const grouped = groupInvoicesByMonth(Array.isArray(invoicesData) ? invoicesData : []);
        setFeeGroups(grouped);

        // Tính toán thống kê
        const calculatedStats = calculateStats(grouped);
        setStats(calculatedStats);
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách hóa đơn:', err);
        setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tải danh sách hóa đơn');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const groupInvoicesByMonth = (invoices: InvoiceResponseDto[]): FeeGroup[] => {
    const groups: Record<string, FeeGroup> = {};

    invoices.forEach((invoice) => {
      const date = new Date(invoice.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!groups[monthKey]) {
        groups[monthKey] = {
          month: monthLabel,
          monthKey,
          amount: 0,
          status: 'Chưa thanh toán', // Mặc định là chưa thanh toán
          date: date.toLocaleDateString('vi-VN'),
          invoices: [],
        };
      }

      groups[monthKey].amount += invoice.money || 0;
      groups[monthKey].invoices.push(invoice);
    });

    // Tính trạng thái cho mỗi nhóm dựa trên các invoice trong nhóm
    Object.values(groups).forEach((group) => {
      // Kiểm tra xem tất cả invoice trong nhóm đã thanh toán chưa
      const allPaid = group.invoices.every((invoice) => invoice.status === 'paid');
      const hasPending = group.invoices.some((invoice) => invoice.status === 'pending');
      const hasOverdue = group.invoices.some((invoice) => invoice.status === 'overdue');

      if (hasOverdue) {
        group.status = 'Quá hạn';
      } else if (allPaid) {
        group.status = 'Đã thanh toán';
      } else if (hasPending) {
        group.status = 'Chờ duyệt';
      } else {
        group.status = 'Chưa thanh toán';
      }
    });

    // Sắp xếp theo tháng mới nhất trước
    return Object.values(groups).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  };

  const calculateStats = (groups: FeeGroup[]) => {
    if (groups.length === 0) {
      return {
        totalPaid: 0,
        averageAmount: 0,
        nextAmount: 0,
        nextDueDate: '',
      };
    }

    // Tổng đã thanh toán (3 tháng gần nhất)
    const recent3Months = groups.slice(0, 3);
    // Tổng đã thanh toán trong 3 tháng gần nhất: chỉ tính các invoice có status === 'paid'
    const totalPaid = recent3Months.reduce((sum, group) => {
      const paidInGroup = group.invoices.reduce((s, inv) => s + ((inv.status === 'paid') ? (inv.money || 0) : 0), 0);
      return sum + paidInGroup;
    }, 0);

    // Chi phí trung bình
    const averageAmount = groups.reduce((sum, group) => sum + group.amount, 0) / groups.length;

    // Tháng tiếp theo (tháng mới nhất + 1)
    const latestGroup = groups[0];
    const latestDate = new Date(latestGroup.monthKey + '-01');
    latestDate.setMonth(latestDate.getMonth() + 1);
    const nextDueDate = latestDate.toLocaleDateString('vi-VN');

    return {
      totalPaid,
      averageAmount,
      nextAmount: latestGroup.amount, // Ước tính bằng tháng gần nhất
      nextDueDate,
    };
  };

  const getServiceBreakdown = (group: FeeGroup) => {
    const breakdown: Record<string, number> = {};

    group.invoices.forEach((invoice) => {
      const serviceName = invoice.service?.name || invoice.name || 'Khác';
      if (!breakdown[serviceName]) {
        breakdown[serviceName] = 0;
      }
      breakdown[serviceName] += invoice.money || 0;
    });

    return breakdown;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} triệu`;
    }
    return `${amount.toLocaleString('vi-VN')} đ`;
  };

  const handlePayInvoice = async (invoiceId: string) => {
    if (!confirm('Bạn có chắc chắn muốn thanh toán hóa đơn này?')) {
      return;
    }

    setPayingInvoiceId(invoiceId);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        OpenAPI.TOKEN = token;
      }

      await InvoicesService.invoiceControllerPayInvoice(invoiceId);
      
      // Reload danh sách hóa đơn
      const invoicesData = await InvoicesService.invoiceControllerGetAllByResidentId(user!.id);
      const invoicesList = Array.isArray(invoicesData) ? invoicesData : [];
      setInvoices(invoicesList);

      // Cập nhật lại nhóm và thống kê
      const grouped = groupInvoicesByMonth(invoicesList);
      setFeeGroups(grouped);
      const calculatedStats = calculateStats(grouped);
      setStats(calculatedStats);
    } catch (err: any) {
      console.error('Lỗi khi thanh toán:', err);
      alert(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể thanh toán hóa đơn. Vui lòng thử lại.');
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const handlePayGroup = (group: FeeGroup) => {
    const unpaidInvoices = group.invoices.filter(
      (inv) => inv.status !== 'paid'
    );
    
    if (unpaidInvoices.length === 0) {
      return;
    }

    setSelectedGroup(group);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedGroup) return;

    const unpaidInvoices = selectedGroup.invoices.filter(
        (inv) => inv.status !== 'paid'
    );

    try {
      const token = localStorage.getItem('token');
      if (token) {
        OpenAPI.TOKEN = token;
      }

      // Thanh toán tất cả invoice chưa thanh toán trong nhóm
      for (const invoice of unpaidInvoices) {
        setPayingInvoiceId(invoice.id);
        await InvoicesService.invoiceControllerPayInvoice(invoice.id);
      }
      
      // Reload danh sách hóa đơn
      const invoicesData = await InvoicesService.invoiceControllerGetAllByResidentId(user!.id);
      const invoicesList = Array.isArray(invoicesData) ? invoicesData : [];
      setInvoices(invoicesList);

      // Cập nhật lại nhóm và thống kê
      const grouped = groupInvoicesByMonth(invoicesList);
      setFeeGroups(grouped);
      const calculatedStats = calculateStats(grouped);
      setStats(calculatedStats);

      // Đóng modal
      setPaymentModalOpen(false);
      setSelectedGroup(null);
    } catch (err: any) {
      console.error('Lỗi khi thanh toán:', err);
      alert(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể thanh toán hóa đơn. Vui lòng thử lại.');
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const generatePaymentContent = (group: FeeGroup) => {
    // Tạo nội dung chuyển khoản theo format Việt Nam
    const invoiceIds = group.invoices
          .filter((inv) => inv.status !== 'paid')
      .map((inv) => inv.id.substring(0, 8).toUpperCase())
      .join(' ');
    const residentName = user?.fullName || 'Cư dân';
    return `ND ${invoiceIds} ${residentName}`;
  };

  const getUnpaidAmount = (group: FeeGroup) => {
    // Tính tổng số tiền chưa thanh toán (chỉ các invoice chưa paid)
    return group.invoices
          .filter((inv) => inv.status !== 'paid')
      .reduce((sum, inv) => sum + (inv.money || 0), 0);
  };

  const generateQRCodeData = (group: FeeGroup) => {
    // Tạo dữ liệu QR code theo format VietQR hoặc ngân hàng Việt Nam
    const amount = getUnpaidAmount(group); // Chỉ tính số tiền chưa thanh toán
    const content = generatePaymentContent(group);
    // Format: STK|Số tiền|Nội dung
    // Ví dụ: 1234567890|500000|ND ABC12345 Nguyen Van A
    const bankAccount = '1234567890'; // Số tài khoản ngân hàng (có thể lấy từ config)
    return `${bankAccount}|${amount}|${content}`;
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExportInvoice = (group: FeeGroup) => {
    const sheetData = [
      ['Hóa đơn tháng', group.month],
      ['Cư dân', user?.fullName || user?.username || ''],
      ['Ngày xuất', new Date().toLocaleString('vi-VN')],
      [],
      ['Mã hóa đơn', 'Dịch vụ', 'Số tiền (đ)', 'Trạng thái', 'Ngày tạo'],
      ...group.invoices.map((invoice) => [
        invoice.id?.slice(0, 8).toUpperCase(),
        invoice.service?.name || invoice.name || 'Khác',
        invoice.money || 0,
        invoice.status,
        new Date(invoice.createdAt).toLocaleDateString('vi-VN'),
      ]),
      [],
      ['Tổng cộng', group.amount],
      ['Còn nợ', getUnpaidAmount(group)],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HoaDon');
    XLSX.writeFile(workbook, `Hoa-don-${group.monthKey}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý chi phí</h2>
        <p className="text-gray-600 mt-1">Theo dõi các khoản phí và thanh toán</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng đã thanh toán</p>
          <p className="text-green-600 text-2xl mt-2">{formatCurrency(stats.totalPaid)}</p>
          <p className="text-gray-600 text-sm mt-1">3 tháng gần nhất</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Chi phí trung bình</p>
          <p className="text-gray-900 text-2xl mt-2">{formatCurrency(stats.averageAmount)}</p>
          <p className="text-gray-600 text-sm mt-1">Mỗi tháng</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tiếp theo</p>
          <p className="text-orange-600 text-2xl mt-2">{formatCurrency(stats.nextAmount)}</p>
          <p className="text-gray-600 text-sm mt-1">
            {stats.nextDueDate ? `Hạn: ${stats.nextDueDate}` : 'Chưa có thông tin'}
          </p>
        </div>
      </div>

      {feeGroups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Chưa có hóa đơn nào
        </div>
      ) : (
        <div className="space-y-4">
          {feeGroups.map((group) => {
            const breakdown = getServiceBreakdown(group);
            const breakdownEntries = Object.entries(breakdown);

            return (
              <div key={group.monthKey} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900">{group.month}</h3>
                    <p className="text-gray-600 text-sm mt-1">Thanh toán: {group.date}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <span className="text-gray-900 text-xl">
                      {group.amount.toLocaleString('vi-VN')} đ
                    </span>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        group.status === 'Đã thanh toán'
                          ? 'bg-green-100 text-green-800'
                          : group.status === 'Chờ duyệt'
                          ? 'bg-blue-100 text-blue-800'
                          : group.status === 'Quá hạn'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {group.status}
                    </span>
                  </div>
                </div>
                {breakdownEntries.length > 0 && (
                  <div className={`grid gap-4 pt-4 border-t border-gray-100 ${
                    breakdownEntries.length <= 2 ? 'grid-cols-2' : 
                    breakdownEntries.length <= 4 ? 'grid-cols-2 md:grid-cols-4' : 
                    'grid-cols-2 md:grid-cols-4'
                  }`}>
                    {breakdownEntries.map(([serviceName, amount]) => (
                      <div key={serviceName}>
                        <p className="text-gray-600 text-sm">{serviceName}</p>
                        <p className="text-gray-900">{amount.toLocaleString('vi-VN')} đ</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-4 border-t border-gray-100 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => handleExportInvoice(group)}
                      className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Xuất hóa đơn
                    </button>
                    {group.status !== 'Đã thanh toán' && (
                      <div className="text-sm text-gray-600">
                        {group.status === 'Chờ duyệt' ? (
                          <span className="text-blue-600">Đang chờ kế toán duyệt</span>
                        ) : (
                          <span>
                            Còn nợ:{' '}
                            <strong>{getUnpaidAmount(group).toLocaleString('vi-VN')} đ</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {group.status !== 'Đã thanh toán' && group.status !== 'Chờ duyệt' && (
                    <button
                      onClick={() => handlePayGroup(group)}
                      disabled={payingInvoiceId !== null}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Thanh toán
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal thanh toán */}
      {paymentModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thanh toán hóa đơn</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedGroup.month}</p>
              </div>
              <button
                onClick={() => {
                  setPaymentModalOpen(false);
                  setSelectedGroup(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* QR Code */}
              <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                <QRCodeSVG
                  value={generateQRCodeData(selectedGroup)}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-xs text-gray-600 mt-2">Quét mã QR để thanh toán</p>
              </div>

              {/* Thông tin chuyển khoản */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Số tài khoản
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="1234567890"
                      aria-label="Số tài khoản ngân hàng"
                      title="Số tài khoản ngân hàng"
                      className="flex-1 border rounded-lg px-2 py-1.5 bg-gray-50 text-sm text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard('1234567890', 'account')}
                      className="p-1.5 border rounded-lg hover:bg-gray-50 transition"
                      title="Sao chép"
                    >
                      {copiedField === 'account' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Số tiền cần thanh toán
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getUnpaidAmount(selectedGroup).toLocaleString('vi-VN') + ' đ'}
                      aria-label="Số tiền cần thanh toán"
                      title="Số tiền cần thanh toán"
                      className="flex-1 border rounded-lg px-2 py-1.5 bg-gray-50 text-sm text-gray-900 font-semibold"
                    />
                    <button
                      onClick={() => copyToClipboard(getUnpaidAmount(selectedGroup).toString(), 'amount')}
                      className="p-1.5 border rounded-lg hover:bg-gray-50 transition"
                      title="Sao chép"
                    >
                      {copiedField === 'amount' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nội dung chuyển khoản
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatePaymentContent(selectedGroup)}
                      aria-label="Nội dung chuyển khoản"
                      title="Nội dung chuyển khoản"
                      className="flex-1 border rounded-lg px-2 py-1.5 bg-gray-50 text-sm text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(generatePaymentContent(selectedGroup), 'content')}
                      className="p-1.5 border rounded-lg hover:bg-gray-50 transition"
                      title="Sao chép"
                    >
                      {copiedField === 'content' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung trên. 
                    Sau khi chuyển khoản thành công, nhấn nút "Đã thanh toán" bên dưới.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setPaymentModalOpen(false);
                    setSelectedGroup(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={payingInvoiceId !== null}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {payingInvoiceId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Đã thanh toán'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

