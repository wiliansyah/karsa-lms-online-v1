import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Download, Award, DollarSign, Briefcase, GraduationCap,
  PieChart as PieIcon, MapPin, X, LogOut,
  Eye, Layers, Menu, ArrowLeft, Target,
  FileCheck, PlayCircle, ToggleLeft, ToggleRight, HelpCircle, Info
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

// ============================================================================
// 1. KONFIGURASI TEMA & STYLE GLOBAL
// ============================================================================

/**
 * Warna identitas perusahaan (Corporate Identity)
 * Digunakan di seluruh komponen untuk konsistensi branding.
 */
const WARNA_TEMA = {
  MERAH: "#D12027",
  KUNING: "#FDB913",
  ABU_GELAP: "#334155",
  ABU_TERANG: "#f1f5f9",
  SUKSES: "#10b981",
  BAHAYA: "#ef4444"
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: ${WARNA_TEMA.ABU_TERANG}; color: ${WARNA_TEMA.ABU_GELAP}; }
    
    /* Animasi Utilitas */
    .animate-masuk { animation: fadeIn 0.4s ease-out forwards; }
    .animate-naik { animation: slideIn 0.3s ease-out forwards; }
    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pop { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }

    /* Scrollbar Kustom */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* Komponen Interaktif */
    .kartu-hover { transition: all 0.2s; }
    .kartu-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    
    .tombol-utama {
      background: ${WARNA_TEMA.MERAH}; color: white;
      transition: all 0.2s;
    }
    .tombol-utama:hover { background: #b91c22; transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(209, 32, 39, 0.3); }
    
    .sidebar-aktif {
      background: linear-gradient(90deg, rgba(209, 32, 39, 0.1) 0%, transparent 100%);
      border-left: 4px solid ${WARNA_TEMA.MERAH};
      color: ${WARNA_TEMA.MERAH};
    }

    /* Tooltip Kustom untuk InfoTip */
    .tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; }
  `}</style>
);

// ============================================================================
// 2. MOCK DATA (DILOKALISASI)
// ============================================================================

const DATA_KARYAWAN = [
  { id: 'K001', nama: 'Budi Santoso', peran: 'Staf Penjualan', dept: 'Frontliner', cabang: 'Kb. Kawung', progres: 85, kepatuhan: 'Patuh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', kursus_ditugaskan: 12, kursus_selesai: 10, email: 'budi.s@kartikasari.com', telepon: '0812-3456-7890', tgl_gabung: '12 Jan 2022' },
  { id: 'K002', nama: 'Siska Wijaya', peran: 'Manajer Toko', dept: 'Operasional', cabang: 'Dago', progres: 92, kepatuhan: 'Patuh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siska', kursus_ditugaskan: 20, kursus_selesai: 18, email: 'siska.w@kartikasari.com', telepon: '0812-9876-5432', tgl_gabung: '05 Mar 2019' },
  { id: 'K003', nama: 'Andi Pratama', peran: 'Kepala Baker', dept: 'Dapur', cabang: 'Pusat Produksi', progres: 45, kepatuhan: 'Berisiko', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', kursus_ditugaskan: 15, kursus_selesai: 6, email: 'andi.p@kartikasari.com', telepon: '0813-4567-8901', tgl_gabung: '20 Agu 2021' },
  { id: 'K004', nama: 'Rina Melati', peran: 'Supervisor', dept: 'Frontliner', cabang: 'Buah Batu', progres: 78, kepatuhan: 'Patuh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', kursus_ditugaskan: 18, kursus_selesai: 14, email: 'rina.m@kartikasari.com', telepon: '0811-2345-6789', tgl_gabung: '10 Nov 2020' },
  { id: 'K005', nama: 'Dedi Kusuma', peran: 'Logistik', dept: 'Gudang', cabang: 'Pusat', progres: 60, kepatuhan: 'Tidak Patuh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi', kursus_ditugaskan: 10, kursus_selesai: 6, email: 'dedi.k@kartikasari.com', telepon: '0856-7890-1234', tgl_gabung: '15 Feb 2023' },
];

const DATA_KURSUS = [
  { 
    id: 'M01', judul: 'Standar Keamanan Pangan (HACCP)', kategori: 'Wajib', level: 'Semua Staf', 
    ditugaskan: 150, selesai: 120, status: 'Aktif',
    deskripsi: 'Panduan komprehensif tentang Analisis Bahaya dan Titik Kendali Kritis untuk keamanan produk.',
    durasi: '2j 30m', jumlah_modul: 5, tipe: 'Video & Kuis'
  },
  { 
    id: 'M02', judul: 'Pelayanan Prima 2.0', kategori: 'Soft Skill', level: 'Frontliner', 
    ditugaskan: 80, selesai: 45, status: 'Aktif',
    deskripsi: 'Teknik pelayanan pelanggan tingkat lanjut untuk menangani keluhan dan memberikan pengalaman premium.',
    durasi: '1j 45m', jumlah_modul: 3, tipe: 'Video'
  },
  { 
    id: 'M03', judul: 'Sistem Kasir POS Lanjutan', kategori: 'Teknis', level: 'Kasir', 
    ditugaskan: 40, selesai: 38, status: 'Aktif',
    deskripsi: 'Penguasaan teknis sistem Point of Sales termasuk troubleshooting dasar.',
    durasi: '45m', jumlah_modul: 2, tipe: 'Interaktif'
  },
];

const DATA_REQUEST = [
  { id: 'R01', karyawan: 'Siska Wijaya', judul: 'Latte Art Tingkat Lanjut', penyedia: 'Barista Academy', biaya: 2500000, tgl: '20-11-2023', status: 'Menunggu', justifikasi: 'Meningkatkan varian menu kopi premium di cabang Dago.', detail_vendor: 'Barista Academy BDG', timeline: 'Workshop 2 Hari', persetujuan_leader: true },
  { id: 'R02', karyawan: 'Andi Pratama', judul: 'Teknologi Baking Industri', penyedia: 'Baking Center JKT', biaya: 5000000, tgl: '22-11-2023', status: 'Disetujui', justifikasi: 'Efisiensi penggunaan mesin oven baru.', detail_vendor: 'Baking Center JKT', timeline: 'Sertifikasi 1 Minggu', persetujuan_leader: true },
];

const DATA_RADAR_SKILL = [
  { subjek: 'HACCP', A: 120, B: 110, fullMark: 150 },
  { subjek: 'Service', A: 98, B: 130, fullMark: 150 },
  { subjek: 'Teknis', A: 86, B: 130, fullMark: 150 },
  { subjek: 'Manajerial', A: 99, B: 100, fullMark: 150 },
  { subjek: 'Safety', A: 85, B: 90, fullMark: 150 },
];

// ============================================================================
// 3. KOMPONEN UTILITAS & UI KIT
// ============================================================================

/**
 * Menampilkan badge status dengan kode warna yang sesuai.
 * @param {string} status - Status (misal: 'Patuh', 'Menunggu', 'Aktif')
 */
const BadgeStatus = ({ status }) => {
  const styles = {
    'Patuh': 'bg-green-100 text-green-700 border-green-200',
    'Aktif': 'bg-green-100 text-green-700 border-green-200',
    'Disetujui': 'bg-green-100 text-green-700 border-green-200',
    'Menunggu': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Berisiko': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Draft': 'bg-slate-100 text-slate-600 border-slate-200',
    'Tidak Patuh': 'bg-red-100 text-red-700 border-red-200',
    'Ditolak': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${styles[status] || styles['Draft']}`}>
      {status}
    </span>
  );
};

const ProgressBar = ({ nilai, warna = "bg-blue-600" }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
    <div className={`h-full rounded-full transition-all duration-500 ${warna}`} style={{ width: `${nilai}%` }}></div>
  </div>
);

/**
 * Komponen InfoTip untuk "Sub-Feature Deep Dive".
 * Menampilkan ikon 'i' kecil yang memunculkan tooltip saat di-hover.
 * Berguna untuk menjelaskan field formulir yang kompleks.
 */
const InfoTip = ({ teks }) => (
  <div className="group relative inline-block ml-2 cursor-help tooltip-container">
    <Info size={14} className="text-slate-400 hover:text-blue-500 transition-colors" />
    <div className="tooltip-text invisible opacity-0 w-48 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-200 text-center shadow-xl">
      {teks}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

// ============================================================================
// 4. MODAL & FORMULIR (DENGAN VALIDASI & KONTEKS EDUKATIF)
// ============================================================================

const ModalTambahKaryawan = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ nama: '', peran: '', dept: 'Frontliner', email: '' });
    const [errors, setErrors] = useState({});

    // Reset saat modal dibuka
    useEffect(() => { if (isOpen) { setFormData({ nama: '', peran: '', dept: 'Frontliner', email: '' }); setErrors({}); } }, [isOpen]);

    const validasi = () => {
        let tempErrors = {};
        if (!formData.nama) tempErrors.nama = "Nama lengkap wajib diisi.";
        if (!formData.email) tempErrors.email = "Email perusahaan wajib diisi.";
        if (!formData.peran) tempErrors.peran = "Jabatan spesifik wajib diisi.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validasi()) {
            onSave({
                ...formData, id: `K${Math.floor(Math.random() * 1000)}`,
                progres: 0, kepatuhan: 'Patuh', kursus_ditugaskan: 0, kursus_selesai: 0,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.nama}`,
                tgl_gabung: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 animate-masuk backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop modal-karyawan-container">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Tambah Karyawan Baru</h3>
                        <p className="text-xs text-slate-500">Pastikan data sesuai KTP/Kontrak.</p>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                            Nama Lengkap <InfoTip teks="Gunakan nama sesuai identitas resmi untuk keperluan sertifikat."/>
                        </label>
                        <input value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} 
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-100 outline-none ${errors.nama ? 'border-red-500' : 'border-slate-200'}`} placeholder="Contoh: Budi Santoso"/>
                        {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Perusahaan</label>
                        <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-100 outline-none ${errors.email ? 'border-red-500' : 'border-slate-200'}`} placeholder="nama@kartikasari.com"/>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Departemen</label>
                            <select value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-white">
                                <option>Frontliner</option><option>Dapur</option><option>Operasional</option><option>Gudang</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jabatan</label>
                            <input value={formData.peran} onChange={e => setFormData({...formData, peran: e.target.value})} 
                                className={`w-full p-2 border rounded-lg outline-none ${errors.peran ? 'border-red-500' : 'border-slate-200'}`}/>
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Batal</button>
                    <button onClick={handleSubmit} className="tombol-utama px-6 py-2 text-sm font-bold rounded-lg shadow-lg">Simpan Data</button>
                </div>
            </div>
        </div>
    );
};

const ModalBuatKursus = ({ isOpen, onClose, onSave }) => {
    const [langkah, setLangkah] = useState(1);
    const [formData, setFormData] = useState({ judul: '', kategori: 'Wajib', level: 'Semua Staf', deskripsi: '', durasi: '', tipe: 'Video' });
    
    const handleSubmit = () => {
        if(!formData.judul) return alert('Judul materi wajib diisi');
        onSave({ ...formData, id: `M${Math.floor(Math.random() * 1000)}`, ditugaskan: 0, selesai: 0, status: 'Draft', jumlah_modul: 0 });
        onClose(); setFormData({ judul: '', kategori: 'Wajib', level: 'Semua Staf', deskripsi: '', durasi: '', tipe: 'Video' }); setLangkah(1);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 animate-masuk backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-pop overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div><h3 className="font-bold text-lg text-slate-800">Buat Kurikulum Baru</h3><p className="text-xs text-slate-500">Langkah {langkah} dari 2</p></div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
                </div>
                <div className="p-6 md:p-8">
                    {langkah === 1 ? (
                        <div className="space-y-4 animate-naik">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul Materi</label>
                                <input value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none" placeholder="Contoh: Teknik Baking Lanjutan"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori <InfoTip teks="Kategori menentukan prioritas dalam algoritma rekomendasi."/></label>
                                    <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white"><option>Wajib</option><option>Soft Skill</option><option>Teknis</option><option>Manajerial</option></select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Peserta</label>
                                    <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white"><option>Semua Staf</option><option>Frontliner</option><option>Manajer</option><option>Staf Dapur</option></select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                                <textarea value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none h-24 resize-none" placeholder="Jelaskan tujuan pembelajaran..."/>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-naik">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estimasi Durasi</label><input value={formData.durasi} onChange={e => setFormData({...formData, durasi: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none" placeholder="e.g. 2j 30m"/></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipe Konten</label><select value={formData.tipe} onChange={e => setFormData({...formData, tipe: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white"><option>Video</option><option>Interaktif SCORM</option><option>Dokumen / PDF</option><option>Campuran</option></select></div>
                            </div>
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer">
                                <div className="bg-white p-3 rounded-full shadow-sm mb-3"><Download size={24} className="text-slate-400"/></div>
                                <p className="font-bold text-slate-600">Unggah Materi Pembelajaran</p>
                                <p className="text-xs text-slate-400">Drag & drop file atau <span className="text-[#D12027] hover:underline">Jelajahi</span></p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-between bg-slate-50">
                    {langkah === 2 ? <button onClick={() => setLangkah(1)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Kembali</button> : <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Batal</button>}
                    {langkah === 1 ? <button onClick={() => setLangkah(2)} className="tombol-utama px-6 py-2 text-sm font-bold rounded-lg shadow-lg flex items-center gap-2">Lanjut <ChevronRight size={16}/></button> : <button onClick={handleSubmit} className="tombol-utama px-6 py-2 text-sm font-bold rounded-lg shadow-lg">Simpan Draft</button>}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// 5. SUB-VIEWS (HALAMAN UTAMA)
// ============================================================================

const OverviewDashboard = ({ pemicuAnalitik }) => (
  <div className="space-y-6 animate-masuk pb-20">
    {/* KPI Cards */}
    <div className="tour-kpi-utama grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[
        { judul: 'Total Pelajar', nilai: '342', sub: '+12 bulan ini', ikon: Users, warna: 'text-blue-600', bg: 'bg-blue-50' }, 
        { judul: 'Rata-rata Selesai', nilai: '78%', sub: '+2.4% vs bulan lalu', ikon: CheckCircle, warna: 'text-green-600', bg: 'bg-green-50' }, 
        { judul: 'Request Pending', nilai: '8', sub: 'Perlu Persetujuan', ikon: Clock, warna: 'text-yellow-600', bg: 'bg-yellow-50' }, 
        { judul: 'Karyawan Berisiko', nilai: '14', sub: 'Tidak Patuh', ikon: AlertTriangle, warna: 'text-red-600', bg: 'bg-red-50' }
      ].map((kpi, idx) => (
        <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 kartu-hover">
          <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${kpi.bg} ${kpi.warna}`}><kpi.ikon size={24} /></div></div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{kpi.nilai}</h3>
          <p className="text-slate-500 text-sm font-medium">{kpi.judul}</p>
          <p className={`text-xs mt-2 ${kpi.sub.includes('Perlu') || kpi.sub.includes('Tidak') ? 'text-red-500 font-bold' : 'text-green-600'}`}>{kpi.sub}</p>
        </div>
      ))}
    </div>

    {/* Grafik Utama */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Tren Aktivitas Pembelajaran (Jam)</h3>
          <div className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ n: 'M1', jam: 400 }, { n: 'M2', jam: 300 }, { n: 'M3', jam: 500 }, { n: 'M4', jam: 450 }]}>
                      <defs><linearGradient id="gradWarna" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D12027" stopOpacity={0.1}/><stop offset="95%" stopColor="#D12027" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="n" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} width={30}/>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                      <Area type="monotone" dataKey="jam" stroke="#D12027" fillOpacity={1} fill="url(#gradWarna)" strokeWidth={3} />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>
      
      {/* Mini Leaderboard */}
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
              <h3 className="font-bold text-lg text-slate-800 mb-6">Penyelesaian per Departemen</h3>
              <div className="space-y-6">
                  {[{ nama: 'Frontliner', val: 85 }, { nama: 'Dapur', val: 72 }, { nama: 'Operasional', val: 95 }, { nama: 'Gudang', val: 60 }].map((dept) => (
                      <div key={dept.nama}>
                          <div className="flex justify-between text-sm mb-2"><span className="font-medium text-slate-700">{dept.nama}</span><span className="font-bold text-slate-800">{dept.val}%</span></div>
                          <ProgressBar nilai={dept.val} warna={dept.val > 80 ? "bg-green-500" : dept.val > 60 ? "bg-yellow-500" : "bg-red-500"} />
                      </div>
                  ))}
              </div>
          </div>
          <button onClick={pemicuAnalitik} className="tour-tombol-analitik w-full mt-8 py-3 text-sm text-[#D12027] font-bold border border-[#D12027] rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <PieIcon size={16}/> Lihat Analisis Mendalam
          </button>
      </div>
    </div>
  </div>
);

const ManajemenKaryawan = ({ karyawan, onTambah }) => {
    const [filterTeks, setFilterTeks] = useState("");
    const [bukaModalTambah, setBukaModalTambah] = useState(false);

    // Filter logika sederhana
    const dataTampil = karyawan.filter(k => 
        k.nama.toLowerCase().includes(filterTeks.toLowerCase()) || 
        k.peran.toLowerCase().includes(filterTeks.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-masuk pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div><h3 className="font-bold text-lg text-slate-800">Direktori Karyawan</h3><p className="text-sm text-slate-500">Kelola akses dan pantau progres individu.</p></div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 tour-cari-karyawan">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                        <input value={filterTeks} onChange={e => setFilterTeks(e.target.value)} placeholder="Cari nama atau jabatan..." className="w-full pl-9 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>
                    <button onClick={() => setBukaModalTambah(true)} className="tour-tambah-karyawan tombol-utama px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold whitespace-nowrap"><Plus size={16}/> Tambah</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left tour-tabel-karyawan">
                        <thead className="bg-slate-50 border-b border-slate-100"><tr>{['Nama Karyawan', 'Jabatan / Dept', 'Progres Belajar', 'Status Kepatuhan', 'Aksi'].map(h => <th key={h} className="p-4 text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {dataTampil.map((k, idx) => (
                                <tr key={k.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="p-4"><div className="flex items-center gap-3"><img src={k.avatar} className="w-10 h-10 rounded-full bg-slate-200" alt="" /><div><p className="font-bold text-slate-800">{k.nama}</p><p className="text-xs text-slate-500">ID: {k.id}</p></div></div></td>
                                    <td className="p-4"><p className="text-sm text-slate-700 font-medium">{k.peran}</p><p className="text-xs text-slate-500">{k.dept}</p></td>
                                    <td className="p-4 w-48"><div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold text-slate-700">{k.progres}%</span></div><ProgressBar nilai={k.progres} warna={k.progres < 50 ? 'bg-red-500' : 'bg-[#D12027]'} /></td>
                                    <td className="p-4"><BadgeStatus status={k.kepatuhan} /></td>
                                    <td className="p-4"><button className="text-slate-400 hover:text-[#D12027] group-hover:bg-red-50 p-2 rounded-full transition-all"><MoreVertical size={18} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {dataTampil.length === 0 && <div className="p-8 text-center text-slate-500">Data tidak ditemukan. Coba kata kunci lain.</div>}
                </div>
            </div>
            <ModalTambahKaryawan isOpen={bukaModalTambah} onClose={() => setBukaModalTambah(false)} onSave={onTambah} />
        </div>
    );
};

const ManajemenKurikulum = ({ kursus, onBuat }) => {
    const [modalBuatOpen, setModalBuatOpen] = useState(false);
    return (
        <div className="space-y-6 animate-masuk pb-20">
            <div className="flex justify-between items-center">
                <div><h3 className="font-bold text-xl text-slate-800">Modul Pembelajaran</h3><p className="text-slate-500 text-sm">Kelola materi pelatihan digital.</p></div>
                <button onClick={() => setModalBuatOpen(true)} className="tour-buat-kursus tombol-utama px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg"><Plus size={18}/> Buat Modul</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 tour-grid-kursus">
                {kursus.map((k) => (
                    <div key={k.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden kartu-hover group relative flex flex-col h-full cursor-pointer">
                        <div className="h-32 bg-slate-100 relative shrink-0">
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center"><BookOpen className="text-slate-300 group-hover:text-white transition-colors" size={48} /></div>
                            <div className="absolute top-3 right-3"><BadgeStatus status={k.status} /></div>
                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">{k.kategori}</div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h4 className="font-bold text-slate-800 text-lg mb-1">{k.judul}</h4>
                            <p className="text-xs text-slate-400 mb-4 line-clamp-2">{k.deskripsi}</p>
                            <div className="mt-auto flex justify-between items-center text-xs text-slate-500 border-t border-slate-50 pt-3">
                                <div className="flex items-center gap-1"><Clock size={12}/> {k.durasi}</div>
                                <div className="flex items-center gap-1"><Users size={12}/> {k.ditugaskan} Peserta</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ModalBuatKursus isOpen={modalBuatOpen} onClose={() => setModalBuatOpen(false)} onSave={onBuat} />
        </div>
    );
};

// ============================================================================
// 6. APLIKASI UTAMA (SHELL & JOYRIDE ENGINE)
// ============================================================================

const AdminApp = () => {
    const [halamanAktif, setHalamanAktif] = useState('dashboard');
    const [sidebarTerbuka, setSidebarTerbuka] = useState(false);
    
    // State Data
    const [dataKaryawan, setDataKaryawan] = useState(DATA_KARYAWAN);
    const [dataKursus, setDataKursus] = useState(DATA_KURSUS);

    // Konfigurasi Joyride (Tutorial Engine)
    const [jalankanTour, setJalankanTour] = useState(false);
    const [langkahTour, setLangkahTour] = useState([]);

    /**
     * Menghasilkan langkah tutorial berdasarkan halaman yang sedang aktif.
     * Menggunakan bahasa Indonesia yang edukatif (menjelaskan "Mengapa").
     */
    const dapatkanLangkahTour = (halaman) => {
        const langkahUmum = [
            { target: '.tour-sidebar', content: 'Menu Navigasi Utama: Gunakan panel ini untuk berpindah antar modul sistem HRIS.', placement: 'right', disableBeacon: true },
            { target: '.tour-profil', content: 'Pusat Kontrol: Akses pengaturan akun, notifikasi, dan tombol bantuan di sini.', placement: 'bottom-end' }
        ];

        const langkahPerHalaman = {
            'dashboard': [
                { target: 'body', content: <div className="text-left"><h4 className="font-bold mb-2">👋 Selamat Datang, Admin!</h4><p>Ini adalah Dashboard Learning Management System (LMS) Anda. Mari kita pelajari cara memantau kesehatan pelatihan organisasi.</p></div>, placement: 'center' },
                ...langkahUmum,
                { target: '.tour-kpi-utama', content: 'KPI Operasional: Pantau metrik kunci seperti tingkat penyelesaian dan kepatuhan (compliance) secara real-time untuk audit.', placement: 'bottom' },
                { target: '.tour-tombol-analitik', content: 'Analisis Mendalam: Klik di sini untuk melihat peta kompetensi (skill gap) per departemen.', placement: 'top' }
            ],
            'karyawan': [
                { target: '.tour-cari-karyawan', content: 'Pencarian Cepat: Temukan data karyawan spesifik untuk mengecek status kepatuhan wajib mereka.', placement: 'bottom' },
                { target: '.tour-tambah-karyawan', content: 'Onboarding: Gunakan tombol ini saat ada karyawan baru masuk untuk membuatkan akun pembelajaran.', placement: 'left' },
                { target: '.tour-tabel-karyawan', content: 'Daftar Personel: Klik baris karyawan untuk melihat "Rapor Pembelajaran" individu secara detail.', placement: 'top' }
            ],
            'kurikulum': [
                { target: '.tour-buat-kursus', content: 'Authoring Tool: Buat materi pelatihan baru (Video, PDF, atau SCORM) di sini.', placement: 'left' },
                { target: '.tour-grid-kursus', content: 'Katalog Modul: Kelola status aktif/non-aktif materi pelatihan. Materi non-aktif tidak akan muncul di aplikasi karyawan.', placement: 'top' }
            ]
        };

        return langkahPerHalaman[halaman] || [];
    };

    // Efek Samping: Jalankan tour saat halaman berubah (jika belum pernah dilihat)
    useEffect(() => {
        const kunciPenyimpanan = `sudahLihat_${halamanAktif}`;
        const sudahLihat = localStorage.getItem(kunciPenyimpanan);
        
        // Reset langkah dan set yang baru
        setLangkahTour(dapatkanLangkahTour(halamanAktif));
        
        if (!sudahLihat) {
            // Beri sedikit jeda agar DOM ter-render sempurna
            setTimeout(() => setJalankanTour(true), 500);
        } else {
            setJalankanTour(false);
        }
    }, [halamanAktif]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setJalankanTour(false);
            localStorage.setItem(`sudahLihat_${halamanAktif}`, 'true');
        }
    };

    const mulaiTourManual = () => {
        setLangkahTour(dapatkanLangkahTour(halamanAktif));
        setJalankanTour(true);
    };

    const MENU_NAVIGASI = [
        { id: 'dashboard', label: 'Ringkasan', ikon: LayoutDashboard },
        { id: 'karyawan', label: 'Data Karyawan', ikon: Users },
        { id: 'kurikulum', label: 'Kurikulum', ikon: BookOpen },
        { id: 'request', label: 'Request Training', ikon: FileText },
        { id: 'analitik', label: 'Analitik & Laporan', ikon: BarChart2 },
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-800 font-sans">
            <GlobalStyles />
            
            {/* --- JOYRIDE ENGINE --- */}
            <Joyride
                steps={langkahTour}
                run={jalankanTour}
                continuous={true}
                showSkipButton={true}
                showProgress={true}
                callback={handleJoyrideCallback}
                locale={{ back: 'Kembali', close: 'Tutup', last: 'Selesai', next: 'Lanjut', skip: 'Lewati' }}
                styles={{
                    options: {
                        primaryColor: WARNA_TEMA.MERAH,
                        zIndex: 1000,
                        arrowColor: '#fff',
                        backgroundColor: '#fff',
                        textColor: '#333',
                        width: 400,
                    },
                    buttonNext: { fontWeight: 'bold', borderRadius: '8px', fontSize: '12px', padding: '10px 16px' },
                    tooltipContent: { fontSize: '14px', lineHeight: '1.6' },
                    tooltipTitle: { fontSize: '16px', fontWeight: 'bold', color: WARNA_TEMA.MERAH }
                }}
            />

            {/* Sidebar Mobile Overlay */}
            {sidebarTerbuka && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm animate-masuk" onClick={() => setSidebarTerbuka(false)}/>}
            
            {/* --- SIDEBAR --- */}
            <aside className={`tour-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ${sidebarTerbuka ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-16 lg:h-20 flex items-center px-6 lg:px-8 border-b border-slate-100 justify-between lg:justify-start">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#D12027] rounded-lg flex items-center justify-center"><span className="text-white font-black text-lg">K</span></div>
                        <div><h1 className="font-bold text-lg tracking-tight text-slate-900 leading-tight">KARSA<br/><span className="text-[#D12027] text-sm font-medium">LMS Admin</span></h1></div>
                    </div>
                    <button onClick={() => setSidebarTerbuka(false)} className="lg:hidden text-slate-400"><X size={24} /></button>
                </div>
                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {MENU_NAVIGASI.map((menu) => (
                        <button key={menu.id} onClick={() => { setHalamanAktif(menu.id); setSidebarTerbuka(false); }} 
                            className={`w-full flex items-center gap-3 px-6 lg:px-8 py-3.5 text-sm font-medium transition-all ${halamanAktif === menu.id ? 'sidebar-aktif' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                            <menu.ikon size={18} className={halamanAktif === menu.id ? 'text-[#D12027]' : 'text-slate-400'}/>
                            {menu.label}
                        </button>
                    ))}
                </nav>
                <div className="p-6 border-t border-slate-100">
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs text-slate-400 hover:text-[#D12027] underline w-full text-left mb-4">Reset Tutorial Demo</button>
                    <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold"><LogOut size={18}/> Keluar</button>
                </div>
            </aside>

            {/* --- KONTEN UTAMA --- */}
            <div className="flex-1 flex flex-col h-screen relative w-full">
                <header className="h-16 lg:h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
                    <div className="flex items-center gap-3 lg:hidden"><button onClick={() => setSidebarTerbuka(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu size={24}/></button><span className="font-bold text-slate-800 capitalize">{halamanAktif}</span></div>
                    <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500"><span className="cursor-pointer hover:text-[#D12027]">Beranda</span><ChevronRight size={14}/><span className="font-bold text-slate-800 capitalize">{MENU_NAVIGASI.find(m => m.id === halamanAktif)?.label}</span></div>
                    
                    <div className="tour-profil flex items-center gap-4 lg:gap-6">
                        <button onClick={mulaiTourManual} className="text-sm font-bold text-[#D12027] bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-2"><HelpCircle size={16}/> Bantuan ?</button>
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
                        <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-slate-200">
                            <div className="text-right hidden md:block"><p className="text-sm font-bold text-slate-800">Admin HR</p><p className="text-xs text-slate-500">Akses Superadmin</p></div>
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#D12027] rounded-full text-white flex items-center justify-center font-bold border-2 border-red-100 shadow-sm text-sm">HR</div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="hidden lg:flex mb-8 justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-2 capitalize">{MENU_NAVIGASI.find(m => m.id === halamanAktif)?.label}</h2>
                                <p className="text-slate-500">Kelola ekosistem pembelajaran organisasi Anda.</p>
                            </div>
                        </div>
                        {halamanAktif === 'dashboard' && <OverviewDashboard pemicuAnalitik={() => setHalamanAktif('analitik')} />}
                        {halamanAktif === 'karyawan' && <ManajemenKaryawan karyawan={dataKaryawan} onTambah={(data) => setDataKaryawan([...dataKaryawan, data])} />}
                        {halamanAktif === 'kurikulum' && <ManajemenKurikulum kursus={dataKursus} onBuat={(data) => setDataKursus([...dataKursus, data])} />}
                        {/* Placeholder untuk halaman lain agar kode tidak terlalu panjang */}
                        {halamanAktif === 'request' && <div className="text-center py-20 text-slate-400">Modul Request Training (Sedang dimuat...)</div>}
                        {halamanAktif === 'analitik' && <div className="text-center py-20 text-slate-400">Modul Analitik Lanjutan (Sedang dimuat...)</div>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminApp;