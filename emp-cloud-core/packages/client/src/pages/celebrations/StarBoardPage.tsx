import React, { useState } from 'react';
import { Star, Award, Heart, Plus } from 'lucide-react';

export const StarBoardPage: React.FC = () => {
  const [recognitions] = useState([
    {
      id: '1',
      employeeName: 'Rahul Sharma',
      badge: 'Employee of the Month',
      title: 'Outstanding Client Delivery',
      reason: 'Delivered the enterprise HRM migration project 3 weeks ahead of schedule with flawless quality!',
      givenBy: 'Ananya Verma (HR Director)',
      date: 'Sep 18, 2026',
      likes: 24,
      category: 'Excellence',
    },
    {
      id: '2',
      employeeName: 'Priya Patel',
      badge: 'Innovation Champion',
      title: 'AI Chatbot Integration',
      reason: 'Created the automated multi-tenant HR assistant that cut support ticket response time by 60%.',
      givenBy: 'Vikram Mehta (CTO)',
      date: 'Sep 15, 2026',
      likes: 19,
      category: 'Innovation',
    },
    {
      id: '3',
      employeeName: 'Amit Kumar',
      badge: 'Team Player',
      title: 'Cross-functional Support',
      reason: 'Stepped in to help the payroll compliance audit team finish filing Form 16 without delays.',
      givenBy: 'Sanjay Rao (Finance Lead)',
      date: 'Sep 10, 2026',
      likes: 15,
      category: 'Teamwork',
    },
  ]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
            Star Board & Peer Recognition
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Celebrate exceptional contributions, award badges, and foster a culture of appreciation.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition">
          <Plus className="w-4 h-4" /> Nominate Star Employee
        </button>
      </div>

      {/* Grid of Recognitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recognitions.map((rec) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {rec.badge}
                </span>
                <span className="text-xs text-gray-400">{rec.date}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{rec.employeeName}</h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{rec.title}</p>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                "{rec.reason}"
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Recognized by <span className="font-semibold text-gray-800 dark:text-gray-200">{rec.givenBy}</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 px-3 py-1.5 rounded-full transition">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> {rec.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StarBoardPage;
