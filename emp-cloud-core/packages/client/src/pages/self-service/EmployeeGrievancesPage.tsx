import React, { useState } from 'react';
import { ShieldAlert, Plus } from 'lucide-react';

export const EmployeeGrievancesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grievance' | 'disciplinary'>('grievance');

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            Grievance & Disciplinary Self-Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Raise workplace grievances confidentially, track status, and view assigned disciplinary case responses.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('grievance')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'grievance'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          My Workplace Grievances
        </button>
        <button
          onClick={() => setActiveTab('disciplinary')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'disciplinary'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          My Disciplinary Cases
        </button>
      </div>

      {activeTab === 'grievance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filed Grievances</h3>
            <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <Plus className="w-4 h-4" /> File New Grievance
            </button>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center py-12 text-gray-500 text-sm">
            No active workplace grievances reported.
          </div>
        </div>
      )}

      {activeTab === 'disciplinary' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Disciplinary Enquiries & Notices</h3>
          <p className="text-sm text-gray-500">Clean compliance record — no active disciplinary warnings or show-cause notices.</p>
        </div>
      )}
    </div>
  );
};
export default EmployeeGrievancesPage;
