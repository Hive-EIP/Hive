const axios = require('axios');

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const RIOT_REGION = 'euw1';
const RIOT_ACCOUNT_REGION = 'europe';

const headers = {
    headers: {
        "X-Riot-Token": RIOT_API_KEY
    }
};

const tierToElo = {
    IRON: 1,
    BRONZE: 2,
    SILVER: 3,
    GOLD: 4,
    PLATINUM: 5,
    EMERALD: 6,
    DIAMOND: 7,
    MASTER: 8,
    GRANDMASTER: 9,
    CHALLENGER: 10
};

exports.fetchPUUIDByRiotId = async (summonerName, tag) => {
    const url = `https://${RIOT_ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(summonerName)}/${encodeURIComponent(tag)}`;
    const res = await axios.get(url, headers);
    return res.data.puuid;
};

exports.fetchSummonerByPUUID = async (puuid) => {
    const url = `https://${RIOT_REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

    const res = await axios.get(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY }
    });

    console.log("[fetchSummonerByPUUID] Response data:", res.data); // ← LOG ENTIER
    return res.data;
};


exports.fetchRankedData = async (puuid) => {
    const url = `https://${RIOT_REGION}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
    const res = await axios.get(url, headers);
    return res.data.find(e => e.queueType === "RANKED_SOLO_5x5");
};

exports.mapTierToElo = (tier) => tierToElo[tier?.toUpperCase()] ?? 1;
