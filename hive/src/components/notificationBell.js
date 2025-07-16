// components/notificationBell.js
import React, { useContext, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { NotificationContext } from "./notificationProvider";
import axios from "axios";
import "../styles/notificationBell.css";

const NotificationBell = () => {
    const { notifications, setNotifications } = useContext(NotificationContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [invitations, setInvitations] = useState([]);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await axios.get("http://localhost:4000/teams/invitations/received", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInvitations(res.data.invitations);
            } catch (err) {
                console.error("Erreur chargement invitations :", err);
            }
        };

        fetchInvitations();
    }, [notifications]); // recharge si nouvelle notif

    const handleResponse = async (invitationId, response) => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://localhost:4000/teams/invitations/${invitationId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ response })
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message || "Réponse envoyée !");
                setNotifications((prev) => prev.filter((n) => n.invitation_id !== invitationId));
            } else {
                alert(data.error || "Erreur lors de la réponse.");
            }
        } catch (err) {
            console.error("Erreur réponse invitation :", err);
            alert("Erreur réseau.");
        }
    };

    return (
        <div
            className="notification-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <div className="notification-icon">
                <Bell size={22} strokeWidth={2} />
                {notifications.length > 0 && (
                    <span className="notification-badge">{notifications.length}</span>
                )}
            </div>

            {showDropdown && (
                <div className="notification-dropdown">
                    {invitations.length === 0 ? (
                        <p>No invitations</p>
                    ) : (
                        invitations.map(inv => (
                            <div key={inv.invitation_id} className="notification-item">
                                <strong>{inv.invited_by_username}</strong> invited you to <strong>{inv.team_name}</strong>
                                <div className="notification-actions">
                                    <button className="accept-btn" onClick={() => handleResponse(inv.invitation_id, 'accept')}>Accept</button>
                                    <button className="decline-btn" onClick={() => handleResponse(inv.invitation_id, 'decline')}>Decline</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
