import React from 'react';

const TeamStats = ({ winrate, rank, elo }) => {
  return (
    <div style={{ fontSize: '1rem', fontFamily: 'sans-serif', color: '#ffffff' }}>
      Winrate Hive: {winrate} &nbsp;|&nbsp; Rank : {rank} &nbsp;|&nbsp; Elo : {elo}
    </div>
  );
};

export default TeamStats;
