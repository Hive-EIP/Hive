import React, { useState } from 'react';
import '../styles/login.css';
import Logo from '../assets/images/hiveLogo.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ParticlesBackground from '../components/particlesBackground';

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
      localStorage.setItem('user_id', res.data.user.id);
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
                    <label className="label-login">Identifier</label>
                    <input
                        className="input-login"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Email / Username"
                        required
                    />
                  </div>

                  <div className="id-login">
                    <label className="label-login">Password</label>
                    <input
                        className="input-login"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                  </div>

                  {error && <p style={{ color: 'red', marginTop: '1em' }}>{error}</p>}

                  <hr />

                  <div className="links-login">
                    <Link to="/signup" className="link-button">Sign Up</Link>
                    <Link to="/forget" className="link-button">Forgot Password</Link>
                  </div>

                  <div className="submit-login">
                    <button className="submit-50" type="submit">LOGIN</button>

                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="bottom-page-login"></div>
          <p className="slogan">“Where solo players become legends.”</p>
        </div>
  );

}

export default Login;
