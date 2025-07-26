import React, { useEffect, useState } from 'react';

function LedgerViewer() {
  const [blocks, setBlocks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/protected/ledger/view', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.blocks) {
          setBlocks(data.blocks);
        } else {
          setMessage(data.message || 'No blocks found');
        }
      })
      .catch(() => setMessage(' Server error'));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2"> Ledger Viewer</h2>
      {message && <p className="text-red-600 mb-2">{message}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Block #</th>
              <th className="p-2 border">File</th>
              <th className="p-2 border">Hash</th>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Previous Hash</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-2 border">{block.index}</td>
                <td className="p-2 border">{block.filename}</td>
                <td className="p-2 border">{block.hash}</td>
                <td className="p-2 border">{block.timestamp}</td>
                <td className="p-2 border">{block.previousHash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LedgerViewer;
