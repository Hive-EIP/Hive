import React, { useState, useEffect } from "react";
import '../styles/teams.css'
import Logo from "../assets/images/hiveLogo.png"
import TeamCard from '../components/teamCard';
import TeamFilters from "../components/teamFilters";
import ModalPage from "../components/modalPage";
import CreateTeamForm from "../components/createTeamForm";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";

function Teams() {

  const navigation = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('http://localhost:4000/teams/', { method: 'GET' });
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Erreur lors du chargement des équipes :", err);
      }
    };

    fetchTeams();
  }, []);

const handleSubmit = (e) => {
    e.preventDefault();
  
    setShowCreateModal(false);
};

const [filters, setFilters] = useState({
    game: "",
    status: "",
    rank: ""
});

const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
};

const filteredTeams = teams.filter(team => {
return (
    (filters.game === "" || filters.game === "Game" || team.game === filters.game) &&
    (filters.status === "" || filters.status === "Status" || team.status === filters.status) &&
    (filters.rank === "" || filters.rank === "Rank" || team.rank === filters.rank)
);
});

return (
  <div className="basic-container">
    <div className="top-page-teams">
      <Navbar/>
    </div>
    <div className="middle-page-teams">
      <div className="id-container-teams">
        <div className="upper-container-teams">
        </div>
        <TeamFilters onChange={handleChange} />
        <div className="bottom-container-teams">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {filteredTeams.map((team, index) => (
              <TeamCard key={index} {...team} team={team} />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="bottom-page-teams">
      <button className="modal-page" onClick={() => setShowCreateModal(true)}>Create a team</button>
          {showCreateModal && (
          <ModalPage onClose={() => setShowCreateModal(false)}>
              <h2>Create your team</h2>
              <CreateTeamForm onSubmit={handleSubmit} onClose={() => setShowCreateModal(false)} />
          </ModalPage>
          )}
      </div>
  </div>
  );
}

export default Teams;