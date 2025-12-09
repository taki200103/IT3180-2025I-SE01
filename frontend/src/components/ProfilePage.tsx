import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService, ResidentsService, OpenAPI } from '../api';
import { ApiError } from '../api';
import { User, Mail, Building2, Shield, ArrowLeft, Phone, CreditCard, Calendar, Edit, Save, X, CheckCircle } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function ProfilePage() {
  const { user, loginFromAPI } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', idNumber: '', birthDate: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setPageError('');
      try {
        // Đảm bảo token được set
        const token = localStorage.getItem('token');
        if (token) {
          OpenAPI.TOKEN = token;
        }

        const profileData = await AuthService.authControllerGetProfile();
        setProfile(profileData);
        setFormData({
          fullName: profileData?.fullName || profileData?.name || '',
          phone: profileData?.phone || '',
          email: profileData?.email || '',
          idNumber: profileData?.idNumber || '',
          birthDate: profileData?.birthDate ? profileData.birthDate.split('T')[0] : '',
        });
      } catch (err: any) {
        console.error('Lỗi khi lấy thông tin profile:', err);
        if (err instanceof ApiError) {
          setPageError(err.body?.message || err.message || 'Không thể tải thông tin cá nhân');
        } else {
          setPageError(err.message || 'Không thể tải thông tin cá nhân');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const calculateAge = (birthDate: Date) => {
    const now = new Date();
    return (
      now.getFullYear() -
      birthDate.getFullYear() -
      (now < new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0)
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: profile?.fullName || profile?.name || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
      idNumber: profile?.idNumber || '',
      birthDate: profile?.birthDate ? profile.birthDate.split('T')[0] : '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = formData.fullName.trim();

    if (!trimmedName) {
      setError('Vui lòng nhập họ và tên');
      return;
    }

    if (/\d/.test(trimmedName)) {
      setError('Họ và tên không được chứa số');
      return;
    }

    if (!formData.birthDate) {
      setError('Vui lòng nhập ngày sinh');
      return;
    }

    const birthDate = new Date(formData.birthDate);
    if (Number.isNaN(birthDate.getTime())) {
      setError('Ngày sinh không hợp lệ');
      return;
    }

    const age = calculateAge(birthDate);
    if (age < 18) {
      setError('Người dùng phải từ 18 tuổi');
      return;
    }

    try {
      const residentId = profile?.id || profile?._id || user?.id;
      if (!residentId) throw new Error('Không tìm thấy ID người dùng');
      
      await ResidentsService.residentControllerUpdate(residentId, {
        fullName: trimmedName,
        phone: formData.phone,
        email: formData.email,
        idNumber: formData.idNumber,
        birthDate: formData.birthDate,
      });

      const updatedProfile = await AuthService.authControllerGetProfile();
      setProfile(updatedProfile);
      await loginFromAPI(updatedProfile);
      setSuccess('Cập nhật thành công!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err instanceof ApiError ? (err.body?.message || err.message) : err.message);
    }
  };

  const roleLabels: Record<string, string> = {
    admin: 'Quản trị viên',
    resident: 'Cư dân',
    police: 'Bảo vệ',
    accountant: 'Kế toán',
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'resident':
        return '🏠';
      case 'police':
        return '🛡️';
      case 'accountant':
        return '💰';
      default:
        return '👤';
    }
  };

  const menuItems = [
    {
      icon: <ArrowLeft className="w-5 h-5" />,
      label: 'Quay lại',
      onClick: () => {
        const role = user?.role || 'resident';
        navigate(`/${role}`);
      },
      active: false,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout 
        title="Thông tin cá nhân" 
        menuItems={menuItems}
        children={
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Đang tải thông tin...</div>
          </div>
        }
      />
    );
  }

  if (pageError) {
    return (
      <DashboardLayout 
        title="Thông tin cá nhân" 
        menuItems={menuItems}
        children={
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {pageError}
          </div>
        }
      />
    );
  }

  return (
    <DashboardLayout 
      title="Thông tin cá nhân" 
      menuItems={menuItems}
      children={
        <>
        {/* Toast Notification - Thông báo thành công */}
        {success && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 toast-slide-down">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[400px] max-w-[500px]">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Thành công!</p>
                <p className="text-sm">{success}</p>
              </div>
              <button
                onClick={() => setSuccess('')}
                className="text-white hover:text-green-100 transition"
                title="Đóng thông báo"
                aria-label="Đóng thông báo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translate(-50%, -20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
          .toast-slide-down {
            animation: slideDown 0.3s ease-out;
          }
        `}</style>

        <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl">
                {getRoleIcon(profile?.role || user?.role || '')}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {profile?.fullName || profile?.name || user?.name || 'N/A'}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>{roleLabels[profile?.role || user?.role || '']}</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>
        </div>

        {/* Information Cards */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Chỉnh sửa thông tin cá nhân
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm text-gray-500 mb-1">Họ và tên</label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                    title="Họ và tên"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-500 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                    title="Email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-500 mb-1">Số điện thoại</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                    title="Số điện thoại"
                  />
                </div>
                <div>
                  <label htmlFor="idNumber" className="block text-sm text-gray-500 mb-1">Số CMND/CCCD</label>
                  <input
                    id="idNumber"
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    title="Số CMND/CCCD"
                  />
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm text-gray-500 mb-1">Ngày sinh</label>
                  <input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    title="Ngày sinh"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Thông tin cá nhân
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{profile?.email || user?.email || 'N/A'}</p>
                  </div>
                </div>

                {profile?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile?.idNumber && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Số CMND/CCCD</p>
                      <p className="text-gray-900">{profile.idNumber}</p>
                    </div>
                  </div>
                )}

                {profile?.birthDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="text-gray-900">
                        {new Date(profile.birthDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                )}

                {profile?.temporaryStatus !== undefined && (
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <p className="text-gray-900">
                        {profile.temporaryStatus ? 'Tạm vắng' : 'Đang cư trú'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Apartment Information */}
          {(profile?.apartment || profile?.apartmentId || user?.apartment) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Thông tin căn hộ
              </h3>
              <div className="space-y-4">
                {profile?.apartment?.name && (
                  <div>
                    <p className="text-sm text-gray-500">Tên căn hộ</p>
                    <p className="text-gray-900">{profile.apartment.name}</p>
                  </div>
                )}

                {profile?.apartment?.building && (
                  <div>
                    <p className="text-sm text-gray-500">Tòa nhà</p>
                    <p className="text-gray-900">{profile.apartment.building}</p>
                  </div>
                )}

                {profile?.apartmentId && !profile?.apartment && (
                  <div>
                    <p className="text-sm text-gray-500">Mã căn hộ</p>
                    <p className="text-gray-900">{profile.apartmentId}</p>
                  </div>
                )}

                {user?.apartment && !profile?.apartment && (
                  <div>
                    <p className="text-sm text-gray-500">Mã căn hộ</p>
                    <p className="text-gray-900">{user.apartment}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Thông tin tài khoản
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="text-gray-900 font-mono text-sm">
                  {profile?.id || profile?._id || user?.id || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Vai trò</p>
                <p className="text-gray-900">{roleLabels[profile?.role || user?.role || '']}</p>
              </div>

              {profile?.createdAt && (
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                  <p className="text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
        </div>
        </>
      }
    />
  );
}

