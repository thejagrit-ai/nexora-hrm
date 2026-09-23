import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

export const EmployeeShiftRosterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roster' | 'swaps' | 'open-shifts'>('roster');

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            My Shift & Roster Self-Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View assigned shift rosters, request shift swaps with teammates, and claim open shifts.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'roster'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          My Weekly Roster
        </button>
        <button
          onClick={() => setActiveTab('swaps')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'swaps'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Shift Swap Requests
        </button>
        <button
          onClick={() => setActiveTab('open-shifts')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'open-shifts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Open Shifts Board
        </button>
      </div>

      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {[
            { day: 'Mon', date: 'Sep 21', shift: 'General Shift (09:00 - 18:00)', type: 'Regular' },
            { day: 'Tue', date: 'Sep 22', shift: 'General Shift (09:00 - 18:00)', type: 'Regular' },
            { day: 'Wed', date: 'Sep 23', shift: 'General Shift (09:00 - 18:00)', type: 'Regular' },
            { day: 'Thu', date: 'Sep 24', shift: 'General Shift (09:00 - 18:00)', type: 'Regular' },
            { day: 'Fri', date: 'Sep 25', shift: 'General Shift (09:00 - 18:00)', type: 'Regular' },
            { day: 'Sat', date: 'Sep 26', shift: 'Weekly Off', type: 'Off' },
            { day: 'Sun', date: 'Sep 27', shift: 'Weekly Off', type: 'Off' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                item.type === 'Off'
                  ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800'
                  : 'bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-900/50 shadow-sm'
              }`}
            >
              <div className="text-xs font-bold text-gray-400">{item.day} • {item.date}</div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white mt-2">{item.shift}</div>
              <span className={`inline-block mt-3 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                item.type === 'Off' ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              }`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'swaps' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shift Swap Requests</h3>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <RefreshCw className="w-4 h-4" /> Request Shift Swap
            </button>
          </div>
          <div className="text-sm text-gray-500 italic py-4">No pending shift swap requests.</div>
        </div>
      )}

      {activeTab === 'open-shifts' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Open Shifts for Overtime / Extra Pay</h3>
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">Night Support Shift (22:00 - 06:00)</div>
              <div className="text-xs text-gray-500">Date: Sep 25, 2026 • Extra Pay Allowance: 1.5x</div>
            </div>
            <button className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Claim Shift
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeeShiftRosterPage;
