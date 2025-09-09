const supabase = require('../config/supabase');

exports.getAllLecturer = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lecturers')
      .select('*');
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lecturers',
      error: error.message
    });
  }
};

exports.getLecturerById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lecturers')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lecturer',
      error: error.message
    });
  }
};

exports.createLecturer = async (req, res) => {
  try {
    const { nama_lengkap, jenis_kelamin, alamat, no_hp, nama_ortu, no_hp_ortu } = req.body;
    
    const { data, error } = await supabase
      .from('lecturers')
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
      message: 'Error creating lecturer',
      error: error.message
    });
  }
};

// Update data lecturer
exports.updateLecturer = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_lengkap, jenis_kelamin, alamat, no_hp, nama_ortu, no_hp_ortu } = req.body;
    
    const { data, error } = await supabase
      .from('lecturers')
      .update({
        nama_lengkap,
        jenis_kelamin,
        alamat,
        no_hp,
        nama_ortu,
        no_hp_ortu
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lecturer',
      error: error.message
    });
  }
};

// Delete data lecturer
exports.deleteLecturer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('lecturers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'lecturer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lecturer',
      error: error.message
    });
  }
};