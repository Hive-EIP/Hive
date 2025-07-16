import React from 'react';

const ModalPage = ({ children, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
        }}>
            <div style={{
                background: 'rgba(20, 20, 30, 0.95)',
                border: '1px solid rgba(255, 60, 120, 0.25)',
                backdropFilter: 'blur(12px)',
                padding: '48px 24px 24px 24px',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '1000px',
                position: 'relative',
                boxShadow: '0 0 20px rgba(255, 60, 120, 0.4)',
                color: 'white'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#ff3c78',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, color 0.3s ease',
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                    &times;
                </button>

                {children}
            </div>
        </div>
    );
};

export default ModalPage;
