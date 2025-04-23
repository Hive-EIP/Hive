// pages/Forget.js
import React from "react";
import '../styles/forget.css'
import Logo from "../assets/images/hiveLogo.png"
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Forget() {

  const navigation = useNavigate();

  return (
    <div className="basic-container">
      <div className="top-page-forget"></div>
      <div className="middle-page-forget">
        <div className="id-container-forget">
          <div className="logo-forget">
            <FaArrowLeft className="arrow-icon" style={{width: "24px", height: "24px"}} onClick={() => navigation(-1)}/>
            <img alt="logo" src={Logo} style={{width: "100px", height: "100px"}}></img>
          </div>
          <form className="credentials-container-forget">
            <div className="input-container">
              <div className="input-signup">
                <label>Email</label>
                <input type="email" placeholder="email@email" className="input-50" required></input>
              </div>
              <div className="input-signup">
                <label>New Password</label>
                <input type="password" placeholder="password" className="input-50" required></input>
              </div>
            </div>
            <hr style={{width: "90%", borderTop: "1px solid", borderColor: "#000000"}}></hr>
            <div className="submit-container-forget">
              <button type="submit" className="submit-50">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
      <div className="bottom-page-forget"></div>
    </div>
  );
}

export default Forget;