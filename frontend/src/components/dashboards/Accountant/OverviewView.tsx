import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { InvoicesService, OpenAPI, ApiError } from '../../../api';

type MonthlyItem = { label: string; amount: number; percent: number };

type Stats = {
  revenueThisMonth: number;
  paidAmount: number;
  unpaidAmount: number;
  paymentRate: number;
  totalInvoicesThisMonth: number;
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
  monthlySeries: MonthlyItem[];
};

const formatCurrency = (amount: number) => {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu`;
  return `${amount.toLocaleString('vi-VN')} đ`;
};

export default function OverviewView() {
  const [stats, setStats] = useState<Stats>({
    revenueThisMonth: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    paymentRate: 0,
    totalInvoicesThisMonth: 0,
    paidCount: 0,
    unpaidCount: 0,
    overdueCount: 0,
    monthlySeries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          OpenAPI.TOKEN = token;
        }

        const invoices = await InvoicesService.invoiceControllerFindAll().catch(() => []);
        const invoicesArr = Array.isArray(invoices) ? invoices : invoices?.data || [];

        const monthlyMap: Record<string, { amount: number; count: number }> = {};

        let revenueThisMonth = 0;
        let paidAmount = 0;
        let paidCount = 0;
        let unpaidAmount = 0;
        let unpaidCount = 0;
        let overdueCount = 0;

        invoicesArr.forEach((inv: any) => {
          const created = new Date(inv.createdAt || inv.created_at);
          if (Number.isNaN(created.getTime())) return;

          const monthKey = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(
            2,
            '0',
          )}`;
          const monthLabel = `Tháng ${created.getMonth() + 1}/${created.getFullYear()}`;

          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { amount: 0, count: 0 };
          }
          monthlyMap[monthKey].amount += inv.money || 0;
          monthlyMap[monthKey].count += 1;

          const status = (inv.status || '').toLowerCase();
          const money = inv.money || 0;

          if (monthKey === currentMonthKey) {
            revenueThisMonth += money;
            if (status === 'paid') {
              paidAmount += money;
              paidCount += 1;
            } else {
              unpaidAmount += money;
              unpaidCount += 1;
              if (status === 'overdue') overdueCount += 1;
            }
          }
        });

        const totalInvoicesThisMonth = paidCount + unpaidCount;
        const paymentRate =
          totalInvoicesThisMonth > 0
            ? Math.round((paidCount / totalInvoicesThisMonth) * 100)
            : 0;

        const monthlySeries = Object.entries(monthlyMap)
          .map(([key, value]) => ({ key, ...value }))
          .sort((a, b) => b.key.localeCompare(a.key))
          .slice(0, 4)
          .map((item, _, arr) => {
            const maxAmount = arr[0]?.amount || 1;
            return {
              label: `Tháng ${Number(item.key.slice(5))}/${item.key.slice(0, 4)}`,
              amount: item.amount,
              percent: Math.round((item.amount / maxAmount) * 100),
            };
          });

        setStats({
          revenueThisMonth,
          paidAmount,
          unpaidAmount,
          paymentRate,
          totalInvoicesThisMonth,
          paidCount,
          unpaidCount,
          overdueCount,
          monthlySeries,
        });
      } catch (err: any) {
        console.error('Lỗi khi lấy thống kê kế toán:', err);
        setError(
          err instanceof ApiError
            ? err.body?.message || err.message
            : 'Không thể tải thống kê từ hệ thống',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentMonthKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang tải thống kê từ cơ sở dữ liệu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <p className="text-green-100 text-sm">Doanh thu tháng</p>
          <p className="text-3xl mt-2">{formatCurrency(stats.revenueThisMonth)}</p>
          <p className="text-green-100 text-sm mt-2">Ghi nhận từ hóa đơn</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <p className="text-blue-100 text-sm">Đã thu</p>
          <p className="text-3xl mt-2">{formatCurrency(stats.paidAmount)}</p>
          <p className="text-blue-100 text-sm mt-2">{stats.paidCount} hóa đơn</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <p className="text-orange-100 text-sm">Chưa thu</p>
          <p className="text-3xl mt-2">{formatCurrency(stats.unpaidAmount)}</p>
          <p className="text-orange-100 text-sm mt-2">{stats.unpaidCount} hóa đơn</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <p className="text-purple-100 text-sm">Tỷ lệ thu</p>
          <p className="text-3xl mt-2">{stats.paymentRate}%</p>
          <p className="text-purple-100 text-sm mt-2">
            {stats.paidCount}/{stats.totalInvoicesThisMonth || 0} hóa đơn tháng
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Doanh thu theo tháng</h3>
          {stats.monthlySeries.length === 0 ? (
            <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
          ) : (
            <div className="space-y-3">
              {stats.monthlySeries.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-gray-900">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Công việc cần xử lý</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                {stats.unpaidCount} hóa đơn chưa thanh toán
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Tổng: {formatCurrency(stats.unpaidAmount)}
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{stats.overdueCount} hóa đơn quá hạn</p>
              <p className="text-sm text-red-600 mt-1">Ưu tiên thu hồi</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-800">Tổng hóa đơn tháng: {stats.totalInvoicesThisMonth}</p>
              <p className="text-sm text-purple-600 mt-1">Theo dõi cập nhật</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

