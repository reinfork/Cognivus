const supabase = require('../config/supabase');

exports.getAllStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student')
      .select('*');
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

    let query;

    if (isUuid) {
      query = supabase.from('student').select('*').eq('user_id', id);
    } else {
      query = supabase.from('student').select('*').eq('id', id);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') { // The result contains 0 rows
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      throw error; // For other errors
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { nama_lengkap, jenis_kelamin, alamat, no_hp, nama_ortu, no_hp_ortu } = req.body;
    
    const { data, error } = await supabase
      .from('student')
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
      message: 'Error creating student',
      error: error.message
    });
  }
};

// Update data student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_lengkap, jenis_kelamin, alamat, no_hp, nama_ortu, no_hp_ortu } = req.body;
    
    const { data, error } = await supabase
      .from('student')
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
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete data student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('student')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};