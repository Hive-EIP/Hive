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
        <div className="team-card" onClick={() => navigate(`/teamPage/${team.id}`)}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
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
                        backgroundColor: '#333',
                        borderRadius: '8px',
                        marginRight: '10px'
                    }} />
                )}
                <div style={{ flex: 1 }}>
                    <h3>{name}</h3>
                    <p>{country} - {points} RK</p>
                </div>
                {badgeUrl && (
                    <img src={badgeUrl} alt="badge" style={{ width: 18, height: 18 }} />
                )}
            </div>
            <p>{description}</p>
            <button className="team-button">View</button>
        </div>
    );
};

export default TeamCard;
