const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/getAlls', auth, messageController.getAllMessages);
router.post('/send', auth, messageController.sendMessage);
router.get('/receive', auth, messageController.getUserMessages);

module.exports = router; 