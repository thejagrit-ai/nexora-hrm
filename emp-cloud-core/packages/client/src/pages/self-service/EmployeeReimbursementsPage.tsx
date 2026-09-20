import React, { useState } from 'react';
import { Receipt, Plus, Plane } from 'lucide-react';

export const EmployeeReimbursementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'claims' | 'travel'>('claims');

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Receipt className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            Reimbursement & Travel Expenses
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Submit expense receipts for approval, request business travel desk assistance, and track payout status.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'claims'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Expense Claims History
        </button>
        <button
          onClick={() => setActiveTab('travel')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'travel'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          My Travel Requests
        </button>
      </div>

      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Submitted Claims</h3>
            <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <Plus className="w-4 h-4" /> File New Expense Claim
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-4 py-3">Claim Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Claim Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Client Dinner</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Team dinner with ACME client representatives</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">₹4,500.00</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">Sep 12, 2026</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Approved & Disbursed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'travel' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Travel Desk</h3>
            <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <Plane className="w-4 h-4" /> New Travel Request
            </button>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center py-12 text-gray-500 text-sm">
            No active domestic or international travel requests filed.
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeeReimbursementsPage;
