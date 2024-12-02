const express = require('express');
const router = express.Router();
const { identifyContact, searchContacts } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

// Public Endpoint
router.post('/identify', identifyContact);

// Protected Endpoint
router.get('/search', authMiddleware, searchContacts);

module.exports = router;
