const { pool } = require('../config/postgres');

exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, created_at, bio, highlight, role FROM users WHERE id = $1',
            [req.user.id]
        );

        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', detail: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, bio FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getEligiblePlayers = async (req, res) => {
    const { teamId } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(`
            SELECT id, username FROM users
            WHERE id != $1
            AND id NOT IN (
                SELECT user_id FROM team_members
            )
        `, [userId]);

        res.json({ players: result.rows });
    } catch (err) {
        console.error("Erreur récupération candidats :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
