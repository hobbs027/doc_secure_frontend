import React, { useState } from 'react';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage('');
    setProgress(0);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3001/api/protected/files/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    });

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);
      if (xhr.status === 200) {
        setMessage('File uploaded successfully!');
        setSelectedFile(null);
      } else {
        setMessage('Upload failed.');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setMessage('Network error.');
    };

    xhr.send(formData);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2"> Upload a File</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {uploading && (
        <div className="w-full bg-gray-200 rounded overflow-hidden mt-4">
          <div
            className="bg-blue-600 text-white text-sm text-center"
            style={{ width: `${progress}%`, padding: '4px 0' }}
          >
            Uploading... {progress}%
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}

export default FileUpload;
