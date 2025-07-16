// App.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/template.css"
import Home from "./screens/home";
import Login from "./screens/login";
import Admin from "./screens/admin";
import Profile from "./screens/profile";
import Error from "./screens/error";
import SignUp from "./screens/signUp";
import Forget from "./screens/forget";
import Teams from "./screens/teams";
import TeamPage from "./screens/teamPage";
import Tournaments from "./screens/tournaments";
import TournamentPage from "./screens/tournamentPage";
import ResetPassword from "./screens/resetPassword";
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { connectSocket } from "./utils/socketInstance";
import NotificationProvider from "./components/notificationProvider";
import ParticlesBackground from "./components/particlesBackground";


function App() {
  useEffect(() => {

  }, []);
  return (
      <NotificationProvider>
          <ParticlesBackground />
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournamentPage" element={<TournamentPage />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teamPage/:id" element={<TeamPage />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
  );

}

export default App;
