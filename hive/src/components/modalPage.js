import React from 'react';

const ModalPage = ({ children, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999
    }}>
      <div style={{
        backgroundColor: '#f4d2ad',
        padding: '24px',
        borderRadius: '16px',
        width: '80%',
        maxWidth: '800px',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalPage;
