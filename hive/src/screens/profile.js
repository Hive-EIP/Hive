// pages/Profile.js
import React from "react";
import { useNavigate, Link } from 'react-router-dom';

import { FaCog } from "react-icons/fa";

import '../styles/profile.css'
import Navbar from "../components/navbar";
import Logo from "../assets/images/hiveLogo.png"

function Profile() {

  const navigation = useNavigate();

  let isMe = 1;
  let rank = "Gold 3";

  return (
    <div className="basic-container">
      <div className="top-page-profile">
        <Navbar/>
      </div>
      <div className="middle-page-profile">
        <div className="profile-main-info">
          <div className="profile-info-container">
            <div className="profile-pic-container">
              <img alt="logo" src={Logo} className="profile-pic" style={{width: "120px", height: "120px", borderRadius: "50%", border: "1px solid"}}></img>
            </div>
            <div className="profile-names-container">
              <div className="profile-username">
                <h3 className="username">Username</h3>
              </div>
              <div className="profile-tags">
              </div>
            </div>
            <div className="profile-action">
              {isMe === 1 ? (
                <button className="gear-button" style={{width: "50px"}} title="Modifier le profil">
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
            <div className="profile-bio-container"></div>
          </div>
        </div>
        <div className="profile-stats">
          <div className="profile-title">
            <h3>Statistiques</h3>
          </div>
          <div className="profile-stats-container">
            <div className="profile-rank-container">
              <div className="profile-rank-picture">
                <img alt="logo" src={Logo} style={{width: "50px", height: "50px"}}></img>
              </div>
              <div className="profile-rank-text">
                <h4>{rank}</h4>
              </div>
            </div>
            <div className="profile-main-stats-container">
              <div className="profile-main-stats">
                <div className="profile-main-stats-title">
                  <p>Level</p>
                </div>
                <div className="profile-main-stats-value">
                  <p>540</p>
                </div>
              </div>
              <div className="profile-main-stats">
                <div className="profile-main-stats-title">
                  <p>Rang</p>
                </div>
                <div className="profile-main-stats-value">
                  <p>Gold 3</p>
                </div>
              </div>
              <div className="profile-main-stats">
                <div className="profile-main-stats-title">
                  <p>Winrate</p>
                </div>
                <div className="profile-main-stats-value">
                  <p>70%</p>
                </div>
              </div>
              <div className="profile-main-stats">
                <div className="profile-main-stats-title">
                  <p>K/D/A</p>
                </div>
                <div className="profile-main-stats-value">
                  <p>9.5</p>
                </div>
              </div>
            </div>
            <div className="profile-other-stats">
              <div></div>
                <div></div>
            </div>
          </div>
        </div>
        <div className="profile-highlight">
          <div className="profile-video-container">
            <video className="profile-video" src="https://www.youtube.com/watch?v=KaZNqpo6ym4" type="video/mp4" width="60%" height="90%" controls>
            </video>
          </div>
        </div>
      </div>
      <div className="bottom-page-profile"></div>
    </div>
  );
}

export default Profile;