const { pool } = require('../config/postgres');

exports.registerTeamToTournament = async (req, res) => {
    const userId = req.user.id;
    const tournamentId = parseInt(req.params.id, 10);

    try {
        // Récupérer les infos du tournoi
        const tournamentRes = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
        const tournament = tournamentRes.rows[0];

        if (!tournament) {
            return res.status(404).json({ error: "Tournoi introuvable" });
        }

        if (tournament.status !== 'open') {
            return res.status(400).json({ error: "Tournoi fermé aux inscriptions" });
        }
        // Vérifier le nombre d'équipes déjà inscrites
        const countRes = await pool.query(
            'SELECT COUNT(*) FROM tournament_registrations WHERE tournament_id = $1',
            [tournamentId]
        );
        const currentCount = parseInt(countRes.rows[0].count, 10);

        if (currentCount >= tournament.max_teams) {
            return res.status(400).json({ error: "Le tournoi est complet" });
        }

        // Vérifier si le joueur est owner d'une team sur le bon jeu
        const teamRes = await pool.query(`
            SELECT tm.team_id, t.elo
            FROM team_members tm
            JOIN teams t ON t.id = tm.team_id
            WHERE tm.user_id = $1 AND tm.role = 'owner' AND t.tag = $2
        `, [userId, tournament.game]);

        const team = teamRes.rows[0];
        if (!team) {
            return res.status(403).json({ error: "Vous n'êtes pas owner d'une équipe pour ce jeu" });
        }

        // Vérifier si l'équipe respecte l'elo requis
        if (team.elo < tournament.required_elo_min || team.elo > tournament.required_elo_max) {
            return res.status(400).json({ error: "Votre équipe n'est pas dans la plage d'élo requise" });
        }

        // Vérifier si l'équipe est déjà inscrite
        const existsRes = await pool.query(
            'SELECT 1 FROM tournament_registrations WHERE tournament_id = $1 AND team_id = $2',
            [tournamentId, team.team_id]
        );

        if (existsRes.rows.length > 0) {
            return res.status(400).json({ error: "Équipe déjà inscrite à ce tournoi" });
        }

        // Inscrire l'équipe
        await pool.query(
            'INSERT INTO tournament_registrations (tournament_id, team_id) VALUES ($1, $2)',
            [tournamentId, team.team_id]
        );

        res.json({ message: "Équipe inscrite avec succès" });

    } catch (err) {
        console.error("Erreur registerTeamToTournament:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.createTournament = async (req, res) => {
    let { name, game, description, start_date, elo_min, elo_max, max_teams } = req.body;

    elo_min = elo_min ?? 0;
    elo_max = elo_max ?? 10;
    max_teams = max_teams ?? 8;

    const created_by = req.user.id;

    try {
        const result = await pool.query(
            `INSERT INTO tournaments
             (name, game, description, start_date, elo_min, elo_max, max_teams, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING *`,
            [name, game, description, start_date, elo_min, elo_max, max_teams, created_by]
        );

        res.status(201).json({ tournament: result.rows[0] });
    } catch (err) {
        console.error('Erreur création tournoi :', err);
        res.status(500).json({ error: 'Erreur lors de la création du tournoi' });
    }
};

exports.getRegisteredTournaments = async (req, res) => {
    const { teamId } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                t.id,
                t.name,
                t.game,
                t.description,
                t.start_date,
                t.created_by,
                COALESCE(u.username, 'unknown') AS creator,
                t.created_at,
                t.status,
                t.elo_min AS eloMin,
                t.elo_max AS eloMax,
                t.max_teams AS maxTeams
            FROM tournaments t
                     JOIN tournament_registrations tr ON t.id = tr.tournament_id
                     LEFT JOIN users u ON t.created_by = u.id
            WHERE tr.team_id = $1
            ORDER BY t.start_date ASC
        `, [teamId]);

        res.status(200).json({ tournaments: result.rows });
    } catch (err) {
        console.error('Erreur récupération tournois inscrits :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des tournois" });
    }
};

exports.generateMatches = async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);

    try {
        const tournamentRes = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
        const tournament = tournamentRes.rows[0];
        if (!tournament) return res.status(404).json({ error: "Tournoi introuvable" });
        // Récupérer les équipes inscrites
        const teamRes = await pool.query(
            'SELECT team_id FROM tournament_registrations WHERE tournament_id = $1',
            [tournamentId]
        );

        const teams = teamRes.rows.map(r => r.team_id);

        if (teams.length !== tournament.max_teams) {
            return res.status(400).json({
                error: `Le tournoi n'est pas encore complet : ${teams.length}/${tournament.max_teams} équipes inscrites`
            });
        }
        // Vérifier si des matchs existent déjà pour ce tournoi
        const already = await pool.query(
            'SELECT 1 FROM tournament_matches WHERE tournament_id = $1 LIMIT 1',
            [tournamentId]
        );

        if (already.rowCount > 0) {
            return res.status(400).json({ error: "Le bracket a déjà été généré pour ce tournoi." });
        }


        // Mélanger les équipes aléatoirement
        for (let i = teams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [teams[i], teams[j]] = [teams[j], teams[i]];
        }

        // Générer les paires
        const insertValues = [];
        for (let i = 0; i < teams.length; i += 2) {
            insertValues.push(`(${tournamentId}, 1, ${teams[i]}, ${teams[i + 1]})`);
        }

        await pool.query(`
      INSERT INTO tournament_matches (tournament_id, round, team_a_id, team_b_id)
      VALUES ${insertValues.join(', ')}
    `);

        res.status(201).json({ message: "Matchs du premier round générés avec succès" });

    } catch (err) {
        console.error('Erreur génération des matchs :', err);
        res.status(500).json({ error: "Erreur lors de la génération des matchs" });
    }
};

exports.getTournamentMatches = async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);

    try {
        const result = await pool.query(`
            SELECT
                m.id,
                m.round,
                m.team_a_id,
                ta.name AS team_a_name,
                m.team_b_id,
                tb.name AS team_b_name,
                m.winner_id
            FROM tournament_matches m
                     LEFT JOIN teams ta ON m.team_a_id = ta.id
                     LEFT JOIN teams tb ON m.team_b_id = tb.id
            WHERE m.tournament_id = $1
            ORDER BY m.round ASC, m.id ASC
        `, [tournamentId]);

        const rounds = {};

        for (const match of result.rows) {
            const roundNumber = match.round;
            if (!rounds[roundNumber]) {
                rounds[roundNumber] = [];
            }
            rounds[roundNumber].push(match);
        }

        res.json({ rounds });

    } catch (err) {
        console.error('Erreur récupération des matchs :', err);
        res.status(500).json({ error: "Erreur lors de la récupération des matchs" });
    }
};

exports.getAllTournaments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                t.id,
                t.name,
                t.game,
                t.description,
                t.start_date,
                t.created_by,
                COALESCE(u.username, 'unknown') AS creator,
                t.created_at,
                t.status,
                t.elo_min AS eloMin,
                t.elo_max AS eloMax,
                t.max_teams AS maxTeams
            FROM tournaments t
                     LEFT JOIN users u ON t.created_by = u.id
            ORDER BY t.created_at DESC;

        `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des tournois :', error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des tournois." });
    }
};

exports.declareWinner = async (req, res) => {
    const matchId = parseInt(req.params.id, 10);

    const winner_id = parseInt(req.body.winner_id, 10);

    try {
        // Récupérer le match
        const matchRes = await pool.query('SELECT * FROM tournament_matches WHERE id = $1', [matchId]);
        const match = matchRes.rows[0];
        if (!match) return res.status(404).json({ error: "Match introuvable" });

        if (match.winner_id) {
            return res.status(400).json({ error: "Ce match a déjà un gagnant" });
        }

        // Vérifier que winner_id correspond à team_a_id ou team_b_id
        if (![match.team_a_id, match.team_b_id].includes(winner_id)) {
            return res.status(400).json({ error: "L'équipe gagnante n'était pas dans ce match" });
        }

        // Enregistrer le gagnant
        await pool.query('UPDATE tournament_matches SET winner_id = $1 WHERE id = $2', [winner_id, matchId]);

        // Récupérer tous les matchs du round
        const matchesRes = await pool.query(`
            SELECT * FROM tournament_matches
            WHERE tournament_id = $1 AND round = $2
        `, [match.tournament_id, match.round]);

        const allWinners = matchesRes.rows.map(m => m.winner_id).filter(Boolean);

        // Tous les matchs ont un gagnant ?
        if (allWinners.length === matchesRes.rowCount) {
            if (allWinners.length === 1) {
                // ✅ Fin du tournoi
                await pool.query(`
                    UPDATE tournaments SET status = 'finished' WHERE id = $1
                `, [match.tournament_id]);

                return res.json({ message: "🏆 Tournoi terminé", winner_id: allWinners[0] });
            }

            // 🧠 Round suivant
            const nextRound = match.round + 1;

            // Mélange aléatoire
            for (let i = allWinners.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allWinners[i], allWinners[j]] = [allWinners[j], allWinners[i]];
            }

            const insertValues = [];
            for (let i = 0; i < allWinners.length; i += 2) {
                insertValues.push(`(${match.tournament_id}, ${nextRound}, ${allWinners[i]}, ${allWinners[i + 1]})`);
            }

            await pool.query(`
        INSERT INTO tournament_matches (tournament_id, round, team_a_id, team_b_id)
        VALUES ${insertValues.join(', ')}
      `);
        }

        res.json({ message: "Gagnant enregistré avec succès." });

    } catch (err) {
        console.error('Erreur déclaration gagnant :', err);
        res.status(500).json({ error: "Erreur lors de la déclaration du gagnant" });
    }
};

exports.openTournament = async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);

    try {
        const result = await pool.query(
            `UPDATE tournaments SET status = 'open' WHERE id = $1 RETURNING *`,
            [tournamentId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tournoi introuvable" });
        }

        res.json({ message: "Tournoi ouvert aux inscriptions", tournament: result.rows[0] });
    } catch (err) {
        console.error('Erreur ouverture tournoi :', err);
        res.status(500).json({ error: "Erreur lors de l’ouverture du tournoi" });
    }
};

exports.deleteTournament = async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);

    try {
        const result = await pool.query(
            'DELETE FROM tournaments WHERE id = $1 RETURNING *',
            [tournamentId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tournoi introuvable" });
        }

        res.json({ message: "Tournoi supprimé avec succès", tournament: result.rows[0] });
    } catch (err) {
        console.error('Erreur suppression tournoi :', err);
        res.status(500).json({ error: "Erreur lors de la suppression du tournoi" });
    }
};

exports.getTeamsForTournament = async (req, res) => {
    const tournamentId = req.params.id;

    try {
        const result = await pool.query(`
      SELECT teams.id, teams.name, teams.elo
      FROM tournament_registrations
      JOIN teams ON tournament_registrations.team_id = teams.id
      WHERE tournament_registrations.tournament_id = $1
    `, [tournamentId]);

        res.json({ teams: result.rows });
    } catch (err) {
        console.error("Erreur getTeamsForTournament :", err);
        res.status(500).json({ error: 'Erreur serveur', detail: err.message });
    }
};

exports.unregisterTeamFromTournament = async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    try {
        // Vérifier si l'utilisateur est owner d'une team
        const teamRes = await pool.query(`
            SELECT * FROM teams WHERE owner_id = $1
        `, [userId]);

        const team = teamRes.rows[0];
        if (!team) return res.status(403).json({ error: "Vous ne possédez pas d'équipe." });

        // Vérifier si cette team est inscrite au tournoi
        const check = await pool.query(`
            SELECT * FROM tournament_registrations WHERE tournament_id = $1 AND team_id = $2
        `, [tournamentId, team.id]);

        if (check.rowCount === 0)
            return res.status(400).json({ error: "Votre équipe n'est pas inscrite à ce tournoi." });

        // Supprimer l'inscription
        await pool.query(`
            DELETE FROM tournament_registrations WHERE tournament_id = $1 AND team_id = $2
        `, [tournamentId, team.id]);

        res.json({ message: "Votre équipe a bien quitté le tournoi." });

    } catch (err) {
        console.error("Erreur désinscription :", err);
        res.status(500).json({ error: "Erreur serveur lors de la désinscription." });
    }
};
