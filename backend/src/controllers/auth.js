const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const roleMapping = {
  1: 'student',
  2: 'lecturer',
  3: 'moderator',
  4: 'admin',
  5: 'owner'
};

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
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
      }

      // 1. Cari user di database users table
      const { data: user, error: userError } = await supabase
        .from('tbuser')
        .select('user_id, username, password, email, role_id')
        .eq('username', username)
        .single();

      if (userError || !user) {
        return res.status(401).json({ success: false, message: 'Invalid Username' });
      }

      // 2. Bandingkan password teks biasa dengan password
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }

      const role = user.role_id;

      if (role !== 2 && role !== 4) {
        return res.status(403).json({ success: false, message: 'Akun tidak terdaftar' });
      }

      // 4. Buat JWT kustom
      const payload = { id: user.user_id, username: user.username, role: roleMapping[role] };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

      // 5. Kirim respons sukses
      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        token: token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
        },
        role: roleMapping[role] // Kirim nama peran ke frontend
      });

    } catch (error) {
      console.error('server error:', error);
      res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
  },

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user profile from database
      const { data: userData, error: userError } = await supabase
        .from('tbuser')
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