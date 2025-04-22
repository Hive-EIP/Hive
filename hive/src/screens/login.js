// pages/Login.js
import React from "react";
import '../styles/login.css'
import Logo from '../assets/images/hiveLogo.png'
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigation = useNavigate();

  return (
    <div className="basic-container">
        <div className="top-page-login">
        </div>
        <div className="middle-page-login">
          <div className="id-container-login">
            <div className="upper-container-login">
              <img src={Logo} alt="Logo" style={{width:"100px", height:"100px"}}></img>
            </div>
            <div className="bottom-container-login">
              <form className="data-login">
                <div className="label-div-login">
                  <label className="label-login">Email</label>
                </div>
                <div className="id-login">
                  <input className="input-login" type="email" placeholder="cdelachapelle4@gmail.com" required></input>
                </div>
                <div className="label-div-login">
                  <label className="label-login">Password</label>
                </div>
                <div className="id-login">
                  <input className="input-login"type="password" placeholder="password" required></input>
                </div>
                <hr style={{width: "90%", borderTop: "1px solid", borderColor: "#000000"}}></hr>
                <div className="links-login">
                  <Link to={"/signUp"} style={{color: "#000"}}>Sign Up</Link>
                  <Link to={"/forget"} style={{color: "#000"}}>Forget password</Link>
                </div>
                <div className="submit-login">
                  <button className="submit-50" onPress={() => navigation.navigate('Home')}>LOGIN</button>
                  <Link style={{fontSize: "10px", marginTop: "1em", color: "#000"}} to={"/home"}>Continue without connecting</Link>
                </div>
              </form>
            </div>
            </div>
        </div>
        <div className="bottom-page-login">
        </div>
    </div>
  );
}

export default Login;