import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, User, Phone, Calendar, CreditCard, Home, CheckCircle, X } from 'lucide-react';
import { ResidentsService } from '../api/services/ResidentsService';
import { ApartmentsService } from '../api/services/ApartmentsService';
import { ApiError } from '../api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    apartmentId: '',
    phone: '',
    idNumber: '',
    birthDate: '',
  });
  const [apartments, setApartments] = useState<any[]>([]);
  const [loadingApartments, setLoadingApartments] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy danh sách apartments khi component mount
  useEffect(() => {
    const fetchApartments = async () => {
      setLoadingApartments(true);
      try {
        const data = await ApartmentsService.apartmentControllerFindAll();
        // Nếu data là array, dùng trực tiếp, nếu không có thể là object có property data
        const apartmentsList = Array.isArray(data) ? data : (data?.data || []);
        setApartments(apartmentsList);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách apartments:', err);
        // Không hiển thị lỗi vì có thể người dùng không phải resident
      } finally {
        setLoadingApartments(false);
      }
    };

    fetchApartments();
  }, []);

  const roles = [
    { value: 'resident', label: 'Cư dân', icon: '🏠', description: 'Người cư trú tại chung cư' },
    { value: 'police', label: 'Bảo vệ', icon: '🛡️', description: 'Nhân viên bảo vệ an ninh' },
    { value: 'accountant', label: 'Kế toán', icon: '💰', description: 'Nhân viên kế toán' },
    { value: 'admin', label: 'Quản trị viên', icon: '👑', description: 'Quản lý hệ thống' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log('Form submitted:', formData);

    // Validation
    if (!formData.name) {
      setError('Vui lòng nhập họ và tên');
      return;
    }

    if (!formData.email) {
      setError('Vui lòng nhập email');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.role === 'resident' && !formData.apartmentId) {
      setError('Vui lòng chọn căn hộ');
      return;
    }

    if (!formData.phone) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    if (!formData.idNumber) {
      setError('Vui lòng nhập số CMND/CCCD');
      return;
    }

    if (!formData.birthDate) {
      setError('Vui lòng nhập ngày sinh');
      return;
    }

    setLoading(true);
    console.log('Bắt đầu gửi request đăng ký...');
    
    try {
      // Tạo resident mới qua API
      const createResidentData = {
        ...(formData.role === 'resident' && {
          apartmentId: formData.apartmentId,
        }),
        fullName: formData.name,
        phone: formData.phone,
        password: formData.password,
        email: formData.email,
        role: formData.role,
        temporaryStatus: false,
        idNumber: formData.idNumber,
        birthDate: formData.birthDate,
      };

      console.log('Dữ liệu gửi đi:', createResidentData);
      const response = await ResidentsService.residentControllerCreate(createResidentData);
      console.log('Đăng ký thành công:', response);
      
      // Hiển thị thông báo thành công với thông tin chờ duyệt
      if (formData.role === 'resident') {
        setSuccess('Đăng ký thành công! Tài khoản của bạn đang chờ admin duyệt. Bạn sẽ nhận được thông báo khi tài khoản được duyệt.');
      } else {
        setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
        // Sau khi đăng ký thành công, chuyển đến trang đăng nhập sau 3 giây (chỉ cho role khác resident)
        setTimeout(() => {
          navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
        }, 3000);
      }
    } catch (err: any) {
      console.error('Lỗi khi đăng ký:', err);
      if (err instanceof ApiError) {
        let errorMessage = 'Đăng ký thất bại';
        
        // Xử lý lỗi 500 - thường do trùng email (Prisma P2002)
        if (err.status === 500) {
          const errorBody = err.body;
          
          // Log toàn bộ error body để debug
          console.log('Error body chi tiết (500):', JSON.stringify(errorBody, null, 2));
          console.log('Error body type:', typeof errorBody);
          console.log('Error body keys:', errorBody ? Object.keys(errorBody) : 'null');
          
          // Chuyển toàn bộ error body thành string để tìm kiếm
          const errorString = JSON.stringify(errorBody || {}).toLowerCase();
          const errorMessageStr = (errorBody?.message || '').toLowerCase();
          const errorStatusText = (err.statusText || '').toLowerCase();
          
          // Kiểm tra nhiều cách khác nhau để phát hiện lỗi trùng email
          const isEmailDuplicate = 
            errorString.includes('p2002') ||
            errorString.includes('unique constraint') ||
            errorString.includes('unique constraint failed') ||
            (errorString.includes('email') && (errorString.includes('unique') || errorString.includes('duplicate') || errorString.includes('exists'))) ||
            errorString.includes('email str') ||
            errorMessageStr.includes('email') && (errorMessageStr.includes('unique') || errorMessageStr.includes('duplicate') || errorMessageStr.includes('exists') || errorMessageStr.includes('đã')) ||
            errorStatusText.includes('email');
          
          // Nếu phát hiện được lỗi trùng email hoặc không có thông tin chi tiết
          // (vì trong trường hợp đăng ký, lỗi 500 thường là do trùng email)
          if (isEmailDuplicate || !errorBody?.message) {
            errorMessage = 'Email này đã được sử dụng. Vui lòng sử dụng email khác.';
          } else if (errorBody?.message) {
            const message = typeof errorBody.message === 'string' 
              ? errorBody.message 
              : JSON.stringify(errorBody.message);
            
            // Kiểm tra lại message có chứa thông tin về email không
            if (message.toLowerCase().includes('email') || 
                message.toLowerCase().includes('trùng') ||
                message.toLowerCase().includes('duplicate') ||
                message.toLowerCase().includes('exists') ||
                message.toLowerCase().includes('unique')) {
              errorMessage = 'Email này đã được sử dụng. Vui lòng sử dụng email khác.';
            } else {
              errorMessage = message || 'Lỗi server. Vui lòng thử lại sau.';
            }
          } else {
            errorMessage = 'Email này đã được sử dụng. Vui lòng sử dụng email khác.';
          }
        } else if (err.status === 400) {
          // Lỗi validation
          errorMessage = err.body?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (err.status === 401) {
          errorMessage = 'Không có quyền thực hiện. Vui lòng liên hệ quản trị viên.';
        } else {
          errorMessage = err.body?.message || err.message || 'Đăng ký thất bại';
        }
        
        console.error('Chi tiết lỗi API:', {
          status: err.status,
          body: err.body,
          message: errorMessage
        });
        setError(errorMessage);
      } else {
        setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Toast Notification */}
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 toast-slide-down">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[400px] max-w-[500px]">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Thành công!</p>
              <p className="text-sm break-words">{success}</p>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="text-white hover:text-green-100 transition flex-shrink-0 ml-2"
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

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 text-center">Đăng Ký Tài Khoản</h1>
          <p className="text-gray-600 text-center mt-2">Tạo tài khoản mới cho hệ thống quản lý chung cư</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 mb-2">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="0901234567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Số CMND/CCCD</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="001234567890"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Ngày sinh</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                title="Ngày sinh"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-3">Vai trò</label>
            <div className="grid md:grid-cols-2 gap-3">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.role === role.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{role.icon}</span>
                      <span className="text-gray-900">{role.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {formData.role === 'resident' && (
            <div>
              <label className="block text-gray-700 mb-2">Căn hộ</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                {loadingApartments ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                    <span className="text-gray-500">Đang tải danh sách căn hộ...</span>
                  </div>
                ) : apartments.length === 0 ? (
                  <div className="w-full px-4 py-3 border border-yellow-300 rounded-lg bg-yellow-50">
                    <span className="text-yellow-700 text-sm">Không có căn hộ nào. Vui lòng liên hệ quản trị viên.</span>
                  </div>
                ) : (
                  <select
                    value={formData.apartmentId}
                    onChange={(e) => setFormData({ ...formData, apartmentId: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white"
                    title="Chọn căn hộ"
                    required
                  >
                    <option value="">-- Chọn căn hộ --</option>
                    {apartments.map((apartment) => (
                      <option key={apartment.id || apartment._id} value={apartment.id || apartment._id}>
                        {apartment.name || apartment.apartmentNumber || `Căn hộ ${apartment.id || apartment._id}`}
                        {apartment.building && ` - ${apartment.building}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || loadingApartments}
            onClick={(e) => {
              console.log('Button clicked');
              // Form sẽ tự động submit vì type="submit"
            }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 transition">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
