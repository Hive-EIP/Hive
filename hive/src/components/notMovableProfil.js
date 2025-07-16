import React from 'react';

const NotMovableProfil = ({ players }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            padding: '20px',
            justifyContent: 'flex-start',
        }}>
            {players.map((player, i) => (
                <div key={i} style={{
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.1)',
                    width: '100px',
                }}>
                    <img
                        src={player.profile_picture_url || '/default.png'}
                        alt="player"
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '8px',
                            border: '2px solid #f0f0f0'
                        }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#eee' }}>
                        <strong>{player.username || 'Inconnu'}</strong><br />
                        <span style={{ opacity: 0.7 }}>{player.rank || 'No rank'}</span><br />
                        <span style={{ fontSize: '0.7rem', color: '#ffd700' }}>
              {player.points != null ? `${player.points} pts` : ''}
            </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotMovableProfil;
