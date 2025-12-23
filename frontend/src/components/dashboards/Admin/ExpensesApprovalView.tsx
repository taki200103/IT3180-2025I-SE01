import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

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

const formatPrice = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

export default function ExpensesApprovalView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const loadExpenses = useCallback(() => {
    setLoading(true);
    try {
      const savedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error('Failed to load expenses', err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_EXPENSES) {
        loadExpenses();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadExpenses]);

  const persist = (updated: Expense[]) => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(updated));
    setExpenses(updated);
  };

  const handleApprove = (id: string) => {
    const updated = expenses.map((exp) =>
      exp.id === id ? { ...exp, status: 'Đã chi' } : exp,
    );
    persist(updated);
  };

  const handleReject = (id: string) => {
    const updated = expenses.map((exp) =>
      exp.id === id ? { ...exp, status: 'Từ chối' } : exp,
    );
    persist(updated);
  };

  const pending = expenses.filter((exp) => exp.status === 'Chờ duyệt');
  const approved = expenses.filter((exp) => exp.status === 'Đã chi');
  const rejected = expenses.filter((exp) => exp.status === 'Từ chối');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-gray-900">Duyệt khoản chi</h2>
          <p className="text-gray-600 mt-1">
            Admin thực hiện phê duyệt/ghi nhận chi phí do kế toán tạo
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Chờ duyệt</p>
          <p className="text-orange-600 text-2xl mt-2">{pending.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Đã chi</p>
          <p className="text-green-600 text-2xl mt-2">{approved.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Từ chối</p>
          <p className="text-red-600 text-2xl mt-2">{rejected.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Đang tải phiếu chi...
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
          Chưa có phiếu chi nào được tạo.
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {expense.status === 'Đã chi' ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Đã duyệt
                        </span>
                      ) : expense.status === 'Từ chối' ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          Đã từ chối
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(expense.id)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Duyệt chi
                          </button>
                          <button
                            onClick={() => handleReject(expense.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

