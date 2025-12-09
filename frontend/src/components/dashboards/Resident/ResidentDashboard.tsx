import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Home, 
  Users, 
  DollarSign, 
  Bell,
  Wrench,
  FileText
} from 'lucide-react';
import OverviewView from './OverviewView';
import FamilyView from './FamilyView';
import FeesView from './FeesView';
import NotificationsView from './NotificationsView';
import ComplainView from './ComplainView';
import DocumentsView from './DocumentsView';

type View = 'overview' | 'family' | 'fees' | 'notifications' | 'services' | 'documents';

export default function ResidentDashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Tổng quan',
      onClick: () => setCurrentView('overview'),
      active: currentView === 'overview',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Quản lý gia đình',
      onClick: () => setCurrentView('family'),
      active: currentView === 'family',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Quản lý chi phí',
      onClick: () => setCurrentView('fees'),
      active: currentView === 'fees',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Thông báo',
      onClick: () => setCurrentView('notifications'),
      active: currentView === 'notifications',
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      label: 'Yêu cầu dịch vụ',
      onClick: () => setCurrentView('services'),
      active: currentView === 'services',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Tài liệu',
      onClick: () => setCurrentView('documents'),
      active: currentView === 'documents',
    },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'family':
        return <FamilyView />;
      case 'fees':
        return <FeesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'services':
        return <ComplainView />;
      case 'documents':
        return <DocumentsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <DashboardLayout title="Dashboard Cư Dân" menuItems={menuItems}>
      {renderView()}
    </DashboardLayout>
  );
}
