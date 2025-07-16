import React, { useState, useEffect } from "react";
import '../styles/tournaments.css';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import TournamentList from "../components/tournamentList";
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
        <div className="tournament-page">
            <Navbar />

            <div className="tournament-header">
                <button className="create-tournament-button" onClick={() => setShowCreateModal(true)}>
                    Create a tournament
                </button>
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                            &times;
                        </button>
                        <h2>Create a tournament</h2>
                        <CreateTournamentForm onSubmit={handleSubmit} onClose={() => setShowCreateModal(false)} />
                    </div>
                </div>
            )}

            <div className="tournament-lists">
                <TournamentList
                    title="Global tournaments"
                    apiUrl="http://localhost:4000/tournaments/global"
                />
                {myTeamId !== null && (
                    <TournamentList
                        title="Subscribed tournaments"
                        apiUrl={`http://localhost:4000/tournaments/registered/${myTeamId}`}
                        extractFromField="tournaments"
                    />
                )}
            </div>
        </div>
    );
}

export default Tournaments;
