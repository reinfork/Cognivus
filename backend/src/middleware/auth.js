const supabase = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
  // Bypass authentication in development environment
  if (process.env.NODE_ENV === 'development') {
    // Optionally, mock a user object for development testing
    req.user = {
      id: 'dev-user-id',
      email: 'dev@example.com',
      role: 'developer',
      // Add any other mock properties you need
    };
    console.log('Development mode: Authentication bypassed');
    return next();
  }
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

module.exports = { authenticateToken };