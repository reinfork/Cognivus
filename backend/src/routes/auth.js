const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: authError.message
      });
    }
    
    // Add user to your users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id, 
          email: email, 
          name: name, 
          role: role || 'student' 
        }
      ]);
    
    if (userError) {
      return res.status(400).json({
        success: false,
        message: 'User creation failed',
        error: userError.message
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: authData.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
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
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;