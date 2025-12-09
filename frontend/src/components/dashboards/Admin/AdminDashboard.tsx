import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import {
  LayoutDashboard,
  Users,
  Bell,
  BarChart3,
  Wrench,
  Receipt,
  Shield,
} from 'lucide-react';
import OverviewView from './OverviewView';
import ResidentsView from './ResidentsView';
import NotificationsView from './NotificationsView';
import StatisticsView from './StatisticsView';
import ServicesView from './ServicesView';
import ExpensesApprovalView from './ExpensesApprovalView';
import ShiftsView from './ShiftsView';
import type { View } from './types';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Tổng quan',
      onClick: () => setCurrentView('overview'),
      active: currentView === 'overview',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Quản lý cư dân',
      onClick: () => setCurrentView('residents'),
      active: currentView === 'residents',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Quản lý thông báo',
      onClick: () => setCurrentView('notifications'),
      active: currentView === 'notifications',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Thống kê',
      onClick: () => setCurrentView('statistics'),
      active: currentView === 'statistics',
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      label: 'Quản lý dịch vụ',
      onClick: () => setCurrentView('services'),
      active: currentView === 'services',
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      label: 'Duyệt chi phí',
      onClick: () => setCurrentView('expenses'),
      active: currentView === 'expenses',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Lịch trực bảo vệ',
      onClick: () => setCurrentView('shifts'),
      active: currentView === 'shifts',
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard Quản Trị"
      menuItems={menuItems}
      children={
        <>
          {currentView === 'overview' && <OverviewView />}
          {currentView === 'residents' && <ResidentsView />}
          {currentView === 'notifications' && <NotificationsView />}
          {currentView === 'statistics' && <StatisticsView />}
          {currentView === 'services' && <ServicesView />}
          {currentView === 'expenses' && <ExpensesApprovalView />}
          {currentView === 'shifts' && <ShiftsView />}
        </>
      }
    />
  );
}
