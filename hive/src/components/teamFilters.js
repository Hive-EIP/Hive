import React from 'react';

const TeamFilters = ({ onChange }) => {
  return (
      <div className="filters-section">
        <h2>🔍 Filter Teams</h2>
        <div className="filters-bar">
          <select className="filter-pill" onChange={e => onChange('game', e.target.value)}>
            <option>Game</option>
            <option>League of Legends</option>
            <option>Fortnite</option>
          </select>

          <select className="filter-pill" onChange={e => onChange('status', e.target.value)}>
            <option>Status</option>
            <option>In search</option>
            <option>Complete</option>
          </select>

          <select className="filter-pill" onChange={e => onChange('rank', e.target.value)}>
            <option>Rank</option>
            <option>7-10</option>
            <option>4-6</option>
            <option>0-3</option>
          </select>
        </div>
      </div>
  );
};

export default TeamFilters;
