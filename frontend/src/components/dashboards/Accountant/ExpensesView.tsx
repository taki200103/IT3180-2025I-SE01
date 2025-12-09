import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, X, Receipt } from 'lucide-react';

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'Đã chi' | 'Chờ duyệt' | 'Từ chối';
  createdAt: string;
};

const STORAGE_KEY_EXPENSES = 'accountant_expenses';

const EXPENSE_CATEGORIES = [
  'Nhân sự',
  'Bảo trì, sửa chữa',
  'Điện',
  'Nước',
  'Vệ sinh',
  'An ninh',
  'Văn phòng phẩm',
  'Marketing',
  'Bảo hiểm',
  'Thuế',
  'Khác',
];

export default function ExpensesView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: '',
    status: 'Chờ duyệt' as Expense['status'],
  });

  // Load expenses from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error('Failed to parse expenses', e);
      }
    }
  }, []);

  // Save expenses to localStorage
  const saveExpenses = useCallback((newExpenses: Expense[]) => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  }, []);

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Chờ duyệt',
    });
    setError('');
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.category || !formData.description.trim() || !formData.amount || !formData.date) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const amount = Number(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Số tiền phải lớn hơn 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newExpense: Expense = {
        id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category: formData.category,
        description: formData.description.trim(),
        amount,
        date: formData.date,
        status: formData.status,
        createdAt: new Date().toISOString(),
      };

      const updatedExpenses = [newExpense, ...expenses];
      saveExpenses(updatedExpenses);

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Create expense failed', err);
      setError('Không thể tạo phiếu chi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const currentMonthExpenses = expenses.filter((exp) => {
    const expenseDate = new Date(exp.date);
    const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
    return expenseMonth === getCurrentMonth();
  });

  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const personnelExpenses = expensesByCategory['Nhân sự'] || 0;
  const maintenanceExpenses = expensesByCategory['Bảo trì, sửa chữa'] || 0;
  const otherExpenses = totalExpenses - personnelExpenses - maintenanceExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý chi phí</h2>
          <p className="text-gray-600 mt-1">Theo dõi các khoản chi</p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormData({
              ...formData,
              date: new Date().toISOString().split('T')[0],
            });
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Receipt className="w-4 h-4" />
          Tạo phiếu chi
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng chi tháng này</p>
          <p className="text-red-600 text-2xl mt-2">
            {formatPrice(currentMonthTotal)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Nhân sự</p>
          <p className="text-gray-900 text-2xl mt-2">{formatPrice(personnelExpenses)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Bảo trì</p>
          <p className="text-gray-900 text-2xl mt-2">{formatPrice(maintenanceExpenses)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Khác</p>
          <p className="text-gray-900 text-2xl mt-2">{formatPrice(otherExpenses)}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
          Chưa có phiếu chi nào. Hãy tạo phiếu chi mới để bắt đầu.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          expense.status === 'Đã chi'
                            ? 'bg-green-100 text-green-800'
                            : expense.status === 'Từ chối'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Duyệt/ghi nhận do Admin thực hiện
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-gray-900 text-lg font-semibold mb-1">
                  Tạo phiếu chi
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
            <p className="text-gray-500 text-sm mb-4">
              Điền thông tin phiếu chi mới
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết khoản chi..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Số tiền <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Đã chi' | 'Chờ duyệt',
                    })
                  }
                >
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đã chi">Đã chi</option>
                </select>
              </div>

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
                  Tạo phiếu chi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
