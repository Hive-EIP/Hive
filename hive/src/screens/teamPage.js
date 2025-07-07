import React, { useState, useEffect } from "react";
import '../styles/teams.css'
import Logo from "../assets/images/hiveLogo.png"
import TeamCard from '../components/teamCard';
import TeamFilters from "../components/teamFilters";
import ModalPage from "../components/modalPage";
import CreateTeamForm from "../components/createTeamForm";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/navbar";
import NotMovableProfil from "../components/notMovableProfil";
import TeamPresentationCard from "../components/teamPresentationCard";
import VideoCard from "../components/videoCard";
import TeamStats from "../components/teamStats";
import Hydra from '../assets/images/team1.png'
import Player from '../assets/images/playerImage.png';
import DefaultPlayer from '../assets/images/defaultPlayer.png';

function TeamPage() {
  const navigation = useNavigate();
  const location = useLocation();
  const team = location.state;
  const [players, setPlayers] = useState([]);
  const [teamStats, setTeamStats] = useState([]);

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      try {
        const resMembers = await fetch(`http://localhost:4000/teams/${team.teamId}/members`, {
          method: 'GET',
        });

        const data = await resMembers.json();
        setPlayers(data);

        const resTeamStats = await fetch(`http://localhost:4000/teams/${team.teamId}/stats`, {
          method: 'GET',
        });

        const dataTeam = await resTeamStats.json();
        console.log(dataTeam)
        setTeamStats(dataTeam);
      } catch (err) {
        console.error("Erreur lors du chargement des joueurs :", err);
      }
    };

    fetchTeamAndPlayers();
  }, []);

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
            teamId={team.teamId}
            image={team.logoUrl}
            name={team.name}
            game={team.game}
            description={team.description}
            status={team.selected}
          />
        </div>
        <div style={{ backgroundColor: '#f6ab6c', borderRadius: '8px' }}>
          <TeamStats winrate={teamStats.winrate} rank={teamStats.rank} elo={teamStats.elo} />
        </div>
        <div style={{ backgroundColor: '#ed8663', borderRadius: '8px' }}>
          <NotMovableProfil players={players} />
        </div>
        <div style={{ backgroundColor: '#d75c37', borderRadius: '8px', width: '100%', height: '100%' }}>
          <VideoCard videoSrc={teamStats.videoSrc} />
        </div>
      </div>
    </div>
  );
}

export default TeamPage;