import React from 'react';

const NotMovableProfil = ({ players }) => {
  return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '10px' }}>
        {players.map((player, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <img
                  src={player.profile_picture_url || '/default.png'} // image par défaut au cas où
                  alt="player"
                  style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {player.username || 'Inconnu'}<br />
                {player.rank || 'No rank'}<br />
                {player.points != null ? `${player.points} points` : ''}
              </div>
            </div>
        ))}
      </div>
  );
};

export default NotMovableProfil;
