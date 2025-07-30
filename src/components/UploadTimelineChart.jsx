import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function UploadTimelineChart() {
  const [dailyStats, setDailyStats] = useState({});
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedAlias, setSelectedAlias] = useState('');

  const fetchStats = () => {
    const params = new URLSearchParams();
    if (selectedRole) params.append('role', selectedRole);
    if (selectedAlias) params.append('alias', selectedAlias);

    fetch(`http://localhost:3001/api/protected/uploads/stats/daily?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setDailyStats(data.stats || {}));
  };

  useEffect(fetchStats, [selectedRole, selectedAlias]);

  const labels = Object.keys(dailyStats).sort();
  const data = {
    labels,
    datasets: [
      {
        label: 'Uploads per Day',
        data: labels.map(date => dailyStats[date]),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '📅 Upload Timeline',
        font: { size: 18 }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Uploads' }, beginAtZero: true }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      {/* Filter Controls */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Alias</label>
          <select
            value={selectedAlias}
            onChange={(e) => setSelectedAlias(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Aliases</option>
            <option value="Financial Report">Financial Report</option>
            <option value="Company Logo">Company Logo</option>
            <option value="Confidential Upload">Confidential Upload</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <Line data={data} options={options} />
    </div>
  );
}

export default UploadTimelineChart;
