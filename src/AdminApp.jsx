/**
 * @file App.jsx
 * @description Enterprise-Grade HR & LMS Dashboard with Context-Aware Tutorials.
 * @author Senior Frontend Developer
 * @version 2.0.0 Production-Ready
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Joyride, { STATUS, EVENTS, LIFECYCLE } from 'react-joyride';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Download, Award, DollarSign, Briefcase, GraduationCap,
  PieChart as PieIcon, MapPin, X, LogOut,
  Eye, Layers, Menu, ArrowLeft, Target,
  FileCheck, PlayCircle, ToggleLeft, ToggleRight,
  HelpCircle, Filter, ArrowUp, ArrowDown, ChevronLeft,
  Save, Trash2, Mail
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// ==========================================
// 1. CONFIGURATION & THEME CONSTANTS
// ==========================================

const THEME = {
  primary: "#D12027",      // Karsa Red
  primaryDark: "#b91c22",
  secondary: "#FDB913",    // Karsa Yellow
  bg: "#f8fafc",
  text: "#334155",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
  border: "#e2e8f0"
};

/**
 * Global Styles injected into the head.
 * Handles animations, scrollbars, and utility classes not found in Tailwind.
 */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: ${THEME.bg}; color: ${THEME.text}; }
    
    /* Animations */
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
    .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pop { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* Utilities */
    .card-hover { transition: all 0.2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    
    .sidebar-active {
      background: linear-gradient(90deg, rgba(209, 32, 39, 0.1) 0%, transparent 100%);
      border-left: 4px solid ${THEME.primary};
      color: ${THEME.primary};
    }
    
    /* Table Styling */
    th { letter-spacing: 0.05em; }
    tr { transition: background-color 0.15s; }

    /* Joyride Overrides */
    .react-joyride__tooltip { border-radius: 12px !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
  `}</style>
);

// ==========================================
// 2. MOCK DATA & GENERATORS
// ==========================================

const INITIAL_EMPLOYEES = [
  { id: 'E001', name: 'Budi Santoso', role: 'Sales Staff', dept: 'Frontliner', branch: 'Kb. Kawung', progress: 85, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', courses_assigned: 12, courses_completed: 10, email: 'budi.s@kartikasari.com', phone: '0812-3456-7890', joinDate: '2022-01-12' },
  { id: 'E002', name: 'Siska Wijaya', role: 'Store Manager', dept: 'Operational', branch: 'Dago', progress: 92, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siska', courses_assigned: 20, courses_completed: 18, email: 'siska.w@kartikasari.com', phone: '0812-9876-5432', joinDate: '2019-03-05' },
  { id: 'E003', name: 'Andi Pratama', role: 'Head Baker', dept: 'Kitchen', branch: 'Central Kitchen', progress: 45, compliance: 'At Risk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', courses_assigned: 15, courses_completed: 6, email: 'andi.p@kartikasari.com', phone: '0813-4567-8901', joinDate: '2021-08-20' },
  { id: 'E004', name: 'Rina Melati', role: 'Supervisor', dept: 'Frontliner', branch: 'Buah Batu', progress: 78, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', courses_assigned: 18, courses_completed: 14, email: 'rina.m@kartikasari.com', phone: '0811-2345-6789', joinDate: '2020-11-10' },
  { id: 'E005', name: 'Dedi Kusuma', role: 'Logistics', dept: 'Warehouse', branch: 'Central', progress: 60, compliance: 'Non-Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi', courses_assigned: 10, courses_completed: 6, email: 'dedi.k@kartikasari.com', phone: '0856-7890-1234', joinDate: '2023-02-15' },
];

const INITIAL_COURSES = [
  { id: 'C01', title: 'Food Safety Standard (HACCP)', category: 'Mandatory', level: 'All Staff', assigned: 150, completed: 120, status: 'Active', description: 'Comprehensive guide to Hazard Analysis Critical Control Point for food safety.', duration: '2h 30m', modules_count: 5, type: 'Video & Quiz' },
  { id: 'C02', title: 'Service Excellence 2.0', category: 'Soft Skill', level: 'Frontliner', assigned: 80, completed: 45, status: 'Active', description: 'Advanced customer service techniques for handling complaints and premium service.', duration: '1h 45m', modules_count: 3, type: 'Video' },
  { id: 'C03', title: 'POS System Advanced', category: 'Technical', level: 'Cashier', assigned: 40, completed: 38, status: 'Active', description: 'Technical mastery of the Point of Sales system including troubleshooting.', duration: '45m', modules_count: 2, type: 'Interactive' },
  { id: 'C04', title: 'Leadership 101', category: 'Managerial', level: 'Manager', assigned: 20, completed: 5, status: 'Draft', description: 'Basic leadership principles for new supervisors and managers.', duration: '3h 00m', modules_count: 8, type: 'Mixed' },
];

const INITIAL_REQUESTS = [
  { id: 'R01', employee: 'Siska Wijaya', title: 'Advanced Latte Art', provider: 'Barista Academy', cost: 2500000, date: '2023-11-20', status: 'Pending', justification: 'To improve premium coffee sales variant at Dago branch.', vendor_details: 'Barista Academy BDG', timeline: '2 Days Workshop', leader_approval: true },
  { id: 'R02', employee: 'Andi Pratama', title: 'Industrial Baking Tech', provider: 'Baking Center JKT', cost: 5000000, date: '2023-11-22', status: 'Approved', justification: 'Efficiency for new oven machine.', vendor_details: 'Baking Center JKT', timeline: '1 Week Certification', leader_approval: true },
  { id: 'R03', employee: 'Team Warehouse', title: 'Safety Driving', provider: 'Internal', cost: 0, date: '2023-12-01', status: 'Rejected', justification: 'Budget constraint.', vendor_details: 'Internal GA Team', timeline: '1 Day', leader_approval: true },
];

// ==========================================
// 3. UTILITY COMPONENTS (UI KIT)
// ==========================================

/**
 * Reusable Status Badge with consistent coloring
 */
const StatusBadge = ({ status }) => {
  const styles = {
    'Compliant': 'bg-green-100 text-green-700 border-green-200',
    'Active': 'bg-green-100 text-green-700 border-green-200',
    'Approved': 'bg-green-100 text-green-700 border-green-200',
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'At Risk': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Draft': 'bg-slate-100 text-slate-600 border-slate-200',
    'Non-Compliant': 'bg-red-100 text-red-700 border-red-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${styles[status] || styles['Draft']}`}>
      {status}
    </span>
  );
};

const ProgressBar = ({ value, colorClass = "bg-blue-600" }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
    <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${value}%` }}></div>
  </div>
);

const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false, type = 'button' }) => {
  const baseStyle = "px-4 py-2 rounded-lg text-sm font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center";
  const variants = {
    primary: `bg-[${THEME.primary}] text-white hover:bg-[${THEME.primaryDark}] shadow-md hover:shadow-lg`,
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  };
  
  // Safe color injection for dynamic classes in Tailwind (workaround)
  const safeStyle = variant === 'primary' 
    ? `bg-red-600 text-white hover:bg-red-700 shadow-md` 
    : variants[variant];

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${safeStyle} ${className}`}>
      {children}
    </button>
  );
};

// ==========================================
// 4. TUTORIAL ENGINE (JOYRIDE CONFIG)
// ==========================================

/**
 * defineSteps - centralized tutorial logic.
 * @param {string} view - The current active view (dashboard, employees, etc.)
 * @returns {Array} Joyride steps
 */
const defineSteps = (view) => {
  const commonSteps = [
    { target: '.tour-sidebar', content: 'Sidebar Navigasi: Akses cepat ke modul utama. Menu yang aktif akan menyala.', placement: 'right', disableBeacon: true },
    { target: '.tour-profile', content: 'Profil & Notifikasi: Cek alert sistem atau ubah pengaturan akun di sini.', placement: 'bottom-end' }
  ];

  switch(view) {
    case 'dashboard':
      return [
        { 
          target: 'body', 
          content: (
            <div className="text-left space-y-2">
              <h4 className="font-bold text-lg">👋 Selamat Datang di Karsa LMS</h4>
              <p>Dashboard ini dirancang untuk memberikan visibilitas instan terhadap kesehatan pelatihan organisasi Anda. Mari kita tur singkat!</p>
            </div>
          ), 
          placement: 'center' 
        },
        ...commonSteps,
        { target: '.tour-kpi-grid', content: 'KPI Cards: Metrik vital. Perhatikan "At Risk Users" - jika angka ini naik, segera lakukan audit kepatuhan.', placement: 'bottom' },
        { target: '.tour-chart-activity', content: 'Activity Trend: Melihat pola belajar karyawan. Grafik menurun di jam kerja? Bagus, artinya operasional tidak terganggu.', placement: 'top' },
        { target: '.tour-btn-analytics', content: 'Deep Dive: Klik ini untuk masuk ke modul Analitik lanjutan untuk melihat skill gap per departemen.', placement: 'top' }
      ];
    
    case 'employees':
      return [
        { target: '.tour-emp-toolbar', content: 'Toolbar: Gunakan Search untuk filter cepat. Tombol "Add" akan membuka modal pendaftaran karyawan baru.', placement: 'bottom' },
        { target: '.tour-emp-table', content: 'Data Grid: Tabel interaktif. Klik baris mana saja untuk melihat Detail Panel di sebelah kanan.', placement: 'top' },
        { target: '.tour-status-badge', content: 'Status Kepatuhan: "Non-Compliant" berarti karyawan tersebut belum menyelesaikan pelatihan wajib (Mandatory).', placement: 'left' }
      ];

    case 'curriculum':
      return [
        { target: '.tour-curr-actions', content: 'Action Center: "Assign Learning" untuk distribusi massal, "Create Course" untuk membuat materi baru.', placement: 'bottom' },
        { target: '.tour-curr-cards', content: 'Course Catalog: Kartu materi pembelajaran. Status "Draft" tidak akan muncul di aplikasi mobile karyawan.', placement: 'top' }
      ];
    
    case 'requests':
      return [
        { target: '.tour-req-stats', content: 'Budget Watch: Pantau sisa budget pelatihan eksternal di sini agar tidak overspending.', placement: 'bottom' },
        { target: '.tour-req-table', content: 'Approval Queue: Klik "Detail" untuk melihat justifikasi biaya dan lampiran persetujuan atasan sebelum Approve/Reject.', placement: 'top' }
      ];

    // MODAL TOURS
    case 'modal-add-employee':
      return [
        { target: '.tour-modal-title', content: 'Form Pendaftaran: Pastikan data sesuai KTP. Email wajib menggunakan domain perusahaan.', placement: 'bottom' },
        { target: '.tour-input-dept', content: 'Departemen: Pilihan ini akan menentukan kurikulum wajib (Mandatory Path) yang otomatis diberikan saat profil dibuat.', placement: 'right' },
        { target: '.tour-modal-actions', content: 'Validasi: Tombol Save hanya aktif jika semua field mandatory terisi valid.', placement: 'top' }
      ];

    default:
      return [];
  }
};

// ==========================================
// 5. COMPLEX SUB-COMPONENTS & MODALS
// ==========================================

const AddEmployeeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', role: '', dept: 'Frontliner', email: '' });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Validation Logic
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.role.trim()) newErrors.role = "Job Role is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Real-time validation
  useEffect(() => {
    if (isDirty) validate();
  }, [formData, isDirty, validate]);

  const handleSubmit = () => {
    setIsDirty(true);
    if (!validate()) return;
    
    onSave({
      ...formData, id: `E${Math.floor(Math.random() * 10000)}`,
      progress: 0, compliance: 'Compliant', courses_assigned: 0, courses_completed: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      joinDate: new Date().toISOString().split('T')[0]
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: '', role: '', dept: 'Frontliner', email: '' });
    setErrors({});
    setIsDirty(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl tour-modal-title">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Add New Employee</h3>
            <p className="text-xs text-slate-500">Create profile & assign mandatory paths.</p>
          </div>
          <button onClick={handleClose}><X size={20} className="text-slate-400 hover:text-red-500 transition-colors"/></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-100 outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1"><AlertTriangle size={10}/> {errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address <span className="text-red-500">*</span></label>
            <input 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-100 outline-none transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              placeholder="employee@company.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1"><AlertTriangle size={10}/> {errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="tour-input-dept">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
              <select 
                value={formData.dept} 
                onChange={e => setFormData({...formData, dept: e.target.value})} 
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none bg-white focus:border-red-300"
              >
                <option>Frontliner</option>
                <option>Kitchen</option>
                <option>Operational</option>
                <option>Warehouse</option>
                <option>Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role <span className="text-red-500">*</span></label>
              <input 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-red-100 outline-none ${errors.role ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                placeholder="e.g. Sales Staff"
              />
              {errors.role && <p className="text-xs text-red-500 mt-1 font-medium">{errors.role}</p>}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-3">
             <HelpCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
             <p className="text-xs text-blue-700 leading-relaxed">
               <strong>Auto-Assignment:</strong> Based on the selected Department, standard "Onboarding" and "Code of Conduct" modules will be automatically assigned upon creation.
             </p>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl tour-modal-actions">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={Object.keys(errors).length > 0 && isDirty}>
            <Save size={16} /> Save Employee
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MAIN VIEW COMPONENTS
// ==========================================

const DashboardView = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 tour-kpi-grid">
        {[
          { title: 'Total Learners', value: '342', sub: '+12 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' }, 
          { title: 'Avg Completion', value: '78%', sub: '+2.4% vs last mo', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }, 
          { title: 'Pending Requests', value: '8', sub: 'Needs Approval', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' }, 
          { title: 'At Risk Users', value: '14', sub: 'Non-compliant', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 card-hover group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform duration-200`}>
                <kpi.icon size={24} />
              </div>
              <span className="text-slate-300 group-hover:text-slate-400"><MoreVertical size={16}/></span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{kpi.value}</h3>
            <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
            <p className={`text-xs mt-2 font-bold ${kpi.sub.includes('Needs') || kpi.sub.includes('Non') ? 'text-red-500' : 'text-green-600'}`}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 tour-chart-activity">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="font-bold text-lg text-slate-800">Learning Activity Trends</h3>
               <p className="text-xs text-slate-500">Video watch time & Quiz attempts per week</p>
            </div>
            <select className="text-xs border-slate-200 rounded-lg p-1 bg-slate-50 font-bold text-slate-600 outline-none">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ name: 'W1', hours: 400 }, { name: 'W2', hours: 300 }, { name: 'W3', hours: 500 }, { name: 'W4', hours: 450 }]}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} width={30} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: THEME.primary, fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="hours" stroke={THEME.primary} fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-6">Completion by Dept</h3>
            <div className="space-y-6">
              {[{ name: 'Frontliner', val: 85 }, { name: 'Kitchen', val: 72 }, { name: 'Operational', val: 95 }, { name: 'Warehouse', val: 60 }].map((dept) => (
                <div key={dept.name} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{dept.name}</span>
                    <span className="font-bold text-slate-800">{dept.val}%</span>
                  </div>
                  <ProgressBar value={dept.val} colorClass={dept.val > 80 ? "bg-green-500" : dept.val > 60 ? "bg-yellow-500" : "bg-red-500"} />
                </div>
              ))}
            </div>
          </div>
          <Button 
            className="tour-btn-analytics w-full mt-8 border-red-200 text-red-600 hover:bg-red-50" 
            variant="ghost"
            onClick={() => onNavigate('analytics')}
          >
            <PieIcon size={16}/> View Detailed Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

const EmployeesView = ({ data, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Advanced Sorting & Filtering
  const processedData = useMemo(() => {
    let sortableItems = [...data];
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fadeIn">
      {/* Main List */}
      <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-300 ${selectedEmp ? 'w-2/3 hidden lg:flex' : 'w-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center tour-emp-toolbar">
           <div className="relative w-64">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
             <input 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Search employee..." 
                className="w-full pl-9 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 transition-all" 
             />
           </div>
           <Button onClick={onAdd}><Plus size={16}/> Add Employee</Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse tour-emp-table">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                {['Employee', 'Role', 'Progress', 'Compliance'].map((head, i) => (
                  <th key={i} className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100" onClick={() => requestSort(head.toLowerCase())}>
                    <div className="flex items-center gap-1">{head} <ArrowUp size={12} className={`text-slate-300 ${sortConfig.key === head.toLowerCase() && sortConfig.direction === 'asc' ? 'text-red-500' : ''}`} /></div>
                  </th>
                ))}
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.length > 0 ? processedData.map((emp) => (
                <tr 
                  key={emp.id} 
                  onClick={() => setSelectedEmp(emp)}
                  className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedEmp?.id === emp.id ? 'bg-red-50' : ''}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} className="w-9 h-9 rounded-full bg-slate-200" alt="" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-700 font-medium">{emp.role}</p>
                    <p className="text-xs text-slate-500">{emp.dept}</p>
                  </td>
                  <td className="p-4 w-40">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">{emp.progress}%</span>
                    </div>
                    <ProgressBar value={emp.progress} colorClass={emp.progress < 50 ? 'bg-red-500' : 'bg-green-600'} />
                  </td>
                  <td className="p-4 tour-status-badge">
                    <StatusBadge status={emp.compliance} />
                  </td>
                  <td className="p-4">
                    <ChevronRight size={16} className="text-slate-300"/>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedEmp && (
        <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col animate-slideInRight z-20 absolute lg:static inset-0">
           <div className="h-16 flex items-center px-4 border-b border-slate-100 lg:hidden">
              <button onClick={() => setSelectedEmp(null)} className="flex items-center gap-2 text-slate-500 font-bold"><ArrowLeft size={20}/> Back</button>
           </div>
           
           <div className="p-6 text-center border-b border-slate-100 relative">
              <button onClick={() => setSelectedEmp(null)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hidden lg:block"><X size={20}/></button>
              <img src={selectedEmp.avatar} className="w-24 h-24 rounded-full mx-auto border-4 border-slate-50 mb-4" alt=""/>
              <h2 className="text-xl font-bold text-slate-800">{selectedEmp.name}</h2>
              <p className="text-slate-500 text-sm">{selectedEmp.role}</p>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="secondary" className="px-3 py-1 text-xs"><Mail size={14}/> Email</Button>
                <Button variant="secondary" className="px-3 py-1 text-xs"><FileText size={14}/> Report</Button>
              </div>
           </div>

           <div className="p-6 space-y-6 flex-1 overflow-auto bg-slate-50">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold">Assigned</p>
                    <p className="text-xl font-bold text-slate-800">{selectedEmp.courses_assigned}</p>
                 </div>
                 <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold">Completed</p>
                    <p className="text-xl font-bold text-green-600">{selectedEmp.courses_completed}</p>
                 </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><Target size={16} className="text-red-500"/> Mandatory Training</h4>
                <div className="space-y-3">
                  {['HACCP Level 1', 'Company Ethics', 'Fire Safety'].map((c, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {i === 0 ? <CheckCircle size={16} className="text-green-500 shrink-0"/> : <Clock size={16} className="text-yellow-500 shrink-0"/>}
                      <span className={i === 0 ? "text-slate-400 line-through" : "text-slate-700 font-medium"}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
           </div>

           <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
              <Button className="w-full">Assign New Course</Button>
           </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. MAIN APPLICATION SHELL
// ==========================================

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  
  // Tutorial State
  const [runTour, setRunTour] = useState(false);
  const [steps, setSteps] = useState([]);
  const [modalOpen, setModalOpen] = useState(null); // 'add-employee', 'course-detail'

  // --- TUTORIAL ORCHESTRATOR ---
  
  // Update steps when view changes or modal opens
  useEffect(() => {
    let context = modalOpen ? `modal-${modalOpen}` : activeView;
    
    // Check local storage if tour has been seen for this context
    const hasSeen = localStorage.getItem(`tour_${context}`);
    if (!hasSeen) {
      setSteps(defineSteps(context));
      setRunTour(true);
    } else {
      setRunTour(false);
    }
  }, [activeView, modalOpen]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const context = modalOpen ? `modal-${modalOpen}` : activeView;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.setItem(`tour_${context}`, 'true');
    }
  };

  const manualStartTour = () => {
    const context = modalOpen ? `modal-${modalOpen}` : activeView;
    setSteps(defineSteps(context));
    setRunTour(true);
  };

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Management', icon: Users },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'requests', label: 'Training Requests', icon: FileText, badge: 3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <GlobalStyles />
      
      {/* JOYRIDE INSTANCE */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: THEME.primary,
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: 'left'
          },
          buttonNext: {
            backgroundColor: THEME.primary,
            fontSize: 12,
            fontWeight: 'bold'
          }
        }}
        locale={{ last: 'Finish', next: 'Next', back: 'Back', skip: 'Dismiss' }}
      />

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm animate-fadeIn" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} tour-sidebar`}>
        <div className="h-20 flex items-center px-8 border-b border-slate-100 gap-3">
          <div className="w-10 h-10 bg-[#D12027] rounded-xl flex items-center justify-center shadow-red-200 shadow-lg">
             <span className="text-white font-black text-xl">K</span>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none">KARSA<span className="text-red-600">LMS</span></h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto px-4">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-2">Main Module</p>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeView === item.id ? 'bg-red-50 text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={activeView === item.id ? 'text-red-600' : 'text-slate-400'}/>
                {item.label}
              </div>
              {item.badge && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <div className="bg-slate-900 rounded-xl p-4 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <p className="text-white font-bold text-sm">Need Help?</p>
                <p className="text-slate-400 text-xs mt-1 mb-3">Check our documentation or contact support.</p>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors font-bold w-full">Reset Tutorial</button>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen relative w-full overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 z-20 shrink-0">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={24}/></button>
              <h2 className="text-xl font-bold text-slate-800 capitalize hidden lg:block">{activeView.replace('-', ' ')}</h2>
           </div>

           <div className="flex items-center gap-4 lg:gap-6 tour-profile">
              <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-full px-1 p-1">
                 <Search size={18} className="text-slate-400 ml-2"/>
                 <input type="text" placeholder="Global Search..." className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none text-slate-600"/>
              </div>
              
              <button onClick={manualStartTour} className="text-slate-400 hover:text-red-600 transition-colors" title="Start Tour">
                <HelpCircle size={22} />
              </button>
              
              <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-800">Admin User</p>
                    <p className="text-xs text-slate-500">Superadmin</p>
                 </div>
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border-2 border-slate-100 bg-slate-50" alt="Profile" />
              </div>
           </div>
        </header>

        {/* CONTENT SCROLLABLE AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth w-full relative">
           <div className="max-w-7xl mx-auto">
             {activeView === 'dashboard' && <DashboardView onNavigate={setActiveView} />}
             {activeView === 'employees' && <EmployeesView data={employees} onAdd={() => setModalOpen('add-employee')} />}
             
             {/* Placeholder for other views */}
             {['curriculum', 'requests', 'analytics'].includes(activeView) && (
               <div className="flex flex-col items-center justify-center h-96 text-slate-400 animate-fadeIn border-2 border-dashed border-slate-200 rounded-3xl">
                  <div className="bg-slate-50 p-6 rounded-full mb-4">
                    {activeView === 'curriculum' ? <BookOpen size={48}/> : activeView === 'requests' ? <FileText size={48}/> : <BarChart2 size={48}/>}
                  </div>
                  <h3 className="text-lg font-bold text-slate-600 capitalize">{activeView} Module</h3>
                  <p className="text-sm">This module is part of the full suite. Refactoring in progress.</p>
                  <Button className="mt-6" variant="secondary" onClick={() => setActiveView('dashboard')}>Return to Dashboard</Button>
               </div>
             )}
           </div>
        </main>
      </div>

      {/* MODALS */}
      <AddEmployeeModal 
        isOpen={modalOpen === 'add-employee'} 
        onClose={() => setModalOpen(null)} 
        onSave={(newEmp) => setEmployees([newEmp, ...employees])} 
      />
    </div>
  );
};

export default App;