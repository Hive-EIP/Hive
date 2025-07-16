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
      <div className="container-signup">
        <div className="middle-page-signup">
          <div className="id-container-signup">
            <div className="logo-signup">
              <FaArrowLeft className="arrow-icon" size={24} onClick={() => navigation(-1)} />
              <img alt="logo" src={Logo} />
            </div>
            <form className="credentials-container-signup" onSubmit={handleSubmit}>
              <div className="input-signup">
                <label>Username</label>
                <input
                    type="text"
                    placeholder="username"
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="submit-container-signup">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
        <p className="slogan">“Where solo players become legends.”</p>
      </div>
  );
}

export default SignUp;
