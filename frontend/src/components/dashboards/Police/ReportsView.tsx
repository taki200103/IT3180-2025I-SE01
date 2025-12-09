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
  const [downloadingDate, setDownloadingDate] = useState<string | null>(null);

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
    }
    
    if (savedLogs) {
      try {
        setAccessLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse access logs', e);
      }
    }

    // Load incidents from API
    const loadIncidents = async () => {
      try {
        const data = await ComplainsService.complainControllerFindAll();
        setIncidents(Array.isArray(data) ? data : data?.data || []);
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
    
    // Sắp xếp theo thứ tự mới nhất trước
    return Array.from(dateSet).sort().reverse();
  }, [accessLogs, visitors]);

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

  const handleExportExcel = async (dateStr: string) => {
    try {
      setDownloadingDate(dateStr);
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();

      const reportDate = new Date(dateStr);
      const reportDateFormatted = reportDate.toLocaleDateString('vi-VN');
      const now = new Date();
      const exportTime = now.toLocaleTimeString('vi-VN');

      // Lọc dữ liệu theo ngày
      const dayLogs = accessLogs.filter(log => log.time.split('T')[0] === dateStr);
      const dayVisitors = visitors.filter(v => v.registeredAt.split('T')[0] === dateStr);
      const dayIncidents = incidents.filter(inc => {
        const incDate = new Date(inc.createdAt);
        return incDate.toISOString().split('T')[0] === dateStr;
      });

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
        ['Sự cố', dayIncidents.length],
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

      // Sheet 4: Sự cố
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
      XLSX.utils.book_append_sheet(wb, wsIncidents, 'Su co');

      // Xuất file
      const fileName = `bao-cao-bao-ve-${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      console.error('Xuất báo cáo thất bại', err);
      alert('Không thể xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setDownloadingDate(null);
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
              const isToday = dateStr === todayStr;
              const isDownloading = downloadingDate === dateStr;

              return (
                <div key={dateStr} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-gray-900">
                        {dateFormatted}
                        {isToday && <span className="ml-2 text-xs text-blue-600">(Hôm nay)</span>}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {dayLogs.length} lượt ra/vào • {dayVisitors.length} khách đăng ký
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleExportExcel(dateStr)}
                    disabled={isDownloading}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Đang xuất...' : 'Tải xuống'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

