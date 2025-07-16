const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/postgres');

// ──────────────── SIGNUP ────────────────
exports.signup = async (req, res) => {
    const { email, username, password, role } = req.body;

    if (!email || !username || !password)
        return res.status(400).json({ error: "Champs manquants" });
    const  userRole = role || 'user';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (email, username, password, role) VALUES ($1, $2, $3, $4)',
            [email, username, hashedPassword, userRole]
        );

        res.status(201).json({ message: '✅ Utilisateur créé' });
    } catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ error: "Email ou pseudo déjà utilisé" });
        } else {
            res.status(500).json({ error: 'Erreur serveur', detail: err.message });
        }
    }
};

// ──────────────── LOGIN ────────────────
exports.login = async (req, res) => {
    const { identifier, password } = req.body;
    // "identifier" = email ou username

    if (!identifier || !password)
        return res.status(400).json({ error: "Champs manquants" });

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $1',
            [identifier]
        );
        const user = result.rows[0];

        if (!user)
            return res.status(404).json({ error: "Utilisateur non trouvé" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Mot de passe incorrect" });

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        const customMessage = user.username === 'HYSPA'
            ? 'Bienvenue EL PHENOMENO DESTRUCTEUR DES MONDES, LE GOAT DES ÉCHECS ET DU TAROT'
            : 'Connexion réussie ✅';

        res.json({
            message: customMessage,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur", detail: err.message });
    }
};

// ──────────────── FORGOT_PASSWORD ────────────────

const crypto = require('crypto');
const {incrementResetAttempts} = require("../utils/resetLimiter");

exports.forgotPassword = async (req, res) => {
    const verifyCaptcha = require('../utils/verifyCaptcha');
    const sendResetEmail = require('../utils/sendResetEmail');
    const email = req.body.email?.toLowerCase().trim();
    const attempts = await incrementResetAttempts(email);

    if (attempts > 5) {
        return res.status(429).json({ message: 'Trop de tentatives de réinitialisation aujourd’hui. Réessaie demain.' });
    }

    if (!email) return res.status(400).json({ error: 'Email requis' });

    try {
        const { email, captchaToken } = req.body;

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ message: 'Échec de vérification CAPTCHA' });
        }
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [token, expires, email]
        );

        // Normalement, ici on enverrait un email → pour l’instant on retourne le token
        await sendResetEmail(email, token);
        res.json({ message: 'Email de réinitialisation envoyé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', detail: err.message });
    }
};

// ──────────────── RESET_PASSWORD ────────────────

// ____________________________
//        RESET_PASSWORD
// ____________________________
exports.resetPassword = async (req, res) => {
    const { incrementResetAttempts, getRemainingAttempts } = require('../utils/resetLimiter');
    const token = req.body.token?.trim();
    const newPassword = req.body.newPassword;
    console.log("increment reset attemps :", incrementResetAttempts);
    console.log("get remaining attemps :", getRemainingAttempts());

    if (!token || !newPassword) {
        return res.status(400).json({ error: "Champs manquants" });
    }

    try {
        if (process.env.NODE_ENV === 'development') {
            // Requête SQL corrigée avec CURRENT_TIMESTAMP
            console.log("Heure serveur (UTC) :", new Date().toISOString());
        }

        const result = await pool.query(
            `
                SELECT * FROM users
                WHERE reset_token = $1
                  AND reset_token_expires > NOW() AT TIME ZONE 'UTC'
            `,
            [token]
        );
        if (process.env.NODE_ENV === 'development') {
            console.log('Token reçu :', token);
            console.log('Résultat SQL complet:', result.rows);
        }

        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        // Hachage du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mise à jour du mot de passe et suppression du token
        await pool.query(
            `
      UPDATE users
      SET password = $1,
          reset_token = NULL,
          reset_token_expires = NULL
      WHERE id = $2
      `,
            [hashedPassword, user.id]
        );

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (err) {
        console.error('Erreur dans resetPassword:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
