import React from 'react';

function Brackets({ rounds }) {
  const roundCount = rounds.length;
  
  // Calculer la hauteur totale basée sur le premier round
  const totalHeight = rounds[0]?.length * 120 || 240;
  
  const renderConnections = (roundIndex) => {
    if (roundIndex === roundCount - 1) return null;
    
    const currentMatches = rounds[roundIndex];
    const nextMatches = rounds[roundIndex + 1];
    
    return currentMatches.map((_, matchIndex) => {
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const isTop = matchIndex % 2 === 0;
      
      // Position verticale du match actuel
      const currentY = (matchIndex + 0.5) * (totalHeight / currentMatches.length);
      // Position verticale du match suivant
      const nextY = (nextMatchIndex + 0.5) * (totalHeight / nextMatches.length);
      
      return (
        <svg
          key={`connection-${roundIndex}-${matchIndex}`}
          style={{
            position: 'absolute',
            left: '220px',
            top: 0,
            width: '80px',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {/* Ligne horizontale sortante */}
          <line
            x1="0"
            y1={currentY}
            x2="40"
            y2={currentY}
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2"
          />
          
          {/* Ligne verticale de connexion (seulement pour le match du haut de chaque paire) */}
          {isTop && (
            <>
              <line
                x1="40"
                y1={currentY}
                x2="40"
                y2={currentY + (totalHeight / currentMatches.length)}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2"
              />
              {/* Ligne horizontale vers le match suivant */}
              <line
                x1="40"
                y1={nextY}
                x2="80"
                y2={nextY}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      );
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          gap: '80px',
          position: 'relative'
        }}
      >
        {rounds.map((matches, roundIndex) => (
          <div
            key={roundIndex}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              height: `${totalHeight}px`,
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Titre du round */}
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {roundIndex === roundCount - 1 
                ? 'FINALE' 
                : roundIndex === roundCount - 2 
                ? 'DEMI-FINALE'
                : `ROUND ${roundIndex + 1}`
              }
            </div>
            
            {matches.map((match, matchIndex) => (
              <div
                key={matchIndex}
                style={{
                  backgroundColor: 'rgba(226, 191, 255, 0.95)',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  color: '#333',
                  width: '200px',
                  minHeight: '70px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  {match.teamA || 'TBD'}
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  margin: '2px 0', 
                  fontSize: '11px',
                  color: '#666'
                }}>
                  VS
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                  {match.teamB || 'TBD'}
                </div>
                {match.score && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#8B5CF6', 
                    fontWeight: 'bold',
                    marginTop: '4px'
                  }}>
                    {match.score}
                  </div>
                )}
              </div>
            ))}
            
            {/* Rendu des connexions */}
            {renderConnections(roundIndex)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Brackets;