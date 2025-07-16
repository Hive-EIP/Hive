import React, { useState } from 'react';
import DefaultPlayer from '../assets/images/defaultPlayer.png';

function totalPoints(players) {
    return players.reduce((sum, p) => sum + (p.points || 0), 0);
}

const PlayerList = ({ players }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const filteredPlayers = players.filter(
        (p) =>
            p.username &&
            p.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedPlayers.some((sel) => sel.username === p.username)
    );

    const handleAddPlayer = (player) => {
        if (selectedPlayers.length < 5) {
            setSelectedPlayers([
                ...selectedPlayers,
                {
                    username: player.username,
                    rank: player.rank || 'N/A',
                    points: player.points || 0,
                    picture: player.picture || DefaultPlayer,
                },
            ]);
            setSearchTerm('');
        }
    };

    const emptySlots = 5 - selectedPlayers.length;
    const defaultPlayers = Array.from({ length: emptySlots }, () => ({
        username: 'N/A',
        rank: 'N/A',
        points: 0,
        picture: DefaultPlayer,
    }));

    const displayedPlayers = [...selectedPlayers, ...defaultPlayers];

    return (
        <div className="player-list-container">
            <div className="search-bar">
                <span role="img" aria-label="search">🔍</span>
                <input
                    type="text"
                    placeholder="Rechercher"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                />
                <span style={{ color: '#ff8fa3', fontWeight: 500, marginLeft: 'auto' }}>
          Current rank : {totalPoints(selectedPlayers)} points
        </span>
            </div>

            {searchFocused && filteredPlayers.length > 0 && (
                <div
                    style={{
                        backgroundColor: '#1e1e2f',
                        borderRadius: '12px',
                        padding: '8px',
                        marginBottom: '12px',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        boxShadow: 'inset 0 0 8px rgba(255,0,110,0.2)',
                    }}
                >
                    {filteredPlayers.map((player, index) => (
                        <div
                            key={index}
                            onClick={() => handleAddPlayer(player)}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                backgroundColor: '#2b2b40',
                                marginBottom: '6px',
                                color: '#fff',
                                transition: 'background 0.2s ease',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#3c3c5e'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#2b2b40'}
                        >
                            {player.username} – {player.points || 0} pts
                        </div>
                    ))}
                </div>
            )}

            {searchFocused && filteredPlayers.length === 0 && (
                <div style={{ color: '#ff006e', fontWeight: 'bold', padding: '8px' }}>
                    Aucun joueur trouvé.
                </div>
            )}

            <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '16px',
                justifyContent: 'center'
            }}>
                {displayedPlayers.map((player, i) => (
                    <div key={i} className="player-item">
                        <img
                            src={player.picture}
                            alt="player"
                        />
                        <div>{player.username}</div>
                        <div>{player.rank}</div>
                        <div>{player.points} pts</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerList;
