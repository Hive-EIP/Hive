import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/tournaments.css';

const TournamentList = ({ title, apiUrl }) => {
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setTournaments(data);
      } catch (err) {
        console.error("Erreur lors du chargement des tournois:", err);
      }
    };
    fetchTournaments();
  }, [apiUrl]);

  const filteredTournaments = tournaments.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{title}</h2>
      <input
        type="text"
        placeholder="🔍 Rechercher"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          backgroundColor: '#f6e8da',
          borderRadius: '20px',
          padding: '6px 12px',
          border: 'none',
          outline: 'none',
          width: '50%',
          marginBottom: '12px'
        }}
      />
      <div style={{
        width: '100%',
        backgroundColor: '#fff1e2',
        padding: '16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderRadius: '20px',
        gap: '8px'
      }}>
        {filteredTournaments.map((tournament, index) => (
          <div
            key={index}
            onClick={() => navigate('/tournamentPage', { state: { id: tournament.tournamentId, data: tournament } })}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fce5cd',
              padding: '1px',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={`${tournament.image}`}
                alt="tournament"
                style={{ width: '32px', height: '32px', borderRadius: '4px' }}
              />
              <span style={{ fontWeight: '500', color: 'black' }}>{tournament.name}</span>
            </div>
              <div style={{ fontSize: '12px', color: '#6e4f3a', display: 'flex', gap: '25px' }}>
                <span>Elo restriction: {tournament.elo_restriction}</span>
                <span>Created by: <b>{tournament.creator}</b></span>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentList;
