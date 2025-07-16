import React, { useEffect, useState } from 'react';

const TeamPresentationCard = ({
                                teamId,
                                image,
                                name,
                                game,
                                description,
                                status,
                                fetchEligiblePlayers,
                                setShowInviteModal,
                                isOwner
                              }) => {
  const [myTeamId, setMyTeamId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:4000/teams/my-team', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setMyTeamId(data.teamId);
      } catch (err) {
        console.error('Erreur lors de la récupération de la team personnelle :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTeam();
  }, []);

  const handleJoin = async () => {
    try {
      const res = await fetch(`http://localhost:4000/teams/${teamId}/join`, { method: 'POST' });
      if (res.ok) alert('Vous avez rejoint l’équipe.');
      else alert('Erreur lors de la tentative de rejoindre.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuit = async () => {
    try {
      const res = await fetch(`http://localhost:4000/teams/${teamId}/leave`, { method: 'POST' });
      if (res.ok) alert('Vous avez quitté l’équipe.');
      else alert('Erreur lors de la tentative de quitter.');
    } catch (err) {
      console.error(err);
    }
  };

  let actionButtons = null;
  if (!loading) {
    if (teamId === myTeamId) {
      actionButtons = (
          <button onClick={handleQuit} style={btnStyle('#ff4d4d', '#ff1a1a')}>Quit</button>
      );
    } else if (!status) {
      actionButtons = (
          <button onClick={handleJoin} style={btnStyle('#00ffaa', '#00cc88')}>Join</button>
      );
    }
  }

  return (
      <div className="team-card-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
          <img
              src={image}
              alt={`${name} logo`}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '10%',
                border: '2px solid #fff',
              }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{name}</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>{game}</p>
          </div>
        </div>

        <div style={{ flexGrow: 1, marginTop: '10px', color: '#ddd' }}>
          <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{name} – La puissance d’un monstre à plusieurs têtes</p>
          <p style={descStyle}>{description}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2%', gap: '8px' }}>
          {isOwner && (
              <button
                  onClick={() => {
                    fetchEligiblePlayers();
                    setShowInviteModal(true);
                  }}
                  style={btnStyle('#FFD966', '#d4b04d')}
              >
                Inviter
              </button>
          )}
          {actionButtons}
        </div>
      </div>
  );
};

// On supprime complètement l'ancien cardStyle
// Ce style sera maintenant contrôlé par `.teampage-card` (déjà utilisé ailleurs)

const descStyle = {
  marginTop: '8px',
  fontSize: '0.85rem',
  lineHeight: '1.4',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
};

const btnStyle = (bg, shadow) => ({
  backgroundColor: bg,
  border: 'none',
  padding: '8px 16px',
  borderRadius: '24px',
  boxShadow: `0 0 8px ${shadow}`,
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  color: '#111',
});

export default TeamPresentationCard;
