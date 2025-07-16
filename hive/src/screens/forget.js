import React, { useState, useEffect, useRef } from "react";
import '../styles/forget.css';
import Logo from "../assets/images/hiveLogo.png";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Forget() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigate();
  const recaptchaRendered = useRef(false); // ✅ Track rendering

  useEffect(() => {
    const loadCaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && !recaptchaRendered.current) {
        window.grecaptcha.render('recaptcha-container', {
          sitekey: '6LdiwG8rAAAAAOY2n0yUBxuQIVdsQJWEvt65EDq1',
        });
        recaptchaRendered.current = true;
      } else if (!window.grecaptcha || !window.grecaptcha.render) {
        setTimeout(loadCaptcha, 500); // Retry if not ready
      }
    };

    loadCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const captchaToken = window.grecaptcha?.getResponse();

    if (!captchaToken) {
      alert("Veuillez remplir le CAPTCHA !");
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, captchaToken })
      });

      const data = await response.json();
      setMessage(data.message || "Un e-mail a été envoyé si le compte existe.");
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      setMessage("Une erreur est survenue.");
    }
  };

  return (
      <div className="basic-container">
        <div className="top-page-forget"></div>
        <div className="middle-page-forget">
          <div className="id-container-forget">
            <div className="logo-forget">
              <FaArrowLeft className="arrow-icon" style={{ width: "24px", height: "24px" }} onClick={() => navigation(-1)} />
              <img alt="logo" src={Logo} style={{ width: "100px", height: "100px" }} />
            </div>

            <form className="credentials-container-forget" onSubmit={handleSubmit}>
              <div className="input-container">
                <div className="input-signup">
                  <label>Email</label>
                  <input
                      type="email"
                      className="input-50"
                      placeholder="email@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>

                <div id="recaptcha-container" className="g-recaptcha"></div>
              </div>

              <hr style={{ width: "90%", borderTop: "1px solid", borderColor: "#000000" }} />

              <div className="submit-container-forget">
                <button type="submit" className="submit-50">Envoyer</button>
                {message && <p style={{ marginTop: "1em", color: "#fff" }}>{message}</p>}
              </div>
            </form>
          </div>
        </div>
        <div className="bottom-page-forget"></div>
        <p className="slogan">“Where solo players become legends.”</p>
      </div>
  );
}

export default Forget;
