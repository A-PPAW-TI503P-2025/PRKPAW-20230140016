
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

// Membuat endpoint GET untuk root ('/')
app.get('/', (req, res) => {
  // Mengirim respons dalam format JSON
  res.json({ message: 'Hello from Server!' });
});

// Menjalankan server pada port yang telah ditentukan
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});