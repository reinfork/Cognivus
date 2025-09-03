// This is a representation of your Supabase table
// In Supabase, you don't need Sequelize models, but this helps with documentation

class Student {
  constructor(data) {
    this.id = data.id;
    this.nama_lengkap = data.nama_lengkap;
    this.jenis_kelamin = data.jenis_kelamin;
    this.alamat = data.alamat;
    this.no_hp = data.no_hp;
    this.nama_ortu = data.nama_ortu;
    this.no_hp_ortu = data.no_hp_ortu;
  }
}

module.exports = Student;