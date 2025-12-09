import { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Shield, 
  Camera, 
  UserCheck, 
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';
import OverviewView from './OverviewView';
import AccessView from './AccessView';
import MonitoringView from './MonitoringView';
import IncidentsView from './IncidentsView';
import ShiftsView from './ShiftsView';
import ReportsView from './ReportsView';
import type { View } from './types';

export default function GuardDashboard() {
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

