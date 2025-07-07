// pages/SignUp.js
import React, { useState } from "react";
import "../styles/signUp.css";
import Logo from "../assets/images/hiveLogo.png";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function SignUp() {
  const navigation = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/signup", {
        username,
        email,
        password
      });

      alert("✅ Compte créé avec succès !");
      navigation("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Erreur lors de l'inscription.");
    }
  };

  return (
      <div className="basic-container">
        <div className="top-page-signup"></div>
        <div className="middle-page-signup">
          <div className="id-container-signup">
            <div className="logo-signup">
              <FaArrowLeft className="arrow-icon" style={{ width: "24px", height: "24px" }} onClick={() => navigation(-1)} />
              <img alt="logo" src={Logo} style={{ width: "100px", height: "100px" }} />
            </div>
            <form className="credentials-container-signup" onSubmit={handleSubmit}>
              <div className="input-container">
                <div className="input-signup">
                  <label>Username</label>
                  <input
                      type="text"
                      placeholder="username"
                      className="input-50"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input-signup">
                  <label>Email</label>
                  <input
                      type="email"
                      placeholder="email@gmail.com"
                      className="input-50"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-signup">
                  <label>Password</label>
                  <input
                      type="password"
                      placeholder="password"
                      className="input-50"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <hr style={{ width: "90%", borderTop: "1px solid", borderColor: "#000000" }} />
              <div className="submit-container-signup">
                <button type="submit" className="submit-50">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
        <div className="bottom-page-signup"></div>
      </div>
  );
}

export default SignUp;
