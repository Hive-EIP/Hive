import React from 'react';
import '../styles/bracket.css';

function Brackets({ rounds, me, onWinnerDeclared }) {
    if (!rounds || Object.keys(rounds).length === 0) {
        return <p className="bracket-empty">Aucun match à afficher.</p>;
    }

    const sortedRounds = Object.keys(rounds)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((key) => rounds[key]);

    const handleDeclareWinner = async (matchId, winnerTeamId) => {
        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(`http://localhost:4000/tournaments/matches/${matchId}/winner`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ winner_id: winnerTeamId })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Erreur API : ${message}`);
            }

            alert("✅ Vainqueur déclaré !");
            if (typeof onWinnerDeclared === 'function') onWinnerDeclared();

        } catch (error) {
            alert(`❌ Erreur réseau : ${error.message}`);
            console.error(error);
        }
    };

    const renderMatch = (match) => (
        <div className="match-box" key={match.id}>
            <div className="match-title" title={`${match.team_a_name} vs ${match.team_b_name}`}>
                <span className="ellipsis">{match.team_a_name || 'TBD'}</span>
                <span className="vs">VS</span>
                <span className="ellipsis">{match.team_b_name || 'TBD'}</span>
            </div>

            <div className="winner-buttons">
                {match.winner_name ? (
                    <div className="winner-label">✅ Gagnant : {match.winner_name}</div>
                ) : (
                    (me?.role === 'admin' || me?.role === 'moderator') && (
                        <>
                            <button onClick={() => handleDeclareWinner(match.id, match.team_a_id)}>✅ {match.team_a_name}</button>
                            <button onClick={() => handleDeclareWinner(match.id, match.team_b_id)}>✅ {match.team_b_name}</button>
                        </>
                    )
                )}
            </div>
        </div>
    );

    return (
        <div className="bracket-container">
            <div className="bracket-wrapper">
                {sortedRounds.map((matches, roundIndex) => (
                    <div className="bracket-column" key={roundIndex}>
                        <h3 className="bracket-round">
                            {roundIndex === sortedRounds.length - 1 ? 'FINALE' :
                                roundIndex === sortedRounds.length - 2 ? 'DEMI-FINALE' :
                                    `ROUND ${roundIndex + 1}`}
                        </h3>
                        {matches.map(renderMatch)}
                    </div>
                ))}

                {/* Lignes SVG */}
                <svg className="bracket-svg">
                    {sortedRounds.slice(0, -1).map((matches, roundIndex) => {
                        const nextMatches = sortedRounds[roundIndex + 1];
                        return matches.map((_, matchIndex) => {
                            const nextIndex = Math.floor(matchIndex / 2);
                            const topY = (matchIndex * 170) + 95;
                            const bottomY = ((matchIndex + 1) * 170) + 25;
                            const middleY = (topY + bottomY) / 2;
                            const x1 = 280 + (roundIndex * 320);

                            return (
                                <g key={`c-${roundIndex}-${matchIndex}`}>
                                    <path
                                        d={`M${x1},${topY} C${x1 + 50},${topY} ${x1 + 50},${middleY} ${x1 + 100},${middleY}`}
                                        stroke="rgba(255,0,255,0.6)"
                                        fill="none"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d={`M${x1},${bottomY} C${x1 + 50},${bottomY} ${x1 + 50},${middleY} ${x1 + 100},${middleY}`}
                                        stroke="rgba(255,0,255,0.6)"
                                        fill="none"
                                        strokeWidth="2"
                                    />
                                </g>
                            );
                        });
                    })}
                </svg>
            </div>
        </div>
    );
}

export default Brackets;
