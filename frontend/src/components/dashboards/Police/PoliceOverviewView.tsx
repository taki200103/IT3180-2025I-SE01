import React, { useEffect, useState } from 'react';
import { UserCheck, Home, AlertTriangle, Camera, Loader2 } from 'lucide-react';
import { ResidentsService } from '../../../api/services/ResidentsService';
import { ComplainsService } from '../../../api/services/ComplainsService';
import { ApiError } from '../../../api';

type Resident = {
  id: string;
  temporaryStatus?: boolean; // true = tạm vắng, false/undefined = đang cư trú
};

export default function PoliceOverviewView() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const resData = await ResidentsService.residentControllerFindAll();
        const list = Array.isArray(resData) ? resData : resData?.data || [];
        setResidents(list);

        const incData = await ComplainsService.complainControllerFindAll();
        const incList = Array.isArray(incData) ? incData : incData?.data || [];
        setIncidents(incList);
      } catch (err) {
        console.error('Load police overview failed', err);
        if (err instanceof ApiError) {
          setError(err.body?.message || 'Không thể tải dữ liệu.');
        } else {
          setError('Không thể tải dữ liệu.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const tamVang = residents.filter((r) => !!r.temporaryStatus).length;
  const tamTru = residents.length - tamVang;
  const pendingIncidents = incidents.filter(
    (inc) => (inc.status || '').toLowerCase() === 'pending',
  ).length;

  const totalCameras = 6;
  const activeCameras = 5; // TODO: replace with real data when available

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Cư dân tạm trú</p>
              <p className="text-gray-900 text-2xl mt-2">{tamTru}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Cư dân tạm vắng</p>
              <p className="text-gray-900 text-2xl mt-2">{tamVang}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Home className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sự cố chờ xử lý</p>
              <p className="text-gray-900 text-2xl mt-2">{pendingIncidents}</p>
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
              <p className="text-gray-900 text-2xl mt-2">
                {activeCameras}/{totalCameras}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 text-base font-semibold mb-4">Thông tin cư dân</h3>
          <ul className="space-y-3">
            {(residents.slice(0, 6) as Resident[]).map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-gray-900">{(r as any).fullName || 'Cư dân'}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    r.temporaryStatus ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {r.temporaryStatus ? 'Tạm vắng' : 'Tạm trú'}
                </span>
              </li>
            ))}
            {residents.length === 0 && (
              <li className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu cư dân.</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 text-base font-semibold mb-4">Sự cố mới</h3>
          <ul className="space-y-3">
            {(incidents.slice(0, 6) as any[]).map((inc, idx) => (
              <li key={inc.id || idx} className="rounded-lg border border-gray-100 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-900 font-medium">{inc.title || inc.message || 'Sự cố'}</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      (inc.status || '').toLowerCase() === 'pending'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {inc.status || 'pending'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {inc.createdAt
                    ? new Date(inc.createdAt).toLocaleString('vi-VN')
                    : 'Chưa rõ thời gian'}
                </p>
              </li>
            ))}
            {incidents.length === 0 && (
              <li className="text-sm text-gray-500 text-center py-4">Chưa có sự cố.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

