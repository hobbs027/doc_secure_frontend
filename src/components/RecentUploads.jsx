import React, { useEffect, useState } from 'react';

function RecentUploads() {
  const [uploads, setUploads] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/protected/uploads/recent', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.uploads) {
          setUploads(data.uploads);
        } else {
          setMessage(data.message || 'No uploads found');
        }
      })
      .catch(() => setMessage('Server error'));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2"> Recent Uploads</h2>
      {message && <p className="text-red-600">{message}</p>}
      <ul className="space-y-2">
        {uploads.map((file, i) => (
          <li key={i} className="border p-2 rounded">
            <strong>{file.filename}</strong>
            <p className="text-sm text-gray-500">Uploaded on {file.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentUploads;
