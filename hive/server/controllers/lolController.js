const { pool } = require('../config/postgres');
const riotService = require('../services/riotService');

exports.linkLoLAccount = async (req, res) => {
    const userId = req.user.id;
    const { summoner_name, tag } = req.body;
    console.log("📥 Requête reçue pour lien LoL :", req.body);

    try {
        const puuid = await riotService.fetchPUUIDByRiotId(summoner_name, tag);
        console.log("🔎 PUUID récupéré :", puuid);

        const ranked = await riotService.fetchRankedData(puuid);
        console.log("📊 Données classées :", ranked);

        let tier = null;
        let rank = null;
        let lp = null;
        let elo = 1;
        let raw_data = {};
        let winrate = null;

        if (ranked) {
            const totalGames = ranked.wins + ranked.losses;
            winrate = totalGames > 0 ? (ranked.wins / totalGames) * 100 : null;
            tier = ranked.tier;
            rank = ranked.rank;
            lp = ranked.leaguePoints;
            elo = riotService.mapTierToElo(tier);
            raw_data = {
                tier,
                rank,
                lp
            };

            console.log(`🏆 Victoires : ${ranked.wins}, ❌ Défaites : ${ranked.losses}, 🎯 Winrate : ${winrate?.toFixed(2)}%`);
        } else {
            console.warn("⚠️ Aucun rang classé trouvé pour ce joueur.");
        }

        // Insertion même si ranked est vide
        await pool.query(`
        INSERT INTO user_game_accounts
        (user_id, game, summoner_name, tag, summoner_id, tier, rank, lp, elo_score, raw_data, winrate)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (user_id, game)
        DO UPDATE SET
            summoner_name = EXCLUDED.summoner_name,
            tag = EXCLUDED.tag,
            summoner_id = EXCLUDED.summoner_id,
            tier = EXCLUDED.tier,
            rank = EXCLUDED.rank,
            lp = EXCLUDED.lp,
            elo_score = EXCLUDED.elo_score,
            raw_data = EXCLUDED.raw_data,
            winrate = EXCLUDED.winrate,
            last_updated = NOW()
    `, [
            userId,
            'LoL',
            summoner_name,
            tag,
            puuid,
            tier,
            rank,
            lp,
            elo,
            raw_data,
            winrate
        ]);

        // ⚙️ Met à jour l'elo de l'équipe si applicable
        const teamRes = await pool.query(`SELECT team_id FROM team_members WHERE user_id = $1`, [userId]);
        if (teamRes.rowCount > 0) {
            const teamId = teamRes.rows[0].team_id;
            const eloRes = await pool.query(`
                SELECT AVG(uga.elo_score)::INTEGER AS avg_elo
                FROM team_members tm
                         JOIN user_game_accounts uga ON tm.user_id = uga.user_id
                WHERE tm.team_id = $1 AND uga.game = 'LoL'
            `, [teamId]);

            const newElo = eloRes.rows[0].avg_elo ?? 1;
            await pool.query('UPDATE teams SET elo = $1 WHERE id = $2', [newElo, teamId]);
        }

        res.json({
            message: "Compte League of Legends lié avec succès",
            data: {
                summoner_name,
                tag,
                tier,
                rank,
                lp,
                elo_score: elo
            }
        });

    } catch (err) {
        console.error("❌ Erreur lien LoL :", err.response?.data || err);
        res.status(500).json({ error: "Erreur lors du lien avec le compte LoL" });
    }
};


exports.refreshLoLAccount = async (req, res) => {
    const userId = req.user.id;

    try {
        // 🔎 On récupère les infos précédemment liées
        const { rows } = await pool.query(
            `SELECT summoner_name, tag FROM user_game_accounts WHERE user_id = $1 AND game = 'LoL'`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Aucun compte LoL lié" });
        }

        const { summoner_name, tag } = rows[0];

        // 🔄 Mise à jour avec Riot API
        const puuid = await riotService.fetchPUUIDByRiotId(summoner_name, tag);
        const summoner = await riotService.fetchSummonerByPUUID(puuid);
        const ranked = await riotService.fetchRankedData(puuid);

        if (!ranked) {
            return res.status(404).json({ error: "Aucun rang classé trouvé" });
        }

        const elo = riotService.mapTierToElo(ranked.tier);
        const totalGames = ranked.wins + ranked.losses;
        const winrate = totalGames > 0 ? (ranked.wins / totalGames) * 100 : null;

        const raw_data = {
            tier: ranked.tier,
            rank: ranked.rank,
            lp: ranked.leaguePoints
        };

        await pool.query(`
            UPDATE user_game_accounts
            SET summoner_id = $1,
                tier = $2,
                rank = $3,
                lp = $4,
                elo_score = $5,
                raw_data = $6,
                winrate = $7,
                last_updated = NOW()
            WHERE user_id = $8 AND game = 'LoL'
        `, [
            summoner.id,
            ranked.tier,
            ranked.rank,
            ranked.leaguePoints,
            elo,
            raw_data,
            winrate,
            userId
        ]);
        const wins = ranked.wins;
        const losses = ranked.losses;
        console.log(`🏆 Victoires : ${wins}, ❌ Défaites : ${losses}, 🎯 Winrate : ${winrate?.toFixed(2)}%`);
        // 🔁 Mise à jour de l’elo moyen d’équipe
        const teamRes = await pool.query(
            `SELECT team_id FROM team_members WHERE user_id = $1`,
            [userId]
        );

        if (teamRes.rowCount > 0) {
            const teamId = teamRes.rows[0].team_id;

            const eloRes = await pool.query(`
                SELECT AVG(uga.elo_score)::INTEGER AS avg_elo
                FROM team_members tm
                JOIN user_game_accounts uga ON tm.user_id = uga.user_id
                WHERE tm.team_id = $1 AND uga.game = 'LoL'
            `, [teamId]);

            const newElo = eloRes.rows[0].avg_elo ?? 1;
            await pool.query('UPDATE teams SET elo = $1 WHERE id = $2', [newElo, teamId]);
        }

        res.json({
            message: "Données mises à jour avec succès",
            data: {
                summoner_name,
                tag,
                tier: ranked.tier,
                rank: ranked.rank,
                lp: ranked.leaguePoints,
                elo_score: elo
            }
        });

    } catch (err) {
        console.error("Erreur refresh LoL :", err.response?.data || err);
        res.status(500).json({ error: "Erreur lors de la mise à jour des données LoL" });
    }
};

exports.getLoLAccount = async (req, res) => {
    const userId = req.user.id;
    console.log("🧠 ID utilisateur dans le token :", userId);


    try {
        const result = await pool.query(
            'SELECT * FROM user_game_accounts WHERE user_id = $1 AND game = $2',
            [userId, 'LoL']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Aucun compte LoL lié à ce profil." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération du compte LoL :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};
