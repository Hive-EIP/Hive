import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
    if (!socket) {
        socket = io("http://localhost:4000", {
            transports: ['websocket'],
            query: { userId }
        });

        socket.on("connect", () => {
            console.log("✅ Socket connecté pour user", userId);
        });
    }

    return socket;
};

export const getSocket = () => socket;
