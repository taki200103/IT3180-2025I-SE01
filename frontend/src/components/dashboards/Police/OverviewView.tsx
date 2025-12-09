import React, { useState, useEffect, useMemo } from 'react';
import { UserCheck, AlertTriangle, Camera, Clock, Loader2 } from 'lucide-react';
import { ShiftsService, type ShiftResponseDto } from '../../../api/services/ShiftsService';
import { ComplainsService } from '../../../api/services/ComplainsService';

const STORAGE_KEY_VISITORS = 'police_visitors';
const STORAGE_KEY_ACCESS_LOGS = 'police_access_logs';

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

export default function OverviewView() {
  const [shifts, setShifts] = useState<ShiftResponseDto[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Load shifts for today
        const shiftsData = await ShiftsService.shiftControllerFindAll(todayStr, todayStr);
        setShifts(Array.isArray(shiftsData) ? shiftsData : []);

        // Load incidents
        const incidentsData = await ComplainsService.complainControllerFindAll();
        setIncidents(Array.isArray(incidentsData) ? incidentsData : incidentsData?.data || []);

        // Load from localStorage
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
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayLogs = accessLogs.filter(log => log.time.split('T')[0] === todayStr);
  const todayVisitors = visitors.filter(v => v.registeredAt.split('T')[0] === todayStr);
  const pendingIncidents = incidents.filter(inc => inc.status === 'pending');

  // Xác định trạng thái ca trực
  const getShiftStatus = (shiftType: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (shiftType === 'morning') {
      if (currentHour >= 6 && currentHour < 14) return 'Đang trực';
      if (currentHour >= 14) return 'Hoàn thành';
      return 'Sắp tới';
    } else if (shiftType === 'afternoon') {
      if (currentHour >= 14 && currentHour < 22) return 'Đang trực';
      if (currentHour >= 22 || currentHour < 6) return 'Hoàn thành';
      return 'Sắp tới';
    } else { // night
      if (currentHour >= 22 || currentHour < 6) return 'Đang trực';
      if (currentHour >= 6 && currentHour < 14) return 'Hoàn thành';
      return 'Sắp tới';
    }
  };

  const getShiftTime = (shiftType: string) => {
    switch (shiftType) {
      case 'morning':
        return '06:00 - 14:00';
      case 'afternoon':
        return '14:00 - 22:00';
      case 'night':
        return '22:00 - 06:00';
      default:
        return '';
    }
  };

  const getShiftLabel = (shiftType: string) => {
    switch (shiftType) {
      case 'morning':
        return 'Ca sáng';
      case 'afternoon':
        return 'Ca chiều';
      case 'night':
        return 'Ca đêm';
      default:
        return shiftType;
    }
  };

  // Tạo danh sách ca trực hôm nay
  const todayShifts = useMemo(() => {
    const shiftsMap = new Map<string, ShiftResponseDto>();
    shifts.forEach(shift => {
      if (shift.date.split('T')[0] === todayStr) {
        shiftsMap.set(shift.shiftType, shift);
      }
    });

    const allShifts = [
      { type: 'morning', shift: shiftsMap.get('morning') },
      { type: 'afternoon', shift: shiftsMap.get('afternoon') },
      { type: 'night', shift: shiftsMap.get('night') },
    ];

    return allShifts.map(({ type, shift }) => ({
      type,
      shift,
      status: shift ? getShiftStatus(type) : 'Chưa phân công',
      time: getShiftTime(type),
      label: getShiftLabel(type),
      guard: shift?.police?.fullName || 'Chưa phân công',
    }));
  }, [shifts, todayStr]);

  // Lấy hoạt động gần đây (5 hoạt động mới nhất)
  const recentActivities = useMemo(() => {
    const allActivities = [
      ...accessLogs.map(log => ({
        time: new Date(log.time),
        action: `${log.direction === 'Vào' ? 'Vào' : 'Ra'} - ${log.name} - ${log.apartment}`,
        type: log.type === 'Khách' ? 'in' : log.type === 'Dịch vụ' ? 'service' : 'out',
      })),
    ].sort((a, b) => b.time.getTime() - a.time.getTime());

    return allActivities.slice(0, 5);
  }, [accessLogs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Người ra/vào hôm nay</p>
              <p className="text-gray-900 text-2xl mt-2">{todayLogs.length}</p>
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
              <p className="text-gray-900 text-2xl mt-2">{todayVisitors.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sự cố chờ xử lý</p>
              <p className="text-gray-900 text-2xl mt-2">{pendingIncidents.length}</p>
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
              <p className="text-gray-900 text-2xl mt-2">6/6</p>
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
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">Chưa có hoạt động nào</div>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-indigo-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{activity.action}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {activity.time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-4">Lịch trực hôm nay</h3>
          <div className="space-y-3">
            {todayShifts.map((shift, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900">{shift.label}</p>
                  <p className="text-gray-600 text-sm">{shift.time}</p>
                  <p className="text-gray-500 text-xs mt-1">{shift.guard}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  shift.status === 'Đang trực' 
                    ? 'bg-green-100 text-green-800' 
                    : shift.status === 'Hoàn thành'
                    ? 'bg-gray-100 text-gray-800'
                    : shift.status === 'Chưa phân công'
                    ? 'bg-red-100 text-red-800'
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

