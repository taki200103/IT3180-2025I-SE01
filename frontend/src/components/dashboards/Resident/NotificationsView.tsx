import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, ChevronUp, Calendar, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ResidentNotificationsService, NotificationsService, OpenAPI, ApiError } from '../../../api';

interface Notification {
  id: string;
  notificationId?: string;
  notification?: {
    id?: string;
    title?: string;
    content?: string;
    info?: string;
    createdAt?: string;
    creator?: string;
  };
  title?: string;
  content?: string;
  info?: string;
  createdAt?: string;
  creator?: string;
  read?: boolean;
  isRead?: boolean;
  fullDetails?: any;
}

export default function NotificationsView() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchNotifications = async () => {
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
        const notificationsData = await ResidentNotificationsService.residentnotificationControllerGetNotificationsByResident(residentId);
        
        // Xử lý dữ liệu từ API
        const processedNotifications = Array.isArray(notificationsData) 
          ? notificationsData.map((item: any) => {
              // Lấy notificationId - đây là ID của notification thực tế để fetch chi tiết
              const notificationId = item.notificationId || item.notification?.id || item.id || '';
              
              // Lấy thông tin notification (có thể là object hoặc trực tiếp trong item)
              const notification = item.notification || item;
              
              return {
                id: item.id || notificationId || '', // ID của resident-notification record
                notificationId: notificationId, // ID của notification để fetch chi tiết
                title: notification?.title || item.title || 'Thông báo',
                content: notification?.content || item.content || notification?.info || item.info || '',
                info: notification?.info || item.info || '', // Trường info từ API
                createdAt: notification?.createdAt || item.createdAt || item.created_at || '',
                creator: notification?.creator || item.creator || '',
                read: item.isRead !== undefined ? item.isRead : (item.read !== undefined ? item.read : false),
                isRead: item.isRead !== undefined ? item.isRead : (item.read !== undefined ? item.read : false),
              };
            })
          : [];

        // Sắp xếp theo ngày mới nhất trước
        processedNotifications.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setNotifications(processedNotifications);
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách thông báo:', err);
        setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tải danh sách thông báo');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có ngày';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Chưa có ngày giờ';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
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

  const handleToggleExpand = async (notification: Notification) => {
    // Sử dụng notificationId để fetch chi tiết (không phải id của resident-notification)
    const notificationId = notification.notificationId;
    const recordId = notification.id; // ID của record để track expanded state
    
    if (!notificationId) {
      console.warn('Không có notificationId để lấy chi tiết');
      return;
    }
    
    if (expandedIds.has(recordId)) {
      // Đóng
      setExpandedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    } else {
      // Mở - fetch chi tiết nếu chưa có
      setExpandedIds(prev => new Set(prev).add(recordId));
      
      if (!notification.fullDetails) {
        setLoadingDetails(prev => new Set(prev).add(recordId));
        try {
          const token = localStorage.getItem('token');
          if (token) {
            OpenAPI.TOKEN = token;
          }

          // Sử dụng notificationId để lấy chi tiết từ API
          const details = await NotificationsService.notificationControllerFindOne(notificationId);
          
          setNotifications(prev => prev.map(n => {
            if (n.id === recordId) {
              return { ...n, fullDetails: details };
            }
            return n;
          }));
        } catch (err: any) {
          console.error('Lỗi khi lấy chi tiết thông báo:', err);
          setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tải chi tiết thông báo');
        } finally {
          setLoadingDetails(prev => {
            const newSet = new Set(prev);
            newSet.delete(recordId);
            return newSet;
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Thông báo</h2>
        <p className="text-gray-600 mt-1">Các thông báo từ ban quản lý</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Chưa có thông báo nào
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isRead = notification.read || notification.isRead || false;
            const recordId = notification.id; // ID của record để track expanded
            const notificationId = notification.notificationId; // ID của notification để fetch chi tiết
            const isExpanded = expandedIds.has(recordId);
            const isLoadingDetail = loadingDetails.has(recordId);
            const details = notification.fullDetails;

            return (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg shadow transition-all ${!isRead ? 'border-l-4 border-indigo-600' : ''}`}
              >
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => handleToggleExpand(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-gray-900 font-semibold">{notification.title || 'Thông báo'}</h3>
                        {!isRead && (
                          <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                            Mới
                          </span>
                        )}
                      </div>
                      {/* Hiển thị info nếu có, nếu không thì hiển thị content */}
                      {(notification.info || notification.content) && (
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {notification.info || notification.content}
                        </p>
                      )}
                      {notification.createdAt && (
                        <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(notification.createdAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Bell className={`w-5 h-5 flex-shrink-0 ${!isRead ? 'text-indigo-600' : 'text-gray-400'}`} />
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Chi tiết thông báo */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    {isLoadingDetail ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="text-gray-500 text-sm">Đang tải chi tiết...</div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {details && (
                          <>
                            {details.title && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Tiêu đề</h4>
                                <p className="text-gray-900">{details.title}</p>
                              </div>
                            )}
                            {/* Ưu tiên hiển thị info, nếu không có thì hiển thị content */}
                            {(details.info || details.content) && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Nội dung</h4>
                                <p className="text-gray-900 whitespace-pre-wrap">{details.info || details.content}</p>
                              </div>
                            )}
                            {details.creator && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <User className="w-4 h-4" />
                                <span>Người tạo: {details.creator}</span>
                              </div>
                            )}
                            {details.createdAt && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Ngày tạo: {formatDateTime(details.createdAt)}</span>
                              </div>
                            )}
                            {details.updatedAt && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Cập nhật: {formatDateTime(details.updatedAt)}</span>
                              </div>
                            )}
                          </>
                        )}
                        {!details && (
                          <div className="space-y-2">
                            {notification.title && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Tiêu đề</h4>
                                <p className="text-gray-900">{notification.title}</p>
                              </div>
                            )}
                            {/* Ưu tiên hiển thị info, nếu không có thì hiển thị content */}
                            {(notification.info || notification.content) && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Nội dung</h4>
                                <p className="text-gray-900 whitespace-pre-wrap">{notification.info || notification.content}</p>
                              </div>
                            )}
                            {notification.creator && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <User className="w-4 h-4" />
                                <span>Người tạo: {notification.creator}</span>
                              </div>
                            )}
                            {notification.createdAt && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Ngày tạo: {formatDateTime(notification.createdAt)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

