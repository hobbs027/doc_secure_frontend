import React, { useEffect, useState } from 'react';
import {saveAs} from 'file-saver';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFilteredLogs] = useState([]);
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/protected/audit/view', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.logs) {
          setLogs(data.logs);
          setFilteredLogs(data.logs);
        } else {
          setMessage(data.message || 'No logs found');
        }
      })
      .catch(() => setMessage('Server error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = logs;
    if (emailFilter) {
      result = result.filter(log => 
        log.userId.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }
    if (dateFilter) {
      result = result.filter(log => 
        log.timestamp.startsWith(dateFilter)
      );
    }
    setFilteredLogs(result);
  }, [emailFilter, dateFilter, logs]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const header= 'User,Action,File,Timestamp';
    const rows = filtered.map(log =>
      `"${log.userId},${log.action},${log.filename},${log.timestamp}"`
    );
    const csv= [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'audit_logs.csv');
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow text-sm:text-base">
      <h2 className="text-xl font-semibold mb-2"> Audit Logs</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        </div>
        <div className="mb-4">
        <button
          onClick={exportCSV}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export as CSV
        </button>
        </div>

      {message && <p className="text-red-600 mb-2">{message}</p>}
      {loading ? (
        <p className="text-gray-600">Loading logs...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">...</table>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">File</th>
              <th className="p-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-2 border">{log.userId}</td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">{log.filename}</td>
                <td className="p-2 border">{log.timestamp}</td>
              </tr>
            ))}
           {filtered.length === 0 && (
             <tr>
               <td colSpan="4" className="text-center text-gray-500 py-4">
                No matching logs found.
               </td>
             </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLog;
