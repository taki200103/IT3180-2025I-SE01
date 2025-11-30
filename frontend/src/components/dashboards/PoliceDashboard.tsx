import { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import { 
  Shield, 
  Camera, 
  UserCheck, 
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';

type View = 'overview' | 'access' | 'monitoring' | 'incidents' | 'shifts' | 'reports';

export default function PoliceDashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');

  const menuItems = [
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Tổng quan',
      onClick: () => setCurrentView('overview'),
      active: currentView === 'overview',
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      label: 'Quản lý ra vào',
      onClick: () => setCurrentView('access'),
      active: currentView === 'access',
    },
    {
      icon: <Camera className="w-5 h-5" />,
      label: 'Giám sát',
      onClick: () => setCurrentView('monitoring'),
      active: currentView === 'monitoring',
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Sự cố',
      onClick: () => setCurrentView('incidents'),
      active: currentView === 'incidents',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Lịch trực',
      onClick: () => setCurrentView('shifts'),
      active: currentView === 'shifts',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Báo cáo',
      onClick: () => setCurrentView('reports'),
      active: currentView === 'reports',
    },
  ];

  return (
    <DashboardLayout title="Dashboard Bảo Vệ" menuItems={menuItems}>
      {currentView === 'overview' && <OverviewView />}
      {currentView === 'access' && <AccessView />}
      {currentView === 'monitoring' && <MonitoringView />}
      {currentView === 'incidents' && <IncidentsView />}
      {currentView === 'shifts' && <ShiftsView />}
      {currentView === 'reports' && <ReportsView />}
    </DashboardLayout>
  );
}

function OverviewView() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Người ra/vào hôm nay</p>
              <p className="text-gray-900 text-2xl mt-2">156</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Khách đăng ký</p>
              <p className="text-gray-900 text-2xl mt-2">12</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sự cố</p>
              <p className="text-gray-900 text-2xl mt-2">3</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Camera hoạt động</p>
              <p className="text-gray-900 text-2xl mt-2">24/24</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            {[
              { time: '14:30', action: 'Khách vào thăm - Căn A301', type: 'in' },
              { time: '13:45', action: 'Xe giao hàng - Căn B205', type: 'delivery' },
              { time: '12:20', action: 'Cư dân ra ngoài - Căn C102', type: 'out' },
              { time: '11:15', action: 'Thợ sửa chữa - Căn A401', type: 'service' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">{activity.action}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Lịch trực hôm nay</h3>
          <div className="space-y-3">
            {[
              { shift: 'Ca sáng', time: '06:00 - 14:00', guard: 'Nguyễn Văn A', status: 'Hoàn thành' },
              { shift: 'Ca chiều', time: '14:00 - 22:00', guard: 'Trần Văn B', status: 'Đang trực' },
              { shift: 'Ca đêm', time: '22:00 - 06:00', guard: 'Lê Văn C', status: 'Sắp tới' },
            ].map((shift, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900">{shift.shift}</p>
                  <p className="text-gray-600 text-sm">{shift.time}</p>
                  <p className="text-gray-500 text-xs mt-1">{shift.guard}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  shift.status === 'Đang trực' 
                    ? 'bg-green-100 text-green-800' 
                    : shift.status === 'Hoàn thành'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {shift.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessView() {
  const accessLogs = [
    { id: 1, name: 'Nguyễn Văn A', apartment: 'A301', type: 'Cư dân', time: '14:30', direction: 'Vào', vehicle: 'Xe máy' },
    { id: 2, name: 'Khách của B205', apartment: 'B205', type: 'Khách', time: '13:45', direction: 'Vào', vehicle: 'Đi bộ' },
    { id: 3, name: 'Trần Thị B', apartment: 'C102', type: 'Cư dân', time: '12:20', direction: 'Ra', vehicle: 'Ô tô' },
    { id: 4, name: 'Thợ điện', apartment: 'A401', type: 'Dịch vụ', time: '11:15', direction: 'Vào', vehicle: 'Xe máy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý ra vào</h2>
          <p className="text-gray-600 mt-1">Theo dõi người và phương tiện ra vào</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Đăng ký khách
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Căn hộ</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Chiều</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Phương tiện</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.apartment}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      log.type === 'Cư dân' 
                        ? 'bg-blue-100 text-blue-800' 
                        : log.type === 'Khách'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      log.direction === 'Vào' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {log.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.vehicle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MonitoringView() {
  const cameras = [
    { id: 1, location: 'Cổng chính', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 2, location: 'Bãi xe tầng 1', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 3, location: 'Thang máy A', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 4, location: 'Thang máy B', status: 'Bảo trì', lastCheck: '2 giờ trước' },
    { id: 5, location: 'Hành lang tầng 5', status: 'Hoạt động', lastCheck: '5 phút trước' },
    { id: 6, location: 'Sảnh chính', status: 'Hoạt động', lastCheck: '5 phút trước' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Hệ thống giám sát</h2>
        <p className="text-gray-600 mt-1">Quản lý camera an ninh</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <div key={camera.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gray-200 w-full h-40 rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-gray-900">{camera.location}</h3>
            <div className="flex items-center justify-between mt-3">
              <span className={`px-2 py-1 text-xs rounded-full ${
                camera.status === 'Hoạt động' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {camera.status}
              </span>
              <span className="text-xs text-gray-500">{camera.lastCheck}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IncidentsView() {
  const incidents = [
    { id: 1, title: 'Xe lạ đậu sai vị trí', location: 'Bãi xe B1', time: '10:30 - 28/11/2025', priority: 'Thấp', status: 'Đã xử lý' },
    { id: 2, title: 'Mất điện khu vực A', location: 'Tòa A', time: '08:15 - 28/11/2025', priority: 'Cao', status: 'Đang xử lý' },
    { id: 3, title: 'Tiếng ồn tầng 5', location: 'Tòa B, Tầng 5', time: '23:00 - 27/11/2025', priority: 'Trung bình', status: 'Đã xử lý' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý sự cố</h2>
          <p className="text-gray-600 mt-1">Ghi nhận và xử lý các sự cố</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Báo cáo sự cố
        </button>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    incident.priority === 'Cao' ? 'text-red-600' :
                    incident.priority === 'Trung bình' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                  <div>
                    <h3 className="text-gray-900">{incident.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">📍 {incident.location}</p>
                    <p className="text-gray-500 text-sm mt-1">🕐 {incident.time}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  incident.priority === 'Cao' ? 'bg-red-100 text-red-800' :
                  incident.priority === 'Trung bình' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {incident.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  incident.status === 'Đã xử lý' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {incident.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShiftsView() {
  const schedule = [
    { day: 'Thứ 2', date: '28/11', morning: 'Nguyễn Văn A', afternoon: 'Trần Văn B', night: 'Lê Văn C' },
    { day: 'Thứ 3', date: '29/11', morning: 'Trần Văn B', afternoon: 'Lê Văn C', night: 'Nguyễn Văn A' },
    { day: 'Thứ 4', date: '30/11', morning: 'Lê Văn C', afternoon: 'Nguyễn Văn A', night: 'Trần Văn B' },
    { day: 'Thứ 5', date: '01/12', morning: 'Nguyễn Văn A', afternoon: 'Trần Văn B', night: 'Lê Văn C' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Lịch trực</h2>
        <p className="text-gray-600 mt-1">Phân công và theo dõi ca trực</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ca sáng (6h-14h)</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ca chiều (14h-22h)</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ca đêm (22h-6h)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.day}</div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.morning}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.afternoon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.night}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Báo cáo</h2>
        <p className="text-gray-600 mt-1">Thống kê và báo cáo hoạt động bảo vệ</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Người ra/vào hôm nay</p>
          <p className="text-gray-900 text-2xl mt-2">156</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Khách đăng ký</p>
          <p className="text-gray-900 text-2xl mt-2">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Sự cố tháng này</p>
          <p className="text-gray-900 text-2xl mt-2">18</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Trung bình/ngày</p>
          <p className="text-gray-900 text-2xl mt-2">142</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Báo cáo chi tiết</h3>
        <div className="space-y-3">
          {[
            { name: 'Báo cáo tuần (21/11 - 27/11)', date: '27/11/2025', type: 'PDF' },
            { name: 'Báo cáo tháng 10/2025', date: '31/10/2025', type: 'PDF' },
            { name: 'Báo cáo tháng 9/2025', date: '30/09/2025', type: 'PDF' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-gray-900">{report.name}</p>
                  <p className="text-gray-500 text-sm">{report.date}</p>
                </div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm">
                Tải xuống
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
