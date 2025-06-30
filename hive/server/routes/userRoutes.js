const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');

router.get('/me', authMiddleware, getProfile);

router.get('/admin-only', authMiddleware, authorizeRole(['admin']), (req, res) => {
    res.json({ message: 'Bienvenue monsieur administrator 👑' });
});

router.get('/moderator-only', authMiddleware, authorizeRole(['moderator']), (req, res) => {
    res.json({ message: 'Bienvenue Modérateur 🛡️' });
});

router.get('/player-only', authMiddleware, authorizeRole(['player']), (req, res) => {
    res.json({ message: 'Bienvenue Joueur 🎮' });
});

module.exports = router;
