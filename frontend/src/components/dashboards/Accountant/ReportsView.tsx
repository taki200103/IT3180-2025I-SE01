import { useState, useEffect, useCallback } from 'react';
import { Loader2, Download, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import { InvoicesService, OpenAPI, ApiError } from '../../../api';
import type { InvoiceResponseDto } from '../../../api/models/InvoiceResponseDto';

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'Đã chi' | 'Chờ duyệt';
};

const STORAGE_KEY_EXPENSES = 'accountant_expenses';

export default function ReportsView() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        OpenAPI.TOKEN = token;
      }

      // Load invoices
      const invoicesData = await InvoicesService.invoiceControllerFindAll();
      const invoicesList = Array.isArray(invoicesData) ? invoicesData : invoicesData?.data || [];
      setInvoices(invoicesList);

      // Load expenses from localStorage
      const savedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
      if (savedExpenses) {
        try {
          setExpenses(JSON.parse(savedExpenses));
        } catch (e) {
          console.error('Failed to parse expenses', e);
        }
      }
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return `${monthNames[parseInt(month) - 1]}/${year}`;
  };

  // Filter data by selected period
  const getFilteredData = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const filteredInvoices = invoices.filter((inv) => {
      const invDate = new Date(inv.createdAt);
      return invDate >= startDate && invDate <= endDate;
    });

    const filteredExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= startDate && expDate <= endDate && exp.status === 'Đã chi';
    });

    return { filteredInvoices, filteredExpenses };
  };

  const { filteredInvoices, filteredExpenses } = getFilteredData();

  // Calculate statistics
  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (inv.money || 0), 0);
  const paidRevenue = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.status === 'paid' ? inv.money || 0 : 0),
    0,
  );
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const profit = paidRevenue - totalExpenses;
  const profitMargin = paidRevenue > 0 ? (profit / paidRevenue) * 100 : 0;

  // Expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Revenue by service
  const revenueByService = filteredInvoices.reduce((acc, inv) => {
    const serviceName = inv.service?.name || 'Khác';
    acc[serviceName] = (acc[serviceName] || 0) + (inv.money || 0);
    return acc;
  }, {} as Record<string, number>);

  const handleExportReport = async () => {
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = [
        ['Kỳ báo cáo', formatMonth(selectedMonth)],
        ['Doanh thu (đã thu)', paidRevenue],
        ['Tổng doanh thu (bao gồm chưa thu)', totalRevenue],
        ['Tổng chi phí', totalExpenses],
        ['Lợi nhuận', profit],
        ['Tỷ suất lợi nhuận (%)', Number(profitMargin.toFixed(2))],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Tong hop');

      // Revenue by service
      const revenueRows = Object.entries(revenueByService).map(([service, amount]) => ({
        'Dịch vụ': service,
        'Doanh thu': amount,
      }));
      const wsRevenue = XLSX.utils.json_to_sheet(revenueRows);
      XLSX.utils.book_append_sheet(wb, wsRevenue, 'Doanh thu DV');

      // Expenses by category
      const expenseRows = Object.entries(expensesByCategory).map(([category, amount]) => ({
        'Danh mục': category,
        'Chi phí': amount,
      }));
      const wsExpenseSummary = XLSX.utils.json_to_sheet(expenseRows);
      XLSX.utils.book_append_sheet(wb, wsExpenseSummary, 'Chi phí DM');

      // Invoice details
      const invoiceRows = filteredInvoices.map((inv) => ({
        'Mã HĐ': inv.id,
        'Cư dân': inv.resident?.fullName || inv.residentId || '',
        'Dịch vụ': inv.service?.name || '',
        'Số tiền': inv.money || 0,
        'Trạng thái': inv.status || '',
        'Ngày tạo': inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('vi-VN') : '',
      }));
      const wsInvoices = XLSX.utils.json_to_sheet(invoiceRows);
      XLSX.utils.book_append_sheet(wb, wsInvoices, 'Chi tiết HĐ');

      // Expense details
      const expenseDetailRows = filteredExpenses.map((exp) => ({
        'Mã phiếu': exp.id,
        'Danh mục': exp.category,
        'Mô tả': exp.description,
        'Số tiền': exp.amount,
        'Ngày chi': exp.date ? new Date(exp.date).toLocaleDateString('vi-VN') : '',
        'Trạng thái': exp.status,
      }));
      const wsExpenseDetails = XLSX.utils.json_to_sheet(expenseDetailRows);
      XLSX.utils.book_append_sheet(wb, wsExpenseDetails, 'Chi tiết chi phí');

      XLSX.writeFile(wb, `bao-cao-tai-chinh-${selectedMonth}.xlsx`);
    } catch (err: any) {
      console.error('Xuất báo cáo thất bại', err);
      alert(
        err instanceof ApiError
          ? err.body?.message || err.message
          : 'Không thể xuất báo cáo. Vui lòng thử lại.',
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Báo cáo tài chính</h2>
          <p className="text-gray-600 mt-1">Xem và xuất báo cáo tài chính</p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <button
            onClick={handleExportReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Doanh thu đã thu</p>
              <p className="text-3xl mt-2">{formatPrice(paidRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Tổng chi phí</p>
              <p className="text-3xl mt-2">{formatPrice(totalExpenses)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Lợi nhuận</p>
              <p className={`text-3xl mt-2 ${profit >= 0 ? '' : 'text-red-200'}`}>
                {formatPrice(profit)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tỷ suất lợi nhuận</p>
              <p className="text-3xl mt-2">{profitMargin.toFixed(1)}%</p>
            </div>
            <FileText className="w-8 h-8 text-purple-100" />
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Chi phí theo danh mục</h3>
          {Object.keys(expensesByCategory).length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có chi phí trong kỳ này</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{category}</span>
                        <span className="text-gray-900">{formatPrice(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Revenue by Service */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Doanh thu theo dịch vụ</h3>
          {Object.keys(revenueByService).length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có doanh thu trong kỳ này</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(revenueByService)
                .sort(([, a], [, b]) => b - a)
                .map(([service, amount]) => {
                  const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                  return (
                    <div key={service}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{service}</span>
                        <span className="text-gray-900">{formatPrice(amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Tóm tắt tài chính {formatMonth(selectedMonth)}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Chỉ tiêu</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Tổng doanh thu phải thu</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatPrice(totalRevenue)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-right">100%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Doanh thu đã thu</td>
                <td className="px-6 py-4 text-sm text-green-600 text-right">{formatPrice(paidRevenue)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-right">
                  {totalRevenue > 0 ? ((paidRevenue / totalRevenue) * 100).toFixed(1) : 0}%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Tổng chi phí</td>
                <td className="px-6 py-4 text-sm text-red-600 text-right">{formatPrice(totalExpenses)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-right">
                  {paidRevenue > 0 ? ((totalExpenses / paidRevenue) * 100).toFixed(1) : 0}%
                </td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4 text-sm text-gray-900">Lợi nhuận ròng</td>
                <td className={`px-6 py-4 text-sm text-right ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPrice(profit)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 text-right">
                  {profitMargin.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
