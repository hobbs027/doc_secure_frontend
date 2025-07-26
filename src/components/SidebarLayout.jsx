import React, { useState } from 'react';

const SidebarLayout = ({ children, onLogout }) => {
  const [activePanel, setActivePanel] = useState('files');

  const navItems = [
    { id: 'files', label: '📁 File Manager' },
    { id: 'alerts', label: '🚨 Alerts & Insights' },
    { id: 'logs', label: '🕵️ Audit Logs' },
    { id: 'visuals', label: '📊 Visual Analytics' },
    { id: 'ledger', label: '📜 Ledger Viewer' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">🔐 Audit Dashboard</h2>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePanel(item.id)}
            className={`block w-full text-left px-3 py-2 rounded ${
              activePanel === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={onLogout}
          className="mt-8 w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children(activePanel)}
      </main>
    </div>
  );
};

export default SidebarLayout;
