import React, { useEffect, useState } from 'react';

const TeamPresentationCard = ({ teamId, image, name, game, description, status }) => {
  const [myTeamId, setMyTeamId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:4000/teams/my-team', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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

  let actionButtons = null;

  const handleJoin = async () => {
    try {
      const res = await fetch(`http://localhost:4000/teams/${teamId}/join`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Vous avez rejoint l’équipe.');
        //window.location.reload();
      } else {
        alert('Erreur lors de la tentative de rejoindre.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuit = async () => {
    try {
      const res = await fetch(`http://localhost:4000/teams/${teamId}/leave`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Vous avez quitté l’équipe.');
        //window.location.reload();
      } else {
        alert('Erreur lors de la tentative de quitter.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvite = async () => {
    try {
      const res = await fetch(`http://localhost:4000/teams/${teamId}/invite`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Invitation envoyée.');
      } else {
        alert('Erreur lors de l’envoi de l’invitation.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!loading) {
    if (teamId === myTeamId) {
      actionButtons = (
        <>
          <button onClick={handleQuit} style={btnStyle('#f2827f', '#c76967')}>Quit</button>
          <button onClick={handleInvite} style={btnStyle('#ffd966', '#d1b954')}>Invite</button>
        </>
      );
    } else if (!status) {
      actionButtons = (
        <button onClick={handleJoin} style={btnStyle('#a6e8c8', '#8cbfae')}>Join</button>
      );
    }
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3%' }}>
        <img
          src={image}
          alt={`${name} logo`}
          style={{
            width: '15%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            borderRadius: '10%',
          }}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.2vw' }}>{name}</h2>
          <p style={{ margin: 0, fontSize: '1vw', color: '#3a3a3a' }}>{game}</p>
        </div>
      </div>

      <div style={{ flexGrow: 1, marginTop: '2%' }}>
        <p style={{ fontWeight: 'bold', fontSize: '1vw', margin: 0 }}>
          {name} – La puissance d’un monstre à plusieurs têtes
        </p>
        <p style={descStyle}>{description}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2%', gap: '8px' }}>
        {actionButtons}
      </div>
    </div>
  );
};

const cardStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  backgroundColor: '#e6c5a8',
  padding: '2%',
  borderRadius: '1.5%',
  fontFamily: 'sans-serif',
  color: '#1e1e1e',
};

const descStyle = {
  marginTop: '1%',
  fontSize: '0.95vw',
  lineHeight: '1.4',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 6,
  WebkitBoxOrient: 'vertical',
};

const btnStyle = (bg, shadow) => ({
  backgroundColor: bg,
  border: 'none',
  padding: '0.8vw 1.5vw',
  borderRadius: '2vw',
  boxShadow: `0.4vw 0.4vw ${shadow}`,
  fontSize: '1vw',
  fontWeight: 500,
  cursor: 'pointer',
  color: '#1f1f1f',
});

export default TeamPresentationCard;
