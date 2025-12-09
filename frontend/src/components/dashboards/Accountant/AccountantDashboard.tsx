import { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Receipt,
  CreditCard,
  PieChart,
  AlertTriangle
} from 'lucide-react';
import OverviewView from './OverviewView';
import RevenueView from './RevenueView';
import ExpensesView from './ExpensesView';
import InvoicesView from './InvoicesView';
import PaymentsView from './PaymentsView';
import ReportsView from './ReportsView';
import IncidentsView from '../Guard/IncidentsView';
import type { View } from './types';

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
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Khiếu nại',
      onClick: () => setCurrentView('complains'),
      active: currentView === 'complains',
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
      {currentView === 'complains' && <IncidentsView targetRole="accountant" />}
    </DashboardLayout>
  );
}

