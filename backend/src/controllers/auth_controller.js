const supabase = require('../config/supabase');

const authController = {
  async register(req, res) {
    try {
      const { email, password, full_name, role } = req.body;
      
      // Validate input
      if (!email || !password || !full_name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and full name are required'
        });
      }

      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
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
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

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
  },

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user profile from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found',
          error: userError.message
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          ...req.user,
          profile: userData
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching profile',
        error: error.message
      });
    }
  },

  async logout(req, res) {
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
  }
};

module.exports = authController;