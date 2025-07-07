// pages/Profile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axioInstance';
import { FaCog } from "react-icons/fa";

import '../styles/profile.css'
import Navbar from "../components/navbar";
import Logo from "../assets/images/hiveLogo.png";

function Profile() {
  const navigation = useNavigate();
  const [selectedGame, setSelectedGame] = useState('lol');
  const [userData, setUserData] = useState({
    username: '',
    avatar: Logo,
    bio: '',
    level: null,
    rank: null,
    winrate: null,
    kda: null,
    highlight: null
  });

  const isMe = 1;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(prev => ({
          ...prev,
          username: res.data.username,
          bio: res.data.bio,
          highlight: res.data.highlight
        }));
      } catch (err) {
        console.error("Erreur profil :", err);
      }
    };

    const fetchGameStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/lol/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setUserData(prev => ({
          ...prev,
          level: data.lp ?? null,
          rank: data.tier && data.rank ? `${data.tier} ${data.rank}` : null,
          winrate: data.winrate ? data.winrate.toFixed(2) : null, // ✅ conversion float → string % formaté
          kda: null,     // Toujours pas dispo
          summoner: data.summoner_name ?? '?'
        }));
      } catch (err) {
        console.log("Aucune donnée de jeu trouvée.");
      }
    };

    fetchProfile();
    fetchGameStats();
  }, [selectedGame]);


  return (
      <div className="basic-container">
        <div className="top-page-profile">
          <Navbar />
        </div>

        <div className="middle-page-profile">
          <div className="profile-main-info">
            <div className="profile-info-container">
              <div className="profile-pic-container">
                <img
                    alt="avatar"
                    src={userData.avatar}
                    className="profile-pic"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      border: "1px solid"
                    }}
                />
              </div>

              <div className="profile-names-container">
                <div className="profile-username">
                  <h3 className="username">{userData.username || "?"}</h3>
                </div>
                <div className="profile-tags"></div>
              </div>

              <div className="profile-action">
                {isMe === 1 ? (
                    <button className="gear-button" style={{ width: "50px" }} title="Modifier le profil">
                      <FaCog size={20} />
                    </button>
                ) : (
                    <button className="add-team-button submit-75">Ajouter à l’équipe</button>
                )}
              </div>
            </div>

            <div className="profile-description">
              <div className="profile-title">
                <h3>Bio</h3>
              </div>
              <div className="profile-bio-container">
                {userData.bio || "Aucune bio renseignée."}
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div style={{ marginTop: '20px' }}>
              <button
                  className="submit-75"
                  onClick={() => setSelectedGame('lol')}
                  style={{ padding: '10px', fontWeight: 'bold' }}
              >
                Voir les infos LoL
              </button>
            </div>

            <div className="profile-title">
              <h3>Statistiques</h3>
            </div>

            <div className="profile-stats-container">
              <div className="profile-rank-container">
                <div className="profile-rank-picture">
                  <img
                      alt="rank logo"
                      src={Logo}
                      style={{ width: "50px", height: "50px" }}
                  />
                </div>
                <div className="profile-rank-text">
                  <h4>{userData.summoner ?? "?"}</h4>
                </div>
              </div>

              <div className="profile-main-stats-container">
                <div className="profile-main-stats">
                  <div className="profile-main-stats-title"><p>Points</p></div>
                  <div className="profile-main-stats-value"><p>{userData.level ?? "?"}</p></div>
                </div>

                <div className="profile-main-stats">
                  <div className="profile-main-stats-title"><p>Rang</p></div>
                  <div className="profile-main-stats-value"><p>{userData.rank ?? "?"}</p></div>
                </div>

                <div className="profile-main-stats">
                  <div className="profile-main-stats-title"><p>Winrate</p></div>
                  <div className="profile-main-stats-value"><p>{userData.winrate ? `${userData.winrate}%` : "?"}</p></div>
                </div>

                <div className="profile-main-stats">
                  <div className="profile-main-stats-title"><p>K/D/A</p></div>
                  <div className="profile-main-stats-value"><p>{userData.kda ?? "?"}</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-highlight">
            <div className="profile-video-container">
              {userData.highlight ? (
                  <video
                      className="profile-video"
                      src={userData.highlight}
                      type="video/mp4"
                      width="60%"
                      height="90%"
                      controls
                  />
              ) : (
                  <p style={{ color: "white", textAlign: "center" }}>Aucun highlight vidéo</p>
              )}
            </div>
          </div>
        </div>

        <div className="bottom-page-profile"></div>
      </div>
  );
}

export default Profile;
