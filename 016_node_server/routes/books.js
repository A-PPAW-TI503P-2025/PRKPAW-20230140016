// routes/books.js

const express = require('express');
const router = express.Router();

// Penyimpanan data sementara menggunakan array
let books = [
    { id: 1, title: 'Buku A', author: 'Penulis A' },
    { id: 2, title: 'Buku B', author: 'Penulis B' }
];

// Middleware untuk validasi apakah buku dengan ID tertentu ada
const findBookById = (req, res, next) => {
    const bookId = parseInt(req.params.id, 10);
    if (Number.isNaN(bookId)) {
        return res.status(400).json({ message: 'ID tidak valid' });
    }

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Buku dengan ID tersebut tidak ditemukan' });
    }

    // Menyimpan data yang ditemukan ke dalam request object agar bisa digunakan di handler selanjutnya
    req.bookIndex = bookIndex;
    req.book = books[bookIndex];
    next();
};


// GET /api/books - Mendapatkan semua buku
router.get('/', (req, res) => {
    res.status(200).json(books);
});

// GET /api/books/:id - Mendapatkan satu buku berdasarkan ID
router.get('/:id', findBookById, (req, res) => {
    res.status(200).json(req.book);
});

// POST /api/books - Membuat buku baru
router.post('/', (req, res) => {
    // Guard: jangan destructure dari undefined
    const { title, author } = req.body || {};

    // Validasi input sederhana
    if (!title || !author) {
        return res.status(400).json({ message: 'Judul dan penulis wajib diisi' });
    }

    const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1,
        title,
        author
    };

    books.push(newBook);
    res.status(201).json({ message: 'Buku berhasil ditambahkan', data: newBook });
});

// PUT /api/books/:id - Memperbarui buku berdasarkan ID
router.put('/:id', findBookById, (req, res) => {
    // Guard: jangan destructure dari undefined
    const { title, author } = req.body || {};

    // Validasi input
    if (!title || !author) {
        return res.status(400).json({ message: 'Judul dan penulis wajib diisi' });
    }

    const updatedBook = { ...req.book, title, author };
    books[req.bookIndex] = updatedBook;

    res.status(200).json({ message: 'Buku berhasil diperbarui', data: updatedBook });
});

// DELETE /api/books/:id - Menghapus buku berdasarkan ID
router.delete('/:id', findBookById, (req, res) => {
    books.splice(req.bookIndex, 1);
    res.status(200).json({ message: 'Buku berhasil dihapus' });
});

module.exports = router;