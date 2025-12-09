import React, { useEffect, useState } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import {
  ApartmentsService,
  ResidentsService,
  ServicesService,
  ComplainsService,
  OpenAPI,
  ApiError,
} from '../../../api';

type PopularService = { name: string; count: number };

type Statistics = {
  totalApartments: number;
  paymentRate: number;
  monthlyRevenue: number;
  serviceRequests: number;
  totalResidents: number;
  children: number;
  adults: number;
  averagePerHousehold: number;
  popularServices: PopularService[];
};

export default function StatisticsView() {
  const [stats, setStats] = useState<Statistics>({
    totalApartments: 0,
    paymentRate: 0,
    monthlyRevenue: 0,
    serviceRequests: 0,
    totalResidents: 0,
    children: 0,
    adults: 0,
    averagePerHousehold: 0,
    popularServices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rawData, setRawData] = useState<{
    apartments: any[];
    residents: any[];
    services: any[];
    complains: any[];
  }>({
    apartments: [],
    residents: [],
    services: [],
    complains: [],
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu`;
    return `${amount.toLocaleString('vi-VN')} đ`;
  };

  const calcAge = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    const diff = Date.now() - date.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        if (token) OpenAPI.TOKEN = token;

        const [apartments, residents, services, complains] = await Promise.all([
          ApartmentsService.apartmentControllerFindAll().catch(() => []),
          ResidentsService.residentControllerFindAll().catch(() => []),
          ServicesService.serviceControllerFindAll().catch(() => []),
          ComplainsService.complainControllerFindAll().catch(() => []),
        ]);

        const apartmentsArr = Array.isArray(apartments) ? apartments : apartments?.data || [];
        const residentsArr = Array.isArray(residents) ? residents : residents?.data || [];
        const servicesArr = Array.isArray(services) ? services : services?.data || [];
        const complainsArr = Array.isArray(complains) ? complains : complains?.data || [];

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const servicesThisMonth =
          servicesArr.length > 0
            ? servicesArr.filter((s: any) => s.month === currentMonthKey)
            : [];

        const servicesForUsage = servicesThisMonth.length > 0 ? servicesThisMonth : servicesArr;

        const paidServices = servicesThisMonth.filter(
          (s: any) => (s.status || '').toLowerCase() === 'paid',
        );

        const monthlyRevenue = paidServices.reduce(
          (sum: number, s: any) => sum + (s.totalAmount || 0),
          0,
        );

        const paymentRate =
          servicesThisMonth.length > 0
            ? Math.round((paidServices.length / servicesThisMonth.length) * 100)
            : 0;

        const complainsThisMonth = complainsArr.filter((c: any) => {
          const createdAt = new Date(c.createdAt || c.created_at || c.created_date);
          return (
            !Number.isNaN(createdAt.getTime()) &&
            createdAt.getMonth() === now.getMonth() &&
            createdAt.getFullYear() === now.getFullYear()
          );
        });

        const totalResidents = residentsArr.length;
        const totalApartments = apartmentsArr.length;
        const householdBase = totalApartments > 0 ? totalApartments : 1; // avoid divide-by-zero

        const children = residentsArr.filter((r: any) => {
          const age = calcAge(r.birthDate || r.birth_date);
          return age !== null && age < 16;
        }).length;

        const adults = Math.max(totalResidents - children, 0);
        const averagePerHousehold =
          totalApartments > 0 ? Number((totalResidents / householdBase).toFixed(1)) : 0;

        const popularServicesMap: Record<string, number> = {};
        servicesForUsage.forEach((s: any) => {
          const name = s.name || 'Khác';
          popularServicesMap[name] = (popularServicesMap[name] || 0) + 1;
        });

        const popularServices = Object.entries(popularServicesMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        setStats({
          totalApartments,
          paymentRate,
          monthlyRevenue,
          serviceRequests: complainsThisMonth.length,
          totalResidents,
          children,
          adults,
          averagePerHousehold,
          popularServices,
        });

        // Lưu raw data để xuất Excel
        setRawData({
          apartments: apartmentsArr,
          residents: residentsArr,
          services: servicesArr,
          complains: complainsArr,
        });
      } catch (err: any) {
        console.error('Lỗi khi tải thống kê', err);
        setError(
          err instanceof ApiError
            ? err.body?.message || err.message
            : 'Không thể tải thống kê từ hệ thống',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải thống kê từ cơ sở dữ liệu...</div>
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

  const handleExportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();

      const now = new Date();
      const reportDate = now.toLocaleDateString('vi-VN');
      const reportTime = now.toLocaleTimeString('vi-VN');

      // Sheet 1: Tổng quan thống kê
      const summaryData = [
        ['BÁO CÁO THỐNG KÊ CHUNG CƯ'],
        ['Ngày xuất báo cáo', reportDate],
        ['Giờ xuất báo cáo', reportTime],
        [],
        ['TỔNG QUAN'],
        ['Tổng số căn hộ', stats.totalApartments],
        ['Tổng số cư dân', stats.totalResidents],
        ['Tỷ lệ thanh toán', `${stats.paymentRate}%`],
        ['Doanh thu tháng', stats.monthlyRevenue],
        ['Yêu cầu/khiếu nại', stats.serviceRequests],
        [],
        ['THỐNG KÊ DÂN SỐ'],
        ['Tổng cư dân', `${stats.totalResidents} người`],
        ['Trẻ em (<16 tuổi)', `${stats.children} người`],
        ['Người lớn', `${stats.adults} người`],
        ['Trung bình/hộ', `${stats.averagePerHousehold} người`],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Tong quan');

      // Sheet 2: Dịch vụ phổ biến
      const popularServicesData = [
        ['Dịch vụ', 'Số lượt sử dụng'],
        ...stats.popularServices.map((s) => [s.name, s.count]),
      ];
      const wsPopularServices = XLSX.utils.aoa_to_sheet(popularServicesData);
      XLSX.utils.book_append_sheet(wb, wsPopularServices, 'Dich vu pho bien');

      // Sheet 3: Danh sách căn hộ
      const apartmentsData = [
        ['Mã căn hộ', 'Tên căn hộ', 'Diện tích (m²)', 'Ngày bắt đầu', 'Ngày kết thúc'],
        ...rawData.apartments.map((apt: any) => [
          apt.id || apt.ID_Apartment || '',
          apt.name || apt.Name || '',
          apt.area || 0,
          apt.contractStartDate
            ? new Date(apt.contractStartDate).toLocaleDateString('vi-VN')
            : '',
          apt.contractEndDate
            ? new Date(apt.contractEndDate).toLocaleDateString('vi-VN')
            : '',
        ]),
      ];
      const wsApartments = XLSX.utils.aoa_to_sheet(apartmentsData);
      XLSX.utils.book_append_sheet(wb, wsApartments, 'Danh sach can ho');

      // Sheet 4: Danh sách cư dân
      const residentsData = [
        [
          'Họ tên',
          'Email',
          'Số điện thoại',
          'Căn hộ',
          'Vai trò',
          'Trạng thái',
          'Đã duyệt',
          'Ngày sinh',
        ],
        ...rawData.residents.map((res: any) => [
          res.fullName || res.name || '',
          res.email || '',
          res.phone || '',
          res.apartment?.name || res.apartmentId || '—',
          res.role || '',
          res.temporaryStatus ? 'Tạm vắng' : 'Đang cư trú',
          res.approved ? 'Đã duyệt' : 'Chờ duyệt',
          res.birthDate
            ? new Date(res.birthDate).toLocaleDateString('vi-VN')
            : '',
        ]),
      ];
      const wsResidents = XLSX.utils.aoa_to_sheet(residentsData);
      XLSX.utils.book_append_sheet(wb, wsResidents, 'Danh sach cu dan');

      // Sheet 5: Dịch vụ
      const servicesData = [
        ['Tên dịch vụ', 'Tháng', 'Tổng tiền', 'Trạng thái', 'Ngày tạo'],
        ...rawData.services.map((s: any) => [
          s.name || '',
          s.month || '',
          s.totalAmount || 0,
          s.status || '',
          s.createdAt
            ? new Date(s.createdAt).toLocaleDateString('vi-VN')
            : '',
        ]),
      ];
      const wsServices = XLSX.utils.aoa_to_sheet(servicesData);
      XLSX.utils.book_append_sheet(wb, wsServices, 'Dich vu');

      // Sheet 6: Khiếu nại
      const complainsData = [
        ['Tiêu đề', 'Cư dân', 'Trạng thái', 'Ngày tạo', 'Phản hồi'],
        ...rawData.complains.map((c: any) => [
          c.title || '',
          c.resident?.fullName || c.residentId || '',
          c.status || '',
          c.createdAt
            ? new Date(c.createdAt).toLocaleDateString('vi-VN')
            : '',
          c.responseText || 'Chưa phản hồi',
        ]),
      ];
      const wsComplains = XLSX.utils.aoa_to_sheet(complainsData);
      XLSX.utils.book_append_sheet(wb, wsComplains, 'Khieu nai');

      // Xuất file
      const fileName = `bao-cao-thong-ke-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      console.error('Xuất báo cáo thất bại', err);
      alert('Không thể xuất báo cáo. Vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Thống kê báo cáo</h2>
          <p className="text-gray-600 mt-1">Số liệu được lấy trực tiếp từ cơ sở dữ liệu</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
          title="Xuất báo cáo Excel"
        >
          <Download className="w-4 h-4" />
          <span></span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <p className="text-blue-100 text-sm">Tổng số căn hộ</p>
          <p className="text-3xl mt-2">{stats.totalApartments}</p>
          <p className="text-blue-100 text-sm mt-2">Cập nhật từ hệ thống</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <p className="text-green-100 text-sm">Tỷ lệ thanh toán</p>
          <p className="text-3xl mt-2">{stats.paymentRate}%</p>
          <p className="text-green-100 text-sm mt-2">Trong tháng hiện tại</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <p className="text-purple-100 text-sm">Doanh thu tháng</p>
          <p className="text-3xl mt-2">{formatCurrency(stats.monthlyRevenue)}</p>
          <p className="text-purple-100 text-sm mt-2">Tổng tiền đã ghi nhận</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <p className="text-orange-100 text-sm">Yêu cầu/khiếu nại</p>
          <p className="text-3xl mt-2">{stats.serviceRequests}</p>
          <p className="text-orange-100 text-sm mt-2">Trong tháng này</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Thống kê dân số</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng cư dân</span>
              <span className="text-gray-900">{stats.totalResidents} người</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trẻ em</span>
              <span className="text-gray-900">{stats.children} người</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Người lớn</span>
              <span className="text-gray-900">{stats.adults} người</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trung bình/hộ</span>
              <span className="text-gray-900">{stats.averagePerHousehold} người</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Dịch vụ phổ biến</h3>
          {stats.popularServices.length === 0 ? (
            <div className="text-gray-500 text-sm">Chưa có dữ liệu dịch vụ</div>
          ) : (
            <div className="space-y-3">
              {stats.popularServices.map((service) => (
                <div key={service.name} className="flex justify-between items-center">
                  <span className="text-gray-600">{service.name}</span>
                  <span className="text-gray-900">{service.count} lượt</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

