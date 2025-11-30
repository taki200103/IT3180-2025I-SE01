import { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Receipt,
  CreditCard,
  PieChart
} from 'lucide-react';

type View = 'overview' | 'revenue' | 'expenses' | 'invoices' | 'payments' | 'reports';

export default function AccountantDashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');

  const menuItems = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Tổng quan',
      onClick: () => setCurrentView('overview'),
      active: currentView === 'overview',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Quản lý doanh thu',
      onClick: () => setCurrentView('revenue'),
      active: currentView === 'revenue',
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      label: 'Quản lý chi phí',
      onClick: () => setCurrentView('expenses'),
      active: currentView === 'expenses',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Hóa đơn',
      onClick: () => setCurrentView('invoices'),
      active: currentView === 'invoices',
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Thanh toán',
      onClick: () => setCurrentView('payments'),
      active: currentView === 'payments',
    },
    {
      icon: <PieChart className="w-5 h-5" />,
      label: 'Báo cáo tài chính',
      onClick: () => setCurrentView('reports'),
      active: currentView === 'reports',
    },
  ];

  return (
    <DashboardLayout title="Dashboard Kế Toán" menuItems={menuItems}>
      {currentView === 'overview' && <OverviewView />}
      {currentView === 'revenue' && <RevenueView />}
      {currentView === 'expenses' && <ExpensesView />}
      {currentView === 'invoices' && <InvoicesView />}
      {currentView === 'payments' && <PaymentsView />}
      {currentView === 'reports' && <ReportsView />}
    </DashboardLayout>
  );
}

function OverviewView() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <p className="text-green-100 text-sm">Doanh thu tháng</p>
          <p className="text-3xl mt-2">2.4 tỷ</p>
          <p className="text-green-100 text-sm mt-2">+8% so tháng trước</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow p-6 text-white">
          <p className="text-red-100 text-sm">Chi phí tháng</p>
          <p className="text-3xl mt-2">1.2 tỷ</p>
          <p className="text-red-100 text-sm mt-2">+3% so tháng trước</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <p className="text-blue-100 text-sm">Lợi nhuận</p>
          <p className="text-3xl mt-2">1.2 tỷ</p>
          <p className="text-blue-100 text-sm mt-2">Tháng 11/2025</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <p className="text-purple-100 text-sm">Tỷ lệ thu</p>
          <p className="text-3xl mt-2">87%</p>
          <p className="text-purple-100 text-sm mt-2">213/245 căn hộ</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Doanh thu theo tháng (2025)</h3>
          <div className="space-y-3">
            {[
              { month: 'Tháng 11', amount: 2400000000, percent: 100 },
              { month: 'Tháng 10', amount: 2220000000, percent: 92 },
              { month: 'Tháng 9', amount: 2350000000, percent: 98 },
              { month: 'Tháng 8', amount: 2100000000, percent: 87 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.month}</span>
                  <span className="text-gray-900">{(item.amount / 1000000000).toFixed(1)} tỷ</span>
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
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Cơ cấu chi phí</h3>
          <div className="space-y-3">
            {[
              { category: 'Nhân sự', amount: 450000000, color: 'bg-blue-600' },
              { category: 'Bảo trì, sửa chữa', amount: 320000000, color: 'bg-green-600' },
              { category: 'Điện nước', amount: 280000000, color: 'bg-yellow-600' },
              { category: 'Vệ sinh', amount: 150000000, color: 'bg-purple-600' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-gray-600 text-sm">{item.category}</span>
                </div>
                <span className="text-gray-900">{(item.amount / 1000000).toFixed(0)} triệu</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Công việc cần xử lý</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">12 hóa đơn chưa thanh toán</p>
            <p className="text-sm text-yellow-600 mt-1">Tổng: 16.3 triệu</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">5 phiếu chi chờ duyệt</p>
            <p className="text-sm text-blue-600 mt-1">Tổng: 8.5 triệu</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-800">Báo cáo tháng cần hoàn thành</p>
            <p className="text-sm text-purple-600 mt-1">Hạn: 05/12/2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueView() {
  const revenues = [
    { apartment: 'A101', month: 'Tháng 11', amount: 2500000, status: 'Đã thu', date: '05/11/2025' },
    { apartment: 'A102', month: 'Tháng 11', amount: 2500000, status: 'Chưa thu', date: '-' },
    { apartment: 'B201', month: 'Tháng 11', amount: 3200000, status: 'Đã thu', date: '10/11/2025' },
    { apartment: 'B202', month: 'Tháng 11', amount: 3200000, status: 'Quá hạn', date: '-' },
    { apartment: 'C301', month: 'Tháng 11', amount: 2800000, status: 'Đã thu', date: '08/11/2025' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý doanh thu</h2>
        <p className="text-gray-600 mt-1">Theo dõi thu nhập từ phí quản lý và dịch vụ</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng phải thu</p>
          <p className="text-gray-900 text-2xl mt-2">124.5 triệu</p>
          <p className="text-gray-600 text-sm mt-1">Tháng 11/2025</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Đã thu</p>
          <p className="text-green-600 text-2xl mt-2">108.2 triệu</p>
          <p className="text-green-600 text-sm mt-1">87% tổng số</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Chưa thu</p>
          <p className="text-red-600 text-2xl mt-2">16.3 triệu</p>
          <p className="text-red-600 text-sm mt-1">32 căn hộ</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Căn hộ</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Kỳ</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ngày thu</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenues.map((revenue, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.apartment}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{revenue.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {revenue.amount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{revenue.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      revenue.status === 'Đã thu' 
                        ? 'bg-green-100 text-green-800' 
                        : revenue.status === 'Quá hạn'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {revenue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExpensesView() {
  const expenses = [
    { id: 1, category: 'Nhân sự', description: 'Lương tháng 11', amount: 45000000, date: '01/11/2025', status: 'Đã chi' },
    { id: 2, category: 'Bảo trì', description: 'Sửa chữa thang máy', amount: 8500000, date: '15/11/2025', status: 'Đã chi' },
    { id: 3, category: 'Điện', description: 'Tiền điện khu vực chung', amount: 12000000, date: '10/11/2025', status: 'Đã chi' },
    { id: 4, category: 'Vệ sinh', description: 'Dịch vụ vệ sinh', amount: 6000000, date: '05/11/2025', status: 'Đã chi' },
    { id: 5, category: 'Khác', description: 'Văn phòng phẩm', amount: 1200000, date: '20/11/2025', status: 'Chờ duyệt' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý chi phí</h2>
          <p className="text-gray-600 mt-1">Theo dõi các khoản chi</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Tạo phiếu chi
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng chi tháng này</p>
          <p className="text-red-600 text-2xl mt-2">72.7 triệu</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Nhân sự</p>
          <p className="text-gray-900 text-2xl mt-2">45 triệu</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Bảo trì</p>
          <p className="text-gray-900 text-2xl mt-2">8.5 triệu</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Khác</p>
          <p className="text-gray-900 text-2xl mt-2">19.2 triệu</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.amount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      expense.status === 'Đã chi' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InvoicesView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý hóa đơn</h2>
        <p className="text-gray-600 mt-1">Theo dõi và quản lý hóa đơn</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Chức năng đang được phát triển...</p>
      </div>
    </div>
  );
}

function PaymentsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý thanh toán</h2>
        <p className="text-gray-600 mt-1">Theo dõi các giao dịch thanh toán</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Chức năng đang được phát triển...</p>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Báo cáo tài chính</h2>
        <p className="text-gray-600 mt-1">Xem và xuất báo cáo tài chính</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Chức năng đang được phát triển...</p>
      </div>
    </div>
  );
}
