const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-key';

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password with hash
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to protect routes
const authenticateLecturer = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
  
  try {
    // Get lecturer from database
    const { data: lecturer, error } = await supabase
      .from('lecturers')
      .select('*')
      .eq('id', decoded.id)
      .single();
    
    if (error || !lecturer) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    
    req.lecturer = lecturer;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authenticateLecturer
};