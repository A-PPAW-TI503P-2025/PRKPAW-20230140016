import React, { useState } from 'react';
import './App.css';

function App() {
  // Membuat state untuk menyimpan nama, nilai awalnya string kosong ''
  const [nama, setNama] = useState('');

  // Fungsi untuk menangani perubahan pada input field
  const handleInputChange = (event) => {
    setNama(event.target.value);
  };
 
  return (
    <div className="App">
      <header className="App-header">
        {/* Input field untuk memasukkan nama */}
        <input
          type="text"
          placeholder="Ketik nama Anda di sini..."
          value={nama}
          onChange={handleInputChange}
          style={{ padding: '10px', fontSize: '16px', margin: '20px' }}
        />

        {/* Menampilkan pesan jika nama sudah diinput */}
        {nama && <h1>Hello, {nama}!</h1>}
        
        {/* Pesan default jika belum ada nama yang diinput */}
        {!nama && <p>Silakan masukkan nama Anda.</p>}
      </header>
    </div>
  );
}

export default App;