import React, { useState } from 'react';

const CreateTournamentForm = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [backgroundBase64, setBackgroundBase64] = useState('');
  const [maxTeams, setMaxTeams] = useState(4);
  const [game, setGame] = useState('LoL');
  const [eloMin, setEloMin] = useState(0);
  const [eloMax, setEloMax] = useState(10);
  const [startDate, setStartDate] = useState('');

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('access_token');

        const meRes = await fetch('http://localhost:4000/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const meData = await meRes.json();
        const userId = meData.userId;
        const userName = meData.userName;
        console.log("Role dans meData.role : ", meData.role);
        if (meData.role !== 'admin' && meData.role !== 'moderator') {
            alert("Seuls les administrateurs ou modérateurs peuvent créer un tournoi.");
            return;
        }

        const tournamentData = {
            name,
            userId,
            userName,
            game,
            start_date: startDate,
            max_teams: parseInt(maxTeams, 10),
            image: imageBase64,
            background: backgroundBase64,
            elo_min: eloMin,
            elo_max: eloMax
        };

        const res = await fetch(`http://localhost:4000/tournaments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(tournamentData)
        });


        if (res.ok) {
        onClose();
      } else {
        console.error("Erreur lors de la création :", await res.text());
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (

    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
      <div style={{
        backgroundColor: '#fff6e5',
        border: '1px solid #d6a77a',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '13px',
        color: '#5c4734'
      }}>
        📌 À la création d’un tournoi, son statut est <b>“upcoming”</b> par défaut. Pensez à l’ouvrir pour permettre aux équipes de s’inscrire !
      </div>
      <input
        type="text"
        placeholder="Tournament name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={inputStyle}
      />

      <label style={{ fontWeight: 'bold' }}>Tournament Image:</label>
      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setImageBase64)} />

      <label style={{ fontWeight: 'bold' }}>Background Image:</label>
      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setBackgroundBase64)} />

      <label style={{ fontWeight: 'bold' }}>Max teams:</label>
      <select value={maxTeams} onChange={e => setMaxTeams(parseInt(e.target.value))} style={inputStyle}>
        <option value={4}>4</option>
        <option value={8}>8</option>
        <option value={16}>16</option>
      </select>
        <label style={{ fontWeight: 'bold' }}>Start date:</label>
        <input
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={inputStyle}
        />

        <label style={{ fontWeight: 'bold' }}>Game:</label>
        <input
            type="text"
            placeholder="ex: League of Legends"
            value={game}
            onChange={e => setGame(e.target.value)}
            style={inputStyle}
        />

        <label style={{ fontWeight: 'bold' }}>Elo min :</label>
      <input
          type="number"
          min="0"
          max="10"
          value={eloMin}
          onChange={e => setEloMin(parseInt(e.target.value))}
          style={inputStyle}
      />

      <label style={{ fontWeight: 'bold' }}>Elo max :</label>
      <input
          type="number"
          min="0"
          max="10"
          value={eloMax}
          onChange={e => setEloMax(parseInt(e.target.value))}
          style={inputStyle}
      />

      <button type="submit" style={buttonStyle}>Create</button>
    </form>
  );
};

const inputStyle = {
  border: '2px solid #d6a77a',
  borderRadius: '8px',
  padding: '8px',
  fontSize: '14px',
  backgroundColor: '#f4d2ad',
  fontFamily: 'inherit'
};

const buttonStyle = {
  backgroundColor: '#e2b583',
  border: 'none',
  borderRadius: '16px',
  padding: '10px 24px',
  fontWeight: '600',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  cursor: 'pointer'
};

export default CreateTournamentForm;