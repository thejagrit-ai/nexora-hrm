import React, { useState } from 'react';
import { Webhook, Plus, RefreshCw, Key, Send } from 'lucide-react';

export const WebhooksIntegrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'webhooks' | 'api-clients' | 'tally' | 'zoho'>('webhooks');
  const [webhooks] = useState([
    { id: '1', name: 'Attendance Event Sync', url: 'https://api.mycompany.com/webhooks/attendance', event: 'attendance.marked', status: 'Active', secret: 'whsec_8f739a...092' },
    { id: '2', name: 'Onboarding Employee Trigger', url: 'https://hooks.zapier.com/hooks/catch/12938/abc', event: 'employee.onboarded', status: 'Active', secret: 'whsec_34a11c...771' },
  ]);

  const [apiClients] = useState([
    { id: '1', name: 'Mobile App Gateway', clientId: 'client_live_890123', scope: 'Read/Write', status: 'Active', lastUsed: '10 mins ago' },
    { id: '2', name: 'Payroll Sync Bot', clientId: 'client_live_456789', scope: 'Payroll Full Access', status: 'Active', lastUsed: '2 hours ago' },
  ]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Webhook className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Integrations & Webhooks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Connect HRM with third-party software, Tally, Zoho, API Clients, and real-time Webhook event notifications.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'webhooks'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Webhooks Endpoint
        </button>
        <button
          onClick={() => setActiveTab('api-clients')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'api-clients'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          API Clients & OAuth
        </button>
        <button
          onClick={() => setActiveTab('tally')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tally'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Tally Prime Export
        </button>
        <button
          onClick={() => setActiveTab('zoho')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'zoho'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Zoho People Sync
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Webhook Endpoints</h3>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <Plus className="w-4 h-4" /> Add Webhook Endpoint
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-4 py-3">Webhook Name</th>
                  <th className="px-4 py-3">Target Endpoint URL</th>
                  <th className="px-4 py-3">Subscribed Event</th>
                  <th className="px-4 py-3">Secret Key</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {webhooks.map((wh) => (
                  <tr key={wh.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{wh.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{wh.url}</td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-medium">{wh.event}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{wh.secret}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {wh.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md font-medium transition inline-flex items-center gap-1">
                        <Send className="w-3 h-3" /> Test Ping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'api-clients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Client Credentials</h3>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              <Key className="w-4 h-4" /> Create API Key / Client
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-4 py-3">Client App Name</th>
                  <th className="px-4 py-3">Client ID</th>
                  <th className="px-4 py-3">Access Scope</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {apiClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{client.clientId}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{client.scope}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{client.lastUsed}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 font-medium">
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tally' && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tally ERP / Prime Export Configuration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Export monthly payroll entries directly into Tally XML format with ledger mapping.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tally Company Name</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" defaultValue="ACME PRIVATE LIMITED" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary Ledger Name in Tally</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" defaultValue="Salary Expenses Account" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Download Tally XML Voucher
            </button>
          </div>
        </div>
      )}

      {activeTab === 'zoho' && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Zoho People Bi-Directional Sync</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sync employee records, attendance logs, and leave entries with Zoho People API.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zoho Client ID</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" placeholder="1000.XXXXXX..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zoho Client Secret</label>
              <input type="password" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white" defaultValue="••••••••••••••••" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <RefreshCw className="w-4 h-4" /> Trigger Immediate Sync
            </button>
            <button className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Save Zoho Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default WebhooksIntegrationsPage;
