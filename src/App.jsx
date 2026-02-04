import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, Layout } from 'lucide-react';

// Import kedua aplikasi yang sudah Anda buat
// Pastikan nama file di folder src Anda adalah 'UserApp.jsx' dan 'AdminApp.jsx'
import UserApp from './UserApp';
import AdminApp from './AdminApp';

// --- HALAMAN DEPAN (LANDING PAGE) ---
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Intro */}
        <div className="space-y-6 flex flex-col justify-center">
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
          <div 
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
          <div 
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