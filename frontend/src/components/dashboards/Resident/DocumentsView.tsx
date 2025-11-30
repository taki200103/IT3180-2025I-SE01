import React from 'react';
import { FileText } from 'lucide-react';

export default function DocumentsView() {
  const documents = [
    { name: 'Hợp đồng thuê căn hộ', category: 'Hợp đồng', date: '15/01/2024', size: '2.4 MB' },
    { name: 'Nội quy chung cư', category: 'Quy định', date: '01/01/2024', size: '1.2 MB' },
    { name: 'Biên bản bàn giao', category: 'Hợp đồng', date: '15/01/2024', size: '3.1 MB' },
    { name: 'Hướng dẫn sử dụng dịch vụ', category: 'Hướng dẫn', date: '01/01/2024', size: '800 KB' },
  ];

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
                <button className="text-indigo-600 hover:text-indigo-700 text-sm mt-3">
                  Tải xuống →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

