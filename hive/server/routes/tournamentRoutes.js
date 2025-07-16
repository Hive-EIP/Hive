const express = require('express');
const router = express.Router();
const {
    createTournament,
    registerTeamToTournament,
    getRegisteredTournaments,
    generateMatches,
    getTournamentMatches,
    declareWinner,
    openTournament,
    deleteTournament,
    getAllTournaments,
    getTeamsForTournament,
    unregisterTeamFromTournament,
} = require('../controllers/tournamentController');

const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');

router.post('/create', authenticateToken, authorizeRole(['admin', 'moderator']), createTournament);
router.post('/:id/register', authenticateToken, registerTeamToTournament);
router.post('/:id/generate-matches', authenticateToken, authorizeRole(['admin', 'moderator']), generateMatches);
router.post('/matches/:id/winner', authenticateToken, authorizeRole(['admin', 'moderator']), declareWinner);

router.get('/registered/:teamId', authenticateToken, getRegisteredTournaments);
router.get('/:id/teams', authenticateToken, getTeamsForTournament);
router.get('/:id/matches', authenticateToken, getTournamentMatches);
router.get('/global', authenticateToken, getAllTournaments);

router.patch('/:id/open', authenticateToken, authorizeRole(['admin', 'moderator']), openTournament);

router.delete('/:id', authenticateToken, authorizeRole(['admin', 'moderator']), deleteTournament);
router.delete('/:id/unregister', authenticateToken, unregisterTeamFromTournament);

module.exports = router;
