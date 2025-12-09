import React, { useEffect, useState } from 'react';
import { Loader2, UserCheck, Phone, Home, RefreshCcw } from 'lucide-react';
import { ResidentsService } from '../../../api/services/ResidentsService';
import { ApiError } from '../../../api';

type Resident = {
  id: string;
  fullName: string;
  phone?: string;
  apartment?: { name?: string };
  apartmentId?: string;
  temporaryStatus?: boolean; // true = tạm vắng, false = đang cư trú
};

export default function ResidentsStatusView() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadResidents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ResidentsService.residentControllerFindAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setResidents(list);
    } catch (err) {
      console.error('Load residents failed', err);
      if (err instanceof ApiError) {
        setError(err.body?.message || 'Không thể tải danh sách cư dân.');
      } else {
        setError('Không thể tải danh sách cư dân.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    setError('');
    try {
      await ResidentsService.residentControllerToggleStatus(id);
      setResidents((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, temporaryStatus: !r.temporaryStatus } : r,
        ),
      );
    } catch (err) {
      console.error('Toggle status failed', err);
      if (err instanceof ApiError) {
        setError(err.body?.message || 'Không thể đổi trạng thái.');
      } else {
        setError('Không thể đổi trạng thái.');
      }
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Trạng thái cư trú</h2>
          <p className="text-gray-600 text-sm">Cập nhật đang cư trú / tạm vắng</p>
        </div>
        <button
          onClick={loadResidents}
          className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          <RefreshCcw className="w-4 h-4" />
          Tải lại
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : residents.length === 0 ? (
        <div className="text-center text-gray-500 py-12">Chưa có cư dân.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Căn hộ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {residents.map((resident) => {
                const isAway = !!resident.temporaryStatus;
                return (
                  <tr key={resident.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        {resident.fullName || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {resident.phone || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        {resident.apartment?.name || resident.apartmentId || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          isAway
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isAway ? 'Tạm vắng' : 'Đang cư trú'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleToggle(resident.id)}
                        disabled={togglingId === resident.id}
                        className="px-3 py-1 rounded-lg border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {togglingId === resident.id
                          ? 'Đang cập nhật...'
                          : isAway
                          ? 'Đánh dấu đang cư trú'
                          : 'Đánh dấu tạm vắng'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

