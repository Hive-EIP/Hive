import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lol from "../assets/images/lol-badge.png";
import Fortnite from "../assets/images/fortnite-badge.png";

const TeamCard = ({ name, country, points, description, selected, game, logoUrl, team }) => {
  const navigate = useNavigate();
  const badgeUrl = game === 'League of Legends'
    ? Lol
    : game === 'Fortnite'
    ? Fortnite
    : null;

  return (
    <div 
      onClick={() => navigate('/teamPage', { state: team })}
        style={{
        cursor: 'pointer',
        backgroundColor: '#f4d2ad',
        borderRadius: '12px',
        padding: '16px',
        width: '240px',
        fontFamily: 'sans-serif',
        color: '#5a3e2b',
        position: 'relative',
        boxShadow: selected ? '0 0 0 2px #8c6b4f' : 'none'
      }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="team logo"
            style={{ width: 40, height: 40, borderRadius: '8px', marginRight: '10px', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#d6a77a',
            borderRadius: '8px',
            marginRight: '10px'
          }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          <div style={{ fontSize: '14px' }}>{country} - {points} RK</div>
        </div>
        {badgeUrl && (
          <img src={badgeUrl} alt="badge" style={{ width: 16, height: 16 }} />
        )}
        {selected && (
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: 16
          }}>✔</span>
        )}
        {!selected && (
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: 16
          }}>X</span>
        )}
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #d6a77a', marginBottom: 8 }} />
      <div style={{ fontSize: '14px' }}>
        {description}
      </div>
    </div>
  );
};

export default TeamCard;