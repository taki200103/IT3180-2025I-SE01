import React, { useState, useEffect } from 'react';
import { Loader2, X, Copy, Check, Download } from 'lucide-react';
import QRCodeSVG from 'react-qr-code';
import * as XLSX from 'xlsx';
import { useAuth } from '../../../context/AuthContext';
import { DonatesService } from '../../../api/services/DonatesService';
import { OpenAPI, ApiError } from '../../../api';
import type { DonateResponseDto } from '../../../api/services/DonatesService';
import { base64 } from '../../../api/core/request';

interface DonateGroup {
  donateId: string;
  donate: DonateResponseDto;
  status: string;
  amount: number;
}

export default function DonatesView() {
  const { user } = useAuth();
  const [donates, setDonates] = useState<DonateResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donateGroups, setDonateGroups] = useState<DonateGroup[]>([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalApproved: 0,
    pendingCount: 0,
  });
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDonate, setSelectedDonate] = useState<DonateResponseDto | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchDonates = async () => {
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
        const donatesData = await DonatesService.donateControllerGetAllByResidentId(residentId);
        
        const donatesList = Array.isArray(donatesData) ? donatesData : [];
        setDonates(donatesList);

        // Tạo groups từ donates và residents
        const groups: DonateGroup[] = [];
        donatesList.forEach((donate) => {
          const residentDonate = donate.residents?.find((dr) => dr.residentId === residentId);
          if (residentDonate) {
            groups.push({
              donateId: donate.id,
              donate,
              status: residentDonate.status,
              amount: donate.money,
            });
          }
        });

        setDonateGroups(groups);

        // Tính toán thống kê
        const totalDonated = groups.reduce((sum, group) => {
          if (group.status === 'approved') {
            return sum + group.amount;
          }
          return sum;
        }, 0);

        const totalApproved = groups.filter((g) => g.status === 'approved').length;
        const pendingCount = groups.filter((g) => g.status === 'pending').length;

        setStats({
          totalDonated,
          totalApproved,
          pendingCount,
        });
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách quyên góp:', err);
        setError(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể tải danh sách quyên góp');
      } finally {
        setLoading(false);
      }
    };

    fetchDonates();
  }, [user]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} triệu`;
    }
    return `${amount.toLocaleString('vi-VN')} đ`;
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

  // Hàm lấy thông tin ngân hàng từ config
  const getBankInfo = () => {
    // @ts-ignore - Vite env variable
    const bankCode = import.meta.env?.VITE_VIETQR_BANK_CODE || 'BIDV';
    // @ts-ignore - Vite env variable
    const bankAccount = import.meta.env?.VITE_VIETQR_BANK_ACCOUNT || '3902047963';
    // @ts-ignore - Vite env variable
    const userBankName = import.meta.env?.VITE_VIETQR_USER_BANK_NAME || 'NGUYEN HUY HOANG';
    return { bankCode, bankAccount, userBankName };
  };

  const generatePaymentContent = (donate: DonateResponseDto) => {
    const donateId = donate.id.substring(0, 8).toUpperCase();
    const residentName = user?.fullName || 'Cư dân';
    return `ND ${donateId} ${residentName}`;
  };

  // Lấy token từ VietQR API
  const getVietQRToken = async (): Promise<string> => {
    try {
      // @ts-ignore - Vite env variable
      const username = import.meta.env?.VITE_VIETQR_USERNAME || 'customer-taki2003-user25468';
      // @ts-ignore - Vite env variable
      const password = import.meta.env?.VITE_VIETQR_PASSWORD || 'Y3VzdG9tZXItdGFraTIwMDMtdXNlcjI1NDY4';
      
      const raw = `${username}:${password}`;
      const credentials = base64(raw);
      
      const tokenUrl = 'https://dev.vietqr.org/vqr/api/token_generate';
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get token: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        if (typeof data === 'string') {
          return data;
        }
        return data.token || data.access_token || data.accessToken || data.data || responseText;
      } catch {
        return responseText.trim();
      }
    } catch (error: any) {
      console.error('Error getting VietQR token:', error);
      throw new Error(`Không thể lấy token: ${error.message}`);
    }
  };

  // Tạo QR code từ VietQR API
  const generateVietQRCode = async (donate: DonateResponseDto): Promise<string> => {
    try {
      setQrLoading(true);
      setQrError(null);

      const token = await getVietQRToken();

      const amount = donate.money;
      const content = generatePaymentContent(donate);
      
      const removeVietnameseTones = (str: string): string => {
        return str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .substring(0, 23);
      };

      const cleanContent = removeVietnameseTones(content);
      
      const { bankCode, bankAccount, userBankName: configUserBankName } = getBankInfo();
      
      const residentName = configUserBankName || user?.fullName || user?.name || 'NGUYEN HUY HOANG';
      const finalUserBankName = removeVietnameseTones(residentName);
      
      const orderId = donate.id.substring(0, 13).toUpperCase();

      const qrData = {
        bankCode: bankCode,
        bankAccount: bankAccount,
        userBankName: finalUserBankName,
        content: cleanContent,
        qrType: 0,
        amount: amount,
        orderId: orderId,
        transType: 'C',
      };

      const response = await fetch('https://dev.vietqr.org/vqr/api/qr/generate-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(qrData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to generate QR: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('VietQR API Response:', JSON.stringify(data, null, 2));
      
      const findValue = (obj: any, keys: string[]): any => {
        for (const key of keys) {
          if (obj[key] !== undefined && obj[key] !== null) {
            return obj[key];
          }
        }
        return null;
      };
      
      const imageUrlKeys = ['qrLink', 'qrDataURL', 'url', 'link', 'qrCodeUrl'];
      const imageBase64Keys = ['qrDataURL', 'image', 'data', 'qrImage'];
      const stringKeys = ['qrCode', 'qrString', 'qrStringData', 'qrData', 'qr', 'qrCodeString', 'code'];
      
      let qrImage = findValue(data, imageUrlKeys);
      if (!qrImage) {
        qrImage = findValue(data, imageBase64Keys);
      }
      let qrString = findValue(data, stringKeys);
      
      if (qrImage && typeof qrImage === 'object') {
        qrImage = findValue(qrImage, imageUrlKeys) || findValue(qrImage, imageBase64Keys) || findValue(qrImage, stringKeys) || qrImage.toString();
      }
      if (qrString && typeof qrString === 'object') {
        qrString = findValue(qrString, stringKeys) || qrString.toString();
      }
      
      const apiQrLink = data.qrLink || data.qrLinkUrl || data.link;
      if (apiQrLink && typeof apiQrLink === 'string') {
        setQrLink(apiQrLink);
      }
      
      if (qrImage && typeof qrImage === 'string') {
        if (qrImage.startsWith('http://') || qrImage.startsWith('https://')) {
          console.log('Using QR code URL:', qrImage);
          if (!apiQrLink) {
            setQrLink(qrImage);
          }
          return qrImage;
        }
        
        if (!qrImage.startsWith('data:') && qrImage.length > 50) {
          qrImage = `data:image/png;base64,${qrImage}`;
        }
        
        console.log('Using QR code image (base64/URL)');
        return qrImage;
      }
      
      if (qrString && typeof qrString === 'string' && qrString.length > 0) {
        console.log('Using QR code string:', qrString.substring(0, 50) + '...');
        return `QR_STRING:${qrString}`;
      }
      
      console.error('Không tìm thấy QR code trong response. Available keys:', Object.keys(data));
      
      const fallbackQr = `${getBankInfo().bankAccount}|${amount}|${cleanContent}`;
      return `QR_STRING:${fallbackQr}`;
    } catch (error: any) {
      console.error('Error generating VietQR code:', error);
      setQrError(error.message || 'Không thể tạo mã QR. Vui lòng thử lại.');
      throw error;
    } finally {
      setQrLoading(false);
    }
  };

  const generateQRCodeData = (donate: DonateResponseDto) => {
    const amount = donate.money;
    const content = generatePaymentContent(donate);
    const { bankAccount } = getBankInfo();
    return `${bankAccount}|${amount}|${content}`;
  };

  const handleOpenPaymentModal = async (donate: DonateResponseDto) => {
    setSelectedDonate(donate);
    setPaymentModalOpen(true);
    setQrCodeImage(null);
    setQrError(null);
    setQrLink(null);
    
    try {
      const qrImage = await generateVietQRCode(donate);
      setQrCodeImage(qrImage);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedDonate || !user?.id) return;

    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        OpenAPI.TOKEN = token;
      }

      await DonatesService.donateControllerUpdateResidentStatus(selectedDonate.id, user.id, {
        status: 'approved',
      });

      // Reload danh sách quyên góp
      const donatesData = await DonatesService.donateControllerGetAllByResidentId(user.id);
      const donatesList = Array.isArray(donatesData) ? donatesData : [];
      setDonates(donatesList);

      // Cập nhật lại groups và stats
      const groups: DonateGroup[] = [];
      donatesList.forEach((donate) => {
        const residentDonate = donate.residents?.find((dr) => dr.residentId === user.id);
        if (residentDonate) {
          groups.push({
            donateId: donate.id,
            donate,
            status: residentDonate.status,
            amount: donate.money,
          });
        }
      });

      setDonateGroups(groups);

      const totalDonated = groups.reduce((sum, group) => {
        if (group.status === 'approved') {
          return sum + group.amount;
        }
        return sum;
      }, 0);

      const totalApproved = groups.filter((g) => g.status === 'approved').length;
      const pendingCount = groups.filter((g) => g.status === 'pending').length;

      setStats({
        totalDonated,
        totalApproved,
        pendingCount,
      });

      // Đóng modal
      setPaymentModalOpen(false);
      setSelectedDonate(null);
      setQrCodeImage(null);
      setQrError(null);
      setQrLink(null);
    } catch (err: any) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      alert(err instanceof ApiError ? (err.body?.message || err.message) : 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleExportDonate = (donate: DonateResponseDto) => {
    const residentDonate = donate.residents?.find((dr) => dr.residentId === user?.id);
    const sheetData = [
      ['Hóa đơn quyên góp'],
      ['Tên quyên góp', donate.name],
      ['Cư dân', user?.fullName || user?.username || ''],
      ['Ngày xuất', new Date().toLocaleString('vi-VN')],
      [],
      ['Mã quyên góp', 'Số tiền (đ)', 'Trạng thái', 'Ngày tạo'],
      [
        donate.id?.slice(0, 8).toUpperCase(),
        donate.money || 0,
        residentDonate?.status || 'pending',
        new Date(donate.createdAt).toLocaleDateString('vi-VN'),
      ],
      [],
      ['Tổng cộng', donate.money],
      ['Mô tả', donate.description || ''],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'QuyenGop');
    XLSX.writeFile(workbook, `Quyen-gop-${donate.id.substring(0, 8)}.xlsx`);
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
        <h2 className="text-gray-900">Quản lý quyên góp</h2>
        <p className="text-gray-600 mt-1">Theo dõi các khoản ủng hộ của bạn</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng đã ủng hộ</p>
          <p className="text-green-600 text-2xl mt-2">{formatCurrency(stats.totalDonated)}</p>
          <p className="text-gray-600 text-sm mt-1">Đã được duyệt</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Số khoản đã duyệt</p>
          <p className="text-gray-900 text-2xl mt-2">{stats.totalApproved}</p>
          <p className="text-gray-600 text-sm mt-1">Khoản quyên góp</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Đang chờ duyệt</p>
          <p className="text-yellow-600 text-2xl mt-2">{stats.pendingCount}</p>
          <p className="text-gray-600 text-sm mt-1">Khoản quyên góp</p>
        </div>
      </div>

      {donateGroups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Chưa có khoản quyên góp nào
        </div>
      ) : (
        <div className="space-y-4">
          {donateGroups.map((group) => (
            <div key={group.donateId} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 text-lg font-semibold">{group.donate.name}</h3>
                  {group.donate.description && (
                    <p className="text-gray-600 text-sm mt-1">{group.donate.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Ngày tạo: {new Date(group.donate.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <span className="text-gray-900 text-xl font-bold">
                    {formatCurrency(group.amount)}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(group.status)}`}>
                    {getStatusLabel(group.status)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => handleExportDonate(group.donate)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Xuất hóa đơn
                  </button>
                  {group.status === 'pending' && (
                    <div className="text-sm text-gray-600">
                      <span className="text-yellow-600">Đang chờ kế toán duyệt</span>
                    </div>
                  )}
                </div>
                {group.status === 'pending' && (
                  <button
                    onClick={() => handleOpenPaymentModal(group.donate)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    Thanh toán
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal thanh toán */}
      {paymentModalOpen && selectedDonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thanh toán quyên góp</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDonate.name}</p>
              </div>
              <button
                onClick={() => {
                  setPaymentModalOpen(false);
                  setSelectedDonate(null);
                  setQrCodeImage(null);
                  setQrError(null);
                  setQrLink(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* QR Code */}
              <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                {qrLoading ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <p className="text-xs text-gray-600 mt-2">Đang tạo mã QR...</p>
                  </div>
                ) : qrError ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                      <p className="text-xs text-red-700 text-center">{qrError}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedDonate) {
                          generateVietQRCode(selectedDonate).then(setQrCodeImage).catch(() => {});
                        }
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Thử lại
                    </button>
                    {/* Fallback to basic QR */}
                    <div className="mt-4">
                      <QRCodeSVG
                        value={generateQRCodeData(selectedDonate)}
                        size={160}
                        level="H"
                        includeMargin={true}
                      />
                      <p className="text-xs text-gray-600 mt-2">Mã QR dự phòng</p>
                    </div>
                  </div>
                ) : qrCodeImage ? (
                  <>
                    {qrCodeImage.startsWith('QR_STRING:') ? (
                      <>
                        <QRCodeSVG
                          value={qrCodeImage.replace('QR_STRING:', '')}
                          size={160}
                          level="H"
                          includeMargin={true}
                        />
                        <p className="text-xs text-gray-600 mt-2">Quét mã QR để thanh toán</p>
                        {qrLink && (
                          <a
                            href={qrLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 underline mt-1 break-all"
                          >
                            {qrLink}
                          </a>
                        )}
                        <button
                          onClick={() => {
                            if (selectedDonate) {
                              generateVietQRCode(selectedDonate).then(setQrCodeImage).catch(() => {});
                            }
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 underline mt-1"
                        >
                          Tải lại mã QR
                        </button>
                      </>
                    ) : (
                      <>
                        <img
                          src={qrCodeImage}
                          alt="VietQR Code"
                          className="w-40 h-40 object-contain bg-white"
                          onError={(e) => {
                            console.error('Error loading QR image:', e);
                            if (selectedDonate) {
                              const fallbackQr = generateQRCodeData(selectedDonate);
                              setQrCodeImage(`QR_STRING:${fallbackQr}`);
                            } else {
                              setQrError('Không thể tải ảnh QR code. Đang sử dụng mã QR dự phòng.');
                            }
                          }}
                        />
                        <p className="text-xs text-gray-600 mt-2">Quét mã QR để thanh toán</p>
                        {qrLink && (
                          <a
                            href={qrLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 underline mt-1 break-all"
                          >
                            {qrLink}
                          </a>
                        )}
                        <button
                          onClick={() => {
                            if (selectedDonate) {
                              generateVietQRCode(selectedDonate).then(setQrCodeImage).catch(() => {});
                            }
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 underline mt-1"
                        >
                          Tải lại mã QR
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <QRCodeSVG
                      value={generateQRCodeData(selectedDonate)}
                      size={160}
                      level="H"
                      includeMargin={true}
                    />
                    <p className="text-xs text-gray-600 mt-2">Quét mã QR để thanh toán</p>
                    <button
                      onClick={() => {
                        if (selectedDonate) {
                          generateVietQRCode(selectedDonate).then(setQrCodeImage).catch(() => {});
                        }
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 underline mt-1"
                    >
                      Tạo mã VietQR
                    </button>
                  </>
                )}
              </div>

              {/* Thông tin chuyển khoản */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Số tài khoản
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getBankInfo().bankAccount}
                      aria-label="Số tài khoản ngân hàng"
                      title="Số tài khoản ngân hàng"
                      className="flex-1 border rounded-lg px-2 py-1.5 bg-gray-50 text-sm text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(getBankInfo().bankAccount, 'account')}
                      className="p-1.5 border rounded-lg hover:bg-gray-50 transition"
                      title="Sao chép"
                    >
                      {copiedField === 'account' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Số tiền cần thanh toán
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={selectedDonate.money.toLocaleString('vi-VN') + ' đ'}
                      aria-label="Số tiền cần thanh toán"
                      title="Số tiền cần thanh toán"
                      className="flex-1 border rounded-lg px-2 py-1.5 bg-gray-50 text-sm text-gray-900 font-semibold"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedDonate.money.toString(), 'amount')}
                      className="p-1.5 border rounded-lg hover:bg-gray-50 transition"
                      title="Sao chép"
                    >
                      {copiedField === 'amount' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nội dung chuyển khoản
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatePaymentContent(selectedDonate)}
                      aria-label="Nội dung chuyển khoản"
                      title="Nội dung chuyển khoản"
                      className="flex-1 border rounded-lg px-2 py-1.5 bg-gray-50 text-sm text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(generatePaymentContent(selectedDonate), 'content')}
                      className="p-1.5 border rounded-lg hover:bg-gray-50 transition"
                      title="Sao chép"
                    >
                      {copiedField === 'content' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung trên. 
                    Sau khi chuyển khoản thành công, kế toán sẽ duyệt quyên góp của bạn.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setPaymentModalOpen(false);
                    setSelectedDonate(null);
                    setQrCodeImage(null);
                    setQrError(null);
                    setQrLink(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm"
                >
                  Đóng
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isUpdatingStatus}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Đã thanh toán'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

