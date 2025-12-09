import React, { useEffect, useState } from 'react';
import { Home, Users, DollarSign, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { ApartmentsService, ResidentsService, ServicesService, ComplainsService, OpenAPI, ApiError } from '../../../api';

interface AdminStats {
  totalApartments: number;
  totalResidents: number;
  monthlyRevenue: number;
  paymentRate: number; // %
  pendingComplaints: number;
  unpaidServices: number;
  expiringContracts: number;
}

export default function OverviewView() {
  const [stats, setStats] = useState<AdminStats>({
    totalApartments: 0,
    totalResidents: 0,
    monthlyRevenue: 0,
    paymentRate: 0,
    pendingComplaints: 0,
    unpaidServices: 0,
    expiringContracts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)} triệu`;
    }
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        if (token) {
          OpenAPI.TOKEN = token;
        }

        const [apartments, residents, services, complains] = await Promise.all([
          ApartmentsService.apartmentControllerFindAll().catch(() => []),
          ResidentsService.residentControllerFindAll().catch(() => []),
          ServicesService.serviceControllerFindAll().catch(() => []),
          ComplainsService.complainControllerFindAll().catch(() => []),
        ]);

        const apartmentsArr = Array.isArray(apartments) ? apartments : [];
        const residentsArr = Array.isArray(residents) ? residents : [];
        const servicesArr = Array.isArray(services) ? services : [];
        const complainsArr = Array.isArray(complains) ? complains : [];

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, '0')}`;

        const servicesThisMonth = servicesArr.filter((s: any) => s.month === currentMonthKey);
        const paidServices = servicesThisMonth.filter(
          (s: any) => (s.status || '').toLowerCase() === 'paid',
        );
        const unpaidServices = servicesThisMonth.filter(
          (s: any) => (s.status || '').toLowerCase() !== 'paid',
        );

        const monthlyRevenue = paidServices.reduce(
          (sum: number, s: any) => sum + (s.totalAmount || 0),
          0,
        );

        const paymentRate =
          servicesThisMonth.length > 0
            ? Math.round((paidServices.length / servicesThisMonth.length) * 100)
            : 0;

        const pendingComplaints = complainsArr.filter(
          (c: any) => (c.status || '').toLowerCase() === 'pending',
        ).length;

        const expiringContracts = apartmentsArr.filter((a: any) => {
          const endDate = new Date(a.contractStartDate || a.contract_enddate);
          if (Number.isNaN(endDate.getTime())) return false;
          const diffDays = (endDate.getTime() - now.getTime()) / 86_400_000;
          return diffDays >= 0 && diffDays <= 30;
        }).length;

        setStats({
          totalApartments: apartmentsArr.length,
          totalResidents: residentsArr.length,
          monthlyRevenue,
          paymentRate,
          pendingComplaints,
          unpaidServices: unpaidServices.length,
          expiringContracts,
        });
      } catch (err: any) {
        console.error('Lỗi khi lấy dữ liệu tổng quan admin:', err);
        setError(
          err instanceof ApiError
            ? err.body?.message || err.message
            : 'Không thể tải dữ liệu thống kê từ hệ thống',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const cards = [
    {
      label: 'Tổng căn hộ',
      value: stats.totalApartments.toString(),
      icon: Home,
      color: 'bg-blue-500',
      subtitle: 'Theo dữ liệu trong hệ thống',
    },
    {
      label: 'Cư dân',
      value: stats.totalResidents.toString(),
      icon: Users,
      color: 'bg-green-500',
      subtitle: 'Tổng số cư dân đã đăng ký',
    },
    {
      label: 'Doanh thu tháng hiện tại',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
      subtitle: 'Tổng tiền các khoản thu đã thu',
    },
    {
      label: 'Tỷ lệ thanh toán',
      value: `${stats.paymentRate}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      subtitle: 'Dựa trên các khoản thu trong tháng',
    },
  ];

  const recentActivities = [
    { time: 'Theo thời gian thực', text: 'Số liệu được lấy trực tiếp từ cơ sở dữ liệu', type: 'info' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải thống kê từ hệ thống...</div>
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-gray-900 text-2xl mt-2">{stat.value}</p>
                <p className="text-green-600 text-sm mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Ghi chú thống kê</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">{activity.text}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Công việc cần xử lý</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-gray-900 text-sm">
                  {stats.pendingComplaints} yêu cầu/khiếu nại đang ở trạng thái pending
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-gray-900 text-sm">
                  {stats.unpaidServices} khoản thu tháng hiện tại chưa được đánh dấu paid
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-gray-900 text-sm">
                  {stats.expiringContracts} hợp đồng căn hộ sẽ hết hạn trong 30 ngày tới
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

