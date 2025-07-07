import React, { useState, useEffect } from "react";
import '../styles/tournaments.css'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import TournamentList from "../components/tournamentList";
import ModalPage from "../components/modalPage";
import CreateTournamentForm from "../components/createTournamentForm";

function Tournaments() {
  const navigation = useNavigate();
  const [myTeamId, setMyTeamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchMyTeam = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.warn("Pas de token trouvé");
            setLoading(false);
            return;
        }
      try {
          const res = await fetch('http://localhost:4000/teams/my-team', {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          if (!res.ok) {
              throw new Error(`Erreur HTTP ${res.status}`);
          }
          const data = await res.json();
          console.log("teamId :", data[0]?.id);
          setMyTeamId(data[0]?.id || null);
      } catch (err) {
        console.error('Erreur lors de la récupération de la team personnelle :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTeam();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    setShowCreateModal(false);
  };
  
  return (
    <div className="basic-container">
      <div className="top-page-teams">
        <Navbar />
      </div>
      <div className="upper-container-teams"></div>
      <button
        style={{
          backgroundColor: '#e2bfff',
          border: 'none',
          height: '20px',
          width: '150px',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#333',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'transform 0.2s ease',
          justifyContent: 'center',
        }}
        onClick={() => setShowCreateModal(true)}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Create a tournament
      </button>

      {showCreateModal && (
        <ModalPage onClose={() => setShowCreateModal(false)}>
          <h2>Create a tournament</h2>
          <CreateTournamentForm onSubmit={handleSubmit} onClose={() => setShowCreateModal(false)} />
        </ModalPage>
      )}
       <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: 'calc(100vh - 120px)',
          paddingTop: '2%',
          paddingBottom: '10px',
          boxSizing: 'border-box',
          gap: '5%',
        }}>
            <TournamentList title="Global tournaments"
                            apiUrl={`http://localhost:4000/tournaments/global`}
            />
           {myTeamId !== null && (
               <TournamentList
                   title="Subscribed tournaments"
                   apiUrl={`http://localhost:4000/tournaments/registered/${myTeamId}`}
                   extractFromField="tournaments"
               />
           )}

       </div>
      <div className="bottom-page-teams"></div>
    </div>
  );
}

export default Tournaments;