import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, ChevronLeft, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle, HelpCircle,
  Download, Award, DollarSign, Briefcase, GraduationCap,
  PieChart as PieIcon, MapPin, X, LogOut, Filter,
  Eye, Layers, Menu, ArrowLeft, Target, Settings,
  FileCheck, PlayCircle, ToggleLeft, ToggleRight, Info,
  ChevronDown, MessageSquare, Zap, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend, ComposedChart,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import Joyride, { STATUS, EVENTS, ACTIONS } from 'react-joyride';

// ==========================================
// 1. CONFIGURATION & STYLES
// ==========================================

const THEME = {
  primary: "#D12027",      // Karsa Red
  secondary: "#FDB913",    // Karsa Yellow
  dark: "#1e293b",
  light: "#f8fafc",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6"
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; color: #334155; -webkit-font-smoothing: antialiased; }
    
    /* Custom Animations */
    .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-pulse-soft { animation: pulseSoft 2s infinite; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes pulseSoft { 0% { box-shadow: 0 0 0 0 rgba(209, 32, 39, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(209, 32, 39, 0); } 100% { box-shadow: 0 0 0 0 rgba(209, 32, 39, 0); } }

    /* Scrollbar Styling */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* Utility Classes */
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15); }
    
    .btn-primary {
      background: linear-gradient(135deg, ${THEME.primary} 0%, #b91c22 100%);
      color: white; border: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-primary:hover { box-shadow: 0 4px 12px rgba(209, 32, 39, 0.3); transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .glass-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    /* Joyride Customization Overrides */
    .__floater__body div { line-height: 1.6 !important; font-size: 14px !important; }
  `}</style>
);

// ==========================================
// 2. ROBUST MOCK DATA ENGINE
// ==========================================

// Helper to generate dates
const getDate = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const INITIAL_EMPLOYEES = Array.from({ length: 15 }).map((_, i) => ({
  id: `E0${10 + i}`,
  name: ['Budi Santoso', 'Siska Wijaya', 'Andi Pratama', 'Rina Melati', 'Dedi Kusuma', 'Eka Saputra', 'Fani Rahma', 'Gilang Ramadhan', 'Hani Pertiwi', 'Indra Lesmana', 'Joko Susilo', 'Kartika Sari', 'Lina Marlina', 'Maman Suherman', 'Nina Zatulini'][i],
  role: ['Sales Staff', 'Store Manager', 'Head Baker', 'Supervisor', 'Logistics', 'Security', 'HR Admin', 'Marketing', 'Finance', 'IT Support', 'Driver', 'Baker', 'Cashier', 'Chef', 'QA'][i],
  dept: ['Frontliner', 'Operational', 'Kitchen', 'Frontliner', 'Warehouse', 'Operational', 'Office', 'Office', 'Office', 'Office', 'Warehouse', 'Kitchen', 'Frontliner', 'Kitchen', 'Kitchen'][i],
  branch: ['Kb. Kawung', 'Dago', 'Central', 'Buah Batu', 'Central', 'Cimahi', 'HQ', 'HQ', 'HQ', 'HQ', 'Central', 'Central', 'Antapani', 'Dago', 'Central'][i],
  progress: Math.floor(Math.random() * 100),
  compliance: Math.random() > 0.8 ? 'Non-Compliant' : Math.random() > 0.6 ? 'At Risk' : 'Compliant',
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 5}`,
  courses_assigned: Math.floor(Math.random() * 20) + 5,
  courses_completed: Math.floor(Math.random() * 10),
  email: `user${i}@kartikasari.com`,
  phone: `0812-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000)}`,
  joinDate: getDate(-Math.floor(Math.random() * 1000))
}));

const INITIAL_COURSES = [
  { 
    id: 'C01', title: 'Food Safety Standard (HACCP)', category: 'Mandatory', level: 'All Staff', 
    assigned: 150, completed: 120, status: 'Active',
    description: 'Mastery of Hazard Analysis Critical Control Point (HACCP) is crucial for our zero-incident policy. Includes bacterial growth prevention, cross-contamination handling, and critical limit monitoring.',
    duration: '2h 30m', modules_count: 5, type: 'Video & Quiz', xp: 500
  },
  { 
    id: 'C02', title: 'Service Excellence 2.0', category: 'Soft Skill', level: 'Frontliner', 
    assigned: 80, completed: 45, status: 'Active',
    description: 'Advanced hospitality techniques. Learn how to handle "The Difficult Customer", upscale selling without being pushy, and the art of greeting in Kartika Sari style.',
    duration: '1h 45m', modules_count: 3, type: 'Video', xp: 300
  },
  { 
    id: 'C03', title: 'POS System Advanced Troubleshooting', category: 'Technical', level: 'Cashier', 
    assigned: 40, completed: 38, status: 'Active',
    description: 'Deep dive into the Point of Sales system. How to handle offline transactions, void items correctly, and closing reports reconciliation.',
    duration: '45m', modules_count: 2, type: 'Interactive', xp: 200
  },
  { 
    id: 'C04', title: 'Leadership: From Peer to Boss', category: 'Managerial', level: 'Manager', 
    assigned: 20, completed: 5, status: 'Draft',
    description: 'Transitioning from a staff role to a leadership role. Covers delegation, feedback loops, and emotional intelligence in management.',
    duration: '3h 00m', modules_count: 8, type: 'Mixed', xp: 800
  },
  { 
    id: 'C05', title: 'Digital Marketing Basics', category: 'Skill', level: 'Office', 
    assigned: 15, completed: 2, status: 'Active',
    description: 'Understanding social media algorithms and content creation for regional brand awareness.',
    duration: '1h 15m', modules_count: 4, type: 'Video', xp: 250
  },
];

const INITIAL_REQUESTS = [
  { id: 'R01', employee: 'Siska Wijaya', title: 'Advanced Latte Art Workshop', provider: 'Barista Academy BDG', cost: 2500000, date: getDate(-2), status: 'Pending', justification: 'To launch the new premium coffee menu at Dago branch next month. Competitor analysis shows high demand for visual coffee appeal.', vendor_details: 'Barista Academy BDG, Jl. Riau No. 5', timeline: '2 Days (Weekend)', leader_approval: true },
  { id: 'R02', employee: 'Andi Pratama', title: 'Industrial Baking Technology', provider: 'Baking Center JKT', cost: 5000000, date: getDate(-5), status: 'Approved', justification: 'Required for operating the new Rotary Rack Oven imported from Italy. Vendor training was insufficient.', vendor_details: 'Baking Center JKT', timeline: '1 Week Certification', leader_approval: true },
  { id: 'R03', employee: 'Warehouse Team', title: 'Defensive Driving & Safety', provider: 'Internal GA', cost: 0, date: getDate(-10), status: 'Rejected', justification: 'Budget constraint for Q4.', vendor_details: 'Internal GA Team', timeline: '1 Day', leader_approval: false },
  { id: 'R04', employee: 'Nina Zatulini', title: 'ISO 9001:2015 Lead Auditor', provider: 'TUV Rheinland', cost: 7500000, date: getDate(-1), status: 'Pending', justification: 'Preparation for next year company-wide audit.', vendor_details: 'Online Course', timeline: '5 Days', leader_approval: true },
];

const SKILL_RADAR_DATA = [
  { subject: 'HACCP', A: 120, B: 110, fullMark: 150 },
  { subject: 'Service', A: 98, B: 130, fullMark: 150 },
  { subject: 'Tech', A: 86, B: 130, fullMark: 150 },
  { subject: 'Managerial', A: 99, B: 100, fullMark: 150 },
  { subject: 'Safety', A: 85, B: 90, fullMark: 150 },
  { subject: 'Product', A: 65, B: 85, fullMark: 150 },
];

// ==========================================
// 3. TUTORIAL & HELP SYSTEM ENGINE
// ==========================================

// This is the core of the "Tutorial Detail" requirement.
// Instead of a single array, we define scenarios.

const TUTORIAL_SCENARIOS = {
  overview: {
    title: "Platform Overview",
    steps: [
      {
        target: 'body',
        content: (
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#D12027]">Selamat Datang di Karsa LMS!</h3>
            <p>Ini adalah Command Center untuk pengembangan SDM Anda. Tutorial ini akan memandu Anda memahami ekosistem fitur yang tersedia secara menyeluruh.</p>
          </div>
        ),
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: '.tour-nav-dashboard',
        content: 'Dashboard: Tempat Anda memantau KPI (Key Performance Indicators) secara real-time. Perhatikan metrik "At Risk Users" untuk tindakan preventif.',
        placement: 'right'
      },
      {
        target: '.tour-nav-employees',
        content: 'Employee Database: Kelola 300+ karyawan, pantau progress individual, dan akses profil lengkap mereka.',
        placement: 'right'
      },
      {
        target: '.tour-nav-curriculum',
        content: 'Curriculum Builder: Dapur pacu pembelajaran Anda. Buat kursus, upload materi, dan distribusikan ke departemen.',
        placement: 'right'
      },
      {
        target: '.tour-help-trigger',
        content: 'Pusat Bantuan Cerdas: Kapanpun Anda bingung, klik tombol ini untuk memilih tutorial spesifik sesuai kebutuhan tugas Anda.',
        placement: 'left'
      }
    ]
  },
  createCourse: {
    title: "Mastering Course Creation",
    steps: [
      {
        target: '.tour-curr-create-btn',
        content: 'Mulai di sini. Membuat kursus terdiri dari 2 tahap: Informasi Dasar dan Upload Materi.',
        placement: 'bottom',
        spotlightPadding: 5
      },
      {
        target: '.tour-curr-category',
        content: 'Pilih Kategori dengan bijak. "Mandatory" akan otomatis memunculkan notifikasi prioritas tinggi di HP karyawan.',
        placement: 'top'
      },
      {
        target: '.tour-curr-upload-area',
        content: 'Mendukung format: MP4 (Video), PDF (Dokumen), dan SCORM (Interaktif). Untuk retensi terbaik, gunakan format Video pendek (Micro-learning).',
        placement: 'left'
      }
    ]
  },
  analytics: {
    title: "Deep Dive Analytics",
    steps: [
      {
        target: '.tour-analytics-radar',
        content: 'Radar Chart ini membandingkan kompetensi antar departemen. Celah (Gap) yang besar menunjukkan kebutuhan training mendesak.',
        placement: 'right'
      },
      {
        target: '.tour-analytics-table',
        content: 'Matrix Risiko: Kami mengkategorikan departemen berdasarkan "Compliance Score". Departemen dengan label merah memerlukan intervensi segera.',
        placement: 'top'
      }
    ]
  }
};

// ==========================================
// 4. SHARED UI COMPONENTS
// ==========================================

const StatusBadge = ({ status }) => {
  const configs = {
    'Compliant': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    'Active': { bg: 'bg-green-100', text: 'text-green-700', icon: PlayCircle },
    'Approved': { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
    'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
    'At Risk': { bg: 'bg-orange-100', text: 'text-orange-700', icon: AlertTriangle },
    'Draft': { bg: 'bg-slate-100', text: 'text-slate-600', icon: FileText },
    'Non-Compliant': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    'Rejected': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  };
  const config = configs[status] || configs['Draft'];
  const Icon = config.icon;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border border-transparent flex items-center gap-1.5 w-fit ${config.bg} ${config.text}`}>
      <Icon size={12} strokeWidth={3} /> {status}
    </span>
  );
};

const ProgressBar = ({ value, colorClass = "bg-blue-600", height = "h-2" }) => (
  <div className={`w-full ${height} bg-slate-200 rounded-full overflow-hidden`}>
    <div className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} style={{ width: `${value}%` }}></div>
  </div>
);

const Card = ({ children, className = "", noPadding = false }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const EmptyState = ({ title, message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
      <Icon size={32} className="text-slate-400" />
    </div>
    <h3 className="text-lg font-bold text-slate-700 mb-1">{title}</h3>
    <p className="text-slate-500 max-w-xs text-sm">{message}</p>
  </div>
);

// ==========================================
// 5. COMPLEX MODALS & FORMS
// ==========================================

const CreateCourseWizard = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', category: 'Mandatory', level: 'All Staff', description: '', duration: '', type: 'Video', modules: [] });
  
  // Reset when closed
  useEffect(() => { if (!isOpen) { setStep(1); setFormData({ title: '', category: 'Mandatory', level: 'All Staff', description: '', duration: '', type: 'Video', modules: [] }); } }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-scaleIn overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-xl text-slate-800">Create New Course</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
              <span className={`px-2 py-0.5 rounded ${step === 1 ? 'bg-[#D12027] text-white' : 'bg-slate-200'}`}>1. Details</span>
              <ChevronRight size={12}/>
              <span className={`px-2 py-0.5 rounded ${step === 2 ? 'bg-[#D12027] text-white' : 'bg-slate-200'}`}>2. Content</span>
            </div>
          </div>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-red-500 transition-colors"/></button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-6 animate-slideInRight">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800">
                <Info className="shrink-0" size={20}/>
                <p><strong>Tips:</strong> Judul yang menarik meningkatkan "Click-through Rate" karyawan hingga 40%. Gunakan kata kerja aktif.</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Course Title <span className="text-red-500">*</span></label>
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all font-medium" placeholder="e.g. Advanced Baking Techniques 2024"/>
              </div>
              
              <div className="grid grid-cols-2 gap-6 tour-curr-category">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-red-100"><option>Mandatory</option><option>Soft Skill</option><option>Technical</option><option>Managerial</option></select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Target Audience</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full p-3.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-red-100"><option>All Staff</option><option>Frontliner</option><option>Manager</option><option>Kitchen Staff</option></select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none h-32 resize-none" placeholder="Explain what they will learn..."/>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-slideInRight">
               <div className="grid grid-cols-2 gap-6">
                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Est. Duration</label><input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-3.5 border border-slate-200 rounded-xl outline-none" placeholder="e.g. 2h 30m"/></div>
                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Format Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3.5 border border-slate-200 rounded-xl outline-none bg-white"><option>Video Playlist</option><option>Interactive SCORM</option><option>PDF Document</option></select></div>
               </div>
               
               <div className="tour-curr-upload-area border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Download size={32} className="text-[#D12027]"/>
                  </div>
                  <h4 className="font-bold text-slate-700 text-lg">Upload Content Materials</h4>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">Drag and drop your video files, PDFs, or SCORM packages here. Max size 500MB per file.</p>
                  <button className="mt-4 text-xs font-bold bg-white border border-slate-300 px-4 py-2 rounded-lg hover:border-[#D12027] hover:text-[#D12027] transition-all">Browse Files</button>
               </div>

               <div className="space-y-3">
                 <h4 className="font-bold text-sm text-slate-700">Modules Preview</h4>
                 {[1, 2].map(i => (
                   <div key={i} className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-bold text-xs">{i}</div>
                      <div className="flex-1 h-2 bg-slate-100 rounded animate-pulse"></div>
                      <div className="w-6 h-6 text-green-500"><CheckCircle size={20}/></div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
          {step === 2 ? 
            <button onClick={() => setStep(1)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"><ChevronLeft size={16}/> Back</button> : 
            <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
          }
          {step === 1 ? 
            <button onClick={() => setStep(2)} className="tour-curr-next-btn btn-primary px-8 py-3 text-sm font-bold rounded-xl shadow-lg flex items-center gap-2">Next Step <ChevronRight size={16}/></button> : 
            <button onClick={() => { onSave({...formData, id: `C${Date.now()}`, assigned: 0, completed: 0, status: 'Draft'}); onClose(); }} className="btn-primary px-8 py-3 text-sm font-bold rounded-xl shadow-lg flex items-center gap-2"><CheckCircle size={18}/> Publish Course</button>
          }
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MAIN VIEW COMPONENTS
// ==========================================

const DashboardView = ({ onTriggerTutorial }) => {
  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tour-nav-dashboard">
        {[
          { label: "Total Learners", val: "342", delta: "+12%", trend: "up", icon: Users, color: "blue" },
          { label: "Completion Rate", val: "78%", delta: "+5.4%", trend: "up", icon: Activity, color: "green" },
          { label: "Pending Approvals", val: "8", delta: "Urgent", trend: "neutral", icon: Clock, color: "yellow" },
          { label: "Compliance Risk", val: "14", delta: "Requires Action", trend: "down", icon: AlertTriangle, color: "red" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24}/>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : stat.trend === 'down' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.delta}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.val}</h3>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Learning Activity Trends</h3>
              <p className="text-sm text-slate-500">Weekly active users vs module completion</p>
            </div>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-2 font-bold text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-100">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                {name: 'W1', uv: 40, pv: 24}, {name: 'W2', uv: 30, pv: 13}, 
                {name: 'W3', uv: 20, pv: 58}, {name: 'W4', uv: 27, pv: 39},
                {name: 'W5', uv: 18, pv: 48}, {name: 'W6', uv: 23, pv: 38},
                {name: 'W7', uv: 34, pv: 43}
              ]}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D12027" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#D12027" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}}/>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}/>
                <Area type="monotone" dataKey="pv" stroke="#D12027" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                <Area type="monotone" dataKey="uv" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Department Leaderboard</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {[
              { name: 'Operational', val: 92, color: 'bg-green-500' },
              { name: 'Frontliner', val: 85, color: 'bg-[#D12027]' },
              { name: 'Kitchen', val: 64, color: 'bg-yellow-500' },
              { name: 'Warehouse', val: 45, color: 'bg-slate-400' },
              { name: 'Office', val: 30, color: 'bg-red-500' }
            ].map((dept, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700">{dept.name}</span>
                  <span className="font-bold text-slate-900">{dept.val}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${dept.color} transition-all duration-1000 group-hover:brightness-110`} style={{width: `${dept.val}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onTriggerTutorial('analytics')} className="mt-6 w-full py-3 text-sm font-bold text-[#D12027] bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2">
             <PieIcon size={16}/> View Detailed Analytics
          </button>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 7. ADMIN APP CONTAINER
// ==========================================

const AdminApp = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // -- TUTORIAL STATE --
  const [tourState, setTourState] = useState({
    run: false,
    steps: [],
    stepIndex: 0
  });

  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  // Trigger specific tutorial scenario
  const startTutorial = (scenarioKey) => {
    const scenario = TUTORIAL_SCENARIOS[scenarioKey];
    if (scenario) {
      setTourState({
        run: true,
        steps: scenario.steps,
        stepIndex: 0
      });
      setIsHelpMenuOpen(false);
    }
  };

  const handleJoyrideCallback = (data) => {
    const { status, action, index } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setTourState(prev => ({ ...prev, run: false }));
    } else if (action === ACTIONS.CLOSE) {
       setTourState(prev => ({ ...prev, run: false }));
    }
  };

  // Nav Config
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, tourClass: 'tour-nav-dashboard' },
    { id: 'employees', label: 'Employees', icon: Users, tourClass: 'tour-nav-employees' },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen, tourClass: 'tour-nav-curriculum' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, tourClass: 'tour-nav-analytics' },
    { id: 'requests', label: 'Requests', icon: FileText, tourClass: 'tour-nav-requests', badge: 3 },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      <GlobalStyles />
      
      {/* --- JOYRIDE INSTANCE --- */}
      <Joyride
        steps={tourState.steps}
        run={tourState.run}
        stepIndex={tourState.stepIndex}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        callback={handleJoyrideCallback}
        disableOverlayClose={true}
        styles={{
          options: {
            primaryColor: THEME.primary,
            textColor: '#334155',
            zIndex: 10000,
            overlayColor: 'rgba(0, 0, 0, 0.6)',
            arrowColor: '#fff',
            backgroundColor: '#fff',
            width: 400,
          },
          tooltip: {
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          },
          buttonNext: {
            backgroundColor: THEME.primary,
            fontWeight: 700,
            borderRadius: '8px',
            outline: 'none',
            fontSize: '14px',
            padding: '12px 20px'
          },
          buttonBack: {
            color: '#64748b',
            marginRight: '10px',
            fontWeight: 600
          }
        }}
      />

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-2xl transition-transform duration-300 transform lg:translate-x-0 lg:static lg:shadow-none flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center px-8 border-b border-slate-100">
           <div className="w-10 h-10 bg-gradient-to-br from-[#D12027] to-[#b91c22] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200 mr-3">K</div>
           <div>
             <h1 className="font-extrabold text-2xl tracking-tight text-slate-900">KARSA</h1>
             <p className="text-xs font-bold text-[#D12027] tracking-widest uppercase">LMS ADMIN</p>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400"><X size={24}/></button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${activeView === item.id ? 'bg-red-50 text-[#D12027] shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${item.tourClass}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={`transition-colors ${activeView === item.id ? 'text-[#D12027]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.label}
              </div>
              {item.badge && <span className="bg-[#D12027] text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{item.badge}</span>}
            </button>
          ))}
          
          <div className="mt-8">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Support</p>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <Settings size={20} className="text-slate-400"/> Settings
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white" alt="Admin"/>
            <div>
              <p className="text-sm font-bold text-slate-800">Ilham (You)</p>
              <p className="text-xs text-slate-500">Culture Manager</p>
            </div>
            <button className="ml-auto p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500"><LogOut size={18}/></button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600"><Menu size={24}/></button>
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400">
              <span>Admin Portal</span> <ChevronRight size={14}/> <span className="text-slate-800 capitalize">{activeView}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* HELP DROPDOWN TRIGGER */}
            <div className="relative tour-help-trigger">
              <button onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isHelpMenuOpen ? 'bg-slate-800 text-white border-slate-800 shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                <HelpCircle size={18}/> 
                <span className="text-sm font-bold hidden md:inline">Tutorials & Help</span>
                <ChevronDown size={14} className={`transition-transform ${isHelpMenuOpen ? 'rotate-180' : ''}`}/>
              </button>

              {/* HELP MENU DROPDOWN */}
              {isHelpMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-scaleIn origin-top-right z-50">
                  <div className="p-3 border-b border-slate-50 mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">Interactive Guides</h4>
                    <p className="text-xs text-slate-400">Select a topic to start a tour.</p>
                  </div>
                  <div className="space-y-1">
                    <button onClick={() => startTutorial('overview')} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors"><LayoutDashboard size={16}/></div>
                      <div><p className="text-sm font-bold text-slate-700">Platform Overview</p><p className="text-[10px] text-slate-400">Basic navigation & KPI</p></div>
                    </button>
                    <button onClick={() => { setActiveView('curriculum'); startTutorial('createCourse'); }} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100 transition-colors"><Plus size={16}/></div>
                      <div><p className="text-sm font-bold text-slate-700">How to Create Course</p><p className="text-[10px] text-slate-400">Step-by-step wizard</p></div>
                    </button>
                    <button onClick={() => { setActiveView('analytics'); startTutorial('analytics'); }} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-yellow-100 transition-colors"><BarChart2 size={16}/></div>
                      <div><p className="text-sm font-bold text-slate-700">Understanding Data</p><p className="text-[10px] text-slate-400">Gap analysis & reports</p></div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><Bell size={20}/><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#D12027] rounded-full border-2 border-white"></span></button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800 capitalize mb-2 tracking-tight">{activeView}</h2>
                  <p className="text-slate-500 font-medium">Manage your organization's learning ecosystem.</p>
                </div>
                {activeView === 'curriculum' && (
                  <button onClick={() => setIsCreateCourseOpen(true)} className="tour-curr-create-btn btn-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-200 flex items-center gap-2">
                    <Plus size={18}/> Create New Course
                  </button>
                )}
             </div>

             {/* Dynamic Views */}
             {activeView === 'dashboard' && <DashboardView onTriggerTutorial={key => { setActiveView(key); setTimeout(() => startTutorial(key), 500); }} />}
             
             {activeView === 'curriculum' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                 {courses.map(course => (
                   <Card key={course.id} noPadding className="group overflow-hidden flex flex-col h-full relative cursor-pointer">
                      <div className="h-40 bg-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"/>
                        <img src={`https://source.unsplash.com/random/400x200?work,office,${course.id}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <span className="absolute top-4 right-4 z-20"><StatusBadge status={course.status}/></span>
                        <span className="absolute bottom-4 left-4 z-20 text-white font-bold text-sm bg-white/20 backdrop-blur px-2 py-1 rounded border border-white/30">{course.category}</span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-[#D12027] transition-colors">{course.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.description}</p>
                        <div className="mt-auto flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-50 pt-4">
                          <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                          <span className="flex items-center gap-1"><Layers size={14}/> {course.modules_count} Modules</span>
                        </div>
                      </div>
                   </Card>
                 ))}
               </div>
             )}

             {activeView === 'analytics' && (
               <div className="space-y-6 animate-fadeIn">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <Card>
                      <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><Target size={20} className="text-[#D12027]"/> Skill Gap Radar</h3>
                      <div className="h-80 tour-analytics-radar">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={SKILL_RADAR_DATA}>
                            <PolarGrid stroke="#e2e8f0"/>
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar name="Frontliner" dataKey="A" stroke="#D12027" fill="#D12027" fillOpacity={0.3} />
                            <Radar name="Kitchen" dataKey="B" stroke="#FDB913" fill="#FDB913" fillOpacity={0.3} />
                            <Legend />
                            <Tooltip contentStyle={{borderRadius: '12px'}}/>
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                   </Card>
                   <Card>
                      <h3 className="font-bold text-lg text-slate-800 mb-4">Budget Utilization</h3>
                      <div className="h-80 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm">Chart Placeholder (Detailed Budget View)</p>
                      </div>
                   </Card>
                 </div>
                 <Card className="tour-analytics-table">
                   <h3 className="font-bold text-lg text-slate-800 mb-4">Detailed Risk Assessment</h3>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                       <thead><tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase"><th className="pb-3">Department</th><th className="pb-3">Head Count</th><th className="pb-3">Avg Score</th><th className="pb-3">Compliance</th><th className="pb-3">Status</th></tr></thead>
                       <tbody className="divide-y divide-slate-100 text-sm">
                         {[
                           {d:'Frontliner', h:45, s:88, c:'High', st:'Compliant'},
                           {d:'Kitchen', h:32, s:72, c:'Medium', st:'At Risk'},
                           {d:'Warehouse', h:12, s:65, c:'Low', st:'Non-Compliant'}
                         ].map((row, i) => (
                           <tr key={i} className="group hover:bg-slate-50">
                             <td className="py-4 font-bold text-slate-800">{row.d}</td>
                             <td className="py-4 text-slate-600">{row.h}</td>
                             <td className="py-4 font-bold text-slate-800">{row.s}</td>
                             <td className="py-4"><div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${row.c === 'High' ? 'bg-green-500' : row.c === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: row.s+'%'}}></div></div></td>
                             <td className="py-4"><StatusBadge status={row.st}/></td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </Card>
               </div>
             )}
             
             {/* Fallback for other views */}
             {(activeView === 'employees' || activeView === 'requests') && (
               <EmptyState title="Module Under Construction" message="This advanced view is part of the Premium setup. Please focus on Dashboard and Curriculum for the tutorial demo." icon={Zap} />
             )}
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}
      <CreateCourseWizard 
        isOpen={isCreateCourseOpen} 
        onClose={() => setIsCreateCourseOpen(false)} 
        onSave={(data) => { setCourses([...courses, data]); setIsCreateCourseOpen(false); }}
      />
    </div>
  );
};

export default AdminApp;