const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();
const authController = require('../controllers/auth.js');
const { authenticateToken } = require('../middleware/auth');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SUPER_KEY
);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth endpoint is working!',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile',
      logout: 'POST /api/auth/logout'
    }
  });
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login/lecturer', authController.loginLecturer);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;