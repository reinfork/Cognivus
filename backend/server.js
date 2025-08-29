// server.js
const express = require('express');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config(); // Memuat variabel dari file .env

const app = express();
const port = 3000;

// --- Konfigurasi Session ---
app.use(session({
    secret: process.env.SESSION_SECRET, // Kunci rahasia dari file .env
    resave: false,
    saveUninitialized: true,
}));

// --- Inisialisasi Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- Konfigurasi Google Strategy untuk Passport ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback" // Harus sama dengan yang di Google Cloud Console
  },
  (accessToken, refreshToken, profile, done) => {
    // Di sini Anda biasanya akan mencari atau membuat user di database
    // Untuk contoh ini, kita langsung teruskan profilnya
    return done(null, profile);
  }
));

// Menyimpan user ID ke session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Mengambil user dari session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware untuk memeriksa apakah user sudah login
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

// --- Rute (Routes) ---
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rute untuk memulai otentikasi Google
// Ini yang dipanggil oleh tombol di frontend
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Rute callback setelah login dari Google
app.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/profile', // Arahkan ke halaman profil jika berhasil
    failureRedirect: '/', // Kembali ke halaman login jika gagal
  })
);

// Rute profil yang dilindungi (hanya bisa diakses setelah login)
app.get('/profile', isLoggedIn, (req, res) => {
    res.send(`<h1>Halo, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});

// Rute untuk logout
app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});