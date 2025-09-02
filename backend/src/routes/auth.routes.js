const express = require('express');
const router = express.Router();

// Temporary routes until we implement full authentication
router.get('/', (req, res) => {
  res.json({ message: 'Auth endpoint is working' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint is working' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint is working' });
});

module.exports = router;