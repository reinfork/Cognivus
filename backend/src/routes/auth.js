const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
          role: role || 'student'
        }
      }
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
    
    // Note: Your trigger will automatically create the student profile
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      user: data.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // This would be protected by authentication middleware
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    // Get user info from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: authError.message
      });
    }
    
    // Get student profile from your database
    const { data: studentData, error: studentError } = await supabase
      .from('student')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (studentError) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
        error: studentError.message
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...user,
        student_profile: studentData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
});

module.exports = router;