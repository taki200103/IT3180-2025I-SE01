import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Mail, Phone, CreditCard, Calendar, X, CheckCircle, Trash2, Edit2, Search, ArrowUpDown } from 'lucide-react';
import { ResidentsService } from '../../../api/services/ResidentsService';
import { ApartmentsService } from '../../../api/services/ApartmentsService';
import type { CreateResidentDto } from '../../../api/models/CreateResidentDto';
import type { UpdateResidentDto } from '../../../api/models/UpdateResidentDto';
import { ApiError } from '../../../api';
import { residentRoles, type ResidentRecord } from './types';

export default function ResidentsView() {
  const [residents, setResidents] = useState<ResidentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<ResidentRecord | null>(null);
  const [apartments, setApartments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingSelected, setDeletingSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'none' | 'apartment-asc' | 'apartment-desc'>('none');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    apartmentId: '',
    idNumber: '',
    birthDate: '',
  });

  const fetchResidents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ResidentsService.residentControllerFindAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setResidents(list);
    } catch (err) {
      console.error('Failed to fetch residents', err);
      setError('Không thể tải danh sách cư dân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApartments = useCallback(async () => {
    try {
      const data = await ApartmentsService.apartmentControllerFindAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setApartments(list);
    } catch (err) {
      console.error('Failed to fetch apartments', err);
    }
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  useEffect(() => {
    if (isModalOpen && apartments.length === 0) {
      fetchApartments();
    }
  }, [isModalOpen, apartments.length, fetchApartments]);

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'resident',
      apartmentId: '',
      idNumber: '',
      birthDate: '',
    });
    setEditingResident(null);
    setError('');
  };

  const handleOpenEdit = (resident: ResidentRecord) => {
    setEditingResident(resident);
    setFormData({
      fullName: resident.fullName || '',
      email: resident.email || '',
      phone: resident.phone || '',
      password: '',
      confirmPassword: '',
      role: resident.role || 'resident',
      apartmentId: resident.apartment?.id || resident.apartment?.ID_Apartment || resident.apartment?.ID_apartment || '',
      idNumber: resident.idNumber || '',
      birthDate: resident.birthDate ? resident.birthDate.slice(0, 10) : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (formData.role === 'resident' && !formData.apartmentId) {
      setError('Cư dân bắt buộc phải thuộc một căn hộ.');
      return;
    }
    if (!formData.idNumber) {
      setError('Vui lòng nhập số CMND/CCCD.');
      return;
    }
    if (!formData.birthDate) {
      setError('Vui lòng chọn ngày sinh.');
      return;
    }

    if (editingResident) {
      const updatePayload: UpdateResidentDto = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        idNumber: formData.idNumber,
        birthDate: formData.birthDate,
      };
      if (formData.role === 'resident') {
        updatePayload.apartmentId = formData.apartmentId;
      }
      if (formData.password) {
        updatePayload.password = formData.password;
      }
      setIsSubmitting(true);
      try {
        await ResidentsService.residentControllerUpdate(String(editingResident.id), updatePayload);
        await fetchResidents();
        setSuccessMessage('Đã cập nhật cư dân.');
        setIsModalOpen(false);
        resetForm();
      } catch (err: any) {
        console.error('Update resident failed', err);
        if (err instanceof ApiError) {
          setError(err.body?.message || 'Không thể cập nhật cư dân. Vui lòng thử lại.');
        } else {
          setError('Không thể cập nhật cư dân. Vui lòng thử lại.');
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const payload: CreateResidentDto = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      idNumber: formData.idNumber,
      birthDate: formData.birthDate,
    };

    if (formData.role === 'resident') {
      payload.apartmentId = formData.apartmentId;
    }

    setIsSubmitting(true);
    try {
      const newResident = await ResidentsService.residentControllerCreate(
        payload,
      );
      setResidents((prev) => [newResident, ...prev]);
      setSuccessMessage('Đã tạo cư dân mới thành công.');
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Create resident failed', err);
      if (err instanceof ApiError) {
        setError(err.body?.message || 'Không thể tạo cư dân. Vui lòng thử lại.');
      } else {
        setError('Không thể tạo cư dân. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    setError('');
    try {
      await ResidentsService.residentControllerApprove(id);
      await fetchResidents();
      setSuccessMessage('Đã duyệt tài khoản thành công.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Approve resident failed', err);
      if (err instanceof ApiError) {
        setError(err.body?.message || 'Không thể duyệt tài khoản. Vui lòng thử lại.');
      } else {
        setError('Không thể duyệt tài khoản. Vui lòng thử lại.');
      }
    } finally {
      setApprovingId(null);
    }
  };

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (!confirm(`Bạn có chắc chắn muốn xóa ${count} cư dân đã chọn? Hành động này không thể hoàn tác.`)) {
      return;
    }
    setDeletingSelected(true);
    setError('');
    try {
      await Promise.all(selectedIds.map((id) => ResidentsService.residentControllerRemove(id)));
      await fetchResidents();
      setSuccessMessage('Đã xóa cư dân đã chọn.');
      setSelectedIds([]);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Delete selected residents failed', err);
      if (err instanceof ApiError) {
        setError(err.body?.message || 'Không thể xóa cư dân. Vui lòng thử lại.');
      } else {
        setError('Không thể xóa cư dân. Vui lòng thử lại.');
      }
    } finally {
      setDeletingSelected(false);
    }
  };

  const apartmentOptions = [
    { id: '', name: 'Tất cả căn hộ' },
    ...apartments.map((apt) => ({
      id: apt.id || apt.ID_Apartment || apt.ID_apartment || String(apt.name),
      name: apt.name || apt.Name || `Căn hộ ${apt.id}`,
    })),
  ];

  // Filter và sort cư dân
  const filteredResidents = residents
    .filter((resident) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      const fullName = resident.fullName?.toLowerCase() || '';
      const apartmentName = resident.apartment?.name?.toLowerCase() || '';
      const apartmentId = String(
        resident.apartment?.id || 
        resident.apartment?.ID_Apartment || 
        resident.apartment?.ID_apartment || 
        ''
      ).toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        apartmentName.includes(searchLower) ||
        apartmentId.includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'none') return 0;
      
      const getApartmentIdentifier = (resident: ResidentRecord) => {
        return (
          resident.apartment?.name ||
          String(resident.apartment?.id || resident.apartment?.ID_Apartment || resident.apartment?.ID_apartment || '')
        ).toLowerCase();
      };
      
      const aptA = getApartmentIdentifier(a);
      const aptB = getApartmentIdentifier(b);
      
      if (sortBy === 'apartment-asc') {
        return aptA.localeCompare(aptB);
      } else if (sortBy === 'apartment-desc') {
        return aptB.localeCompare(aptA);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý cư dân</h2>
          <p className="text-gray-600 mt-1">Tìm kiếm, quản lý và theo dõi cư dân theo căn hộ.</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã căn hộ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'none' | 'apartment-asc' | 'apartment-desc')}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                aria-label="Sắp xếp theo mã căn hộ"
                title="Sắp xếp theo mã căn hộ"
              >
                <option value="none">Sắp xếp</option>
                <option value="apartment-asc">Mã căn hộ: A-Z</option>
                <option value="apartment-desc">Mã căn hộ: Z-A</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0 || deletingSelected}
            title="Xóa cư dân đã chọn"
          >
            {deletingSelected ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="whitespace-nowrap">Xóa đã chọn ({selectedIds.length})</span>
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Thêm cư dân mới
          </button>
        </div>
      </div>

      {/* Residents tab shows all residents (no filters) */}

      {successMessage && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 flex items-center justify-center text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Đang tải dữ liệu...
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {residents.length === 0
              ? 'Chưa có cư dân nào trong hệ thống'
              : 'Không tìm thấy cư dân phù hợp'}
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Chọn</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Căn hộ</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Duyệt</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10 min-w-[240px]">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResidents.map((resident) => (
                  <tr
                    key={resident.id}
                    className="hover:bg-gray-50 relative"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-red-600"
                        checked={selectedIds.includes(resident.id)}
                        onChange={(e) => toggleSelected(resident.id, e.target.checked)}
                        aria-label={`Chọn cư dân ${resident.fullName || ''} để xóa`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resident.apartment?.name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{resident.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{resident.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-600">
                      {resident.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          resident.approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {resident.approved ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm sticky right-0 bg-white z-10 min-w-[240px] border-l-2 border-gray-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        {resident.role === 'resident' && !resident.approved && (
                          <button
                            onClick={() => handleApprove(resident.id)}
                            disabled={approvingId === resident.id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            title="Duyệt tài khoản cư dân"
                          >
                            {approvingId === resident.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang duyệt...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Duyệt</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(resident)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Edit2 className="w-4 h-4" />
                          Sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-[60vw] max-w-5xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-gray-900 mb-1 text-lg font-semibold leading-tight">
                  Thêm cư dân mới
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed">
              Điền thông tin cư dân. Vai trò khác cư dân có thể bỏ trống căn hộ.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
              {successMessage && (
                <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm">{successMessage}</div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Họ và tên</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0901234567"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Số CMND/CCCD</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      placeholder="001234567890"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Vai trò</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    aria-label="Chọn vai trò cư dân"
                  >
                    {residentRoles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ngày sinh</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      aria-label="Chọn ngày sinh"
                      required
                    />
                  </div>
                </div>
              </div>

              {formData.role === 'resident' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Căn hộ</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.apartmentId}
                    onChange={(e) => setFormData({ ...formData, apartmentId: e.target.value })}
                    aria-label="Chọn căn hộ"
                  >
                    <option value="">-- Chọn căn hộ --</option>
                    {apartments.map((apt) => (
                      <option key={apt.id || apt.ID_Apartment || apt.ID_apartment} value={apt.id || apt.ID_Apartment || apt.ID_apartment}>
                        {apt.name || apt.Name || `Căn hộ ${apt.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  Tạo cư dân
                </button>
              </div>
            </form>
      </div>
        </div>
      )}
    </div>
  );
}

