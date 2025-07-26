import React, { useEffect, useState } from 'react';

function FileSummaryPanel() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/protected/files/summary', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setSummary(data));
  }, []);

  if (!summary) return null;

  return (
    <div className="bg-blue-50 p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold text-blue-800 mb-2">📊 File Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
        <div><strong>Total Files:</strong> {summary.totalFiles}</div>
        <div><strong>Unique Uploaders:</strong> {summary.uploaderCount}</div>
        <div>
          <strong>Uploads by Role:</strong>
          <ul className="list-disc ml-5">
            {Object.entries(summary.uploadsPerRole).map(([role, count]) => (
              <li key={role}>{role}: {count}</li>
            ))}
          </ul>
        </div>
        <div><strong>Most Common Alias:</strong> {summary?.mostCommonAlias || 'N/A'}</div>
      </div>
    </div>
  );
}

export default FileSummaryPanel;
