import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Brackets from "../components/brackets";
import defaultBackground from '../assets/images/bgDefaultTournament.jpg';
import defaultImg from '../assets/images/hiveLogo.png';
import '../styles/tournamentPage.css';

function TournamentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tournamentId = location.state?.id;
  const tournamentData = location.state?.data;
  const [rounds, setRounds] = useState(null);
  const [me, setMe] = useState({});
  const [status, setStatus] = useState(tournamentData?.status);
  const [isOwner, setIsOwner] = useState(false);
  const [registeredTeams, setRegisteredTeams] = useState([]);

  console.log("Données tournoi :", tournamentData);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:4000/tournaments/${tournamentId}/matches`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setRounds(data.rounds);
        } else {
          console.error('Erreur API /matches :', data.error);
        }
      } catch (err) {
        console.error('Erreur fetch rounds :', err);
      }
    };

    if (tournamentId) {
      fetchRounds();
    }
  }, [tournamentId]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:4000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (res.ok) {
          setMe(data);

          // Enchaînement avec récupération de la team
          const teamRes = await fetch('http://localhost:4000/teams/my-team', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (teamRes.ok) {
            const team = await teamRes.json();

            if (team.owner_id === data.userId) {
              setIsOwner(true);
            }
          } else {
            console.warn("Pas de team ou erreur teamRes");
          }

        } else {
          console.error("Erreur chargement user :", data.error);
        }
      } catch (err) {
        console.error("Erreur réseau user:", err);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:4000/tournaments/${tournamentId}/teams`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setRegisteredTeams(data.teams);
        } else {
          console.error('Erreur chargement équipes :', data.error);
        }
      } catch (err) {
        console.error('Erreur réseau équipes :', err);
      }
    };

    if (tournamentId) {
      fetchRegisteredTeams();
    }
  }, [tournamentId]);

  const handleOpenTournament = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:4000/tournaments/${tournamentId}/open`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const updated = await res.json();
        setStatus('open'); // Met à jour dynamiquement
      } else {
        console.error("Erreur lors de l’ouverture :", await res.text());
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };
  const handleJoin = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const res = await fetch(`http://localhost:4000/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('✅ Votre équipe a rejoint le tournoi.');
      } else {
        const errText = await res.text();
        alert('❌ Erreur lors de la tentative de rejoindre : ' + errText);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erreur réseau : impossible de rejoindre le tournoi.');
    }
  };
  const handleGenerateMatches = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:4000/tournaments/${tournamentId}/generate-matches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Matchs générés avec succès');
        setRounds(data.rounds); // si ta route retourne les matchs générés
      } else {
        console.error('Erreur génération matchs :', data.error);
      }
    } catch (err) {
      console.error('Erreur réseau génération :', err);
    }
  };
  const handleDeclareWinner = async (matchId, teamId) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:4000/tournaments/matches/${matchId}/winner`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ winnerTeamId: teamId })
      });

      if (res.ok) {
        alert('🏆 Gagnant déclaré !');
        const updated = await res.json();
        setRounds(updated.rounds); // si ton backend renvoie les rounds mis à jour
      } else {
        console.error('Erreur déclaration gagnant :', await res.text());
      }
    } catch (err) {
      console.error('Erreur réseau déclaration :', err);
    }
  };
  const handleUnregister = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:4000/tournaments/${tournamentId}/unregister`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert("✅ Votre équipe a quitté le tournoi.");
        // Mise à jour des équipes
        setRegisteredTeams((prev) => prev.filter(t => t.owner_id !== me.userId));
      } else {
        const err = await res.text();
        alert("❌ Erreur : " + err);
      }
    } catch (err) {
      alert("❌ Erreur réseau");
      console.error(err);
    }
  };
  const handleDeleteTournament = async () => {
    const confirm = window.confirm("⚠️ Es-tu sûr de vouloir supprimer ce tournoi ?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:4000/tournaments/${tournamentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert("✅ Tournoi supprimé !");
        navigate("/tournaments"); // ou navigate(-1) pour revenir en arrière
      } else {
        const err = await res.text();
        alert("❌ Erreur : " + err);
      }
    } catch (err) {
      alert("❌ Erreur réseau");
      console.error(err);
    }
  };

  const backgroundImage = tournamentData?.background && tournamentData.background.trim() !== ""
      ? `url(${tournamentData.background})`
      : `url(${defaultBackground})`;

  const imageTournament = tournamentData?.image && tournamentData.image.trim() !== ""
      ? tournamentData.image
      : defaultImg;

  const canOpenTournament =
      (me.role === 'admin' || me.role === 'moderator' || me.userId === tournamentData?.created_by) &&
      status === 'upcoming';

  return (
      <div className="tournamentPage-container" style={{ backgroundImage }}>
        <div className="tournamentPage-header">
          <div>
            <h1>{tournamentData?.name}</h1>
            <p>Created by: <b>{tournamentData?.creator}</b></p>

            <span className="tournamentPage-elo-badge">
          Allowed Elo: {tournamentData.elomin} → {tournamentData.elomax}
        </span>

            <p>
              Status:
              <span className={`tournamentPage-status-badge ${status === 'open' ? 'tournamentPage-status-open' : 'tournamentPage-status-waiting'}`}>
            {status === 'open' ? '✅ Open for registration' : '🕐 Waiting for launch'}
          </span>
            </p>

            <div className="tournamentPage-teams-count">
              <strong>Registered teams:</strong> {registeredTeams.length} / {tournamentData?.maxteams}
            </div>

            <ul className="tournamentPage-teams-list">
              {registeredTeams.map((team) => (
                  <li key={team.id}>{team.name} (Elo: {team.elo})</li>
              ))}
            </ul>

            {canOpenTournament && (
                <button className="tournamentPage-btn tournamentPage-open-btn" onClick={handleOpenTournament}>
                  🔓 Open tournament for registration
                </button>
            )}

            {registeredTeams.length === tournamentData?.maxteams && !rounds?.length && (
                <button className="tournamentPage-btn tournamentPage-generate-btn" onClick={handleGenerateMatches}>
                  ⚔️ Generate matches
                </button>
            )}
          </div>

          <img src={imageTournament} alt="tournament" className="tournamentPage-image" />
        </div>

        {/* 🔽 Moved buttons here */}
        <div className="tournamentPage-button-group">
          {isOwner && status === 'open' && (
              <button className="tournamentPage-btn tournamentPage-join-btn" onClick={handleJoin}>
                🚀 Join the tournament with your team
              </button>
          )}

          {isOwner && status === 'open' && registeredTeams.some(t => t.owner_id === me.userId) && (
              <button className="tournamentPage-btn tournamentPage-quit-btn" onClick={handleUnregister}>
                ❌ Leave the tournament
              </button>
          )}

          {(me.role === 'admin' || me.role === 'moderator' || me.userId === tournamentData?.created_by) && (
              <button className="tournamentPage-btn tournamentPage-delete-btn" onClick={handleDeleteTournament}>
                🗑 Delete tournament
              </button>
          )}

          <button className="tournamentPage-btn tournamentPage-back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        {/* Brackets */}
        <div className="tournamentPage-brackets">
          {rounds && Object.keys(rounds).length > 0 ? (
              <Brackets
                  rounds={rounds}
                  me={me}
                  onWinnerDeclared={() => {
                    const token = localStorage.getItem('access_token');
                    fetch(`http://localhost:4000/tournaments/${tournamentId}/matches`, {
                      headers: { Authorization: `Bearer ${token}` }
                    })
                        .then(res => res.json())
                        .then(data => setRounds(data.rounds))
                        .catch(err => console.error(err));
                  }}
              />
          ) : (
              <p className="tournamentPage-no-matches">No matches to display.</p>
          )}
        </div>
      </div>
  );

}

export default TournamentPage;