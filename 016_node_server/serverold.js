// server.js

const express = require('express');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = 3001;

// 1. Middleware untuk parsing body JSON
// PENTING: Ini harus diletakkan SEBELUM rute (`app.use('/api/books', ...)`).
app.use(express.json());

// 2. Middleware untuk logging setiap request yang masuk
// Log ini akan muncul di terminal setiap kali ada request ke server.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next(); // Melanjutkan ke proses berikutnya
});

// 3. Menghubungkan rute utama ke file `routes/books.js`
// Semua request yang diawali dengan /api/books akan ditangani oleh file ini.
app.use('/api/books', bookRoutes);

// 4. Middleware untuk menangani 404 Not Found
// Ini akan dijalankan jika tidak ada rute yang cocok dengan request dari klien.
app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource tidak ditemukan' });
});

// 5. Global Error Handler
// Middleware ini akan menangkap setiap error yang terjadi di dalam aplikasi.
app.use((err, req, res, next) => {
    // Mencetak detail error di terminal untuk debugging.
    console.error(err.stack); 
    // Mengirim pesan error umum ke klien.
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

// Menjalankan server pada port yang ditentukan
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});