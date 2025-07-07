// pages/SignUp.js
import React from "react";
import "../styles/signUp.css"
import Logo from "../assets/images/hiveLogo.png"
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigation = useNavigate();

  return (
    <div className="basic-container">
      <div className="top-page-signup"></div>
      <div className="middle-page-signup">
        <div className="id-container-signup">
          <div className="logo-signup">
            <FaArrowLeft className="arrow-icon" style={{width: "24px", height: "24px"}} onClick={() => navigation(-1)}/>
            <img alt="logo" src={Logo} style={{width: "100px", height: "100px"}}></img>
          </div>
          <form className="credentials-container-signup">
            <div className="input-container">
              <div className="input-signup">
                <label>Username</label>
                <input type="username" placeholder="username" className="input-50" required></input>
              </div>
              <div className="input-signup">
                <label>Email</label>
                <input type="email" placeholder="email@gmail.com" className="input-50" required></input>
              </div>
              <div className="input-signup">
                <label>Password</label>
                <input type="password" placeholder="password" className="input-50" required></input>
              </div>
            </div>
            <hr style={{width: "90%", borderTop: "1px solid", borderColor: "#000000"}}></hr>
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