import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, X, Plus, Users } from 'lucide-react';
import { DonatesService, type DonateResponseDto, type CreateDonateDto } from '../../../api/services/DonatesService';
import { ResidentsService } from '../../../api/services/ResidentsService';
import { ApartmentsService } from '../../../api/services/ApartmentsService';

interface ResidentRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  temporaryStatus: boolean;
  apartmentId?: string;
  apartment?: { id?: string; name?: string; ownerId?: string; area?: number };
}

interface ApartmentRecord {
  id: string;
  name: string;
  ownerId: string;
  area: number;
}

export default function DonatesView() {
  const [donates, setDonates] = useState<DonateResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDonate, setSelectedDonate] = useState<DonateResponseDto | null>(null);
  const [residents, setResidents] = useState<ResidentRecord[]>([]);
  const [apartments, setApartments] = useState<ApartmentRecord[]>([]);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    money: '',
    description: '',
  });
  const [assignFormData, setAssignFormData] = useState({
    residentId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectAllResidents, setSelectAllResidents] = useState(false);

  const loadDonates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await DonatesService.donateControllerFindAll();
      const list = Array.isArray(data) ? data : [];
      setDonates(list);
    } catch (err) {
      console.error('Failed to load donates', err);
      setError('Không thể tải danh sách quyên góp. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonates();
  }, [loadDonates]);

  const ensureReferenceData = useCallback(async () => {
    try {
      // Load apartments trước
      if (apartments.length === 0) {
        try {
          const apartmentData = await ApartmentsService.apartmentControllerFindAll();
          const apartmentsList = Array.isArray(apartmentData) ? apartmentData : [];
          setApartments(apartmentsList);
        } catch (aptErr) {
          console.error('Failed to load apartments', aptErr);
        }
      }
      
      if (residents.length === 0) {
        const residentData = await ResidentsService.residentControllerFindAll();
        const residentsList = Array.isArray(residentData) ? residentData : [];
        
        const apartmentsList = apartments.length > 0 ? apartments : [];
        const residentsWithApartment = residentsList.map((resident: any) => {
          const apartment = apartmentsList.find((apt: any) => apt.id === (resident.apartmentId || resident.apartment?.id));
          return {
            ...resident,
            apartment: apartment || resident.apartment,
          };
        });
        setResidents(residentsWithApartment);
      }
    } catch (err) {
      console.error('Failed to load reference data', err);
    }
  }, [residents.length, apartments.length, apartments]);

  useEffect(() => {
    if (isCreateModalOpen || isAssignModalOpen) {
      ensureReferenceData();
    }
  }, [isCreateModalOpen, isAssignModalOpen, ensureReferenceData]);

  // Lọc residents - chỉ hiển thị chủ hộ (owners)
  const filteredResidents = React.useMemo(() => {
    return residents.filter((resident) => {
      const apartment = apartments.find((apt) => apt.id === (resident.apartmentId || resident.apartment?.id));
      return apartment && apartment.ownerId === resident.id;
    });
  }, [residents, apartments]);

  const resetCreateForm = () => {
    setCreateFormData({
      name: '',
      money: '',
      description: '',
    });
    setError('');
  };

  const resetAssignForm = () => {
    setAssignFormData({
      residentId: '',
    });
    setSelectAllResidents(false);
    setError('');
  };

  const handleCreateDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const money = Number(createFormData.money);

    if (!createFormData.name.trim() || isNaN(money) || money <= 0) {
      setError('Vui lòng nhập đầy đủ thông tin hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload: CreateDonateDto = {
        name: createFormData.name.trim(),
        money,
        description: createFormData.description.trim() || undefined,
      };

      await DonatesService.donateControllerCreate(payload);
      setIsCreateModalOpen(false);
      resetCreateForm();
      loadDonates();
    } catch (err: any) {
      console.error('Create donate failed', err);
      const errorMessage = err?.body?.message || err?.message || 'Không thể tạo quyên góp. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignResidents = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonate) return;

    const residentsToAssign = selectAllResidents
      ? filteredResidents
      : [filteredResidents.find((r) => r.id === assignFormData.residentId)].filter(Boolean) as ResidentRecord[];

    if (residentsToAssign.length === 0) {
      setError('Không có cư dân phù hợp để gán.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const promises = residentsToAssign.map((resident) =>
        DonatesService.donateControllerAddResident(selectedDonate.id, {
          residentId: resident.id,
          status: 'pending',
        })
      );

      await Promise.all(promises);
      setIsAssignModalOpen(false);
      resetAssignForm();
      setSelectedDonate(null);
      loadDonates();
    } catch (err: any) {
      console.error('Assign residents failed', err);
      const errorMessage = err?.body?.message || err?.message || 'Không thể gán cư dân. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveResident = async (donateId: string, residentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cư dân khỏi quyên góp này?')) {
      return;
    }

    try {
      await DonatesService.donateControllerRemoveResident(donateId, residentId);
      loadDonates();
    } catch (err) {
      console.error('Remove resident failed', err);
      alert('Không thể xóa cư dân. Vui lòng thử lại.');
    }
  };


  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending':
      default:
        return 'Chờ duyệt';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý quyên góp</h2>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý các khoản ủng hộ</p>
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Tạo quyên góp mới
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Đang tải danh sách quyên góp...
        </div>
      ) : error && !isCreateModalOpen && !isAssignModalOpen ? (
        <div className="bg-white rounded-lg shadow p-6 text-red-600">{error}</div>
      ) : donates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
          Chưa có quyên góp nào.
        </div>
      ) : (
        <div className="space-y-4">
          {donates.map((donate) => (
            <div key={donate.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{donate.name}</h3>
                  {donate.description && (
                    <p className="text-gray-600 mt-1">{donate.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {formatPrice(donate.money)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(donate.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  onClick={() => {
                    setSelectedDonate(donate);
                    setIsAssignModalOpen(true);
                  }}
                >
                  <Users className="w-4 h-4" />
                  Gán cư dân
                </button>
              </div>

              {donate.residents && donate.residents.length > 0 ? (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Danh sách cư dân tham gia ({donate.residents.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Cư dân</th>
                          <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Trạng thái</th>
                          <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donate.residents.map((dr) => (
                          <tr key={`${dr.donateId}-${dr.residentId}`}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {dr.resident?.fullName || dr.residentId}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {dr.resident?.email || '—'}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dr.status)}`}>
                                {getStatusLabel(dr.status)}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleRemoveResident(dr.donateId, dr.residentId)}
                                className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-4 border-t pt-4 text-sm text-gray-500">
                  Chưa có cư dân nào tham gia quyên góp này.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal tạo quyên góp mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-900 text-lg font-semibold">Tạo quyên góp mới</h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetCreateForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleCreateDonate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Tên quyên góp <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  placeholder="Ví dụ: Quyên góp từ thiện"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Số tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={createFormData.money}
                  onChange={(e) => setCreateFormData({ ...createFormData, money: e.target.value })}
                  placeholder="1000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  placeholder="Mô tả về quyên góp..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetCreateForm();
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
                  Tạo quyên góp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal gán cư dân */}
      {isAssignModalOpen && selectedDonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">Gán cư dân vào quyên góp</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedDonate.name}</p>
              </div>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  resetAssignForm();
                  setSelectedDonate(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleAssignResidents} className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <label className="block text-sm text-gray-700">
                    Cư dân <span className="text-red-500">*</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectAllResidents}
                      onChange={(e) => {
                        setSelectAllResidents(e.target.checked);
                        if (e.target.checked) {
                          setAssignFormData({ ...assignFormData, residentId: '' });
                        }
                      }}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Chọn tất cả cư dân</span>
                  </label>
                </div>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={assignFormData.residentId}
                  onChange={(e) => {
                    setAssignFormData({ ...assignFormData, residentId: e.target.value });
                    if (e.target.value) {
                      setSelectAllResidents(false);
                    }
                  }}
                  required={!selectAllResidents}
                  disabled={selectAllResidents}
                >
                  <option value="">-- Chọn cư dân --</option>
                  {filteredResidents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.fullName} ({resident.apartment?.name || 'N/A'})
                    </option>
                  ))}
                </select>
                {selectAllResidents && (
                  <p className="text-xs text-blue-600 mt-1">
                    Sẽ gán cho tất cả {filteredResidents.length} chủ hộ
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ hiển thị chủ căn hộ (owner)
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    resetAssignForm();
                    setSelectedDonate(null);
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
                  Gán cư dân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

