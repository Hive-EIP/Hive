const { pool } = require('../config/postgres');

exports.joinTeam = async (req, res) => {
    const userId = req.user.id;
    const { teamId } = req.params;
    const { game } = req.body;

    if (!game) return res.status(400).json({ error: "Nom du jeu requis" });

    try {
        await pool.query(
            `INSERT INTO team_members (user_id, team_id, role, joined_at, game)
             VALUES ($1, $2, 'member', NOW(), $3)`,
            [userId, teamId, game]
        );
        res.status(200).json({ message: "Membre ajouté à l'équipe" });
    } catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ error: "Déjà membre d’une équipe sur ce jeu" });
        } else {
            res.status(500).json({ error: "Erreur serveur", details: err.message });
        }
    }
};

exports.leaveTeam = async (req, res) => {
    const { teamId } = req.params;
    const userId = req.user.id;

    try {
        // Vérifie si l'utilisateur est bien membre
        const result = await pool.query(
            'SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2',
            [userId, teamId]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Tu n'es pas membre de cette équipe." });
        }

        // Supprimer l'entrée
        await pool.query(
            'DELETE FROM team_members WHERE user_id = $1 AND team_id = $2',
            [userId, teamId]
        );

        res.status(200).json({ message: "Tu as quitté l'équipe." });
    } catch (err) {
        console.error("Erreur leaveTeam :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.createTeam = async (req, res) => {
    try {
        const userId = req.user.id; // créateur de l'équipe
        const { name, tag, description } = req.body;

        if (!name || !tag || !description) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        // Insère l'équipe avec owner_id = userId
        const insertTeamQuery = `
            INSERT INTO teams (name, tag, description, created_by, owner_id, status, rank_points, elo)
            VALUES ($1, $2, $3, $4, $4, 'open', 0, 0)
                RETURNING id
        `;
        const { rows } = await pool.query(insertTeamQuery, [name, tag, description, userId]);
        const teamId = rows[0].id;

        // Insère le créateur comme membre et owner (tag = jeu)
        const insertMemberQuery = `
            INSERT INTO team_members (user_id, team_id, role, joined_at, game)
            VALUES ($1, $2, 'owner', NOW(), $3)
        `;
        await pool.query(insertMemberQuery, [userId, teamId, tag]);

        res.status(201).json({ message: 'Équipe créée avec succès', teamId });
    } catch (err) {
        console.error('Erreur createTeam:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAllTeams = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teams');
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur getAllTeams :', err.message);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des équipes' });
    }
};

exports.getMyTeams = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT t.*
       FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       WHERE tm.user_id = $1`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur getMyTeams :', err.message);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des équipes utilisateur' });
    }
};

exports.inviteToTeam = async (req, res) => {
    const { teamId } = req.params;
    const { invitedUserId } = req.body;
    const invitedBy = req.user.id;

    try {
        // Vérifie que l'utilisateur est bien owner de l'équipe
        const result = await pool.query(
            'SELECT * FROM teams WHERE id = $1 AND owner_id = $2',
            [teamId, invitedBy]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Tu n'es pas autorisé à inviter pour cette équipe." });
        }

        // Vérifie si l'utilisateur est déjà dans l'équipe
        const existingMember = await pool.query(
            'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',
            [teamId, invitedUserId]
        );
        if (existingMember.rows.length > 0) {
            return res.status(400).json({ error: "L'utilisateur est déjà dans l'équipe." });
        }

        // Vérifie si une invitation existe déjà
        const existingInvite = await pool.query(
            'SELECT * FROM team_invitations WHERE team_id = $1 AND invited_user_id = $2 AND status = $3',
            [teamId, invitedUserId, 'pending']
        );
        if (existingInvite.rows.length > 0) {
            return res.status(400).json({ error: "Invitation déjà envoyée." });
        }

        // Crée l'invitation
        const insertResult = await pool.query(
            'INSERT INTO team_invitations (team_id, invited_user_id, invited_by) VALUES ($1, $2, $3) RETURNING *',
            [teamId, invitedUserId, invitedBy]
        );

        // ➕ Notification instantanée via Socket.IO
        console.log(`📨 Émission socket vers user_${invitedUserId}`);
        if (global.io) {
            global.io.to(`user_${invitedUserId}`).emit('team_invitation', {
                type: 'invitation',
                invitationId: insertResult.rows[0].id,
                teamId: teamId,
                invitedBy: invitedBy,
                timestamp: new Date().toISOString()
            });
        }

        res.status(201).json({ message: "Invitation envoyée." });
    } catch (error) {
        console.error("Erreur invitation équipe:", error);
        res.status(500).json({ error: "Erreur serveur lors de l'envoi de l'invitation." });
    }
};

exports.getInvitations = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
      SELECT ti.id, ti.team_id, t.name AS team_name, t.tag,
             ti.invited_by, u.username AS invited_by_username,
             ti.created_at, ti.status
      FROM team_invitations ti
      JOIN teams t ON ti.team_id = t.id
      JOIN users u ON ti.invited_by = u.id
      WHERE ti.invited_user_id = $1
      AND ti.status = 'pending'
    `;

        const { rows } = await pool.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        console.error('Erreur getInvitations:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getSentInvitations = async (req, res) => {
    const userId = req.user.id;
    const { teamId } = req.params;

    try {
        // Vérifie que l'utilisateur est bien owner de cette team
        const teamCheck = await pool.query(
            `SELECT * FROM teams WHERE id = $1 AND owner_id = $2`,
            [teamId, userId]
        );

        if (teamCheck.rowCount === 0) {
            return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le propriétaire de cette équipe." });
        }

        // Récupère les invitations envoyées pour cette équipe
        const query = `
            SELECT i.id AS invitation_id, i.invited_user_id, u.username, i.status, i.created_at
            FROM team_invitations i
            JOIN users u ON i.invited_user_id = u.id
            WHERE i.team_id = $1
            ORDER BY i.created_at DESC
        `;
        const { rows } = await pool.query(query, [teamId]);

        res.json({ invitations: rows });
    } catch (err) {
        console.error("Erreur getSentInvitations:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.respondToInvitation = async (req, res) => {
    const userId = req.user.id;
    const { invitationId } = req.params;
    const { response } = req.body;
    console.log(req.body);
    if (!['accept', 'decline'].includes(response)) {
        return res.status(400).json({ error: 'Réponse invalide' });
    }

    try {
        const invitationResult = await pool.query(
            `SELECT * FROM team_invitations WHERE id = $1 AND invited_user_id = $2`,
            [invitationId, userId]
        );
        const invitation = invitationResult.rows[0];

        if (!invitation || invitation.status !== 'pending') {
            return res.status(404).json({ error: 'Invitation introuvable ou déjà traitée' });
        }

        if (response === 'decline') {
            await pool.query(
                `UPDATE team_invitations SET status = 'declined' WHERE id = $1`,
                [invitationId]
            );
            return res.json({ message: 'Invitation refusée' });
        }

        // Accepter : ajoute le joueur à l'équipe
        await pool.query(
            `INSERT INTO team_members (user_id, team_id, role, joined_at, game)
       VALUES ($1, $2, 'member', NOW(), (
         SELECT tag FROM teams WHERE id = $2
       ))`,
            [userId, invitation.team_id]
        );

        // Met à jour le statut de l’invitation
        await pool.query(
            `UPDATE team_invitations SET status = 'accepted' WHERE id = $1`,
            [invitationId]
        );

        res.json({ message: 'Invitation acceptée' });
    } catch (err) {
        console.error('Erreur respondToInvitation:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.cancelInvitation = async (req, res) => {
    const userId = req.user.id;
    const { invitationId } = req.params;

    try {
        // Récupère l'invitation
        const invitationResult = await pool.query(
            `SELECT * FROM team_invitations WHERE id = $1`,
            [invitationId]
        );
        const invitation = invitationResult.rows[0];

        if (!invitation) {
            return res.status(404).json({ error: "Invitation introuvable" });
        }

        // Vérifie que le user est bien owner de l'équipe liée
        const ownerCheck = await pool.query(
            `SELECT * FROM team_members 
       WHERE user_id = $1 AND team_id = $2 AND role = 'owner'`,
            [userId, invitation.team_id]
        );

        if (ownerCheck.rowCount === 0) {
            return res.status(403).json({ error: "Non autorisé à annuler cette invitation" });
        }

        await pool.query(`DELETE FROM team_invitations WHERE id = $1`, [invitationId]);

        res.json({ message: "Invitation annulée avec succès" });
    } catch (err) {
        console.error("Erreur cancelInvitation:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getReceivedInvitations = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT
                i.id AS invitation_id,
                i.status,
                i.created_at,
                i.invited_by,
                u.username AS invited_by_username,
                t.id AS team_id,
                t.name AS team_name,
                t.tag AS team_tag
            FROM team_invitations i
                     JOIN teams t ON i.team_id = t.id
                     JOIN users u ON i.invited_by = u.id
            WHERE i.invited_user_id = $1 AND i.status = 'pending'
            ORDER BY i.created_at DESC
        `;

        const { rows } = await pool.query(query, [userId]);

        res.json({ invitations: rows });
    } catch (err) {
        console.error('Erreur getReceivedInvitations:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteTeam = async (req, res) => {
    const userId = req.user.id;
    const { teamId } = req.params;

    try {
        // Vérifie que l'utilisateur est bien owner
        const check = await pool.query(
            `SELECT * FROM teams WHERE id = $1 AND owner_id = $2`,
            [teamId, userId]
        );

        if (check.rowCount === 0) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer cette équipe." });
        }

        // Supprime l'équipe
        await pool.query(`DELETE FROM teams WHERE id = $1`, [teamId]);

        res.json({ message: "Équipe supprimée avec succès." });
    } catch (err) {
        console.error("Erreur deleteTeam:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getTeamMembers = async (req, res) => {
    const teamId = req.params.teamId;

    try {
        const { rows } = await pool.query(`
      SELECT u.id, u.username, u.profile_picture_url, tm.role, tm.joined_at
      FROM team_members tm
      JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = $1
    `, [teamId]);

        res.status(200).json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des membres de l’équipe :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des membres." });
    }
};

exports.getTeamById = async (req, res) => {
    const { teamId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM teams WHERE id = $1', [teamId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération de la team' });
    }
};

exports.getNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(`
            SELECT ti.*, t.name AS team_name
            FROM team_invitations ti
            JOIN teams t ON ti.team_id = t.id
            WHERE ti.invited_user_id = $1 AND ti.status = 'pending'
            ORDER BY ti.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (err) {
        console.error('Erreur récupération notifications :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
    }
};
