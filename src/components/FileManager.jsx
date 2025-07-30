import React, { useEffect, useState } from 'react';
import DocumentViewer from './DocumentViewer';

function FileManager({ userRole }) {
  const [files, setFiles] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [availableEmails, setAvailableEmails] = useState([]);
  const [availableRoles, setAvailableRoles] = useState(['admin', 'user', 'auditor']);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [batchStatus, setBatchStatus] = useState('');
  const [message, setMessage] = useState('');

  const sortFiles = (files, method) => {
    let sorted = [...files];
    if (method === 'name-asc') {
      sorted.sort((a, b) => a.filename.localeCompare(b.filename));
    } else if (method === 'name-desc') {
      sorted.sort((a, b) => b.filename.localeCompare(a.filename));
    } else if (method === 'date-asc') {
      sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else {
      sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    return sorted;
  };

  const fetchFiles = async () => {
    try {
      const params = new URLSearchParams();
      if (filterEmail) params.append('email', filterEmail);
      if (filterRole) params.append('role', filterRole);
      if (filterStatus) params.append('status', filterStatus);
      const res = await fetch('http://localhost:3001/api/protected/files/list?${params.toStrings()}', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files || []);
        setSortedFiles(sortFiles(data.files || [], sortBy));
      } else {
        setMessage(data.message || 'Failed to fetch files');
      }
    } catch {
      setMessage('Server error');
    }
  };

  const fetchMeta = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/protected/files/meta', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    if (res.ok) {
      setAvailableEmails(data.emails || []);
      setAvailableRoles(data.roles || []);
    }
  } catch {
    console.error('Failed to fetch meta');
  }
 };

  useEffect(() => {
    fetchFiles();
    fetchMeta();
  }, []);

  const handleDelete = async (filename) => {
    try {
      const res = await fetch(`http://localhost:3001/api/protected/files/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        const updated = files.filter(f => f.filename !== filename);
        setFiles(updated);
        setSortedFiles(sortFiles(updated, sortBy));
        setMessage(`Deleted: ${filename}`);
      } else {
        setMessage(data.message || 'Delete failed');
      }
    } catch {
      setMessage('Server error');
    }
  };

  const updateFileStatus = async (filename, newStatus) => {
  try {
    const res = await fetch(`http://localhost:3001/api/protected/files/status/${filename}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();
    if (res.ok) {
      const updated = files.map(f =>
        f.filename === filename ? { ...f, status: newStatus } : f
      );
      setFiles(updated);
      setSortedFiles(sortFiles(updated, sortBy));
      setMessage(`Updated status for ${filename}`);
    } else {
      setMessage(data.message || 'Failed to update status');
    }
  } catch {
    setMessage('Server error');
  }
 };


  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      }
      return `${(bytes / 1024).toFixed(2)} KB`;
  };

  useEffect(() => {
    fetchFiles();
  }, [filterEmail, filterRole, filterStatus, sortBy]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2"> File Manager</h2>

      {message && <p className="text-sm text-gray-700 mb-2">{message}</p>}

      {/* Sort Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => {
            const method = e.target.value;
            setSortBy(method);
            setSortedFiles(sortFiles(files, method));
          }}
          className="border p-2 rounded"
        >
          <option value="date-desc"> Newest First</option>
          <option value="date-asc"> Oldest First</option>
          <option value="name-asc"> A-Z</option>
          <option value="name-desc"> Z-A</option>
        </select>
      </div>

      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block text-sm font-medium mb-1">Filter by Role:</label>
          <select
           value={filterRole}
           onChange={(e) => setFilterRole(e.target.value)}
           className="border p-2 rounded w-full"
           >
            <option value=''>All Roles</option>
            {availableRoles.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
           </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Filter by Uploader:</label>
          <input
            type="text"
            placeholder="Enter email"
            value={filterEmail}
            onChange={(e) => { setFilterEmail(e.target.value); }}
            className="border p-2 rounded w-full"
            >
              <option value="">All Uploaders</option>
              {availableEmails.map((email, i) =>
               <option key={i} value={email}>{email}</option>
              )}
          </input>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Filter by status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
        </select>
      </div>

      {userRole === 'admin' && (
        <div className="mb-4 flex items-center gap-4">
          <select
            value={batchStatus}
            onChange={(e) => setBatchStatus(e.target.value)}
            className="border p-2 rounded"
            >
              <option value="">Set Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
          </select>
          <button>
            onClick= {async () => {
              const updates= selectedFiles.map(f =>({filename: f, status: batchStatus}));
              const res= await fetch('http://localhost:3001/api/protected/files/status/batch', {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ updates })
              });
              const data = await res.json();
              if (res.ok) {
                fetchFiles();
                setSelectedFiles([]);
                setBatchStatus('');
                setMessage('Batch status updated');
              } else {
                setMessage(data.message || 'Batch update failed')
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover: bg-blue-700"
            disabled={!selectedFiles.length || !batchStatus}
          
            Apply to Selected
          </button>
        </div>
      )}

      <button
        onClick={async () => {
          const res = await fetch('http://localhost:3001/api/protected/files/download/batch', {
            method:'POST',
            headers:{
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ filenames: selectedFiles})
          });

          if (res.ok) {
            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'bulk_files.zip';
            document.body.appendChild(link);
            link.click();
            link.remove();
          } else {
            setMessage('Bulk download failed');
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={!selectedFiles.length}
      >
        Download Selected
      </button>

      {userRole ==='admin' && (
        <div className="mb-2 flex items-center gap-4">
          <button
           onClick={() => {
            const allVisibleFilenames = sortedFiles.map(f=> f.filename);
            const allSelected = allVisibleFilenames.every(f => selectedFiles.includes(f));
            setSelectedFiles(allSelected ? [] : allVisibleFilenames);
           }}
           classname="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
           >
            {sortedFiles.every(f => selectedFiles.includes(f)) ? 'Deselect All' : 'Select All'}
          </button>
          <p className="text-sm text-gray-700">
             Selected: {selectedFiles.length} of {sortedFiles.length}
          </p>
         </div>  
      )}

      {/* File List */}
      <ul className="space-y-4">
        {sortedFiles.map((fileObj, i) => {
          const { filename, alias, timestamp, size, uploadedBy, role, status} = fileObj;

          let icon = '📄';
          if (/\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) icon = '🖼️';
          if (/\.pdf$/i.test(filename)) icon = '📑';
          if (/\.zip|\.rar$/i.test(filename)) icon = '🗜️';

          return (
            <li key={i} className={`border p-3 rounded bg-gray-50 ${
              selectedFiles.includes(filename) ? 'ring-2 ring-blue-400' : ''
            }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{icon} {alias||filename}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(filename)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles([...selectedFiles, filename]);
                      } else {
                        setSelectedFiles(selectedFiles.filter(f => f !==filename));
                      }
                    }}
                    className="mr-1 accent-blue-600"
                  />
                  <span className="font-medium">
                    {icon} {alias || filename}
                  </span>
                </div>

                <div className="space-x-2">
                  <a
                    href={`http://localhost:3001/api/protected/files/download/${filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download
                  </a>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(filename)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Size: {uploadedBy || 'Unknown'} ({role || 'unspecified'}) - {formatSize(size)}
              </p>
              <p className="text-sm text-gray-500">
                status: <span className={`font-semibold ${status=== 'approved' ? 'text-green-600':
                                                 status === 'pending' ? 'text-yellow-600': 
                                                 status === 'rejected' ? 'text-red-600': 
                                                 'text-purple-600'}`}>
                 {status}
                 </span>
              </p>
              {userRole === 'admin' && (
                <div className="mt-2">
                  <label className="text-sm mr-2">Change Status:</label>
                  <select
                    value={status}
                    onChange={(e) => updateFileStatus(filename, e.target.value)}
                    className="border p-1 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="flagged">Flagged</option>
                    </select>
                </div>
              )}
              <DocumentViewer
                fileUrl={`http://localhost:3001/api/protected/files/download/${filename}`}
                fileName={filename}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FileManager;