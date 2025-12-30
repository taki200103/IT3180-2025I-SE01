import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, X } from 'lucide-react';
import { InvoicesService } from '../../../api/services/InvoicesService';
import { ServicesService } from '../../../api/services/ServicesService';
import { ResidentsService } from '../../../api/services/ResidentsService';
import { ApartmentsService } from '../../../api/services/ApartmentsService';
import type { CreateInvoiceDto } from '../../../api/models/CreateInvoiceDto';
import type { InvoiceResponseDto } from '../../../api/models/InvoiceResponseDto';

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

export default function InvoicesView() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [residents, setResidents] = useState<ResidentRecord[]>([]);
  const [apartments, setApartments] = useState<ApartmentRecord[]>([]);
  const [formData, setFormData] = useState({
    residentId: '',
    serviceId: '',
    name: '',
    money: '',
    kWh: '',
    waterM3: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectAllResidents, setSelectAllResidents] = useState(false);
  const [previewAmount, setPreviewAmount] = useState<number | null>(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await InvoicesService.invoiceControllerFindAll();
      const list = Array.isArray(data) ? data : [];
      setInvoices(list);
    } catch (err) {
      console.error('Failed to load invoices', err);
      setError('Không thể tải danh sách hóa đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const ensureReferenceData = useCallback(async () => {
    try {
      if (services.length === 0) {
        const serviceData = await ServicesService.serviceControllerFindAll();
        setServices(Array.isArray(serviceData) ? serviceData : []);
      }
      
      // Load apartments trước để có thông tin ownerId và area
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
        
        // Gắn thông tin apartment vào residents nếu đã load apartments
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
  }, [services.length, residents.length, apartments]);

  useEffect(() => {
    if (isModalOpen) {
      ensureReferenceData();
    }
  }, [isModalOpen, ensureReferenceData]);

  // Cập nhật residents khi apartments được load
  useEffect(() => {
    if (apartments.length > 0 && residents.length > 0) {
      const residentsWithApartment = residents.map((resident: any) => {
        const apartment = apartments.find((apt: any) => apt.id === (resident.apartmentId || resident.apartment?.id));
        return {
          ...resident,
          apartment: apartment || resident.apartment,
        };
      });
      // Chỉ cập nhật nếu có thay đổi
      const hasChanges = residentsWithApartment.some((r, i) => {
        const oldApt = residents[i]?.apartment;
        const newApt = r.apartment;
        return oldApt?.id !== newApt?.id || oldApt?.ownerId !== newApt?.ownerId || oldApt?.area !== newApt?.area;
      });
      if (hasChanges) {
        setResidents(residentsWithApartment);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartments]);

  const resetForm = () => {
    setFormData({
      residentId: '',
      serviceId: '',
      name: '',
      money: '',
      kWh: '',
      waterM3: '',
    });
    setSelectAllResidents(false);
    setError('');
    setPreviewAmount(null);
  };

  // Tính tiền điện theo bậc thang (chỉ để preview)
  const calculateElectricityCost = (kWh: number): number => {
    let total = 0;
    let remaining = kWh;

    // Bậc 1 (0 - 50 kWh): 1.984 đồng/kWh
    if (remaining > 0) {
      const tier1 = Math.min(remaining, 50);
      total += tier1 * 1984;
      remaining -= tier1;
    }

    // Bậc 2 (51 - 100 kWh): 2.050 đồng/kWh
    if (remaining > 0) {
      const tier2 = Math.min(remaining, 50);
      total += tier2 * 2050;
      remaining -= tier2;
    }

    // Bậc 3 (101 - 200 kWh): 2.380 đồng/kWh
    if (remaining > 0) {
      const tier3 = Math.min(remaining, 100);
      total += tier3 * 2380;
      remaining -= tier3;
    }

    // Bậc 4 (201 - 300 kWh): 2.998 đồng/kWh
    if (remaining > 0) {
      const tier4 = Math.min(remaining, 100);
      total += tier4 * 2998;
      remaining -= tier4;
    }

    // Bậc 5 (301 - 400 kWh): 3.350 đồng/kWh
    if (remaining > 0) {
      const tier5 = Math.min(remaining, 100);
      total += tier5 * 3350;
      remaining -= tier5;
    }

    // Bậc 6 (401 kWh trở lên): 3.460 đồng/kWh
    if (remaining > 0) {
      total += remaining * 3460;
    }

    return total;
  };

  // Lọc residents - luôn chỉ hiển thị chủ hộ (owners)
  const filteredResidents = useMemo(() => {
    // Luôn chỉ hiển thị residents là owners
    return residents.filter((resident) => {
      const apartment = apartments.find((apt) => apt.id === (resident.apartmentId || resident.apartment?.id));
      return apartment && apartment.ownerId === resident.id;
    });
  }, [residents, apartments]);

  // Tính toán số tiền preview
  useEffect(() => {
    const serviceId = Number(formData.serviceId);
    const selectedResident = filteredResidents.find((r) => r.id === formData.residentId);
    
    if (!serviceId) {
      setPreviewAmount(null);
      return;
    }

    const apartment = apartments.find((apt) => apt.id === (selectedResident?.apartmentId || selectedResident?.apartment?.id));
    
    switch (serviceId) {
      case 1: // "Phí dịch vụ" - 13k/m²
        if (apartment?.area) {
          setPreviewAmount(13000 * apartment.area);
        } else {
          setPreviewAmount(null);
        }
        break;
      case 2: // "Phí quản lí" - 7k/m²
        if (apartment?.area) {
          setPreviewAmount(7000 * apartment.area);
        } else {
          setPreviewAmount(null);
        }
        break;
      case 3: // "Phí khác" - nhập tay
        if (formData.money && !isNaN(Number(formData.money))) {
          setPreviewAmount(Number(formData.money));
        } else {
          setPreviewAmount(null);
        }
        break;
      case 4: // "Phí điện" - tính theo bậc thang
        if (formData.kWh && !isNaN(Number(formData.kWh)) && Number(formData.kWh) >= 0) {
          setPreviewAmount(calculateElectricityCost(Number(formData.kWh)));
        } else {
          setPreviewAmount(null);
        }
        break;
      case 5: // "Phí nước" - m³ * 10000
        if (formData.waterM3 && !isNaN(Number(formData.waterM3)) && Number(formData.waterM3) >= 0) {
          setPreviewAmount(Number(formData.waterM3) * 10000);
        } else {
          setPreviewAmount(null);
        }
        break;
      case 6: // "Internet" - cố định 200k
        setPreviewAmount(200000);
        break;
      default:
        setPreviewAmount(null);
    }
  }, [formData.serviceId, formData.residentId, formData.money, formData.kWh, formData.waterM3, filteredResidents, apartments]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceId = Number(formData.serviceId);
    const ownerOnlyServices = [1, 2, 3, 4, 5, 6];

    // Validation cơ bản - backend sẽ validate chi tiết
    if ((!selectAllResidents && !formData.residentId) || !serviceId || !formData.name.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const residentsToProcess = selectAllResidents 
        ? filteredResidents // Khi chọn tất cả, dùng filteredResidents (chủ hộ)
        : [filteredResidents.find((r) => r.id === formData.residentId)].filter(Boolean) as ResidentRecord[];

      if (residentsToProcess.length === 0) {
        setError('Không có cư dân phù hợp để tạo hóa đơn.');
        setIsSubmitting(false);
        return;
      }

      const createPromises = residentsToProcess.map((resident) => {
        const payload: CreateInvoiceDto = {
          residentId: resident.id,
          serviceId,
          name: formData.name.trim(),
        };

        // Thêm các trường tùy chọn
        if (serviceId === 3) {
          payload.money = Number(formData.money);
        } else if (serviceId === 4) {
          payload.kWh = Number(formData.kWh);
        } else if (serviceId === 5) {
          payload.waterM3 = Number(formData.waterM3);
        }

        return InvoicesService.invoiceControllerCreate(payload);
      });

      const createdInvoices = await Promise.all(createPromises);
      setInvoices((prev) => [...createdInvoices, ...prev]);

      setIsModalOpen(false);
      resetForm();
      loadInvoices();
    } catch (err: any) {
      console.error('Create invoice failed', err);
      const errorMessage = err?.body?.message || err?.message || 'Không thể tạo hóa đơn. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceChange = (value: string) => {
    const selected = services.find((svc) => String(svc.id ?? svc.ID_khoan_thu) === value);
    const serviceId = Number(value);
    
    setFormData((prev) => ({
      ...prev,
      serviceId: value,
      name: prev.name || (selected ? `Hóa đơn ${selected.name}` : ''),
      money: serviceId === 3 ? prev.money : '', // Chỉ giữ money cho service 3
      kWh: serviceId === 4 ? prev.kWh : '', // Chỉ giữ kWh cho service 4
      waterM3: serviceId === 5 ? prev.waterM3 : '', // Chỉ giữ waterM3 cho service 5
    }));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý hóa đơn</h2>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý hóa đơn</p>
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Tạo hóa đơn
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Đang tải hóa đơn...
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-6 text-red-600">{error}</div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
          Chưa có hóa đơn nào.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Mã hóa đơn</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Cư dân</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Tên phiếu</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.resident?.fullName || invoice.residentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {invoice.service?.name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(invoice.money)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                              ? 'bg-blue-100 text-blue-800'
                              : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {invoice.status === 'paid'
                            ? 'Đã thanh toán'
                            : invoice.status === 'pending'
                            ? 'Chờ duyệt'
                            : invoice.status === 'overdue'
                            ? 'Quá hạn'
                            : 'Chưa thanh toán'}
                        </span>
                        {invoice.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={async () => {
                                try {
                                  await InvoicesService.invoiceControllerApproveInvoice(invoice.id);
                                  // Reload danh sách
                                  const data = await InvoicesService.invoiceControllerFindAll();
                                  const list = Array.isArray(data) ? data : [];
                                  setInvoices(list);
                                } catch (err) {
                                  console.error('Failed to approve invoice', err);
                                  alert('Không thể duyệt hóa đơn. Vui lòng thử lại.');
                                }
                              }}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              title="Duyệt"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await InvoicesService.invoiceControllerRejectInvoice(invoice.id);
                                  // Reload danh sách
                                  const data = await InvoicesService.invoiceControllerFindAll();
                                  const list = Array.isArray(data) ? data : [];
                                  setInvoices(list);
                                } catch (err) {
                                  console.error('Failed to reject invoice', err);
                                  alert('Không thể từ chối hóa đơn. Vui lòng thử lại.');
                                }
                              }}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                              title="Từ chối"
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative border-2 border-yellow-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-gray-900 text-lg font-semibold leading-tight">Tạo hóa đơn</h3>
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
            <p className="text-gray-500 text-sm mb-4">Chọn cư dân và dịch vụ để tạo hóa đơn thanh toán.</p>

            {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 border-2 border-yellow-300 p-4 rounded-lg">
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
                          setFormData({ ...formData, residentId: '' });
                        }
                      }}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Chọn tất cả cư dân</span>
                  </label>
                </div>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.residentId}
                  onChange={(e) => {
                    setFormData({ ...formData, residentId: e.target.value });
                    if (e.target.value) {
                      setSelectAllResidents(false);
                    }
                  }}
                  required={!selectAllResidents}
                  disabled={selectAllResidents}
                  aria-label="Chọn cư dân"
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
                    Sẽ tạo hóa đơn cho tất cả {filteredResidents.length} chủ hộ
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ hiển thị chủ căn hộ (owner)
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Khoản thu <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  required
                  aria-label="Chọn khoản thu"
                >
                  <option value="">-- Chọn khoản thu --</option>
                  {services.map((service) => (
                    <option key={service.id || service.ID_khoan_thu} value={service.id || service.ID_khoan_thu}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {previewAmount !== null && Number(formData.serviceId) > 0 && (
                  <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Số tiền dự kiến:</span>
                      <span className="text-lg font-bold text-green-700">{formatPrice(previewAmount)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Tên hóa đơn <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Phí dịch vụ tháng 12"
                  required
                />
              </div>

              {/* Hiển thị các trường input dựa trên service */}
              {Number(formData.serviceId) === 1 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Phí dịch vụ:</strong> Sẽ tự động tính 13,000 VNĐ/m² dựa trên diện tích căn hộ
                  </p>
                </div>
              )}

              {Number(formData.serviceId) === 2 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Phí quản lí:</strong> Sẽ tự động tính 7,000 VNĐ/m² dựa trên diện tích căn hộ
                  </p>
                </div>
              )}

              {Number(formData.serviceId) === 3 && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Số tiền <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.money}
                    onChange={(e) => setFormData({ ...formData, money: e.target.value })}
                    placeholder="Nhập số tiền"
                    required
                  />
                </div>
              )}

              {Number(formData.serviceId) === 4 && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Số kWh điện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.kWh}
                    onChange={(e) => setFormData({ ...formData, kWh: e.target.value })}
                    placeholder="Nhập số kWh"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số tiền sẽ được tính tự động theo bậc thang khi tạo hóa đơn
                  </p>
                </div>
              )}

              {Number(formData.serviceId) === 5 && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Số m³ nước <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.waterM3}
                    onChange={(e) => setFormData({ ...formData, waterM3: e.target.value })}
                    placeholder="Nhập số m³"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số tiền = số m³ × 10,000 VNĐ
                  </p>
                </div>
              )}

              {Number(formData.serviceId) === 6 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Internet:</strong> Cố định 200,000 VNĐ
                  </p>
                </div>
              )}

              {/* Hiển thị số tiền cho các service khác */}
              {![1, 2, 3, 4, 5, 6].includes(Number(formData.serviceId)) && Number(formData.serviceId) > 0 && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Số tiền <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.money}
                    onChange={(e) => setFormData({ ...formData, money: e.target.value })}
                    placeholder="Nhập số tiền"
                    required
                  />
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
                  Tạo hóa đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

