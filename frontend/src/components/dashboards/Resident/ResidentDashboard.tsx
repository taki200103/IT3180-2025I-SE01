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
import ServicesView from './ServicesView';
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

  return (
    <DashboardLayout title="Dashboard Cư Dân" menuItems={menuItems}>
      {currentView === 'overview' && <OverviewView />}
      {currentView === 'family' && <FamilyView />}
      {currentView === 'fees' && <FeesView />}
      {currentView === 'notifications' && <NotificationsView />}
      {currentView === 'services' && <ServicesView />}
      {currentView === 'documents' && <DocumentsView />}
    </DashboardLayout>
  );
}
