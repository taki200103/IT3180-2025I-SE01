import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Wrench, Bell } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { InvoicesService, ResidentsService, ComplainsService, ResidentNotificationsService, OpenAPI, ApiError } from '../../../api';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface Stats {
  currentMonthFee: number;
  totalMembers: number;
  pendingComplaints: number;
  recentNotifications: any[];
  monthlyFees: Array<{ month: string; amount: number }>;
}

export default function OverviewView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    currentMonthFee: 0,
    totalMembers: 0,
    pendingComplaints: 0,
    recentNotifications: [],
    monthlyFees: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverviewData = async () => {
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
        const apartmentId = user.apartment;

        // Fetch tất cả dữ liệu song song
        const [invoices, residents, complaints, notifications] = await Promise.all([
          InvoicesService.invoiceControllerGetAllByResidentId(residentId).catch(() => []),
          ResidentsService.residentControllerFindAll().catch(() => []),
          ComplainsService.complainControllerFindAll(residentId).catch(() => []),
          ResidentNotificationsService.residentnotificationControllerGetNotificationsByResident(residentId).catch(() => []),
        ]);

        // Tính phí tháng hiện tại
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const currentMonthInvoices = Array.isArray(invoices)
          ? invoices.filter((inv: any) => {
              const invDate = new Date(inv.createdAt || inv.created_at);
              return invDate.getMonth() + 1 === currentMonth && invDate.getFullYear() === currentYear;
            })
          : [];
        const currentMonthFee = currentMonthInvoices.reduce((sum: number, inv: any) => sum + (inv.money || 0), 0);

        // Đếm thành viên cùng căn hộ
        const familyMembers = Array.isArray(residents)
          ? residents.filter((r: any) => {
              const residentApartmentId = r.apartmentId || r.apartment?.id;
              return residentApartmentId === apartmentId;
            })
          : [];
        const totalMembers = familyMembers.length;

        // Đếm yêu cầu đang xử lý
        const pendingComplaints = Array.isArray(complaints)
          ? complaints.filter((c: any) => {
              const status = (c.status || '').toLowerCase();
              return !status.includes('hoàn thành') && !status.includes('đã xử lý');
            }).length
          : 0;

        // Lấy thông báo mới (3 thông báo gần nhất)
        const processedNotifications = Array.isArray(notifications)
          ? notifications
              .map((item: any) => {
                const notification = item.notification || item;
                return {
                  id: item.id || notification?.id || '',
                  title: notification?.title || item.title || 'Thông báo',
                  info: notification?.info || item.info || '',
                  createdAt: notification?.createdAt || item.createdAt || '',
                };
              })
              .sort((a: any, b: any) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
              })
              .slice(0, 3)
          : [];

        // Tính phí theo tháng (6 tháng gần nhất)
        const monthlyFeesMap: Record<string, { month: string; amount: number }> = {};
        if (Array.isArray(invoices)) {
          invoices.forEach((inv: any) => {
            const date = new Date(inv.createdAt || inv.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = `T${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
            if (!monthlyFeesMap[monthKey]) {
              monthlyFeesMap[monthKey] = { month: monthLabel, amount: 0 };
            }
            monthlyFeesMap[monthKey].amount += inv.money || 0;
          });
        }

        // Sắp xếp và lấy 6 tháng gần nhất
        const monthlyFees = Object.entries(monthlyFeesMap)
          .map(([key, value]) => ({ ...value, key }))
          .sort((a, b) => b.key.localeCompare(a.key))
          .slice(0, 6)
          .reverse();

        setStats({
          currentMonthFee,
          totalMembers,
          pendingComplaints,
          recentNotifications: processedNotifications,
          monthlyFees,
        });
      } catch (err: any) {
        console.error('Lỗi khi lấy dữ liệu tổng quan:', err);
        setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [user]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} triệu`;
    }
    return `${amount.toLocaleString('vi-VN')} đ`;
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    } catch {
      return '';
    }
  };

  const chartConfig = {
    amount: {
      label: 'Số tiền',
      color: 'hsl(var(--chart-1))',
    },
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

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-white text-2xl font-semibold">Xin chào, {user?.name}! 👋</h2>
        <p className="mt-2 text-indigo-100">Căn hộ: {user?.apartment || 'Chưa cập nhật'}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Phí tháng này</p>
              <p className="text-gray-900 text-2xl mt-2">{formatCurrency(stats.currentMonthFee)}</p>
              <p className="text-green-600 text-sm mt-1">Đã thanh toán</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Thành viên</p>
              <p className="text-gray-900 text-2xl mt-2">{stats.totalMembers} người</p>
              <p className="text-gray-600 text-sm mt-1">Trong gia đình</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Yêu cầu</p>
              <p className="text-gray-900 text-2xl mt-2">{stats.pendingComplaints}</p>
              <p className="text-orange-600 text-sm mt-1">Đang xử lý</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart - Chi phí theo tháng */}
      {stats.monthlyFees.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4 font-semibold">Chi phí theo tháng</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={stats.monthlyFees}>
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--color-amount)"
                fill="url(#fillAmount)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4 font-semibold">Thông báo mới</h3>
        {stats.recentNotifications.length === 0 ? (
          <div className="text-center text-gray-500 py-4">Chưa có thông báo nào</div>
        ) : (
          <div className="space-y-3">
            {stats.recentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <Bell className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium">{notification.title}</p>
                  {notification.info && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-1">{notification.info}</p>
                  )}
                  {notification.createdAt && (
                    <p className="text-gray-500 text-xs mt-1">{formatTimeAgo(notification.createdAt)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

