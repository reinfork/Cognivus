const supabase = require('../config/supabase');

exports.getAllLecturer = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tbteacher')
      .select(`
        teacherid,
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone,
        user_id,
        lasteducation,
        tbuser!inner(
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
      .from('tbteacher')
      .select(`
        teacherid,
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone,
        user_id,
        lasteducation,
        tbuser!inner(
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
        .from('tbteacher')
        .select(`
          teacherid,
          fullname,
          age,
          birthplace,
          address,
          birthdate,
          phone,
          user_id,
          lasteducation,
          tbuser!inner(
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
    // Data untuk tabel users
    const { username, email, password } = req.body;
    // Data untuk tabel tbteacher
    const { fullname, age, birthplace, address, birthdate, phone_number, academic_background } = req.body;

    // --- Langkah 1: Buat entri di tabel 'users' ---
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, and password are required for the user account.' });
    }

    // Hash password sebelum disimpan
    const saltRounds = 10;
    const encrypted_password = await bcrypt.hash(password, saltRounds);

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        encrypted_password,
        role_id: 2 // role_id 2 untuk 'lecturer'
      })
      .select('user_id')
      .single();

    if (userError) {
      // Jika username atau email sudah ada, Supabase akan error
      return res.status(409).json({ success: false, message: 'Error creating user account.', error: userError.message });
    }

    // --- Langkah 2: Buat entri di tabel 'tbteacher' menggunakan user_id dari user baru ---

    // Ubah string kosong menjadi null agar sesuai dengan tipe data database
    age = age === '' ? null : parseInt(age); // Ubah ke integer atau null
    birthplace = birthplace === '' ? null : birthplace;
    address = address === '' ? null : address;
    birthdate = birthdate === '' ? null : birthdate;
    academic_background = academic_background === '' ? null : academic_background;
    const { data: newLecturer, error: lecturerError } = await supabase
      .from('tbteacher')
      .insert({
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone_number,
        academic_background,
        user_id: newUser.user_id // Hubungkan dengan user_id yang baru dibuat
      })
      .select()
      .single();

    if (lecturerError) {
      // Jika terjadi error di sini, idealnya user yang sudah dibuat tadi dihapus (rollback)
      // Untuk sekarang, kita kirim error saja
      return res.status(500).json({ success: false, message: 'User account created, but failed to create lecturer profile.', error: lecturerError.message });
    }

    res.status(201).json({
      success: true,
      data: newLecturer
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
      .from('tbteacher')
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
        teacherid,
        fullname,
        age,
        birthplace,
        address,
        birthdate,
        phone,
        user_id,
        lasteducation,
        tbuser!inner(
          user_id,
          username,
          email
        )
      `);

    let { data, error } = await updateQuery;

    // If not found by user_id, try by lecturer id
    if (error || !data || data.length === 0) {
      updateQuery = supabase
        .from('tbteacher')
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
          teacherid,
          fullname,
          age,
          birthplace,
          address,
          birthdate,
          phone,
          user_id,
          lasteducation,
          tbuser!inner(
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
    const { id } = req.params; // Ini adalah 'id' dari tabel tbteacher, bukan user_id

    // Ambil user_id dari lecturer yang akan dihapus
    const { data: lecturer, error: findError } = await supabase
      .from('tbteacher')
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError || !lecturer) {
      return res.status(404).json({ success: false, message: 'Lecturer not found.' });
    }

    // --- Langkah 1: Hapus dari tabel 'tbteacher' ---
    const { error: lecturerError } = await supabase
      .from('tbteacher')
      .delete()
      .eq('id', id);

    if (lecturerError) throw lecturerError;

    // --- Langkah 2: Hapus dari tabel 'users' ---
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('user_id', lecturer.user_id);

    if (userError) throw userError;

    res.json({
      success: true,
      message: 'Lecturer and associated user account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lecturer',
      error: error.message
    });
  }
};