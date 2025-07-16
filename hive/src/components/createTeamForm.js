import React, { useState, useEffect } from 'react';
import ImageUpload from './imageUpload';
import PlayerList from './playerList';
import '../styles/createTeamForm.css';

function totalPoints(players) {
  return players.reduce((sum, player) => sum + (player.points || 0), 0);
}

const CreateTeamForm = ({ onSubmit, onClose }) => {
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
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
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
    if (!token) return console.error("❌ Aucun token trouvé dans le localStorage !");

    const teamData = {
      name,
      description,
      tag: game,
    };

    try {
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
      <form onSubmit={handleCreate} className="modal-page">
        <h2>Create your team</h2>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <ImageUpload onImageUpload={setLogoBase64} />

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
            />
            <select value={nationality} onChange={e => setNationality(e.target.value)}>
              <option>Nationality</option>
              <option>France</option>
              <option>Germany</option>
              <option>USA</option>
            </select>
            <select value={game} onChange={e => setGame(e.target.value)}>
              <option>Game</option>
              <option value="Lol">League of Legends</option>
              <option value="FN">Fortnite</option>
            </select>
          </div>

          <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description.."
          />
        </div>

        <div className="player-list-container">

          <PlayerList players={players} />
        </div>

        <button type="submit" className="create-button">Create</button>
      </form>
  );
};

export default CreateTeamForm;
