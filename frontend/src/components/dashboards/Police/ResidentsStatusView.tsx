import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, UserCheck, Phone, Home, RefreshCcw, X, Download } from 'lucide-react';
import { ResidentsService } from '../../../api/services/ResidentsService';
import { ApiError } from '../../../api';

type Resident = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  apartment?: { name?: string };
  apartmentId?: string;
  temporaryStatus?: boolean; // true = tạm vắng, false = đang cư trú
};

export default function ResidentsStatusView() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'apartment'>('all');
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>('');
  const [detailResident, setDetailResident] = useState<Resident | null>(null);
  const [search, setSearch] = useState('');

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

  const apartments = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    residents.forEach((r) => {
      const aptId = r.apartmentId || r.apartment?.name;
      const aptName = r.apartment?.name || r.apartmentId || 'Chưa rõ';
      if (!aptId) return;
      const prev = map.get(aptId);
      if (prev) {
        map.set(aptId, { ...prev, count: prev.count + 1 });
      } else {
        map.set(aptId, { id: String(aptId), name: String(aptName), count: 1 });
      }
    });
    return Array.from(map.values());
  }, [residents]);

  const filteredByView =
    viewMode === 'apartment'
      ? selectedApartmentId
        ? residents.filter(
            (r) => (r.apartmentId || r.apartment?.name || '') === selectedApartmentId,
          )
        : []
      : residents;

  const filteredResidents = filteredByView.filter((r) =>
    r.fullName?.toLowerCase().includes(search.trim().toLowerCase() || ''),
  );

  const handleExportCsv = () => {
    const rows = filteredResidents.length ? filteredResidents : residents;
    if (!rows.length) return;
    const headers = ['Họ tên', 'Email', 'Số điện thoại', 'CCCD/CMND', 'Căn hộ', 'Trạng thái'];
    const lines = [
      headers.join(','),
      ...rows.map((r) =>
        [
          r.fullName || '',
          r.email || '',
          r.phone || '',
          r.idNumber || '',
          r.apartment?.name || r.apartmentId || '',
          r.temporaryStatus ? 'Tạm vắng' : 'Đang cư trú',
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');

    // Add BOM to avoid font/encoding issues in Excel
    const blob = new Blob(['\ufeff', lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cu-dan.csv';
    link.click();
    URL.revokeObjectURL(url);
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-gray-900">Trạng thái cư trú</h2>
          <p className="text-gray-600 text-sm">Cập nhật đang cư trú / tạm vắng, lọc theo phòng.</p>
        </div>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              setViewMode('all');
              setSelectedApartmentId('');
            }}
          >
            Toàn bộ cư dân
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
              viewMode === 'apartment'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setViewMode('apartment')}
            disabled={apartments.length === 0}
          >
            Lọc theo phòng
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={(viewMode === 'apartment' && !selectedApartmentId) || (!filteredResidents.length && !residents.length)}
            title="Xuất danh sách CSV"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên"
              className="pl-3 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56 md:w-64"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {viewMode === 'apartment' && apartments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-900 font-semibold text-sm">Chọn phòng</h4>
            <span className="text-xs text-gray-500">{apartments.length} phòng</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {apartments.map((apt) => (
              <button
                key={apt.id}
                onClick={() => setSelectedApartmentId(apt.id === selectedApartmentId ? '' : apt.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition ${
                  selectedApartmentId === apt.id
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">{apt.name}</span>
                </div>
                <span className="text-xs text-gray-500">{apt.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : viewMode === 'apartment' && !selectedApartmentId ? (
        <div className="text-center text-gray-500 py-12">Chọn phòng để xem cư dân.</div>
      ) : filteredResidents.length === 0 ? (
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
              {filteredResidents.map((resident) => {
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
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDetailResident(resident)}
                        className="px-3 py-1 rounded-lg border text-gray-700 hover:bg-gray-50"
                      >
                        Chi tiết
                      </button>
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

      {detailResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-[60vw] max-w-5xl p-6 relative">
            <h3 className="text-gray-900 text-lg font-semibold mb-2">Thông tin cư dân</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 mt-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">{detailResident.fullName || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-800">{detailResident.email || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{detailResident.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">CCCD/CMND:</span>
                <span className="font-medium text-gray-800">{detailResident.idNumber || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-400" />
                <span>{detailResident.apartment?.name || detailResident.apartmentId || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Trạng thái:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    detailResident.temporaryStatus
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {detailResident.temporaryStatus ? 'Tạm vắng' : 'Đang cư trú'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDetailResident(null)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

