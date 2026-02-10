import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, Layout } from 'lucide-react';
import Joyride, { STATUS } from 'react-joyride'; // 1. Import Joyride

// Import kedua aplikasi yang sudah Anda buat
import UserApp from './UserApp';
import AdminApp from './AdminApp';

// --- HALAMAN DEPAN (LANDING PAGE) ---
const LandingPage = () => {
  const navigate = useNavigate();

  // 2. State untuk mengontrol Tutorial
  const [runTutorial, setRunTutorial] = useState(true);

  // 3. Definisi Langkah-langkah Tutorial
  const steps = [
    {
      target: 'body', // Target body berarti muncul di tengah layar
      content: (
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">Selamat Datang! 👋</h3>
          <p>Ini adalah tur singkat untuk mengenalkan fitur di KARSA University LMS.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#tour-intro', // ID yang kita pasang di judul
      content: 'Ini adalah halaman utama portal LMS Anda.',
    },
    {
      target: '#tour-user', // ID untuk kartu User
      content: 'Klik di sini jika Anda adalah Karyawan untuk mengakses materi dan kuis.',
    },
    {
      target: '#tour-admin', // ID untuk kartu Admin
      content: 'Klik di sini jika Anda HR/Admin untuk mengelola data dan kurikulum.',
    },
  ];

  // Fungsi agar tutorial berhenti setelah selesai
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      
      {/* 4. Komponen Joyride */}
      <Joyride
        steps={steps}
        run={runTutorial}
        continuous={true} // Agar ada tombol "Next"
        showSkipButton={true}
        showProgress={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#D12027', // Menyesuaikan warna merah Karsa
            zIndex: 1000,
          },
        }}
        locale={{ 
          back: 'Kembali', 
          close: 'Tutup', 
          last: 'Selesai', 
          next: 'Lanjut', 
          skip: 'Lewati' 
        }} 
      />

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Intro */}
        {/* Tambahkan ID 'tour-intro' di sini */}
        <div id="tour-intro" className="space-y-6 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-slate-800">
            KARSA <span className="text-[#D12027]">University</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Selamat datang di Portal Learning Management System (LMS). 
            Silakan pilih peran Anda untuk masuk ke dashboard yang sesuai.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400 font-bold bg-white p-3 rounded-lg border border-slate-200 w-fit">
            <Layout size={16} /> Mockup Demo v1.0
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Menu */}
        <div className="space-y-4">
          {/* Kartu User */}
          {/* Tambahkan ID 'tour-user' di sini */}
          <div 
            id="tour-user"
            onClick={() => navigate('/user')}
            className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-[#D12027] cursor-pointer transition-all shadow-sm hover:shadow-xl flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#D12027] group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800 group-hover:text-[#D12027] transition-colors">User Area</h3>
              <p className="text-slate-500 text-sm">Masuk sebagai Karyawan. Akses materi training dan kuis.</p>
            </div>
          </div>

          {/* Kartu Admin */}
          {/* Tambahkan ID 'tour-admin' di sini */}
          <div 
            id="tour-admin"
            onClick={() => navigate('/admin')}
            className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-[#FDB913] cursor-pointer transition-all shadow-sm hover:shadow-xl flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800 group-hover:text-yellow-600 transition-colors">Admin HR</h3>
              <p className="text-slate-500 text-sm">Masuk sebagai Superadmin. Kelola kurikulum dan data karyawan.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- ROUTING UTAMA ---
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<UserApp />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </Router>
  );
};

export default App;