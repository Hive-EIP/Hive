// pages/Home.js

import React from "react";
import '../styles/admin.css'

function Admin() {
  return (
    <div className="container">
        <div className="topPage">
          <navBar></navBar>
        </div>
        <div className="middlePage">
          <div className="buttonRow">
            <button>Receive Profile</button>
            <button>Create Profile</button>
            <button>On / Off</button>
          </div>
          <div className="buttonRow">
            <button>Auth</button>
            <button>Choose Role</button>
            <button>On / Off .. autre</button>
          </div>
          <div className="buttonRow">
            <button>Forget Password ?</button>
            <button>Connect</button>
            <button>Log Out</button>
          </div>
          <div className="buttonRow">
            <input className="fields" placeholder="email"></input>
            <input className="fields" placeholder="password"></input>
          </div>
        </div>
        <div className="bottomPage"></div>
    </div>
  );
}

export default Admin;