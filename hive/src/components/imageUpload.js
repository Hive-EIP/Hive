import React, { useState } from 'react';

function ImageUpload() {
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <label
        htmlFor="imageUpload"
        style={{
          border: '2px solid #d6a77a',
          borderRadius: '8px',
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#8c6b4f',
          backgroundColor: '#f4d2ad',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          '+'
        )}
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
  );
}

export default ImageUpload;
