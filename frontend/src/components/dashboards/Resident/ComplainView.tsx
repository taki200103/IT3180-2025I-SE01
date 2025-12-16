import React, { useState, useEffect } from 'react';
import { Wrench, Plus, X, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ComplainsService, OpenAPI, ApiError } from '../../../api';

interface Complaint {
  id: string;
  title: string;
  message: string;
  status?: string;
  responseText?: string;
  createdAt?: string;
  updatedAt?: string;
  targetRole?: string;
}

export default function ComplainView() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', targetRole: 'admin' });
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          OpenAPI.TOKEN = token;
        }

        const residentId = user.id;
        const complaintsData = await ComplainsService.complainControllerFindAll(residentId);
        
        const processedComplaints = Array.isArray(complaintsData) 
          ? complaintsData.map((item: any) => ({
              id: item.id || item._id || '',
              title: item.title || 'Yêu cầu',
              message: item.message || '',
              status: item.status || 'Đang xử lý',
              responseText: item.responseText || item.response_text || '',
              createdAt: item.createdAt || item.created_at || '',
              updatedAt: item.updatedAt || item.updated_at || '',
              targetRole: item.targetRole || item.target_role || 'admin',
            }))
          : [];

        // Sắp xếp theo ngày mới nhất trước
        processedComplaints.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setComplaints(processedComplaints);
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách yêu cầu:', err);
        setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tải danh sách yêu cầu');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (token) {
        OpenAPI.TOKEN = token;
      }

      await ComplainsService.complainControllerCreate({
        residentId: user.id,
        title: formData.title,
        message: formData.message,
        status: 'Đang xử lý',
        targetRole: formData.targetRole,
      });

      setSuccess('Tạo yêu cầu thành công!');
      setShowCreateForm(false);
      setFormData({ title: '', message: '', targetRole: 'admin' });
      setTimeout(() => setSuccess(''), 3000);

      // Refresh danh sách
      const residentId = user.id;
      const complaintsData = await ComplainsService.complainControllerFindAll(residentId);
      const processedComplaints = Array.isArray(complaintsData) 
        ? complaintsData.map((item: any) => ({
            id: item.id || item._id || '',
            title: item.title || 'Yêu cầu',
            message: item.message || '',
            status: item.status || 'Đang xử lý',
            responseText: item.responseText || item.response_text || '',
            createdAt: item.createdAt || item.created_at || '',
            updatedAt: item.updatedAt || item.updated_at || '',
            targetRole: item.targetRole || item.target_role || 'admin',
          }))
        : [];
      processedComplaints.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setComplaints(processedComplaints);
    } catch (err: any) {
      setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tạo yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có ngày';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const roleLabels: Record<string, string> = {
    admin: 'Quản trị',
    accountant: 'Kế toán',
    guard: 'Bảo vệ',
    police: 'Công an',
  };

  const getStatusDisplay = (status?: string) => {
    const normalized = (status || '').toLowerCase();
    if (!normalized || normalized === 'pending' || normalized.includes('chờ') || normalized.includes('đang')) {
      return {
        label: 'Chờ xử lý',
        colorClass: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    }
    if (normalized.includes('hoàn') || normalized.includes('xử lý') || normalized === 'resolved' || normalized.includes('đã xử lý')) {
      return {
        label: 'Đã xử lý',
        colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
    return {
      label: status || 'Chờ xử lý',
      colorClass: 'bg-gray-100 text-gray-800 border-gray-200',
    };
  };

  const statusKey = (status?: string): 'pending' | 'resolved' => {
    const normalized = (status || '').toLowerCase();
    if (!normalized || normalized === 'pending' || normalized.includes('chờ') || normalized.includes('đang')) {
      return 'pending';
    }
    if (normalized.includes('hoàn') || normalized.includes('xử lý') || normalized === 'resolved' || normalized.includes('đã xử lý')) {
      return 'resolved';
    }
    return 'pending';
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === 'all') return true;
    return statusKey(c.status) === filterStatus;
  });

  const counts = complaints.reduce(
    (acc, c) => {
      const key = statusKey(c.status);
      acc[key] += 1;
      acc.all += 1;
      return acc;
    },
    { all: 0, pending: 0, resolved: 0 }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Yêu cầu</h2>
          <p className="text-gray-600 mt-1">Gửi và theo dõi yêu cầu sửa chữa, bảo trì</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition flex items-center gap-1.5 text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo yêu cầu</span>
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Bộ lọc trạng thái */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          {([
            { key: 'all', label: 'Tất cả', count: counts.all },
            { key: 'pending', label: 'Đang xử lý', count: counts.pending },
            { key: 'resolved', label: 'Đã xử lý', count: counts.resolved },
          ] as const).map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterStatus(item.key)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                filterStatus === item.key
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
              }`}
            >
              {item.label}
              <span
                className={`ml-2 inline-flex items-center justify-center min-w-[24px] px-1.5 text-xs rounded-full ${
                  filterStatus === item.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                ({item.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form tạo yêu cầu mới */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tạo yêu cầu mới</h3>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setFormData({ title: '', message: '', targetRole: 'admin' });
                setError('');
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Đóng form"
              title="Đóng form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateComplaint} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
                placeholder="Ví dụ: Sửa điện, Sửa nước..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gửi tới</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                title="Chọn bộ phận tiếp nhận"
              >
                <option value="admin">Quản trị</option>
                <option value="accountant">Kế toán</option>
                <option value="guard">Bảo vệ</option>
                <option value="police">Công an</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                rows={4}
                required
                placeholder="Mô tả chi tiết yêu cầu của bạn..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
              >
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ title: '', message: '', targetRole: 'admin' });
                  setError('');
                }}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          {complaints.length === 0 ? 'Chưa có yêu cầu nào' : 'Không có yêu cầu ở trạng thái này'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h3 className="text-gray-900 font-semibold">{complaint.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          Gửi: {roleLabels[complaint.targetRole || 'admin'] || 'Quản trị'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{complaint.message}</p>
                      {complaint.createdAt && (
                        <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(complaint.createdAt)}
                        </p>
                      )}
                      {complaint.responseText && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700 mb-1">Phản hồi từ ban quản lý:</p>
                              <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg">
                                {complaint.responseText}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

