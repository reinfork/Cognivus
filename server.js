// server.js
const express = require('express');
const path = require('path');

// Membuat aplikasi express
const app = express();
const port = 3000; // Anda bisa mengganti port jika diperlukan

// Memberitahu Express untuk menyajikan file statis dari folder root
// Ini akan membuat file seperti index.html, CSS, dan gambar bisa diakses
app.use(express.static(__dirname));

// Membuat rute utama ('/') untuk mengirimkan file index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});