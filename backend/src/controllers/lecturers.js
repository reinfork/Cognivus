const supabase = require('../config/supabase');

exports.getAllLecturer = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lecturers')
      .select(`
        id,
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone_number,
        user_id,
        users!inner(
          user_id,
          username,
          email
        )
      `);
    
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

exports.getLecturerById = async (req, res) => {
  try {
    // Check if we're looking by user_id (from JWT token) or lecturer id
    const { id } = req.params;
    
    // First try to get lecturer by user_id (for profile lookups)
    let lecturerQuery = supabase
      .from('lecturers')
      .select(`
        id,
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone_number,
        user_id,
        users!inner(
          user_id,
          username,
          email
        )
      `)
      .eq('user_id', id)
      .single();
    
    let { data, error } = await lecturerQuery;
    
    // If not found by user_id, try by lecturer id
    if (error && error.code === 'PGRST116') {
      lecturerQuery = supabase
        .from('lecturers')
        .select(`
          id,
          fullname,
          age,
          birthplace,
          address,
          birthdate,
          phone_number,
          user_id,
          users!inner(
            user_id,
            username,
            email
          )
        `)
        .eq('id', id)
        .single();
      
      const result = await lecturerQuery;
      data = result.data;
      error = result.error;
    }
    
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
    const { fullname, age, birthplace, address, birthdate, phone_number, user_id } = req.body;
    
    const { data, error } = await supabase
      .from('lecturers')
      .insert([{
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone_number,
        user_id
      }])
      .select(`
        id,
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone_number,
        user_id,
        users!inner(
          user_id,
          username,
          email
        )
      `);
    
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
    const { fullname, age, birthplace, address, birthdate, phone_number } = req.body;
    
    // First check if we're updating by user_id or lecturer id
    let updateQuery = supabase
      .from('lecturers')
      .update({
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone_number
      })
      .eq('user_id', id)
      .select(`
        id,
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone_number,
        user_id,
        users!inner(
          user_id,
          username,
          email
        )
      `);
    
    let { data, error } = await updateQuery;
    
    // If not found by user_id, try by lecturer id
    if (error || !data || data.length === 0) {
      updateQuery = supabase
        .from('lecturers')
        .update({
          fullname,
          age,
          birthplace,
          address,
          birthdate,
          phone_number
        })
        .eq('id', id)
        .select(`
          id,
          fullname,
          age,
          birthplace,
          address,
          birthdate,
          phone_number,
          user_id,
          users!inner(
            user_id,
            username,
            email
          )
        `);
      
      const result = await updateQuery;
      data = result.data;
      error = result.error;
    }
    
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