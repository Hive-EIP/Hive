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
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                    type="text"
                    placeholder="🔍 Rechercher"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                    style={{
                        backgroundColor: '#f6e8da',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        border: 'none',
                        outline: 'none',
                        width: '200px',
                    }}
                />
                <span style={{ color: '#5c4635', fontWeight: 500, paddingLeft: '50%' }}>
          Current rank : {totalPoints(selectedPlayers)} points
        </span>
            </div>

            {searchFocused && filteredPlayers.length > 0 && (
                <div
                    style={{
                        backgroundColor: '#f4d2ad',
                        borderRadius: '8px',
                        padding: '8px',
                        marginBottom: '12px',
                        maxHeight: '150px',
                        overflowY: 'auto',
                    }}
                >
                    {filteredPlayers.map((player, index) => (
                        <div
                            key={index}
                            onClick={() => handleAddPlayer(player)}
                            style={{
                                padding: '6px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                backgroundColor: '#fbe2c2',
                            }}
                        >
                            {player.username} – {player.points || 0} pts
                        </div>
                    ))}
                </div>
            )}

            {searchFocused && filteredPlayers.length === 0 && (
                <div style={{ color: '#a33', fontWeight: 'bold', padding: '8px' }}>
                    Impossible de charger les données d’utilisateurs ou aucun joueur trouvé.
                </div>
            )}

            <div
                style={{
                    backgroundColor: '#f6e8da',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    width: '100%',
                }}
            >
                {displayedPlayers.map((player, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <img
                            src={player.picture}
                            alt="player"
                            style={{ width: 60, height: 60, borderRadius: '50%' }}
                        />
                        <div style={{ fontSize: '12px' }}>
                            {player.username}<br />
                            {player.rank}<br />
                            {player.points} points
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerList;
