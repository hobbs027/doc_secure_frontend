import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import {useRef} from 'react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function AuditAlertPanel({filters, setFilters}) {
  const [alerts, setAlerts] = useState([]);
  const grouped = {high: [], medium: [], low: []};
  const [resolvedIds, setResolvedIds] = useState([]);
  const [selectedType, setselectedType] = useState('');
  const [timeRange, setTimeRange] = useState('3od');
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  alerts.forEach(alert => {
    grouped[alert.severity || 'medium'].push(alert);
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/protected/audit/alerts', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setAlerts(data.alerts || []));
  }, []);

  if (!alerts.length) return null;

  const filteredAlerts = selectedType
   ? filteredByTime.filter(a => a.type === selectedType): filteredByTime;
  
  const groupedByDay = filteredAlerts.reduce((acc, alert) =>{
    const day = new Date(alert.timestamp).toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const peakDay = Object.entries(groupedByDay).reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0]);
  const quietDay = Object.entries(groupedByDay).reduce((a, b) => (b[1] < a[1] ? b : a), ['', Infinity]);

  const totalDays = Object.keys(groupedByDay).length || 1;
  const totalAlerts = filteredAlerts.length;
  const avgPerDay = (totalAlerts / totalDays).toFixed(2);

  const typeCounts = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  },{});
  const topType = Object.entries(typeCounts).reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0]);

  const now = new Date();
  const filteredByTime = alerts.filter(alert => {
    if (timeRange === 'all') return true;

    const days = parseInt(timeRange.replace('d', ''));
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);

    return new Date(alert.timestamp) >= cutoff;
  });


 const chartData = {
  labels: Object.keys(groupedByDay),
  datasets: [
    {
      label: 'Alerts per Day',
      data: Object.values(groupedByDay),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.3,
      fill: true
    }
  ]
 };

 const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { title: { display: true, text: 'Date' } },
    y: { title: { display: true, text: 'Alert Count' }, beginAtZero: true }
  }
 };

 const barData= {
   label: Object.keys(typeCounts),
   datasets: [
      {
        label:'Alert Count by Type',
        data: Object.values(typeCounts),
        backgroundColor: 'rbga(54, 162, 235, 0.6)'
      }
    ]
  };

  return (
 <div className="bg-white p-4 rounded shadow mb-6">
     <h2 className="text-lg font-semibold mb-4">🕵️ Audit Alert Viewer</h2>

     <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Alert Type</label>
      <select
         value={selectedType}
         onChange={(e) => setselectedType(e.target.value)}
         className="border p-2 rounded w-full sm:w-64"
      >
        <option value="">All Types</option>
        {[...new Set(alerts.map(a => a.type))].map((type, i) => (
          <option key={i} value={type}>{type}</option>
        ))}
      </select>
     </div>

     <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        className="border p-2 rounded w-full sm:w-64"
        >
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
        <option value="all">All Time</option>
      </select>
     </div>

     <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2"> Audit Insights</h3>
      <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
        <li><strong>Peak Alert Day:</strong>{peakDay[0]} ({peakDay[1]} alerts)</li>
        <li><strong>Quietest Day:</strong>{quietDay[0]} ({quietDay[1]} alerts)</li>
        <li><strong>Average Alerts/Day:</strong> {avgPerDay}</li>
        <li><strong>Most Frequent Alert Type:</strong> {topType[0]} ({topType[1]} times)</li>
      </ul>
     </div>

     {/* 📈 Line Chart */}
     <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Alert Trends</h3>
      <Line ref={lineChartRef} data={chartData} options={chartOptions} />
      <button
        onClick={() =>{
          const chart = lineChartRef.current
          if (chart) {
            const url = chart.toBase64Image();
            const link = document.createElement('a');
            link.href = url;
            link.download = 'alert_trends_charts.png';
            link.click();
          }
        }}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        Export Line Chart
      </button>
     </div>

     {/* Bar Chart */}
     <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2"> Alert Type Breakdown</h3>
      <Bar ref={barChartRef} data={barData} options={{ responsive: true, plugins: {legend: {display: false} } }}/>
      <button
        onClick={() => {
          const chart = barChartRef.current;
          if (chart) {
            const url = chart.toBase64Image();
            const link = document.createElement('a');
            link.href = url;
            link.download = 'alert_type_breakdown.png';
            link.click();
          }
        }}
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
      >
        Export Bar Chart
      </button>
     </div>

     {/* 🔔 Alert Summary */}
     <div className="text-sm text-red-700 mb-2 font-medium">
      🚨 Unresolved Alerts: {alerts.length - resolvedIds.length}
     </div>

      {/* 🔁 Alert List */}
      <ul className="list-disc ml-6 text-sm text-red-800">
        {alerts.map((alert, i) => (
          <li key={i}>
              <button
                onClick={() => {
                 if (alert.by) setFilters({ ...filters, email: alert.by });
                 if (alert.file) setFilters({ ...filters, filename: alert.file });
                }}
               className="text-left hover:underline"
              >
               {alert.type === 'Repeated Rejections' &&
                `${alert.by} rejected ${alert.count} files in 1 hour (${alert.timeBlock})`}
               {alert.type === 'Sensitive File Reaccessed' &&
                 `${alert.file} downloaded ${alert.count} times`}
              </button>

              {resolvedIds.includes(alert.id) ? (
                 <button
                    onClick={() => setResolvedIds(resolvedIds.filter(id => id !== alert.id))}
                    className="ml-4 text-yellow-600 hover:underline text-sm"
                 >
                  Undo
                 </button>
                 ) : (
                <button
                  onClick={() => setResolvedIds([...resolvedIds, alert.id])}
                  className="ml-4 text-blue-600 hover:underline text-sm"
                >
                  Mark Resolved
                </button>
               )}
               <button
                 onClick={async ()=> {
                    const res = await fetch('http://localhost:3000/api/protected/audit/alerts/export',{
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                    });
                    if(res.ok) {
                        const blob = await res.blob();
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'unresolved_alerts.csv';
                        link.click();
                        link.remove();
                    }
                 }}
                 className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
               >
                Export Unresolved alerts
               </button>
            </li>
         ))}
      </ul>
   </div>
 );
}

export default AuditAlertPanel;
