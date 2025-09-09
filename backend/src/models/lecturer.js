// This is a representation of your Supabase table
// In Supabase, you don't need Sequelize models, but this helps with documentation

class Lecturer {
  constructor(data) {
    this.user_id = data.id;
    this.username = data.username;
    this.password_hash = data.password_hash;
    this.email = data.email;
  }
}

module.exports = Student;