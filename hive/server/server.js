require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Crée le serveur HTTP à partir de Express
const server = http.createServer(app);

// Initialise Socket.IO
const io = socketIo(server, {
    cors: {
        origin: '*', // adapte si tu as une whitelist
        methods: ['GET', 'POST']
    }
});

// Rendre io accessible globalement
global.io = io;

// Lorsqu’un client se connecte
io.on('connection', (socket) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        console.log("❌ Aucun token envoyé par le client socket.");
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded.id;
        console.log(`🧠 ID utilisateur dans le token : ${userId}`);

        socket.join(`user_${userId}`);
        console.log(`✅ Utilisateur ${userId} a rejoint la room user_${userId}`);
    } catch (err) {
        console.error("❌ Erreur de vérification du token JWT :", err.message);
    }

    socket.on('disconnect', () => {
        console.log(`❌ Déconnexion socket : ${socket.id}`);
    });
});


// Middleware & routes
app.use(cors());
app.use(express.json());
app.use('/auth', require('./routes/authRoutes'));
app.use('/profile', require('./routes/userRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/teams', require('./routes/teamRoutes'));
app.use('/tournaments', require('./routes/tournamentRoutes'));
app.use('/lol', require('./routes/lolRoutes'));

// Sert les fichiers statiques (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'test_chaussures')));

// Route dynamique pour reset password
app.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'test_chaussures', 'reset-password.html'));
});

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🟢 Serveur lancé sur http://localhost:${PORT}`);
});
