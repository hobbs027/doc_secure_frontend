import React, { useState } from 'react';

function DocumentViewer({ fileUrl, fileName }) {
  const [visible, setVisible] = useState(false);

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  const isPDF = /\.pdf$/i.test(fileName);

  return (
    <div className="my-4">
      <button
        onClick={() => setVisible(!visible)}
        className="text-blue-600 hover:underline"
      >
        {visible ? 'Hide Preview' : 'Show Preview'}
      </button>

      {visible && (
        <div className="mt-2 border p-2 rounded bg-gray-50">
          {isImage && <img src={fileUrl} alt={fileName} className="max-h-96" />}
          {isPDF && (
            <iframe
              src={fileUrl}
              title="PDF Preview"
              className="w-full h-96"
            />
          )}
          {!isImage && !isPDF && (
            <p className="text-sm text-gray-600">Preview not available for this file type.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DocumentViewer;
