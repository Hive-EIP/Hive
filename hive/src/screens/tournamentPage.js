import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Brackets from "../components/brackets";

function TournamentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tournamentId = location.state?.id;
  const tournamentData = location.state?.data;
  const isJoined = true

  const handleJoin = async () => {
    try {
      const meRes = await fetch('http://localhost:4000/me');
      const meData = await meRes.json();
      const userId = meData.userId;

      const res = await fetch(`http://localhost:4000/tournaments/${userId}/${tournamentId}/join`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Vous avez rejoint l’équipe.');
        //window.location.reload();
      } else {
        alert('Erreur lors de la tentative de rejoindre.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuit = async () => {
    try {
      const meRes = await fetch('http://localhost:4000/me');
      const meData = await meRes.json();
      const userId = meData.userId;

      const res = await fetch(`http://localhost:4000/tournaments/${userId}/${tournamentId}/leave`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Vous avez quitté l’équipe.');
        //window.location.reload();
      } else {
        alert('Erreur lors de la tentative de quitter.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${tournamentData?.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "40px",
        boxSizing: "border-box",
        overflowX: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px", color: "white" }}>
        <div>
          <h1 style={{ fontSize: "32px", margin: 0 }}>{tournamentData?.name}</h1>
          <p style={{ fontSize: "14px" }}>created by : <b>{tournamentData?.creator}</b></p>
        </div>
        <img
          src={`${tournamentData?.image}`}
          alt="tournament"
          style={{ width: "96px", height: "96px", borderRadius: "12px" }}
        />
      </div>

      <div style={{ height: '100vh', overflow: 'auto', padding: '40px' }}>
        <Brackets rounds={tournamentData?.rounds} />
      </div>

      <div style={{ position: "absolute", bottom: "16px", right: "16px", display: "flex", gap: "12px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "rgba(226, 191, 255, 1)",
            color: "black",
            padding: "8px 16px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Retour
        </button>

        {isJoined ? (
          <button
            onClick={handleQuit}
            style={{
              backgroundColor: "#ff7f7f",
              color: "white",
              padding: "8px 16px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Quitter
          </button>
        ) : (
          <button
            onClick={handleJoin}
            style={{
              backgroundColor: "#7fff7f",
              color: "black",
              padding: "8px 16px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Rejoindre
          </button>
        )}
      </div>
    </div>
  );
}

export default TournamentPage;
