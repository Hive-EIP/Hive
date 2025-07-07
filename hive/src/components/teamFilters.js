import React from 'react';

const TeamFilters = ({ onChange }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ margin: 0, fontWeight: '600' }}>Filtred by</h2>

      <select style={dropdownStyle} onChange={e => onChange('game', e.target.value)}>
        <option>Game</option>
        <option>League of Legends</option>
        <option>Fortnite</option>
      </select>

      <select style={dropdownStyle} onChange={e => onChange('status', e.target.value)}>
        <option>Status</option>
        <option>In search</option>
        <option>Complete</option>
      </select>

      <select style={dropdownStyle} onChange={e => onChange('rank', e.target.value)}>
        <option>Rank</option>
        <option>7-10</option>
        <option>4-6</option>
        <option>0-3</option>
      </select>
    </div>
  );
};

const dropdownStyle = {
  backgroundColor: '#f4d2ad',
  border: 'none',
  borderRadius: '20px',
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#3d2b1f',
  cursor: 'pointer',
  appearance: 'none'
};

export default TeamFilters;
