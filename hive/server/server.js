require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

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

// Route pour afficher la page de reset dynamiquement
app.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'test_chaussures', 'reset-password.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🟢 Serveur lancé sur http://localhost:${PORT}`));
