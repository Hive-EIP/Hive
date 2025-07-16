import React, { useState, useEffect } from "react";
import '../styles/teamPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../components/navbar";
import defaultPlayer from '../assets/images/defaultPlayer.png';
import { jwtDecode } from "jwt-decode";

function TeamPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [teamStats, setTeamStats] = useState({});
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [eligiblePlayers, setEligiblePlayers] = useState([]);
    const [search, setSearch] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null); // ✅ Ajout

    useEffect(() => {
        const fetchTeamAndPlayers = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            try {
                const decoded = jwtDecode(token); // ✅ Récupère l'user ID
                // console.log("🧩 Token décodé :", decoded);

                setCurrentUserId(decoded.id);

                const resTeam = await fetch(`http://localhost:4000/teams/${id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (!resTeam.ok) throw new Error(`Erreur HTTP: ${resTeam.status}`);
                const teamData = await resTeam.json();
                setTeam(teamData);
                // console.log("🛡️ Team récupérée :", teamData);

                const resMembers = await fetch(`http://localhost:4000/teams/${id}/members`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const membersData = await resMembers.json();

                if (Array.isArray(membersData)) {
                    const updatedPlayers = membersData.map(player => ({
                        ...player,
                        profile_picture_url: player.profile_picture_url || defaultPlayer,
                    }));
                    setPlayers(updatedPlayers);
                } else {
                    setPlayers([]);
                }

            } catch (err) {
                console.error("Erreur lors de la récupération des données :", err);
            }
        };

        fetchTeamAndPlayers();
    }, []);

    const fetchEligiblePlayers = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:4000/users/${id}/candidates`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const data = await res.json();
            setEligiblePlayers(data.players || []);
            console.log("Joueurs éligibles reçus :", data.players);

        } catch (err) {
            console.error("Erreur chargement joueurs éligibles :", err);
        }
    };

    const handleInvite = async (invitedUserId) => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:4000/teams/${id}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({invitedUserId}),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Invitation envoyée !");
                setEligiblePlayers(prev => prev.filter(p => p.id !== invitedUserId));
            } else {
                alert(data.error || "Erreur lors de l’invitation.");
            }
        } catch (err) {
            console.error("Erreur envoi invitation :", err);
        }
    };

    const renderInviteModal = () => {
        return (
            <div
                className="modal-overlay"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999,
                }}
            >
                <div
                    className="modal-content"
                    style={{
                        backgroundColor: '#ffffff',
                        padding: '30px',
                        borderRadius: '10px',
                        width: '400px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        textAlign: 'center',
                        color: '#1e1e1e'
                    }}>
                        Search a player
                    </div>

                    <h2>Invite a player</h2>
                    <input
                        type="text"
                        placeholder="Search a player..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    <div className="player-list">
                        {eligiblePlayers
                            .filter((p) =>
                                p.username.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((player) => (
                                <div
                                    key={player.id}
                                    className="player-item"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #eee',
                                        color: '#1a1a1a',
                                    }}
                                >
                                    {player.username}
                                    <button
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#ffd966',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleInvite(player.id)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                    </div>
                    <button
                        onClick={() => setShowInviteModal(false)}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#eee',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    if (!team) {
        return <div style={{padding: '100px', textAlign: 'center'}}>Chargement de l'équipe...</div>;
    }
    //console.log("🧑 ID utilisateur courant :", currentUserId);
    const isOwner = currentUserId === team.owner_id; // ✅ Comparaison avec l’ID du token
    //console.log("🧮 Est-ce le propriétaire ?", currentUserId === team?.owner_id);
    //console.log("🆔 team.owner_id =", team?.owner_id, "| currentUserId =", currentUserId);


    return (
        <div className="teampage-container">
            <div className="navbar-fixed">
                <Navbar />
            </div>
            <div className="team-sections-wrapper">

                <div className="teampage-card team-info-card">
                    <div className="team-info-header">
                        <img src={team.logoUrl} alt={`${team.name} logo`} className="team-logo" />
                        <div className="team-name-game">
                            <h2 className="team-name">{team.name}</h2>
                            <p className="team-game">{team.game}</p>
                        </div>
                    </div>

                    <div className="team-description">
                        <p className="team-tagline">{team.name} – The power of a multi-headed monster</p>
                        <p className="team-desc">{team.description}</p>
                    </div>

                    {isOwner && (
                        <div className="team-actions">
                            <button className="invite-btn" onClick={() => {
                                fetchEligiblePlayers();
                                setShowInviteModal(true);
                            }}>
                                Invite
                            </button>
                        </div>
                    )}
                </div>

                <div className="teampage-card team-members-card">
                    <h3 className="section-title">Team Members</h3>
                    <div className="members-list">
                        {players.map((player) => (
                            <div className="member-card" key={player.id}>
                                <img src={player.profile_picture_url} alt={player.username} className="member-avatar" />
                                <span className="member-username">{player.username}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="teampage-card team-video-card">
                    <h3 className="section-title">Presentation Video</h3>
                    <div className="video-container">
                        <iframe
                            width="100%"
                            height="315"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

            </div>

            {/* Invite Modal */}
            {showInviteModal && renderInviteModal()}
        </div>

    );
}
export default TeamPage;
