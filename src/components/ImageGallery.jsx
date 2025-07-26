import React, { useEffect, useState } from 'react';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploaders, setUploaders] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const fetchImages = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    if (filterEmail) params.append('email', filterEmail);
    if (filterRole) params.append('role', filterRole);

    fetch(`http://localhost:3000/api/protected/files/list?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const imgs = (data.files || []).filter(f =>
          /\.(jpg|jpeg|png|gif|webp)$/i.test(f.filename)
        );
        setImages(imgs);
      });
  };

  useEffect(fetchImages, [startDate, endDate]);
  useEffect(() => {
    fetch('http://localhost:3000/api/protected/files/uploaders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUploaders(data.emails || []);
        setRoles(data.roles || []);
      });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">🖼️ Image Gallery</h2>

      {/* Date Filters */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium">Uploader</label>
          <select
            value={filterEmail}
            onChange={e => setFilterEmail(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All</option>
            {uploaders.map((email, i) => (
              <option key={i} value={email}>{email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All</option>
            {roles.map((role, i) => (
              <option key={i} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => {
          const {filename, alias, uploadedBy, role} = img;
          <a
            key={i}
            href={`http://localhost:3000/api/protected/files/download/${img.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded overflow-hidden hover:shadow-lg"
          >
            <img
              src={`http://localhost:3000/api/protected/files/download/${img.filename}`}
              alt={img.filename}
              className="w-full h-40 object-cover"
            />
            <div className="text-xs text-center text-gray-600 mt-1">
              <p>{alias || filename}</p>
              <p className="text-[0.75rem] italic text-gray-500">
                By: {uploadedBy} ({role})
            </p>
            </div>
          </a>
        
        })}
      </div>
    </div>
  );
}

export default ImageGallery;
