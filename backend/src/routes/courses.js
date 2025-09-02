const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Courses endpoint is working' });
});

module.exports = router;