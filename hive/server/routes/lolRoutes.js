const express = require('express');
const router = express.Router();
const { linkLoLAccount, refreshLoLAccount, getLoLAccount } = require('../controllers/lolController');
const authenticateToken = require('../middlewares/auth');

router.post('/link', authenticateToken, linkLoLAccount);
router.post('/refresh', authenticateToken, refreshLoLAccount);

router.get('/me', authenticateToken, getLoLAccount);

module.exports = router;
