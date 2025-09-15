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

      // 1. Cari user di database users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id, username, encrypted_password, email')
        .eq('username', username)
        .single();

      if (userError || !user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      // 2. Bandingkan password teks biasa dengan encrypted_password
      const isPasswordMatch = (password === user.encrypted_password);

      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }

      // 3. Cek apakah user ini adalah lecturer dengan mencari di lecturers table
      const { data: lecturer, error: lecturerError } = await supabase
        .from('lecturers')
        .select('id, fullname, user_id')
        .eq('user_id', user.user_id)
        .single();

      if (lecturerError || !lecturer) {
        return res.status(401).json({ success: false, message: 'User is not authorized as a lecturer.' });
      }

      // 4. Buat JWT kustom
      const payload = { id: user.user_id, username: user.username, role: 'lecturer', lecturer_id: lecturer.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

      // 5. Kirim respons sukses
      res.status(200).json({
        success: true,
        message: 'Lecturer login successful',
        token: token,
        user: { 
          id: user.user_id, 
          username: user.username, 
          nama_lengkap: lecturer.fullname, 
          email: user.email,
          lecturer_id: lecturer.id
        },
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