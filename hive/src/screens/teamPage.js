import React, { useState, useEffect } from "react";
import '../styles/teams.css';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import NotMovableProfil from "../components/notMovableProfil";
import TeamPresentationCard from "../components/teamPresentationCard";
import VideoCard from "../components/videoCard";
import TeamStats from "../components/teamStats";
import defaultPlayer from '../assets/images/defaultPlayer.png';
import { useParams } from 'react-router-dom';


function TeamPage() {
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [teamStats, setTeamStats] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchTeamAndPlayers = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            try {
                const resTeam = await fetch(`http://localhost:4000/teams/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!resTeam.ok) throw new Error(`Erreur HTTP: ${resTeam.status}`);

                const teamData = await resTeam.json();
                setTeam(teamData);


                const resMembers = await fetch(`http://localhost:4000/teams/${id}/members`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const membersData = await resMembers.json();
                console.log("Membres récupérés :", membersData);


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

    if (!team) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Chargement de l'équipe...</div>;
    }

    return (
        <div className="basic-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '80px',
                zIndex: 10,
            }}>
                <Navbar />
            </div>

            <div
                style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '48% 48%',
                    gridTemplateRows: '46% 46%',
                    gap: '24px',
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    paddingTop: '120px',
                    justifyContent: 'center',
                }}
            >
                <div style={{ backgroundColor: '#f7c59f', borderRadius: '8px', width: '100%', height: '100%', overflow: 'hidden' }}>
                    <TeamPresentationCard
                        teamId={team.id}
                        image={team.logoUrl}
                        name={team.name}
                        game={team.game}
                        description={team.description}
                        status={team.selected}
                    />
                </div>
                <div style={{ backgroundColor: '#f6ab6c', borderRadius: '8px' }}>
                    {/* Tu peux laisser vide ou mettre autre chose */}
                </div>
                <div style={{ backgroundColor: '#ed8663', borderRadius: '8px' }}>
                    Player: {players.length}
                    <NotMovableProfil players={players} />
                </div>
                <div style={{ backgroundColor: '#d75c37', borderRadius: '8px', width: '100%', height: '100%' }}>
                    <VideoCard videoSrc={teamStats.videoSrc || ''} />
                </div>
            </div>
        </div>
    );
}

export default TeamPage;
