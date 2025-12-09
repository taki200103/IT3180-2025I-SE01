import React from 'react';
import { FileText, Download } from 'lucide-react';

type Document = {
  name: string;
  category: string;
  date: string;
  size: string;
  fileName: string;
};

export default function DocumentsView() {
  const documents: Document[] = [
    { name: 'Hợp đồng thuê căn hộ', category: 'Hợp đồng', date: '15/01/2024', size: '2.4 MB', fileName: 'hop-dong-thue-can-ho.pdf' },
    { name: 'Nội quy chung cư', category: 'Quy định', date: '01/01/2024', size: '1.2 MB', fileName: 'noi-quy-chung-cu.pdf' },
    { name: 'Biên bản bàn giao', category: 'Hợp đồng', date: '15/01/2024', size: '3.1 MB', fileName: 'bien-ban-ban-giao.pdf' },
    { name: 'Hướng dẫn sử dụng dịch vụ', category: 'Hướng dẫn', date: '01/01/2024', size: '800 KB', fileName: 'huong-dan-su-dung-dich-vu.pdf' },
  ];

  const handleDownload = (doc: Document) => {
    // Tạo nội dung tài liệu dạng text
    const content = `
${doc.name}
${'='.repeat(50)}

Loại: ${doc.category}
Ngày: ${doc.date}
Kích thước: ${doc.size}

${'='.repeat(50)}

NỘI DUNG TÀI LIỆU

Đây là tài liệu ${doc.name.toLowerCase()}.

Thông tin chi tiết:
- Tên tài liệu: ${doc.name}
- Phân loại: ${doc.category}
- Ngày phát hành: ${doc.date}
- Kích thước file: ${doc.size}

${'='.repeat(50)}

Tài liệu này được cung cấp bởi hệ thống quản lý chung cư.
    `.trim();

    // Tạo blob từ nội dung text
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Tạo link tải xuống
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName.replace('.pdf', '.txt');
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Tài liệu</h2>
        <p className="text-gray-600 mt-1">Hợp đồng, quy định và tài liệu liên quan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900">{doc.name}</h3>
                <div className="flex gap-3 mt-2 text-sm text-gray-600">
                  <span>{doc.category}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">📅 {doc.date}</p>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm mt-3 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải xuống</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

