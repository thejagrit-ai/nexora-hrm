import React, { useState } from 'react';
import { CreditCard, HandCoins, Download } from 'lucide-react';

export const EmployeePayBenefitsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payslip' | 'loans' | 'tax' | 'form16' | 'resignation'>('payslip');

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Pay & Benefits Self-Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Access monthly salary slips, tax declarations, Form 16, loan requests, advance salary, and settlement history.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('payslip')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'payslip'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Salary Slips
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'loans'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          My Loans & Advances
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'tax'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Tax Declaration (80C/80D)
        </button>
        <button
          onClick={() => setActiveTab('form16')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'form16'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          My Form 16
        </button>
        <button
          onClick={() => setActiveTab('resignation')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'resignation'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Resignation & F&F
        </button>
      </div>

      {activeTab === 'payslip' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Monthly Payslips</h3>
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <Download className="w-4 h-4" /> Download Latest Payslip (PDF)
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {[
              { month: 'August 2026', gross: '₹1,25,000', net: '₹1,08,500', status: 'Paid' },
              { month: 'July 2026', gross: '₹1,25,000', net: '₹1,08,500', status: 'Paid' },
              { month: 'June 2026', gross: '₹1,25,000', net: '₹1,08,500', status: 'Paid' },
            ].map((p, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{p.month}</div>
                  <div className="text-xs text-gray-500">Gross: {p.gross} • Net Pay: {p.net}</div>
                </div>
                <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg">
                  View Slip
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'loans' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Loans & Advance Salary Requests</h3>
              <p className="text-sm text-gray-500">Apply for emergency salary advances or long-term company loans.</p>
            </div>
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <HandCoins className="w-4 h-4" /> Request Advance Salary
            </button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Loan Summary</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹0.00</div>
            <div className="text-xs text-gray-500 mt-1">No active active salary deductions or pending loans.</div>
          </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Income Tax Declarations (FY 2026-27)</h3>
            <p className="text-sm text-gray-500">Declare investments under 80C, 80D, HRA rent receipts for tax saving.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
              <div className="font-semibold text-gray-900 dark:text-white">Section 80C (PPF, ELSS, EPF)</div>
              <div className="text-sm text-gray-500">Declared Limit: ₹1,50,000</div>
              <input type="number" placeholder="Enter amount" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" defaultValue={150000} />
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
              <div className="font-semibold text-gray-900 dark:text-white">Section 80D (Health Insurance)</div>
              <div className="text-sm text-gray-500">Declared Limit: ₹25,000</div>
              <input type="number" placeholder="Enter amount" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" defaultValue={25000} />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
              Save Tax Declaration
            </button>
          </div>
        </div>
      )}

      {activeTab === 'form16' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Form 16 Tax Certificate Downloads</h3>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-emerald-900 dark:text-emerald-200">Form 16 - Assessment Year 2026-27</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400">Digitally signed by Finance Department</div>
            </div>
            <button className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-emerald-700 transition">
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>
      )}

      {activeTab === 'resignation' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resignation & Offboarding Portal</h3>
          <p className="text-sm text-gray-500">Initiate formal resignation, track notice period status, and Full & Final settlement.</p>
          <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Submit Resignation Request
          </button>
        </div>
      )}
    </div>
  );
};
export default EmployeePayBenefitsPage;
