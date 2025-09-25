const supabase = require('../config/supabase');

//read all user data
exports.get_all_users = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tbuser')
      .select('*');
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

//read user by id
exports.get_users_by_id = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tbuser')
      .select('*')
      .eq('user_id', req.params.id)
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

//insert new user
exports.create_users = async (req, res) => {
  try {
    const { nama_lengkap, jenis_kelamin, alamat, no_hp, nama_ortu, no_hp_ortu } = req.body;
    
    const { data, error } = await supabase
      .from('tbuser')
      .insert([{
        nama_lengkap,
        jenis_kelamin,
        alamat,
        no_hp,
        nama_ortu,
        no_hp_ortu
      }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// update user data
exports.update_users = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, encrypted_password, email, updated_at } = req.body;
    
    const { data, error } = await supabase
      .from('tbuser')
      .update({
        nama_lengkap,
        jenis_kelamin,
        alamat,
        no_hp,
        nama_ortu,
        no_hp_ortu
      })
      .eq('user_id', id)
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// delete user instance
exports.delete_users = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('tbuser')
      .delete()
      .eq('user_id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'user deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lecturer',
      error: error.message
    });
  }
};