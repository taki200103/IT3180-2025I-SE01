import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, X, Edit2, Trash2 } from 'lucide-react';
import { NotificationsService } from '../../../api/services/NotificationsService';
import { ApiError } from '../../../api';

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    info: '', 
    creator: 'Ban Quản Lý',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await NotificationsService.notificationControllerFindAll();
      setNotifications(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
      setError('Không thể tải danh sách thông báo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Xử lý ESC key để đóng modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
        resetForm();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const resetForm = () => {
    setFormData({ 
      info: '', 
      creator: 'Ban Quản Lý',
    });
    setError('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.info.trim()) {
      setError('Nội dung thông báo không được để trống.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await NotificationsService.notificationControllerUpdate(editingId, {
          info: formData.info.trim(),
          creator: formData.creator.trim() || 'Ban Quản Lý',
        });
      } else {
        await NotificationsService.notificationControllerCreate({
          info: formData.info.trim(),
          creator: formData.creator.trim() || 'Ban Quản Lý',
        });
      }
      await loadNotifications();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Create notification failed', err);
      setError(editingId ? 'Không thể cập nhật thông báo. Vui lòng thử lại.' : 'Không thể tạo thông báo. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (notification: any) => {
    setEditingId(notification.id);
    setFormData({
      info: notification.info || '',
      creator: notification.creator || 'Ban Quản Lý',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return;
    setDeletingId(id);
    try {
      await NotificationsService.notificationControllerRemove(id);
      await loadNotifications();
    } catch (err) {
      console.error('Delete notification failed', err);
      setError('Không thể xóa thông báo. Vui lòng thử lại.');
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="space-y-6 max-w-5xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý thông báo</h2>
          <p className="text-gray-600 mt-1">Gửi thông báo đến cư dân</p>
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Tạo thông báo mới
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
        {loading ? (
          <div className="p-6 flex items-center text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Đang tải thông báo...
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-gray-500">Chưa có thông báo nào.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification: any) => (
              <div key={notification.id} className="p-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-gray-900">{notification.info}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Người gửi: {notification.creator || 'Ban Quản Lý'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString('vi-VN') : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700">Đã gửi</span>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    aria-label="Chỉnh sửa thông báo"
                    onClick={() => startEdit(notification)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    aria-label="Xóa thông báo"
                    onClick={() => handleDelete(notification.id)}
                    disabled={deletingId === notification.id}
                  >
                    {deletingId === notification.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div
            className="bg-white border border-gray-300 rounded-2xl shadow-2xl w-full max-w-5xl p-6 relative my-auto"
            style={{ width: '50%' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-gray-900 text-lg font-semibold leading-tight">
                  {editingId ? 'Cập nhật thông báo' : 'Tạo thông báo'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 flex-shrink-0 transition"
                aria-label="Đóng"
                title="Đóng (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="creator" className="block text-sm text-gray-700 mb-1">Người gửi</label>
                <input
                  id="creator"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.creator}
                  onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="info" className="block text-sm text-gray-700 mb-1">Nội dung thông báo</label>
                <textarea
                  id="info"
                  rows={6}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.info}
                  onChange={(e) => setFormData({ ...formData, info: e.target.value })}
                  placeholder="Nhập nội dung thông báo..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Thông báo sẽ được gửi đến tất cả cư dân</p>
                    <p className="text-xs text-blue-700 mt-1">Tất cả cư dân đã đăng ký trong hệ thống sẽ nhận được thông báo này.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
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
                  {editingId ? 'Lưu thay đổi' : 'Gửi thông báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

