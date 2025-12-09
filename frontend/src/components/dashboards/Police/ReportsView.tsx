import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download } from 'lucide-react';
import { ComplainsService } from '../../../api/services/ComplainsService';

const STORAGE_KEY_VISITORS = 'police_visitors';
const STORAGE_KEY_ACCESS_LOGS = 'police_access_logs';

type Visitor = {
  id: string;
  name: string;
  phone: string;
  apartmentId: string;
  apartmentName: string;
  purpose: string;
  vehicle: string;
  registeredAt: string;
};

type AccessLog = {
  id: string;
  name: string;
  apartment: string;
  type: 'Cư dân' | 'Khách' | 'Dịch vụ';
  time: string;
  direction: 'Vào' | 'Ra';
  vehicle: string;
  visitorId?: string;
};

export default function ReportsView() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [downloadingAccessDate, setDownloadingAccessDate] = useState<string | null>(null);
  const [downloadingIncidentDate, setDownloadingIncidentDate] = useState<string | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const savedVisitors = localStorage.getItem(STORAGE_KEY_VISITORS);
    const savedLogs = localStorage.getItem(STORAGE_KEY_ACCESS_LOGS);
    
    if (savedVisitors) {
      try {
        setVisitors(JSON.parse(savedVisitors));
      } catch (e) {
        console.error('Failed to parse visitors', e);
      }
    } else {
      // Fake visitors nếu chưa có
      const now = new Date();
      const mockVisitors: Visitor[] = Array.from({ length: 14 }).map((_, idx) => {
        const date = new Date(now);
        date.setHours(9 + (idx % 6), 10 + idx, 0, 0);
        return {
          id: `FAKE-VIS-${idx + 1}`,
          name: `Khách ${idx + 1}`,
          phone: `090${(100000 + idx).toString().slice(-6)}`,
          apartmentId: `A${(idx % 8) + 1}0${(idx % 5) + 1}`,
          apartmentName: `Căn hộ ${(idx % 8) + 1}0${(idx % 5) + 1}`,
          purpose: ['Thăm người thân', 'Giao hàng', 'Bảo trì', 'Làm việc'][idx % 4],
          vehicle: ['Xe máy', 'Ô tô', 'Đi bộ'][idx % 3],
          registeredAt: date.toISOString(),
        };
      });
      setVisitors(mockVisitors);
      localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(mockVisitors));
    }
    
    if (savedLogs) {
      try {
        setAccessLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse access logs', e);
      }
    } else {
      // Fake access logs nếu chưa có
      const now = new Date();
      const mockLogs: AccessLog[] = Array.from({ length: 24 }).map((_, idx) => {
        const date = new Date(now);
        date.setHours(6 + (idx % 12), (idx % 4) * 15, 0, 0);
        return {
          id: `FAKE-LOG-${idx + 1}`,
          name: idx % 3 === 0 ? `Khách ${idx + 1}` : `Cư dân ${idx + 1}`,
          apartment: `T${(idx % 5) + 1}0${(idx % 6) + 1}`,
          type: idx % 3 === 0 ? 'Khách' : 'Cư dân',
          time: date.toISOString(),
          direction: idx % 2 === 0 ? 'Vào' : 'Ra',
          vehicle: ['Xe máy', 'Ô tô', 'Đi bộ'][idx % 3],
          visitorId: idx % 3 === 0 ? `FAKE-VIS-${idx + 1}` : undefined,
        };
      });
      setAccessLogs(mockLogs);
      localStorage.setItem(STORAGE_KEY_ACCESS_LOGS, JSON.stringify(mockLogs));
    }

    // Load incidents from API
    const loadIncidents = async () => {
      try {
        const data = await ComplainsService.complainControllerFindAll();
        const incList = Array.isArray(data) ? data : data?.data || [];
        if (incList.length === 0) {
          const now = new Date();
          const mockIncidents = Array.from({ length: 10 }).map((_, idx) => {
            const date = new Date(now);
            date.setDate(now.getDate() - idx);
            return {
              id: `FAKE-INC-${idx + 1}`,
              title: `Sự cố ${idx + 1}`,
              message: 'Mô tả sự cố giả lập để kiểm thử báo cáo.',
              status: idx % 3 === 0 ? 'pending' : 'resolved',
              createdAt: date.toISOString(),
              responseText: idx % 3 === 0 ? '' : 'Đã khắc phục',
            };
          });
          setIncidents(mockIncidents);
        } else {
          setIncidents(incList);
        }
      } catch (err) {
        console.error('Failed to load incidents', err);
      }
    };
    loadIncidents();
  }, []);

  // Lấy danh sách các ngày có dữ liệu
  const reportDates = useMemo(() => {
    const dateSet = new Set<string>();
    
    // Lấy từ accessLogs
    accessLogs.forEach(log => {
      const date = log.time.split('T')[0];
      dateSet.add(date);
    });
    
    // Lấy từ visitors
    visitors.forEach(v => {
      const date = v.registeredAt.split('T')[0];
      dateSet.add(date);
    });

    // Lấy từ incidents
    incidents.forEach((inc: any) => {
      if (!inc?.createdAt) return;
      const date = new Date(inc.createdAt).toISOString().split('T')[0];
      dateSet.add(date);
    });
    
    // Sắp xếp theo thứ tự mới nhất trước
    return Array.from(dateSet).sort().reverse();
  }, [accessLogs, visitors, incidents]);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayLogs = accessLogs.filter(log => log.time.split('T')[0] === todayStr);
  const todayVisitors = visitors.filter(v => v.registeredAt.split('T')[0] === todayStr);
  const thisMonthIncidents = incidents.filter(inc => {
    const incDate = new Date(inc.createdAt);
    return incDate.getMonth() === today.getMonth() && incDate.getFullYear() === today.getFullYear();
  });
  const avgPerDay = accessLogs.length > 0 
    ? Math.round(accessLogs.length / Math.max(1, Math.ceil((today.getTime() - new Date(accessLogs[0]?.time || today).getTime()) / (1000 * 60 * 60 * 24))))
    : 0;

  const handleExportAccessExcel = async (dateStr: string) => {
    try {
      setDownloadingAccessDate(dateStr);
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();

      const reportDate = new Date(dateStr);
      const reportDateFormatted = reportDate.toLocaleDateString('vi-VN');
      const now = new Date();
      const exportTime = now.toLocaleTimeString('vi-VN');

      // Lọc dữ liệu theo ngày
      const dayLogs = accessLogs.filter(log => log.time.split('T')[0] === dateStr);
      const dayVisitors = visitors.filter(v => v.registeredAt.split('T')[0] === dateStr);

      // Sheet 1: Tổng quan
      const summaryData = [
        ['BÁO CÁO HOẠT ĐỘNG BẢO VỆ'],
        ['Ngày báo cáo', reportDateFormatted],
        ['Ngày xuất báo cáo', now.toLocaleDateString('vi-VN')],
        ['Giờ xuất báo cáo', exportTime],
        [],
        ['THỐNG KÊ NGÀY'],
        ['Người ra/vào', dayLogs.length],
        ['Khách đăng ký', dayVisitors.length],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Tong quan');

      // Sheet 2: Lịch sử ra/vào
      const accessLogsData = [
        ['Thời gian', 'Tên', 'Căn hộ', 'Loại', 'Hướng', 'Phương tiện'],
        ...dayLogs.map((log) => [
          new Date(log.time).toLocaleString('vi-VN'),
          log.name,
          log.apartment,
          log.type,
          log.direction,
          log.vehicle || '—',
        ]),
      ];
      const wsAccessLogs = XLSX.utils.aoa_to_sheet(accessLogsData);
      XLSX.utils.book_append_sheet(wb, wsAccessLogs, 'Lich su ra vao');

      // Sheet 3: Danh sách khách đăng ký
      const visitorsData = [
        ['Tên', 'Số điện thoại', 'Căn hộ', 'Mục đích', 'Phương tiện', 'Thời gian đăng ký'],
        ...dayVisitors.map((v) => [
          v.name,
          v.phone,
          v.apartmentName,
          v.purpose,
          v.vehicle || '—',
          new Date(v.registeredAt).toLocaleString('vi-VN'),
        ]),
      ];
      const wsVisitors = XLSX.utils.aoa_to_sheet(visitorsData);
      XLSX.utils.book_append_sheet(wb, wsVisitors, 'Danh sach khach');

      // Xuất file
      const fileName = `bao-cao-ra-vao-${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      console.error('Xuất báo cáo thất bại', err);
      alert('Không thể xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setDownloadingAccessDate(null);
    }
  };

  const handleExportIncidentExcel = async (dateStr: string) => {
    try {
      setDownloadingIncidentDate(dateStr);
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();

      const reportDate = new Date(dateStr);
      const reportDateFormatted = reportDate.toLocaleDateString('vi-VN');
      const now = new Date();
      const exportTime = now.toLocaleTimeString('vi-VN');

      // Lọc sự cố theo ngày và toàn bộ
      const dayIncidents = incidents.filter(inc => {
        const incDate = new Date(inc.createdAt);
        return incDate.toISOString().split('T')[0] === dateStr;
      });
      const allIncidents = incidents || [];
      const pendingAllIncidents = allIncidents.filter((inc) => (inc.status || '').toLowerCase() === 'pending');
      const pendingDayIncidents = dayIncidents.filter((inc) => (inc.status || '').toLowerCase() === 'pending');

      // Sheet 1: Tổng quan sự cố
      const summaryData = [
        ['BÁO CÁO SỰ CỐ'],
        ['Ngày báo cáo', reportDateFormatted],
        ['Ngày xuất báo cáo', now.toLocaleDateString('vi-VN')],
        ['Giờ xuất báo cáo', exportTime],
        [],
        ['THỐNG KÊ NGÀY'],
        ['Sự cố trong ngày', dayIncidents.length],
        ['Sự cố đang chờ (ngày)', pendingDayIncidents.length],
        [],
        ['THỐNG KÊ TỔNG'],
        ['Tổng sự cố', allIncidents.length],
        ['Sự cố đang chờ (tổng)', pendingAllIncidents.length],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Tong quan');

      // Sheet 2: Sự cố trong ngày
      const incidentsData = [
        ['Tiêu đề', 'Cư dân', 'Trạng thái', 'Ngày tạo', 'Phản hồi'],
        ...dayIncidents.map((inc) => [
          inc.title || '',
          inc.resident?.fullName || inc.residentId || '',
          inc.status || '',
          inc.createdAt ? new Date(inc.createdAt).toLocaleDateString('vi-VN') : '',
          inc.responseText || 'Chưa phản hồi',
        ]),
      ];
      const wsIncidents = XLSX.utils.aoa_to_sheet(incidentsData);
      XLSX.utils.book_append_sheet(wb, wsIncidents, 'Su co trong ngay');

      // Sheet 3: Sự cố (tất cả)
      const incidentsAllData = [
        ['Tiêu đề', 'Cư dân', 'Trạng thái', 'Ngày tạo', 'Phản hồi'],
        ...allIncidents.map((inc) => [
          inc.title || '',
          inc.resident?.fullName || inc.residentId || '',
          inc.status || '',
          inc.createdAt ? new Date(inc.createdAt).toLocaleDateString('vi-VN') : '',
          inc.responseText || 'Chưa phản hồi',
        ]),
      ];
      const wsIncidentsAll = XLSX.utils.aoa_to_sheet(incidentsAllData);
      XLSX.utils.book_append_sheet(wb, wsIncidentsAll, 'Su co (tat ca)');

      // Xuất file
      const fileName = `bao-cao-su-co-${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      console.error('Xuất báo cáo sự cố thất bại', err);
      alert('Không thể xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setDownloadingIncidentDate(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Báo cáo</h2>
        <p className="text-gray-600 mt-1">Thống kê và báo cáo hoạt động bảo vệ</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Người ra/vào hôm nay</p>
          <p className="text-gray-900 text-2xl mt-2">{todayLogs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Khách đăng ký</p>
          <p className="text-gray-900 text-2xl mt-2">{todayVisitors.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Sự cố tháng này</p>
          <p className="text-gray-900 text-2xl mt-2">{thisMonthIncidents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Trung bình/ngày</p>
          <p className="text-gray-900 text-2xl mt-2">{avgPerDay}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Báo cáo theo ngày</h3>
        {reportDates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có dữ liệu báo cáo
          </div>
        ) : (
          <div className="space-y-3">
            {reportDates.map((dateStr) => {
              const date = new Date(dateStr);
              const dateFormatted = date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              const dayLogs = accessLogs.filter(log => log.time.split('T')[0] === dateStr);
              const dayVisitors = visitors.filter(v => v.registeredAt.split('T')[0] === dateStr);
              const dayIncidents = incidents.filter(inc => {
                const incDate = new Date(inc.createdAt);
                return incDate.toISOString().split('T')[0] === dateStr;
              });
              const isToday = dateStr === todayStr;
              const isDownloadingAccess = downloadingAccessDate === dateStr;
              const isDownloadingIncident = downloadingIncidentDate === dateStr;

              return (
                <div key={dateStr} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-gray-900">
                          {dateFormatted}
                          {isToday && <span className="ml-2 text-xs text-blue-600">(Hôm nay)</span>}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {dayLogs.length} lượt ra/vào • {dayVisitors.length} khách đăng ký • {dayIncidents.length} sự cố
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <div className="p-3 bg-white rounded border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 text-sm font-medium">Báo cáo ra/vào</p>
                          <p className="text-gray-500 text-xs mt-1">Lượt ra/vào, khách đăng ký</p>
                        </div>
                        <button
                          onClick={() => handleExportAccessExcel(dateStr)}
                          disabled={isDownloadingAccess}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                          <span>{isDownloadingAccess ? 'Đang xuất...' : 'Tải xuống'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 text-sm font-medium">Báo cáo sự cố</p>
                          <p className="text-gray-500 text-xs mt-1">Sự cố trong ngày & tổng</p>
                        </div>
                        <button
                          onClick={() => handleExportIncidentExcel(dateStr)}
                          disabled={isDownloadingIncident}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                          <span>{isDownloadingIncident ? 'Đang xuất...' : 'Tải xuống'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

