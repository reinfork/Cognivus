const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken')

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

   // --- LECTURER LOGIN DO NOT CHANGE FOR NOW! ---
  async loginLecturer(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
      }

      // 1. Cari dosen di database
      const { data: lecturer, error } = await supabase
        .from('lecturers')
        .select('id, username, password_hash, nama_lengkap, email')
        .eq('username', username)
        .single();

      if (error || !lecturer) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      // 2. Bandingkan password teks biasa (TIDAK AMAN)
      const isPasswordMatch = (password === lecturer.password_hash);

      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      // 3. Buat JWT kustom
      const payload = { id: lecturer.id, username: lecturer.username, role: 'lecturer' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

      // 4. Kirim respons sukses
      res.status(200).json({
        success: true,
        message: 'Lecturer login successful',
        token: token,
        user: { id: lecturer.id, username: lecturer.username, nama_lengkap: lecturer.nama_lengkap, email: lecturer.email },
        role: 'lecturer'
      });

    } catch (error) {
      console.error('Lecturer login server error:', error);
      res.status(500).json({ success: false, message: 'An internal server error occurred.' });
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