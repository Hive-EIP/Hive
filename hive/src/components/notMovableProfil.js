import React from 'react';

const NotMovableProfil = ({ players }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {players.map((player, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <img
            src={player.picture}
            alt="player"
            style={{ width: 60, height: 60, borderRadius: '50%' }}
          />
          <div style={{ fontSize: '12px' }}>
            {player.name}<br />
            {player.rank}<br />
            {player.points} points
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotMovableProfil;
