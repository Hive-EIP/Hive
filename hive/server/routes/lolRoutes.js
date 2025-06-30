const express = require('express');
const router = express.Router();
const { linkLoLAccount } = require('../controllers/lolController');
const authenticateToken = require('../middlewares/auth');

router.post('/link', authenticateToken, linkLoLAccount);

module.exports = router;
