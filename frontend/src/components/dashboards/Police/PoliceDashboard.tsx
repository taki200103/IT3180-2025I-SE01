import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Shield, 
  Camera, 
  UserCheck, 
  AlertTriangle
} from 'lucide-react';
import OverviewView from '../Guard/OverviewView';
import IncidentsView from '../Guard/IncidentsView';
import MonitoringView from '../Guard/MonitoringView';
import ResidentsStatusView from './ResidentsStatusView';
import type { View } from '../Guard/types';

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
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Sự cố',
      onClick: () => setCurrentView('incidents'),
      active: currentView === 'incidents',
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      label: 'Cư dân',
      onClick: () => setCurrentView('residents'),
      active: currentView === 'residents',
    },
    {
      icon: <Camera className="w-5 h-5" />,
      label: 'Giám sát',
      onClick: () => setCurrentView('monitoring'),
      active: currentView === 'monitoring',
    },
  ];

  return (
    <DashboardLayout title="Dashboard Công an" menuItems={menuItems}>
      {currentView === 'overview' && <OverviewView />}
      {currentView === 'incidents' && <IncidentsView />}
      {currentView === 'residents' && <ResidentsStatusView />}
      {currentView === 'monitoring' && <MonitoringView />}
    </DashboardLayout>
  );
}

