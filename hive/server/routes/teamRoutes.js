const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/auth');

router.post('/:teamId/join', authMiddleware, teamController.joinTeam);
router.post('/:teamId/leave', authMiddleware, teamController.leaveTeam);
router.post('/:teamId/invite', authMiddleware, teamController.inviteToTeam);
router.post('/create', authMiddleware, teamController.createTeam);
router.post('/invitations/:invitationId/respond', authMiddleware, teamController.respondToInvitation);

router.get('/', teamController.getAllTeams);
router.get('/my-team', authMiddleware, teamController.getMyTeams);
router.get('/invitations', authMiddleware, teamController.getInvitations);
router.get('/:teamId/invitations', authMiddleware, teamController.getSentInvitations);
router.get('/invitations/received', authMiddleware, teamController.getReceivedInvitations);
router.get('/:teamId/members', authMiddleware, teamController.getTeamMembers);
router.get('/:teamId', authMiddleware, teamController.getTeamById);

router.delete('/invitations/:invitationId', authMiddleware, teamController.cancelInvitation);
router.delete('/:teamId', authMiddleware, teamController.deleteTeam);

module.exports = router;
