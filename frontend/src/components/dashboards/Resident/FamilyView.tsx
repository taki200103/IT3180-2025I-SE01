import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ResidentsService, ApartmentsService, OpenAPI, ApiError } from '../../../api';

export default function FamilyView() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          OpenAPI.TOKEN = token;
        }

        // Lấy thông tin căn hộ để có ownerId
        const apartmentId = user?.apartment;
        let apartmentOwnerId: string | null = null;
        
        if (apartmentId) {
          try {
            const apartment = await ApartmentsService.apartmentControllerFindOne(apartmentId);
            apartmentOwnerId = apartment?.ownerId || apartment?.ownerID || null;
            setOwnerId(apartmentOwnerId);
          } catch (apartmentErr) {
            console.warn('Không thể lấy thông tin căn hộ:', apartmentErr);
          }
        }

        // Lấy tất cả residents và filter theo apartmentId
        const allResidents = await ResidentsService.residentControllerFindAll();
        
        // Filter các thành viên cùng căn hộ
        const familyMembers = Array.isArray(allResidents) 
          ? allResidents.filter((resident: any) => {
              const residentId = resident.id || resident._id;
              const residentApartmentId = resident.apartmentId || resident.apartment?.id;
              return residentApartmentId === apartmentId;
            })
          : [];

        // Sắp xếp: chủ hộ trước, sau đó là các thành viên khác
        const sortedMembers = familyMembers.sort((a: any, b: any) => {
          const aId = a.id || a._id;
          const bId = b.id || b._id;
          const aIsOwner = apartmentOwnerId && aId === apartmentOwnerId;
          const bIsOwner = apartmentOwnerId && bId === apartmentOwnerId;
          
          if (aIsOwner && !bIsOwner) return -1;
          if (!aIsOwner && bIsOwner) return 1;
          return 0;
        });

        setMembers(sortedMembers);
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách thành viên:', err);
        setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tải danh sách thành viên');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFamilyMembers();
    }
  }, [user]);

  const handleRegisterTemporary = async (memberId: string, memberName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn đăng ký tạm trú cho ${memberName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        OpenAPI.TOKEN = token;
      }

      await ResidentsService.residentControllerUpdate(memberId, {
        temporaryStatus: true,
      });

      setSuccess(`Đã đăng ký tạm trú thành công cho ${memberName}`);
      setTimeout(() => setSuccess(''), 3000);

      // Refresh danh sách
      const apartmentId = user?.apartment;
      let apartmentOwnerId: string | null = ownerId;
      
      if (apartmentId && !apartmentOwnerId) {
        try {
          const apartment = await ApartmentsService.apartmentControllerFindOne(apartmentId);
          apartmentOwnerId = apartment?.ownerId || apartment?.ownerID || null;
          setOwnerId(apartmentOwnerId);
        } catch (apartmentErr) {
          console.warn('Không thể lấy thông tin căn hộ:', apartmentErr);
        }
      }

      const allResidents = await ResidentsService.residentControllerFindAll();
      const familyMembers = Array.isArray(allResidents) 
        ? allResidents.filter((resident: any) => {
            const residentApartmentId = resident.apartmentId || resident.apartment?.id;
            return residentApartmentId === apartmentId;
          })
        : [];

      // Sắp xếp lại
      const sortedMembers = familyMembers.sort((a: any, b: any) => {
        const aId = a.id || a._id;
        const bId = b.id || b._id;
        const aIsOwner = apartmentOwnerId && aId === apartmentOwnerId;
        const bIsOwner = apartmentOwnerId && bId === apartmentOwnerId;
        
        if (aIsOwner && !bIsOwner) return -1;
        if (!aIsOwner && bIsOwner) return 1;
        return 0;
      });
      
      setMembers(sortedMembers);
    } catch (err: any) {
      setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể đăng ký tạm trú');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error && !members.length) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Quản lý gia đình</h2>
        <p className="text-gray-600 mt-1">Thông tin các thành viên trong gia đình</p>
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

      {members.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Chưa có thông tin thành viên trong căn hộ
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {members.map((member) => {
            const memberId = member.id || member._id;
            const isOwner = ownerId && memberId === ownerId;
            const isTemporary = member.temporaryStatus === true;
            
            return (
              <div key={memberId} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isOwner ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">{member.fullName || member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {isOwner ? 'Chủ hộ' : isTemporary ? 'Tạm vắng' : 'Thành viên'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {member.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="text-gray-900">{member.phone}</span>
                    </div>
                  )}
                  {member.birthDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày sinh:</span>
                      <span className="text-gray-900">
                        {new Date(member.birthDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                  {member.idNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">CMND/CCCD:</span>
                      <span className="text-gray-900">{member.idNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`font-medium ${isTemporary ? 'text-orange-600' : 'text-green-600'}`}>
                      {isTemporary ? 'Tạm vắng' : 'Đang cư trú'}
                    </span>
                  </div>
                </div>
                {!isTemporary && !isOwner && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleRegisterTemporary(memberId, member.fullName || member.name)}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm"
                    >
                      Đăng ký tạm trú
                    </button>
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

