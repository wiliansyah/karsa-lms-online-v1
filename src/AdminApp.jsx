import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Download, Award, DollarSign, Briefcase, GraduationCap,
  PieChart as PieIcon, MapPin, X, LogOut,
  Eye, Layers, Menu, ArrowLeft, Target,
  FileCheck, PlayCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Joyride, { STATUS, EVENTS } from 'react-joyride'; 

// ==========================================
// --- 1. THEME & GLOBAL STYLES CONFIG ---
// ==========================================

const KARSA_RED = "#D12027";
const KARSA_YELLOW = "#FDB913";

// Komponen ini menyuntikkan CSS global ke dalam head dokumen.
// Menggunakan teknik ini memungkinkan kita mengontrol scrollbar dan animasi
// tanpa file CSS terpisah.
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { 
      font-family: 'Inter', sans-serif; 
      background-color: #f8fafc; /* Slate-50 yang lebih bersih */
      color: #334155; /* Slate-700 untuk keterbacaan tinggi */
    }
    
    /* --- Animations Utility Classes --- */
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
    .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pop { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }

    /* --- Custom Scrollbar (Chrome/Safari/Edge) --- */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* --- Utility Helper Classes --- */
    .card-hover { transition: all 0.2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    
    .btn-primary {
      background: ${KARSA_RED}; color: white;
      transition: all 0.2s;
    }
    .btn-primary:hover { background: #b91c22; transform: translateY(-1px); }
    
    .sidebar-active {
      background: linear-gradient(90deg, rgba(209, 32, 39, 0.1) 0%, transparent 100%);
      border-left: 4px solid ${KARSA_RED};
      color: ${KARSA_RED};
    }
    
    tr { transition: background-color 0.15s; }
  `}</style>
);

// ==========================================
// --- 2. MOCK DATA LAYER (DATABASE SIMULATION) ---
// ==========================================

// Data Karyawan: Mengandung stats progress belajar untuk visualisasi dashboard
const INITIAL_EMPLOYEES = [
  { id: 'E001', name: 'Budi Santoso', role: 'Sales Staff', dept: 'Frontliner', branch: 'Kb. Kawung', progress: 85, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', courses_assigned: 12, courses_completed: 10, email: 'budi.s@kartikasari.com', phone: '0812-3456-7890', joinDate: '12 Jan 2022' },
  { id: 'E002', name: 'Siska Wijaya', role: 'Store Manager', dept: 'Operational', branch: 'Dago', progress: 92, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siska', courses_assigned: 20, courses_completed: 18, email: 'siska.w@kartikasari.com', phone: '0812-9876-5432', joinDate: '05 Mar 2019' },
  { id: 'E003', name: 'Andi Pratama', role: 'Head Baker', dept: 'Kitchen', branch: 'Central Kitchen', progress: 45, compliance: 'At Risk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', courses_assigned: 15, courses_completed: 6, email: 'andi.p@kartikasari.com', phone: '0813-4567-8901', joinDate: '20 Aug 2021' },
  { id: 'E004', name: 'Rina Melati', role: 'Supervisor', dept: 'Frontliner', branch: 'Buah Batu', progress: 78, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', courses_assigned: 18, courses_completed: 14, email: 'rina.m@kartikasari.com', phone: '0811-2345-6789', joinDate: '10 Nov 2020' },
  { id: 'E005', name: 'Dedi Kusuma', role: 'Logistics', dept: 'Warehouse', branch: 'Central', progress: 60, compliance: 'Non-Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi', courses_assigned: 10, courses_completed: 6, email: 'dedi.k@kartikasari.com', phone: '0856-7890-1234', joinDate: '15 Feb 2023' },
];

// Data Kursus: Mencakup metadata seperti durasi dan tipe konten
const INITIAL_COURSES = [
  { 
    id: 'C01', title: 'Food Safety Standard (HACCP)', category: 'Mandatory', level: 'All Staff', 
    assigned: 150, completed: 120, status: 'Active',
    description: 'Comprehensive guide to Hazard Analysis Critical Control Point for food safety.',
    duration: '2h 30m', modules_count: 5, type: 'Video & Quiz'
  },
  { 
    id: 'C02', title: 'Service Excellence 2.0', category: 'Soft Skill', level: 'Frontliner', 
    assigned: 80, completed: 45, status: 'Active',
    description: 'Advanced customer service techniques for handling complaints and premium service.',
    duration: '1h 45m', modules_count: 3, type: 'Video'
  },
  { 
    id: 'C03', title: 'POS System Advanced', category: 'Technical', level: 'Cashier', 
    assigned: 40, completed: 38, status: 'Active',
    description: 'Technical mastery of the Point of Sales system including troubleshooting.',
    duration: '45m', modules_count: 2, type: 'Interactive'
  },
  { 
    id: 'C04', title: 'Leadership 101', category: 'Managerial', level: 'Manager', 
    assigned: 20, completed: 5, status: 'Draft',
    description: 'Basic leadership principles for new supervisors and managers.',
    duration: '3h 00m', modules_count: 8, type: 'Mixed'
  },
];

// Data Request Training Eksternal
const INITIAL_REQUESTS = [
  { id: 'R01', employee: 'Siska Wijaya', title: 'Advanced Latte Art', provider: 'Barista Academy', cost: 2500000, date: '2023-11-20', status: 'Pending', justification: 'To improve premium coffee sales variant at Dago branch.', vendor_details: 'Barista Academy BDG', timeline: '2 Days Workshop', leader_approval: true },
  { id: 'R02', employee: 'Andi Pratama', title: 'Industrial Baking Tech', provider: 'Baking Center JKT', cost: 5000000, date: '2023-11-22', status: 'Approved', justification: 'Efficiency for new oven machine.', vendor_details: 'Baking Center JKT', timeline: '1 Week Certification', leader_approval: true },
  { id: 'R03', employee: 'Team Warehouse', title: 'Safety Driving', provider: 'Internal', cost: 0, date: '2023-12-01', status: 'Rejected', justification: 'Budget constraint.', vendor_details: 'Internal GA Team', timeline: '1 Day', leader_approval: true },
];

// Data Riwayat untuk Detail Karyawan
const HISTORY_MOCK = [
  { id: 1, action: 'Completed Module', detail: 'Food Safety (HACCP)', date: 'Oct 24, 2023', score: '95%' },
  { id: 2, action: 'Badge Earned', detail: 'Hygiene Hero', date: 'Oct 24, 2023', score: '-' },
  { id: 3, action: 'Quiz Failed', detail: 'Customer Service Basics', date: 'Oct 20, 2023', score: '45%' },
  { id: 4, action: 'Started Course', detail: 'Product Knowledge: Bolen', date: 'Oct 15, 2023', score: '-' },
];

// Data untuk Grafik Radar (Skill Gap Analysis)
const SKILL_RADAR_DATA = [
  { subject: 'HACCP', A: 120, B: 110, fullMark: 150 },
  { subject: 'Service', A: 98, B: 130, fullMark: 150 },
  { subject: 'Tech', A: 86, B: 130, fullMark: 150 },
  { subject: 'Managerial', A: 99, B: 100, fullMark: 150 },
  { subject: 'Safety', A: 85, B: 90, fullMark: 150 },
  { subject: 'Product', A: 65, B: 85, fullMark: 150 },
];
// ==========================================
// --- 3. REUSABLE UI COMPONENT (ATOMS) ---
// ==========================================

// Komponen Badge Status: Menerima string status dan merender warna yang sesuai secara otomatis.
// Ini memudahkan perubahan tema warna status dari satu tempat saja.
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

// Komponen Progress Bar: Visualisasi persentase kelulusan/progres.
// colorClass memungkinkan kita mengubah warna bar jika nilainya rendah (merah) atau tinggi (merah Karsa).
const ProgressBar = ({ value, colorClass = "bg-blue-600" }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
    <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${value}%` }}></div>
  </div>
);

// ==========================================
// --- 4. SMART MODALS & FORMS ---
// ==========================================

// 4.1 ADD EMPLOYEE MODAL
// Modal sederhana untuk input data karyawan baru.
const AddEmployeeModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', role: '', dept: 'Frontliner', email: '' });
    
    // Validasi sederhana sebelum menyimpan
    const handleSubmit = () => {
        if(!formData.name || !formData.email) return alert('Name and Email are required');
        onSave({
            ...formData, id: `E${Math.floor(Math.random() * 1000)}`, // Generate ID dummy
            progress: 0, compliance: 'Compliant', courses_assigned: 0, courses_completed: 0,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`, // Auto-generate avatar
            joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        onClose(); 
        setFormData({ name: '', role: '', dept: 'Frontliner', email: '' }); // Reset form
    };
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Add New Employee</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"/></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-100 outline-none"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label><select value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none"><option>Frontliner</option><option>Kitchen</option><option>Operational</option><option>Warehouse</option></select></div>
                        <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label><input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg outline-none"/></div>
                    </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button>
                    <button onClick={handleSubmit} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg shadow-lg">Save</button>
                </div>
            </div>
        </div>
    );
};

// 4.2 CREATE COURSE MODAL (MULTI-STEP WIZARD)
// Modal ini menggunakan konsep "Wizard" (Langkah 1 -> Langkah 2) untuk UX yang lebih baik.
const CreateCourseModal = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1); // State untuk melacak halaman wizard
    const [formData, setFormData] = useState({ title: '', category: 'Mandatory', level: 'All Staff', description: '', duration: '', type: 'Video' });
    
    const handleSubmit = () => {
        if(!formData.title) return alert('Title is required');
        onSave({ ...formData, id: `C${Math.floor(Math.random() * 1000)}`, assigned: 0, completed: 0, status: 'Draft', modules_count: 0 });
        onClose(); setFormData({ title: '', category: 'Mandatory', level: 'All Staff', description: '', duration: '', type: 'Video' }); setStep(1);
    };
    
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-pop overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div><h3 className="font-bold text-lg text-slate-800">Create New Course</h3><p className="text-xs text-slate-500">Step {step} of 2</p></div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
                </div>
                <div className="p-6 md:p-8">
                    {step === 1 ? (
                        <div className="space-y-4 animate-slideInRight">
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Title</label><input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none" placeholder="e.g. Advanced Baking Techniques"/></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white"><option>Mandatory</option><option>Soft Skill</option><option>Technical</option><option>Managerial</option></select></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Audience</label><select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white"><option>All Staff</option><option>Frontliner</option><option>Manager</option><option>Kitchen Staff</option></select></div>
                            </div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none h-24 resize-none" placeholder="Short description..."/></div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-slideInRight">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Est. Duration</label><input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none" placeholder="e.g. 2h 30m"/></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Content Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white"><option>Video</option><option>Interactive SCORM</option><option>Document / PDF</option><option>Mixed</option></select></div>
                            </div>
                            {/* Area Upload Dummy */}
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                <div className="bg-white p-3 rounded-full shadow-sm mb-3"><Download size={24} className="text-slate-400"/></div>
                                <p className="font-bold text-slate-600">Upload Course Material</p>
                                <p className="text-xs text-slate-400">Drag & drop files or <span className="text-[#D12027] cursor-pointer hover:underline">Browse</span></p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-between bg-slate-50">
                    {step === 2 ? <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Back</button> : <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button>}
                    {step === 1 ? <button onClick={() => setStep(2)} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg shadow-lg flex items-center gap-2">Next <ChevronRight size={16}/></button> : <button onClick={handleSubmit} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg shadow-lg">Create Draft</button>}
                </div>
            </div>
        </div>
    );
};

// 4.3 COURSE DETAIL MODAL
// Menampilkan detail kursus dan memberikan opsi untuk Mengaktifkan/Menonaktifkan kursus.
const CourseDetailModal = ({ course, isOpen, onClose, onToggleStatus }) => {
    if(!isOpen || !course) return null;
    const isActive = course.status === 'Active';
    return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-pop overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header dengan efek blur dan gradient */}
                <div className="bg-slate-900 text-white p-6 relative shrink-0">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#D12027] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-40"></div>
                     <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold border border-white/20 mb-2 inline-block">{course.category}</span>
                            <h2 className="text-2xl font-bold">{course.title}</h2>
                            <p className="text-slate-300 text-sm mt-1 flex items-center gap-4">
                                <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                                <span className="flex items-center gap-1"><Layers size={14}/> {course.modules_count} Modules</span>
                            </p>
                        </div>
                        <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h3 className="font-bold text-slate-800 mb-3">About this Course</h3><p className="text-sm text-slate-600 leading-relaxed">{course.description || 'No description provided.'}</p></div>
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h3 className="font-bold text-slate-800 mb-4">Syllabus / Modules</h3><div className="space-y-3">{[1,2,3].map(i => (<div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"><div className="w-8 h-8 bg-[#D12027]/10 text-[#D12027] rounded-full flex items-center justify-center font-bold text-sm">{i}</div><div className="flex-1"><p className="text-sm font-bold text-slate-700">Module {i}: Introduction to Topic</p><p className="text-xs text-slate-400">Video • 15 mins</p></div><PlayCircle size={18} className="text-slate-300"/></div>))}</div></div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">Course Status</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-sm font-bold ${isActive ? 'text-green-600' : 'text-slate-500'}`}>{isActive ? 'Published / Active' : 'Draft / Inactive'}</span>
                                    <button onClick={() => onToggleStatus(course.id)} className={`text-2xl transition-colors ${isActive ? 'text-green-500' : 'text-slate-300'}`}>{isActive ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}</button>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">{isActive ? 'This course is visible to all assigned employees.' : 'This course is hidden. Activate to allow enrollment.'}</p>
                                <button onClick={() => onToggleStatus(course.id)} className={`w-full py-2 rounded-lg text-sm font-bold border transition-colors ${isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700'}`}>{isActive ? 'Deactivate Course' : 'Activate Course'}</button>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-2">Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Enrolled</span><span className="font-bold">{course.assigned}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Completed</span><span className="font-bold text-green-600">{course.completed}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4.4 ASSIGN COURSE MODAL (COMPLEX LOGIC)
// Modal ini memiliki logika "Dual Mode": Assign ke Departemen (Bulk) atau User (Individual).
// Juga memiliki fitur search untuk mencari karyawan.
const AssignCourseModal = ({ isOpen, onClose, courses, employees, preSelectedEmployee = null, onAssign }) => {
  const [assignMode, setAssignMode] = useState('dept'); // Mode: 'dept' atau 'user'
  const [selectedIds, setSelectedIds] = useState([]);   // Menyimpan ID yang dipilih (bisa nama Dept atau ID User)
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;
  
  const toggleSelection = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  
  // Filter karyawan berdasarkan search term
  const filteredEmployees = employees?.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.role.toLowerCase().includes(searchTerm.toLowerCase())) || [];
  
  const handleConfirm = () => {
    if(!selectedCourse) return alert("Please select a course");
    if(!preSelectedEmployee && selectedIds.length === 0) return alert("Please select recipients");
    
    // Callback ke parent component untuk memproses assignment
    if(onAssign) onAssign(selectedCourse, preSelectedEmployee ? [preSelectedEmployee.id] : selectedIds);
    
    alert('Course Assigned Successfully!'); 
    onClose(); 
    setSelectedIds([]); setSearchTerm(""); setAssignMode('dept');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-pop flex flex-col max-h-[90vh]">
        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center shrink-0"><h3 className="font-bold text-lg">Assign Learning</h3><button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button></div>
        <div className="p-5 md:p-6 space-y-4 overflow-y-auto">
           {/* Dropdown Pemilihan Course */}
           <div className="tour-modal-select-course">
               <label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
               <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none bg-white font-medium text-slate-700 text-sm" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}><option value="" disabled>-- Select a course --</option>{courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}</select>
           </div>
           
           <div><label className="block text-sm font-bold text-slate-700 mb-2">Assign To</label>
             {/* Jika dibuka dari profil karyawan spesifik (Pre-selected) */}
             {preSelectedEmployee ? (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3"><img src={preSelectedEmployee.avatar} className="w-8 h-8 rounded-full" alt=""/><div><p className="text-sm font-bold text-slate-800">{preSelectedEmployee.name}</p><p className="text-xs text-slate-500">{preSelectedEmployee.role}</p></div></div>
             ) : (
                <>
                    {/* Toggle Switch Mode */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-3"><button onClick={() => setAssignMode('dept')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${assignMode === 'dept' ? 'bg-white shadow text-[#D12027]' : 'text-slate-500'}`}>Department</button><button onClick={() => setAssignMode('user')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${assignMode === 'user' ? 'bg-white shadow text-[#D12027]' : 'text-slate-500'}`}>Individual</button></div>
                    
                    {/* Mode Departemen */}
                    {assignMode === 'dept' ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-100 p-2 rounded-xl">{['Operational (All)', 'Kitchen Staff', 'Warehouse & Logistics', 'Frontliners', 'Office / HQ'].map(d => (<label key={d} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(d) ? 'bg-red-50' : 'hover:bg-slate-50'}`}><input type="checkbox" checked={selectedIds.includes(d)} onChange={() => toggleSelection(d)} className="accent-[#D12027] w-4 h-4"/><span className="text-sm text-slate-700 font-medium">{d}</span></label>))}</div>
                    ) : (
                        // Mode Individual dengan Search
                        <div className="space-y-2"><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={16}/><input type="text" placeholder="Search employee..." className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div><div className="max-h-40 overflow-y-auto border border-slate-100 p-2 rounded-xl space-y-1">{filteredEmployees.length > 0 ? filteredEmployees.map(emp => (<label key={emp.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(emp.id) ? 'bg-red-50' : 'hover:bg-slate-50'}`}><input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggleSelection(emp.id)} className="accent-[#D12027] w-4 h-4"/><img src={emp.avatar} className="w-6 h-6 rounded-full bg-slate-200" alt=""/><div><p className="text-xs font-bold text-slate-800">{emp.name}</p><p className="text-[10px] text-slate-500">{emp.role}</p></div></label>)) : <p className="text-center text-xs text-slate-400 py-2">No employees found.</p>}</div></div>
                    )}
                </>
             )}
           </div>
           
           {/* Summary Alert */}
           <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-100"><AlertTriangle size={14} className="shrink-0"/> <span className="leading-tight">{preSelectedEmployee ? `Notify ${preSelectedEmployee.name} via email.` : `Notify ${selectedIds.length > 0 ? selectedIds.length : '0'} ${assignMode === 'dept' ? 'departments' : 'people'} via email.`}</span></div>
        </div>
        <div className="p-5 md:p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl shrink-0"><button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button><button onClick={handleConfirm} className="btn-primary px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg">Confirm</button></div>
      </div>
    </div>
  );
};

// 4.5 FULL PROFILE MODAL
// Menampilkan profil lengkap karyawan, termasuk riwayat training (History Mock).
const FullProfileModal = ({ employee, isOpen, onClose }) => {
    if (!isOpen || !employee) return null;
    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 animate-fadeIn">
            <div className="bg-white md:rounded-3xl w-full max-w-4xl h-full md:h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-pop">
                <div className="bg-slate-900 text-white p-6 md:p-8 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D12027] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-4 md:gap-6"><img src={employee.avatar} className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white/20" alt={employee.name}/><div><h2 className="text-xl md:text-3xl font-bold">{employee.name}</h2><p className="text-slate-300 text-sm md:text-base flex items-center gap-2 mt-1"><Briefcase size={16}/> {employee.role} | {employee.dept}</p></div></div>
                        <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={18} className="text-[#D12027]"/> Personal Data</h3><div className="space-y-4 text-sm"><div><p className="text-slate-400 text-xs uppercase font-bold">Email</p><p className="text-slate-700 font-medium break-all">{employee.email}</p></div><div><p className="text-slate-400 text-xs uppercase font-bold">Phone</p><p className="text-slate-700 font-medium">{employee.phone}</p></div><div><p className="text-slate-400 text-xs uppercase font-bold">Join Date</p><p className="text-slate-700 font-medium">{employee.joinDate}</p></div></div></div>
                        </div>
                        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-slate-800 flex items-center gap-2"><BookOpen size={18} className="text-blue-600"/> Training History</h3></div>
                            <div className="space-y-0 divide-y divide-slate-100">{HISTORY_MOCK.map((hist, idx) => (<div key={idx} className="py-4 flex flex-col md:flex-row justify-between md:items-center gap-2"><div className="flex items-center gap-4"><div className="p-2 bg-slate-50 rounded-lg text-slate-400 shrink-0">{hist.action.includes('Badge') ? <Award size={20} className="text-yellow-500"/> : hist.action.includes('Failed') ? <XCircle size={20} className="text-red-500"/> : <CheckCircle size={20} className="text-green-500"/>}</div><div><p className="font-bold text-slate-700 text-sm">{hist.detail}</p><p className="text-xs text-slate-400">{hist.action} • {hist.date}</p></div></div>{hist.score !== '-' && (<span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 w-fit">{hist.score}</span>)}</div>))}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4.6 REQUEST DETAIL MODAL
// Untuk menyetujui/menolak request training eksternal.
const RequestDetailModal = ({ request, isOpen, onClose, onUpdateStatus }) => {
    if(!isOpen || !request) return null;
    return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-pop overflow-hidden max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="bg-[#D12027] p-6 text-white flex justify-between items-start sticky top-0 z-10 shrink-0"><div><p className="text-red-100 text-xs font-bold uppercase tracking-wider mb-1">Request #{request.id}</p><h3 className="font-bold text-xl">{request.title}</h3></div><button onClick={onClose} className="text-white/80 hover:text-white"><X size={24}/></button></div>
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">{request.employee.substring(0,2)}</div><div><p className="font-bold text-slate-800 text-sm">{request.employee}</p><p className="text-xs text-slate-500">Requestor</p></div></div><div className="md:ml-auto text-left md:text-right flex flex-row md:flex-col justify-between items-center md:items-end"><StatusBadge status={request.status} /><p className="text-xs text-slate-400 mt-0 md:mt-1">{request.date}</p></div></div>
                    <div><p className="text-xs text-slate-400 uppercase font-bold mb-2">Required Documents</p>{request.leader_approval ? (<div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between"><div className="flex items-center gap-3"><div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm border border-blue-50"><FileCheck size={20}/></div><div><p className="text-sm font-bold text-slate-700">Leader Approval Letter</p><p className="text-xs text-slate-500">Signed by Area Manager</p></div></div><div className="flex items-center gap-2"><span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">VERIFIED</span><button className="text-blue-600 text-xs font-bold hover:underline">View</button></div></div>) : (<div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-3"><AlertTriangle size={20} className="text-red-500"/><p className="text-sm font-bold text-red-700">Leader approval not yet attached.</p></div>)}</div>
                    <div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-slate-400 uppercase font-bold mb-1">Cost Estimation</p><p className="font-mono text-lg font-bold text-slate-800">Rp {request.cost.toLocaleString('id-ID')}</p></div><div><p className="text-xs text-slate-400 uppercase font-bold mb-1">Timeline</p><p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Clock size={14}/> {request.timeline || 'TBD'}</p></div></div>
                    <div><p className="text-xs text-slate-400 uppercase font-bold mb-1">Justification</p><p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg italic">"{request.justification}"</p></div>
                </div>
                {/* Tombol Action hanya muncul jika status Pending */}
                {request.status === 'Pending' && (<div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 sticky bottom-0 z-10 shrink-0"><button onClick={() => onUpdateStatus(request.id, 'Rejected')} className="flex-1 py-3 border border-slate-200 bg-white hover:bg-red-50 text-red-600 font-bold rounded-xl transition-colors">Reject</button><button onClick={() => onUpdateStatus(request.id, 'Approved')} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200">Approve</button></div>)}
            </div>
        </div>
    );
};

// 4.7 DEPARTMENT ANALYTICS MODAL (CHART HEAVY)
// Modal ini menggunakan Library 'Recharts' untuk menampilkan visualisasi data (Radar & Bar Chart).
const DeptAnalyticsModal = ({ isOpen, onClose }) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] shadow-2xl flex flex-col animate-pop overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50"><div><h2 className="text-2xl font-bold text-slate-800">Department Deep Dive</h2><p className="text-slate-500">Comparative analysis and skill gap identification</p></div><button onClick={onClose}><X size={24} className="text-slate-400 hover:text-red-500"/></button></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Target size={18} className="text-[#D12027]"/> Skill Gap Analysis</h3>
                            <div className="h-72"><ResponsiveContainer width="100%" height="100%"><RadarChart outerRadius={90} data={SKILL_RADAR_DATA}><PolarGrid /><PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} /><PolarRadiusAxis angle={30} domain={[0, 150]} /><Radar name="Frontliner" dataKey="A" stroke="#D12027" fill="#D12027" fillOpacity={0.4} /><Radar name="Kitchen" dataKey="B" stroke="#FDB913" fill="#FDB913" fillOpacity={0.4} /><Legend /><Tooltip /></RadarChart></ResponsiveContainer></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-600"/> Module Completion Breakdown</h3>
                             <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={[{ name: 'HACCP', Frontliner: 90, Kitchen: 80, Warehouse: 60 }, { name: 'Service', Frontliner: 95, Kitchen: 40, Warehouse: 30 }, { name: 'Safety', Frontliner: 85, Kitchen: 90, Warehouse: 95 }]}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" /><YAxis dataKey="name" type="category" width={60}/><Tooltip cursor={{fill: 'transparent'}}/><Legend /><Bar dataKey="Frontliner" stackId="a" fill="#D12027" /><Bar dataKey="Kitchen" stackId="a" fill="#FDB913" /><Bar dataKey="Warehouse" stackId="a" fill="#475569" /></BarChart></ResponsiveContainer></div>
                        </div>
                    </div>
                    {/* Data Table */}
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Department Performance Metrics</h3>
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs"><tr><th className="p-4">Department</th><th className="p-4">Total Staff</th><th className="p-4">Avg Score</th><th className="p-4">Completion Rate</th><th className="p-4">Top Skill</th><th className="p-4">Risk Level</th></tr></thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {[{ d: 'Frontliner', s: 45, sc: 88, c: 92, t: 'Service', r: 'Low' }, { d: 'Kitchen', s: 30, sc: 82, c: 75, t: 'HACCP', r: 'Medium' }, { d: 'Operational', s: 15, sc: 91, c: 95, t: 'Managerial', r: 'Low' }, { d: 'Warehouse', s: 20, sc: 70, c: 60, t: 'Safety', r: 'High' }].map((row, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-4 font-bold text-slate-700">{row.d}</td><td className="p-4">{row.s}</td><td className="p-4 font-bold text-[#D12027]">{row.sc}</td><td className="p-4"><div className="flex items-center gap-2"><span className="w-12 text-xs">{row.c}%</span><div className="w-24 h-1.5 bg-slate-100 rounded-full"><div style={{width: `${row.c}%`}} className={`h-full rounded-full ${row.c > 80 ? 'bg-green-500' : row.c > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div></div></div></td><td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{row.t}</span></td><td className="p-4"><StatusBadge status={row.r === 'Low' ? 'Approved' : row.r === 'High' ? 'Rejected' : 'Pending'} /></td></tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// ==========================================
// --- 5. DASHBOARD OVERVIEW (HOME PAGE) ---
// ==========================================

// Halaman utama yang menampilkan ringkasan performa (KPI) dan grafik.
// Menerima prop 'analyticsTrigger' untuk navigasi cepat ke halaman Analytics detail.
const DashboardOverview = ({ analyticsTrigger }) => (
  <div className="space-y-6 animate-fadeIn pb-20">
    {/* KPI Cards Section */}
    <div className="tour-stats-overview grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[
        { title: 'Total Learners', value: '342', sub: '+12 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' }, 
        { title: 'Avg Completion', value: '78%', sub: '+2.4% vs last mo', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }, 
        { title: 'Pending Requests', value: '8', sub: 'Needs Approval', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' }, 
        { title: 'At Risk Users', value: '14', sub: 'Non-compliant', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
      ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 card-hover">
            <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}><kpi.icon size={24} /></div></div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{kpi.value}</h3>
            <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
            <p className={`text-xs mt-2 ${kpi.sub.includes('Needs') || kpi.sub.includes('Non') ? 'text-red-500 font-bold' : 'text-green-600'}`}>{kpi.sub}</p>
          </div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Area Chart: Learning Trend */}
      <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Learning Activity Trends</h3>
          <div className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ name: 'W1', hours: 400 }, { name: 'W2', hours: 300 }, { name: 'W3', hours: 500 }, { name: 'W4', hours: 450 }]}>
                      <defs><linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D12027" stopOpacity={0.1}/><stop offset="95%" stopColor="#D12027" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} width={30}/>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                      <Area type="monotone" dataKey="hours" stroke="#D12027" fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>

      {/* Progress Bars: Department Completion */}
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
              <h3 className="font-bold text-lg text-slate-800 mb-6">Completion by Dept</h3>
              <div className="space-y-6">
                  {[{ name: 'Frontliner', val: 85 }, { name: 'Kitchen', val: 72 }, { name: 'Operational', val: 95 }, { name: 'Warehouse', val: 60 }].map((dept) => (
                      <div key={dept.name}>
                          <div className="flex justify-between text-sm mb-2"><span className="font-medium text-slate-700">{dept.name}</span><span className="font-bold text-slate-800">{dept.val}%</span></div>
                          <ProgressBar value={dept.val} colorClass={dept.val > 80 ? "bg-green-500" : dept.val > 60 ? "bg-yellow-500" : "bg-red-500"} />
                      </div>
                  ))}
              </div>
          </div>
          <button onClick={analyticsTrigger} className="tour-dashboard-analytics-btn w-full mt-8 py-3 text-sm text-[#D12027] font-bold border border-[#D12027] rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <PieIcon size={16}/> View Detailed Analytics
          </button>
      </div>
    </div>
  </div>
);

// ==========================================
// --- 6. MAIN APPLICATION SHELL (THE ROOT) ---
// ==========================================

const AdminApp = () => {
  // --- A. STATE MANAGEMENT ---
  const [activeView, setActiveView] = useState('dashboard'); // State untuk routing sederhana
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mobile menu
  
  // Data State (Diinisialisasi dari Mock Data Part 1)
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  
  // Modal Visibility State
  const [deptAnalyticsOpen, setDeptAnalyticsOpen] = useState(false);
  
  // --- B. HANDLERS (CRUD & ACTIONS) ---
  const handleAddEmployee = (newEmp) => setEmployees([...employees, newEmp]);
  const handleAddCourse = (newCourse) => setCourses([...courses, newCourse]);
  const handleUpdateCourseStatus = (id) => setCourses(courses.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Draft' : 'Active' } : c));
  const handleRequestStatus = (id, status) => setRequests(requests.map(r => r.id === id ? { ...r, status } : r));

  // --- C. INTERACTIVE TOUR CONFIGURATION (JOYRIDE) ---
  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);

  // Definisi langkah tutorial berdasarkan halaman yang aktif
  const getSteps = (view) => {
      const commonSteps = [
          { target: '.tour-sidebar', content: 'Gunakan sidebar ini untuk berpindah menu.', placement: 'right' },
          { target: '.tour-profile', content: 'Akses profil & notifikasi di sini.', placement: 'bottom-end' }
      ];
      switch(view) {
          case 'dashboard':
              return [
                  { target: 'body', content: <div className="text-left"><h4 className="font-bold mb-2">👋 Welcome Admin!</h4><p>Ini adalah Dashboard HR Anda. Mari lihat ringkasan performa sistem.</p></div>, placement: 'center' },
                  ...commonSteps,
                  { target: '.tour-stats-overview', content: 'Ringkasan KPI real-time: Total learner, completion rate, dan pending task.', placement: 'bottom' },
                  { target: '.tour-dashboard-analytics-btn', content: 'Klik di sini untuk melihat analisa skill & gap per departemen secara detail.', placement: 'top' }
              ];
          // ... (Step untuk halaman lain bisa ditambahkan di sini)
          default: return [];
      }
  };

  // Effect: Jalankan tour hanya jika user belum pernah melihatnya
  useEffect(() => {
      const seenKey = `hasSeen_${activeView}`;
      if (!localStorage.getItem(seenKey)) {
          setTourSteps(getSteps(activeView));
          setRunTour(true);
      }
  }, [activeView]);

  const handleJoyrideCallback = (data) => {
      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
          setRunTour(false);
          localStorage.setItem(`hasSeen_${activeView}`, 'true');
      }
  };

  // Menu Configuration
  const MENUS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Progress', icon: Users },
    { id: 'curriculum', label: 'Curriculum & Assign', icon: BookOpen },
    { id: 'requests', label: 'Training Requests', icon: FileText, badge: requests.filter(r => r.status === 'Pending').length },
    { id: 'analytics', label: 'Analytics & Leaderboard', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-800 font-sans">
      <GlobalStyles /> {/* Memuat style global dari Part 1 */}

      {/* --- D. JOYRIDE COMPONENT (TUTORIAL OVERLAY) --- */}
      <Joyride
        steps={tourSteps} run={runTour} continuous={true} showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: { primaryColor: '#D12027', zIndex: 1000, width: 400 },
          buttonNext: { fontWeight: 'bold', borderRadius: '8px', fontSize: '12px' }
        }}
      />

      {/* --- E. RESPONSIVE SIDEBAR --- */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm animate-fadeIn" onClick={() => setIsSidebarOpen(false)}/>}
      
      <aside className={`tour-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 lg:h-20 flex items-center px-6 lg:px-8 border-b border-slate-100 justify-between lg:justify-start">
           <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-[#D12027] rounded-lg flex items-center justify-center"><span className="text-white font-black text-lg">K</span></div>
               <div><h1 className="font-bold text-lg tracking-tight text-slate-900 leading-tight">KARSA<br/><span className="text-[#D12027] text-sm font-medium">Admin Portal</span></h1></div>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={24} /></button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          {MENUS.map((menu) => (
            <button key={menu.id} onClick={() => { setActiveView(menu.id); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-6 lg:px-8 py-3.5 text-sm font-medium transition-all ${activeView === menu.id ? 'sidebar-active' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <div className="flex items-center gap-3"><menu.icon size={18} className={activeView === menu.id ? 'text-[#D12027]' : 'text-slate-400'}/>{menu.label}</div>
              {menu.badge > 0 && <span className="bg-[#D12027] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{menu.badge}</span>}
            </button>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-100">
           <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs text-slate-400 hover:text-[#D12027] underline w-full text-left mb-4">Reset Tutorials</button>
           <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold"><LogOut size={18}/> Sign Out</button>
        </div>
      </aside>

      {/* --- F. MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen relative w-full">
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-3 lg:hidden"><button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu size={24}/></button><span className="font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</span></div>
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500"><span className="cursor-pointer hover:text-[#D12027]">Home</span><ChevronRight size={14}/><span className="font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</span></div>
          
          <div className="tour-profile flex items-center gap-4 lg:gap-6">
            <button onClick={() => {setTourSteps(getSteps(activeView)); setRunTour(true);}} className="text-sm font-bold text-[#D12027] bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">Help ?</button>
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
            <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-slate-200">
               <div className="text-right hidden md:block"><p className="text-sm font-bold text-slate-800">Admin HR</p><p className="text-xs text-slate-500">Superadmin Access</p></div>
               <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#D12027] rounded-full text-white flex items-center justify-center font-bold border-2 border-red-100 shadow-sm text-sm">HR</div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth w-full">
           <div className="max-w-7xl mx-auto">
             <div className="hidden lg:flex mb-8 justify-between items-end">
               <div><h2 className="text-3xl font-bold text-slate-800 mb-2 capitalize">{activeView.replace('-', ' ')}</h2><p className="text-slate-500">Manage your organization's learning ecosystem.</p></div>
             </div>
             
             {/* Content Switching Logic */}
             {activeView === 'dashboard' && <DashboardOverview analyticsTrigger={() => { setActiveView('analytics'); setDeptAnalyticsOpen(true); }} />}
             {activeView === 'employees' && <EmployeeManager employees={employees} courses={courses} onAddEmployee={handleAddEmployee} />}
             {activeView === 'curriculum' && <CurriculumManager courses={courses} employees={employees} onAddCourse={handleAddCourse} onUpdateCourseStatus={handleUpdateCourseStatus} />}
             {activeView === 'requests' && <RequestManager requests={requests} onUpdateStatus={handleRequestStatus} />}
             {activeView === 'analytics' && <AnalyticsDashboard onOpenDeptDetail={() => setDeptAnalyticsOpen(true)} />}
           </div>
        </main>

        {/* Global Modals (Rendered di luar flow utama agar z-index benar) */}
        <DeptAnalyticsModal isOpen={deptAnalyticsOpen} onClose={() => setDeptAnalyticsOpen(false)} />
      </div>
    </div>
  );
};

export default AdminApp;
