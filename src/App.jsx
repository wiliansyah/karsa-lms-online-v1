import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, Layout } from 'lucide-react';

// Import kedua aplikasi yang sudah dipisah tadi
import UserApp from './UserApp';
import AdminApp from './AdminApp';

// Halaman Menu Depan (Landing Page Sederhana)
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Intro Section */}
        <div className="space-y-6 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-slate-800">KARSA <span className="text-[#D12027]">University</span></h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Selamat datang di Portal Learning Management System (LMS) Mockup. 
            Silakan pilih role untuk melihat antarmuka yang berbeda.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400 font-bold bg-white p-3 rounded-lg border border-slate-200 w-fit">
            <Layout size={16} /> Versi Demo v1.0
          </div>
        </div>

        {/* Card Selection */}
        <div className="space-y-4">
          <div 
            onClick={() => navigate('/user')}
            className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-[#D12027] cursor-pointer transition-all shadow-sm hover:shadow-xl flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#D12027] group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800 group-hover:text-[#D12027] transition-colors">User Interface</h3>
              <p className="text-slate-500 text-sm">Masuk sebagai Karyawan (Staff/Manager). Akses materi, kuis, dan leaderboard.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin')}
            className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-[#FDB913] cursor-pointer transition-all shadow-sm hover:shadow-xl flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800 group-hover:text-yellow-600 transition-colors">Superadmin Interface</h3>
              <p className="text-slate-500 text-sm">Masuk sebagai HR/Admin. Kelola kurikulum, assign training, dan analytics.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Routing Logic
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