import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/tournaments.css';
import defaultLogo from "../assets/images/trophy.webp";

const TournamentList = ({ title, apiUrl, extractFromField = null }) => {
    const [tournaments, setTournaments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await fetch(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                const data = await res.json();
                const extracted = extractFromField ? data[extractFromField] : data;

                if (!Array.isArray(extracted)) {
                    console.error("⚠️ Réponse inattendue (pas un tableau) :", data);
                    setTournaments([]);
                } else {
                    setTournaments(extracted);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des tournois:", err);
                setTournaments([]);
            }
        };

        fetchTournaments();
    }, [apiUrl, extractFromField]);

    const filteredTournaments = tournaments.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="tournament-card">
            <h2 className="tournament-card-title">{title}</h2>
            <input
                type="text"
                placeholder="🔍 Research"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tournament-search"
            />

            <div className="tournament-list-scroll">
                {filteredTournaments.map((tournament, index) => (
                    <div
                        key={index}
                        className="tournament-item"
                        onClick={() =>
                            navigate('/tournamentPage', { state: { id: tournament.id, data: tournament } })
                        }
                    >
                        <div className="tournament-info-left">
                            <img
                                src={tournament.image || defaultLogo}
                                alt="trophy"
                                className="tournament-logo"
                            />
                            <div>
                                <strong>{tournament.name}</strong>
                                <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                                    Elo: {tournament.elomin} – {tournament.elomax}
                                </div>
                            </div>
                        </div>
                        <div className="tournament-info-right">
                            By <strong>{tournament.creator}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentList;
