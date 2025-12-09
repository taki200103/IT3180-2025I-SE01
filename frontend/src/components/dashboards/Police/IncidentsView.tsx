import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { ComplainsService } from '../../../api/services/ComplainsService';
import type { UpdateComplainDto } from '../../../api/models/UpdateComplainDto';

type Incident = {
  id: string;
  title: string;
  message: string;
  responseText?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  resident?: {
    fullName: string;
    apartment?: { name?: string };
  };
};

export default function IncidentsView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ComplainsService.complainControllerFindAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setIncidents(list);
    } catch (err) {
      console.error('Failed to load incidents', err);
      setError('Không thể tải danh sách sự cố. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const handleOpenResponseModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setResponseText(incident.responseText || '');
    setIsModalOpen(true);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    setIsSubmitting(true);
    try {
      const payload: UpdateComplainDto = {
        responseText: responseText.trim(),
        status: 'resolved',
      };
      await ComplainsService.complainControllerUpdate(selectedIncident.id, payload);
      await loadIncidents();
      setIsModalOpen(false);
      setSelectedIncident(null);
      setResponseText('');
    } catch (err) {
      console.error('Update incident failed', err);
      setError('Không thể cập nhật sự cố. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriority = (status: string) => {
    if (status === 'resolved') return 'Thấp';
    if (status === 'pending') return 'Cao';
    return 'Trung bình';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý sự cố</h2>
          <p className="text-gray-600 mt-1">Ghi nhận và xử lý các sự cố</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Đang tải sự cố...
        </div>
      ) : error && !isModalOpen ? (
        <div className="bg-white rounded-lg shadow p-6 text-red-600">{error}</div>
      ) : incidents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
          Chưa có sự cố nào được báo cáo.
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => {
            const priority = getPriority(incident.status);
            return (
              <div key={incident.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          priority === 'Cao'
                            ? 'text-red-600'
                            : priority === 'Trung bình'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}
                      />
                      <div>
                        <h3 className="text-gray-900">{incident.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          📍 Cư dân: {incident.resident?.fullName || 'N/A'}
                          {incident.resident?.apartment?.name && ` - ${incident.resident.apartment.name}`}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          🕐 {formatDate(incident.createdAt)}
                        </p>
                        <p className="text-gray-700 text-sm mt-2">{incident.message}</p>
                        {incident.responseText && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-blue-900 text-sm font-semibold">Phản hồi:</p>
                            <p className="text-blue-800 text-sm mt-1">{incident.responseText}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0 sm:flex-col">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        priority === 'Cao'
                          ? 'bg-red-100 text-red-800'
                          : priority === 'Trung bình'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {priority}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        incident.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {incident.status === 'resolved' ? 'Đã xử lý' : 'Đang xử lý'}
                    </span>
                    {incident.status !== 'resolved' && (
                      <button
                        onClick={() => handleOpenResponseModal(incident)}
                        className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Phản hồi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-gray-900 text-lg font-semibold mb-1">
                  Phản hồi sự cố
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedIncident(null);
                  setResponseText('');
                }}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">{selectedIncident.title}</p>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Nội dung phản hồi <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Nhập nội dung phản hồi..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedIncident(null);
                    setResponseText('');
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Gửi phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

