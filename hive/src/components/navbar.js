import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/images/hiveLogo.png";
import { User, Users, Trophy, Bell } from 'lucide-react';
import { NotificationContext } from './notificationProvider';
import NotificationBell from './notificationBell';

const Navbar = () => {
    const navigate = useNavigate();
    const { notifications } = useContext(NotificationContext);

    const handleLogoClick = () => {
        navigate('/home');
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <img
                    alt="logo"
                    src={Logo}
                    style={{width: "50px", height: "50px", cursor: "pointer"}}
                    onClick={handleLogoClick}
                />
                <input
                    className="input-30P"
                    type="text"
                    placeholder="Research"
                />
            </div>

            <div className="navbar-right">
                <NotificationBell />
                <button className="submit-25 nav-button" onClick={() => navigate('/profile')}>
                    <User size={20} className="nav-icon" />
                    <span className="nav-text">Profile</span>
                </button>
                <button className="submit-25 nav-button" onClick={() => navigate('/teams')}>
                    <Users size={20} className="nav-icon" />
                    <span className="nav-text">Teams</span>
                </button>
                <button className="submit-25 nav-button" onClick={() => navigate('/tournaments')}>
                    <Trophy size={20} className="nav-icon" />
                    <span className="nav-text">Tournaments</span>
                </button>
                {localStorage.getItem("access_token") ? (
                    <button
                        onClick={() => {
                            localStorage.removeItem("access_token");
                            navigate("/login");
                        }}
                        className="logout-button"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="login-button"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
