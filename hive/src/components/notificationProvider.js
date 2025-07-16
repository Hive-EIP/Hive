// src/components/NotificationProvider.js
import React, { useEffect, useState, createContext } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

export const NotificationContext = createContext();

const socket = io("http://localhost:4000", { autoConnect: false });

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            const userId = decoded.userId || decoded.id;

            socket.auth = { token };
            socket.connect();
            console.log("🔌 Socket connecté !");
            console.log("🎧 Listener prêt");
            socket.on("team_invitation", (data) => {
                console.log("📩 Nouvelle invitation :", data);
                setNotifications((prev) => [...prev, data]);
            });

            return () => {
                socket.off("team_invitation");
                socket.disconnect();
            };
        } catch (err) {
            console.error("Erreur token Socket.IO", err);
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
