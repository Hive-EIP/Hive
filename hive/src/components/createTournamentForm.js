import React, { useState } from 'react';

const CreateTournamentForm = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [backgroundBase64, setBackgroundBase64] = useState('');
  const [maxTeams, setMaxTeams] = useState(4);

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
      const meRes = await fetch('http://localhost:4000/me');
      const meData = await meRes.json();
      const userId = meData.userId;
      const userName = meData.userName;

      const tournamentData = {
        name,
        userId,
        userName,
        max_teams: parseInt(maxTeams, 10),
        image: imageBase64,
        background: backgroundBase64,
      };

      const res = await fetch(`http://localhost:4000/tournaments/${userId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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