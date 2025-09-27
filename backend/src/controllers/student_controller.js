const supabase = require('../config/supabase');

const STUDENT_SELECT_FIELDS = `
  student_id,
  user_id,
  fullname,
  gender,
  address,
  phone,
  parentname,
  parentphone,
  birthdate,
  birthplace,
  class_id
`;

const buildStudentPayload = (body = {}) => {
  const allowedFields = [
    'student_id',
    'user_id',
    'fullname',
    'gender',
    'address',
    'phone',
    'parentname',
    'parentphone',
    'birthdate',
    'birthplace',
    'class_id'
  ];

  return allowedFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field] === '' ? null : body[field];
    }
    return payload;
  }, {});
};

exports.getAllStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tbstudent')
      .select(STUDENT_SELECT_FIELDS)
      .order('fullname', { ascending: true });
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

    // Try lookup by associated user_id first (profile flow)
    let { data, error } = await supabase
      .from('tbstudent')
      .select(STUDENT_SELECT_FIELDS)
      .eq('user_id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Fallback: try to find by student_id when user_id lookup fails
      const fallbackResult = await supabase
        .from('tbstudent')
        .select(STUDENT_SELECT_FIELDS)
        .eq('student_id', id)
        .single();

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const payload = buildStudentPayload(req.body);

    if (!payload.fullname || !payload.gender) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap and jenis kelamin harus diisi.'
      });
    }

    const { data, error } = await supabase
      .from('tbstudent')
      .insert([payload])
      .select(STUDENT_SELECT_FIELDS)
      .single();

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
    const payload = buildStudentPayload(req.body);

    const updateQuery = supabase
      .from('tbstudent')
      .update(payload)
      .eq('user_id', id)
      .select(STUDENT_SELECT_FIELDS)
      .single();

    let { data, error } = await updateQuery;

    if (error && error.code === 'PGRST116') {
      // Fallback to student_id when user_id lookup fails
      const fallbackResult = await supabase
        .from('tbstudent')
        .update(payload)
        .eq('student_id', id)
        .select(STUDENT_SELECT_FIELDS)
        .single();

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or could not be updated'
      });
    }
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating student:', error);
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

    const primaryDelete = await supabase
      .from('tbstudent')
      .delete()
      .eq('user_id', id);
    
    if (error) throw error;

    if (!data || data.length === 0) {
      const fallbackDelete = await supabase
        .from('tbstudent')
        .delete()
        .eq('student_id', id)
        .select('student_id');

      data = fallbackDelete.data;
      error = fallbackDelete.error;
    }

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

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