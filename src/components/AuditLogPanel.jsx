import React, { useState, useEffect } from 'react';

function AuditLogPanel() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    email: '',
    role: '',
    action: '',
    filename: ''
  });

  const fetchLogs = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const res = await fetch(`http://localhost:3000/api/protected/audit/logs?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    if (res.ok) setLogs(data.logs || []);
  };

  useEffect(fetchLogs, [filters]);

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">🕵️ Audit Log Viewer</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Role"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Action (e.g. delete)"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Filename"
          value={filters.filename}
          onChange={(e) => setFilters({ ...filters, filename: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* Logs */}
      <ul className="space-y-2 text-sm">
        {logs.map((log, i) => (
          <li key={i} className="border rounded p-3 bg-gray-50">
            <div><strong>Action:</strong> {log.action}</div>
            <div><strong>File:</strong> {log.filename}</div>
            <div><strong>By:</strong> {log.performedBy} ({log.role})</div>
            <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>

      <button
        onClick={async () => {
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([key,value]) => {
            if (value) params.append(key, value);
        });
        const res = await fetch(`http://loalhost:3000/api/protected/audit/logs/export?${params.toString()}`,{
          headers: { Authorization:`Bearer ${localStorage.getItem('token')}`}
          });

          if (res.ok) {
            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'audit_logs.cvs';
            document.body.appendChild(link);
            link.click();
            link.remove();
          }
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Export Audit Logs
      </button>
    </div>
  );
}

export default AuditLogPanel;
