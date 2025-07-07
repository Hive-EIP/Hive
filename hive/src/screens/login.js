// pages/Login.js
import React, { useState } from 'react';
import '../styles/login.css';
import Logo from '../assets/images/hiveLogo.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:4000/auth/login', {
        identifier,
        password
      });

      const token = res.data.token;
      localStorage.setItem('access_token', token);
      console.log("Token stocké :", res.data.token);

      navigation('/home');
    } catch (err) {
      console.error('Erreur de connexion :', err.response?.data || err.message);
      setError('Email/pseudo ou mot de passe incorrect');
    }
  };

  return (
      <div className="basic-container">
        <div className="top-page-login"></div>

        <div className="middle-page-login">
          <div className="id-container-login">
            <div className="upper-container-login">
              <img src={Logo} alt="Logo" style={{ width: "100px", height: "100px" }} />
            </div>

            <div className="bottom-container-login">
              <form className="data-login" onSubmit={handleLogin}>
                <div className="id-login">
                  <label className="label-login">Email ou Pseudo</label>
                  <input
                      className="input-login"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email ou pseudo"
                      required
                  />
                </div>

                <div className="id-login">
                  <label className="label-login">Mot de passe</label>
                  <input
                      className="input-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mot de passe"
                      required
                  />
                </div>

                {error && <p style={{ color: 'red', marginTop: '1em' }}>{error}</p>}

                <hr style={{ width: "90%", borderTop: "1px solid", borderColor: "#000000" }} />

                <div className="Links-login">
                  <Link to="/signup" style={{ color: "var(--text)" }}>Sign Up</Link>
                  <Link to="/forget" style={{ color: "var(--text)" }}>Mot de passe oublié</Link>
                </div>

                <div className="submit-login">
                  <button className="submit-50" type="submit">LOGIN</button>
                  <Link style={{ fontSize: "10px", marginTop: "1em", color: "#fff", textDecoration: "underline" }} to="/">
                    Retour
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="bottom-page-login"></div>
      </div>
  );
}

export default Login;
