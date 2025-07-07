import React, { useState, useEffect } from 'react';
import ImageUpload from './imageUpload';
import PlayerList from './playerList';

function totalPoints(players) {
  return players.reduce((sum, player) => sum + (player.points || 0), 0);
}

const CreateTeamForm = ({onSubmit, onClose}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nationality, setNationality] = useState('');
  const [game, setGame] = useState('');
  const [players, setPlayers] = useState([]);
  const [logoBase64, setLogoBase64] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch('http://localhost:4000/users/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        console.log("📦 Données reçues depuis /users/all :", data);
        setPlayers(data);
      } catch (err) {
        console.error("Erreur lors du chargement des joueurs :", err);
      }
    };

    fetchPlayers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    try {
      if (!token) {
        console.error("❌ Aucun token trouvé dans le localStorage !");
        return;
      }

      const teamData = {
        name,
        description,
        //country: nationality,
        tag: game,
        //players,
        //points: totalPoints(players),
        //logo: logoBase64
      };

      const res = await fetch(`http://localhost:4000/teams/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamData)
      });

      if (res.ok) {
        console.log("✅ Équipe créée avec succès !");
        onClose();
      } else {
        console.error("Erreur lors de la création :", await res.text());
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };


  return (
    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <ImageUpload onImageUpload={setLogoBase64} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
          <select
            value={nationality}
            onChange={e => setNationality(e.target.value)}
            style={inputStyle}
          >
            <option>Nationality</option>
            <option>France</option>
            <option>Germany</option>
            <option>USA</option>
          </select>
          <select
            value={game}
            onChange={e => setGame(e.target.value)}
            style={inputStyle}
          >
            <option>Game</option>
            <option value="Lol">League of Legends</option>
            <option value="FN">Fortnite</option>
          </select>
        </div>

        <textarea
          placeholder="Description.."
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{
            flexGrow: 1,
            height: '180px',
            resize: 'none',
            border: '2px solid #d6a77a',
            borderRadius: '8px',
            padding: '8px',
            fontFamily: 'inherit',
            fontSize: '14px',
            backgroundColor: '#f4d2ad'
          }}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
          <PlayerList players={players} />
      </div>

      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button type="submit" style={{
          backgroundColor: '#e2b583',
          border: 'none',
          borderRadius: '16px',
          padding: '10px 24px',
          fontWeight: '600',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}>
          Create
        </button>
      </div>
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

export default CreateTeamForm;