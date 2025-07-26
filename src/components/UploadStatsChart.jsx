import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

function UploadStatsChart() {
  const [roleStats, setRoleStats] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/api/protected/uploads/stats/role', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setRoleStats(data.stats || {}));
  }, []);

  const data = {
    labels: Object.keys(roleStats),
    datasets: [
      {
        label: 'Uploads by Role',
        data: Object.values(roleStats),
        backgroundColor: '#3b82f6'
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-2"> Upload Activity by Role</h2>
      <Bar data={data} />
    </div>
  );
}

export default UploadStatsChart;
