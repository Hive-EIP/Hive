const { pool } = require('../config/postgres');
const riotService = require('../services/riotService');

exports.linkLoLAccount = async (req, res) => {
    const userId = req.user.id;
    const { summoner_name, tag } = req.body;

    try {
        const puuid = await riotService.fetchPUUIDByRiotId(summoner_name, tag);
        const ranked = await riotService.fetchRankedData(puuid);

        if (!ranked) return res.status(404).json({ error: "Aucun rang classé trouvé" });

        const elo = riotService.mapTierToElo(ranked.tier);

        const raw_data = {
            tier: ranked.tier,
            rank: ranked.rank,
            lp: ranked.leaguePoints
        };

        await pool.query(`
            INSERT INTO user_game_accounts
            (user_id, game, summoner_name, tag, summoner_id, tier, rank, lp, elo_score, raw_data)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
                                   last_updated = NOW()
        `, [
            userId,
            'LoL',
            summoner_name,
            tag,
            puuid,
            ranked.tier,
            ranked.rank,
            ranked.leaguePoints,
            elo,
            raw_data
        ]);

        // Recalculer l’elo de la team si le joueur est dans une team
        const teamRes = await pool.query(`
            SELECT team_id FROM team_members WHERE user_id = $1
        `, [userId]);

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
                tier: ranked.tier,
                rank: ranked.rank,
                lp: ranked.leaguePoints,
                elo_score: elo
            }
        });

    } catch (err) {
        console.error("Erreur lien LoL :", err.response?.data || err);
        res.status(500).json({ error: "Erreur lors du lien avec le compte LoL" });
    }
};
