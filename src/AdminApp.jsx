import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, ChevronLeft, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Download, Award, DollarSign, Briefcase, GraduationCap,
  PieChart as PieIcon, MapPin, X, LogOut,
  Eye, Layers, Menu, ArrowLeft, Target,
  FileCheck, PlayCircle, ToggleLeft, ToggleRight, HelpCircle,
  Filter, ArrowUp, ArrowDown, Edit3, Trash2, Calendar,
  Settings, UserCheck, Shield, Zap, Mail, Phone
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from 'recharts';
import Joyride, { STATUS, EVENTS, ACTIONS } from 'react-joyride';

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================

const THEME = {
  colors: {
    primary: "#D12027",      // Karsa Red
    primaryDark: "#b91c22",
    primaryLight: "#fef2f2",
    secondary: "#FDB913",    // Karsa Yellow
    secondaryLight: "#fffbeb",
    success: "#10b981",
    successLight: "#ecfdf5",
    warning: "#f59e0b",
    warningLight: "#fff7ed",
    danger: "#ef4444",
    dangerLight: "#fef2f2",
    dark: "#1e293b",
    gray: "#64748b",
    light: "#f8fafc",
    white: "#ffffff",
    border: "#e2e8f0"
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    glow: "0 0 15px rgba(209, 32, 39, 0.3)"
  }
};

const DEPARTMENTS = ['Frontliner', 'Kitchen', 'Operational', 'Warehouse', 'Office / HQ', 'Logistics'];
const ROLES = ['Staff', 'Supervisor', 'Manager', 'Head', 'Director'];

// ==========================================
// 2. MOCK DATA GENERATOR (MASSIVE DATASET)
// ==========================================

const generateEmployees = (count) => {
  const names = ["Budi", "Siska", "Andi", "Rina", "Dedi", "Eka", "Fajar", "Gita", "Hadi", "Indah", "Joko", "Kartika", "Lina", "Mamat", "Nina", "Oscar", "Putri", "Qori", "Rudi", "Santi"];
  const lastNames = ["Santoso", "Wijaya", "Pratama", "Melati", "Kusuma", "Saputra", "Utami", "Hidayat", "Nugroho", "Pertiwi", "Susanto", "Lestari"];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = names[i % names.length];
    const lastName = lastNames[i % lastNames.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const role = ROLES[i % 3]; // Mostly staff/spv
    const joinYear = 2018 + (i % 6);
    
    return {
      id: `EMP-${1000 + i}`,
      name: `${firstName} ${lastName}`,
      role: role,
      dept: dept,
      branch: i % 2 === 0 ? 'Dago' : (i % 3 === 0 ? 'Buah Batu' : 'Central'),
      progress: Math.floor(Math.random() * 100),
      compliance: Math.random() > 0.8 ? 'Non-Compliant' : (Math.random() > 0.6 ? 'At Risk' : 'Compliant'),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      courses_assigned: 10 + Math.floor(Math.random() * 10),
      courses_completed: Math.floor(Math.random() * 10),
      email: `${firstName.toLowerCase()}.${lastName.charAt(0).toLowerCase()}@karsa.com`,
      phone: `0812-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      joinDate: `${Math.floor(1 + Math.random() * 28)} ${['Jan','Feb','Mar','Apr','May','Jun'][i%6]} ${joinYear}`,
      performance_score: 70 + Math.floor(Math.random() * 30), // 70-100
      last_active: `${Math.floor(Math.random() * 24)} hours ago`
    };
  });
};

const INITIAL_EMPLOYEES = generateEmployees(35); // Generate 35 Employees

const INITIAL_COURSES = [
  { id: 'C01', title: 'Food Safety Standard (HACCP)', category: 'Mandatory', level: 'All Staff', assigned: 150, completed: 120, status: 'Active', description: 'Comprehensive guide to Hazard Analysis Critical Control Point for food safety.', duration: '2h 30m', modules_count: 5, type: 'Video & Quiz', last_updated: '2023-10-01' },
  { id: 'C02', title: 'Service Excellence 2.0', category: 'Soft Skill', level: 'Frontliner', assigned: 80, completed: 45, status: 'Active', description: 'Advanced customer service techniques for handling complaints and premium service.', duration: '1h 45m', modules_count: 3, type: 'Video', last_updated: '2023-11-15' },
  { id: 'C03', title: 'POS System Advanced', category: 'Technical', level: 'Cashier', assigned: 40, completed: 38, status: 'Active', description: 'Technical mastery of the Point of Sales system including troubleshooting.', duration: '45m', modules_count: 2, type: 'Interactive', last_updated: '2023-09-20' },
  { id: 'C04', title: 'Leadership 101', category: 'Managerial', level: 'Manager', assigned: 20, completed: 5, status: 'Draft', description: 'Basic leadership principles for new supervisors and managers.', duration: '3h 00m', modules_count: 8, type: 'Mixed', last_updated: '2024-01-10' },
  { id: 'C05', title: 'Inventory Management', category: 'Technical', level: 'Warehouse', assigned: 15, completed: 12, status: 'Active', description: 'FIFO, LIFO, and stock opname best practices.', duration: '1h 30m', modules_count: 4, type: 'Document', last_updated: '2023-12-05' },
  { id: 'C06', title: 'Digital Marketing Basics', category: 'Soft Skill', level: 'Office', assigned: 10, completed: 2, status: 'Draft', description: 'Introduction to social media branding.', duration: '2h 00m', modules_count: 6, type: 'Video', last_updated: '2024-02-01' },
];

const INITIAL_REQUESTS = [
  { id: 'R01', employee: 'Siska Wijaya', title: 'Advanced Latte Art', provider: 'Barista Academy', cost: 2500000, date: '2023-11-20', status: 'Pending', justification: 'To improve premium coffee sales variant at Dago branch.', vendor_details: 'Barista Academy BDG', timeline: '2 Days Workshop', leader_approval: true },
  { id: 'R02', employee: 'Andi Pratama', title: 'Industrial Baking Tech', provider: 'Baking Center JKT', cost: 5000000, date: '2023-11-22', status: 'Approved', justification: 'Efficiency for new oven machine.', vendor_details: 'Baking Center JKT', timeline: '1 Week Certification', leader_approval: true },
  { id: 'R03', employee: 'Team Warehouse', title: 'Safety Driving', provider: 'Internal', cost: 0, date: '2023-12-01', status: 'Rejected', justification: 'Budget constraint.', vendor_details: 'Internal GA Team', timeline: '1 Day', leader_approval: true },
  { id: 'R04', employee: 'Rina Melati', title: 'Customer Psychology', provider: 'Udemy Business', cost: 1500000, date: '2024-01-15', status: 'Pending', justification: 'Better handling of VIP customers.', vendor_details: 'Online Course', timeline: 'Self-paced', leader_approval: false },
  { id: 'R05', employee: 'IT Dept', title: 'AWS Cloud Certification', provider: 'Amazon', cost: 3000000, date: '2024-01-20', status: 'Approved', justification: 'Cloud migration project.', vendor_details: 'AWS Training', timeline: '3 Months', leader_approval: true },
];

const HISTORY_MOCK = [
  { id: 1, action: 'Completed Module', detail: 'Food Safety (HACCP)', date: 'Oct 24, 2023', score: '95%', type: 'success' },
  { id: 2, action: 'Badge Earned', detail: 'Hygiene Hero', date: 'Oct 24, 2023', score: '-', type: 'warning' },
  { id: 3, action: 'Quiz Failed', detail: 'Customer Service Basics', date: 'Oct 20, 2023', score: '45%', type: 'danger' },
  { id: 4, action: 'Started Course', detail: 'Product Knowledge: Bolen', date: 'Oct 15, 2023', score: '-', type: 'info' },
  { id: 5, action: 'Certification', detail: 'Halal Assurance System', date: 'Sep 10, 2023', score: 'Pass', type: 'success' },
];

// ==========================================
// 3. UTILITY FUNCTIONS & HOOKS
// ==========================================

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// Hook for Toasts
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, addToast, removeToast };
};

// ==========================================
// 4. ATOMIC UI COMPONENTS (REUSABLE)
// ==========================================

const Card = ({ children, className = "", noPadding = false, hover = false }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}>
    <div className={noPadding ? "" : "p-5 md:p-6"}>{children}</div>
  </div>
);

const Badge = ({ children, type = 'default', className = "" }) => {
  const styles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    primary: `bg-[${THEME.colors.primaryLight}] text-[${THEME.colors.primary}] border-[${THEME.colors.primaryLight}]`,
    outline: "bg-transparent border-slate-300 text-slate-500"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap inline-flex items-center gap-1 ${styles[type] || styles.default} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, className = "", disabled = false, fullWidth = false }) => {
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: `bg-[${THEME.colors.primary}] hover:bg-[#b91c22] text-white shadow-lg shadow-red-200`,
    secondary: "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
    outline: `bg-transparent border-2 border-[${THEME.colors.primary}] text-[${THEME.colors.primary}] hover:bg-red-50`,
    danger: "bg-red-100 text-red-600 hover:bg-red-200 border border-red-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-800",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} className={children ? "mr-2" : ""} />}
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, error }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
      <input 
        type={type} 
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white border ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-red-100'} rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

const ProgressBar = ({ value, color = "bg-[#D12027]", height = "h-2" }) => (
  <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden`}>
    <div 
      className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    ></div>
  </div>
);

const EmptyState = ({ title, description, icon: Icon, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
      <Icon size={32} className="text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
    {action}
  </div>
);

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
    {toasts.map((toast) => (
      <div 
        key={toast.id} 
        className={`animate-slideInRight min-w-[300px] p-4 rounded-xl shadow-2xl border-l-4 bg-white flex items-center justify-between ${
          toast.type === 'success' ? 'border-green-500' : 
          toast.type === 'error' ? 'border-red-500' : 'border-blue-500'
        }`}
      >
        <div className="flex items-center gap-3">
          {toast.type === 'success' ? <CheckCircle className="text-green-500" size={20}/> : 
           toast.type === 'error' ? <XCircle className="text-red-500" size={20}/> : 
           <Bell className="text-blue-500" size={20}/>}
          <p className="text-sm font-bold text-slate-700">{toast.message}</p>
        </div>
        <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
      </div>
    ))}
  </div>
);

// ==========================================
// 5. COMPLEX MODALS & VIEWS
// ==========================================

// --- ADD EMPLOYEE MODAL ---
const AddEmployeeModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', role: '', dept: 'Frontliner', email: '', phone: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if(!formData.name || !formData.email) return; // Simple validation
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            onSave({
                ...formData, id: `E${Math.floor(Math.random() * 10000)}`,
                progress: 0, compliance: 'Compliant', courses_assigned: 0, courses_completed: 0,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
                joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            });
            setLoading(false);
            onClose(); 
            setFormData({ name: '', role: '', dept: 'Frontliner', email: '', phone: '' });
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-pop flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">New Employee Onboarding</h3>
                        <p className="text-xs text-slate-500">Add personnel to the HR database.</p>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500 transition-colors"/></button>
                </div>
                <div className="p-6 space-y-5 overflow-y-auto">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 shrink-0">
                            <UserCheck className="text-slate-400" size={32}/>
                        </div>
                        <div className="w-full space-y-4">
                            <Input label="Full Name" placeholder="e.g. Budi Santoso" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} icon={UserCheck} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Email Address" placeholder="budi@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} icon={Mail} />
                                <Input label="Phone Number" placeholder="0812..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} icon={Phone} />
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-slate-100 w-full my-2"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Department</label>
                            <select value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-100">
                                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <Input label="Role / Position" placeholder="e.g. Senior Barista" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} icon={Briefcase} />
                    </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading} icon={loading ? undefined : CheckCircle}>
                        {loading ? 'Saving...' : 'Add Employee'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- CREATE COURSE MODAL ---
const CreateCourseModal = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ title: '', category: 'Mandatory', level: 'All Staff', description: '', duration: '', type: 'Video' });
    const [runModalTour, setRunModalTour] = useState(false);

    // Modal Specific Tutorial Steps
    const modalSteps = [
        { target: '.tour-modal-step1', content: 'Step 1: Define Course Identity. Choose the right category (Mandatory/Soft Skill) for accurate reporting.', placement: 'right', disableBeacon: true },
        { target: '.tour-modal-step2', content: 'Step 2: Upload material (Video/PDF). Ensure format is supported and under 50MB.', placement: 'left' }
    ];

    useEffect(() => {
        if(isOpen) { 
            const seen = localStorage.getItem('seen_create_course_tour');
            if(!seen) setRunModalTour(true);
        } else {
            setRunModalTour(false);
            setStep(1);
        }
    }, [isOpen]);

    const handleTourFinish = () => {
        setRunModalTour(false);
        localStorage.setItem('seen_create_course_tour', 'true');
    }

    const handleSubmit = () => {
        if(!formData.title) return;
        onSave({ ...formData, id: `C${Math.floor(Math.random() * 1000)}`, assigned: 0, completed: 0, status: 'Draft', modules_count: 0 });
        onClose(); 
        setFormData({ title: '', category: 'Mandatory', level: 'All Staff', description: '', duration: '', type: 'Video' }); 
        setStep(1);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <Joyride 
                steps={modalSteps} run={runModalTour} continuous showSkipButton 
                callback={(data) => { if(data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) handleTourFinish() }}
                styles={{ options: { zIndex: 10000, primaryColor: THEME.colors.primary } }}
            />

            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-pop overflow-hidden relative flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Create Learning Module</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-[#D12027]' : 'bg-slate-200'}`}></div>
                            <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-[#D12027]' : 'bg-slate-200'}`}></div>
                            <span className="text-xs text-slate-500 ml-2">Step {step} of 2</span>
                        </div>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
                </div>
                
                <div className="p-6 md:p-8 overflow-y-auto flex-1">
                    {step === 1 ? (
                        <div className="tour-modal-step1 space-y-5 animate-slideInRight">
                            <Input label="Course Title" placeholder="e.g. Advanced Baking Techniques" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} icon={BookOpen} />
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-red-100">
                                        <option>Mandatory</option><option>Soft Skill</option><option>Technical</option><option>Managerial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Target Audience</label>
                                    <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-red-100">
                                        <option>All Staff</option><option>Frontliner</option><option>Manager</option><option>Kitchen Staff</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Description & Outcomes</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none h-32 resize-none text-sm" placeholder="Describe what the learner will achieve..."/>
                            </div>
                        </div>
                    ) : (
                        <div className="tour-modal-step2 space-y-5 animate-slideInRight">
                            <div className="grid grid-cols-2 gap-5">
                                <Input label="Est. Duration" placeholder="e.g. 2h 30m" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} icon={Clock} />
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Content Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-red-100">
                                        <option>Video Lesson</option><option>Interactive SCORM</option><option>Document / PDF</option><option>Quiz Assessment</option>
                                    </select>
                                </div>
                            </div>
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <Download size={28} className="text-[#D12027]"/>
                                </div>
                                <p className="font-bold text-slate-700">Upload Course Material</p>
                                <p className="text-xs text-slate-400 mt-1">Drag & drop files or <span className="text-[#D12027] hover:underline">Browse</span></p>
                                <p className="text-[10px] text-slate-400 mt-2">MP4, PDF, SCORM (Max 50MB)</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-between bg-slate-50">
                    {step === 2 ? 
                        <Button variant="secondary" onClick={() => setStep(1)} icon={ChevronLeft}>Back</Button> : 
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    }
                    {step === 1 ? 
                        <Button onClick={() => setStep(2)}>Next Step <ChevronRight size={18} className="ml-2"/></Button> : 
                        <Button onClick={handleSubmit} icon={FileCheck}>Create Draft</Button>
                    }
                </div>
                <button onClick={() => setRunModalTour(true)} className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"><HelpCircle size={12}/> Guide Me</button>
            </div>
        </div>
    );
};

// ==========================================
// 6. MAIN PAGE COMPONENTS
// ==========================================

// --- EMPLOYEES PAGE (WITH ADVANCED TABLE) ---
const EmployeeManager = ({ employees, courses, onAddEmployee, addToast }) => {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ dept: 'All', role: 'All', status: 'All' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Derived Data Logic (Filtering & Sorting)
  const filteredData = useMemo(() => {
    let data = employees.filter(e => 
      (e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.dept === 'All' || e.dept === filters.dept) &&
      (filters.role === 'All' || e.role === filters.role) &&
      (filters.status === 'All' || e.compliance === filters.status)
    );

    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [employees, searchTerm, filters, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const handleNewEmployee = (emp) => {
      onAddEmployee(emp);
      addToast(`Successfully added ${emp.name}`, 'success');
  }

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-140px)] gap-6 animate-fadeIn pb-20 lg:pb-0">
      {/* LEFT: LIST VIEW */}
      <div className={`w-full ${selectedEmp ? 'hidden lg:flex lg:w-2/3' : 'flex'} bg-white rounded-2xl shadow-sm border border-slate-200 flex-col transition-all duration-300`}>
        {/* Header & Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div><h3 className="font-bold text-lg text-slate-800">Employee Directory</h3><p className="text-sm text-slate-500">{filteredData.length} active personnel found</p></div>
                <Button onClick={() => setAddModalOpen(true)} icon={Plus} size="sm" className="tour-emp-add">Add New</Button>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 tour-emp-search">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search name or email..." className="w-full pl-9 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 transition-shadow" />
                </div>
                <select value={filters.dept} onChange={e => setFilters({...filters, dept: e.target.value})} className="p-2 border border-slate-200 rounded-xl text-sm bg-white outline-none">
                    <option value="All">All Depts</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="p-2 border border-slate-200 rounded-xl text-sm bg-white outline-none">
                    <option value="All">All Status</option><option>Compliant</option><option>At Risk</option><option>Non-Compliant</option>
                </select>
            </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0 tour-emp-table">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                    {['Employee', 'Role', 'Progress', 'Compliance', 'Action'].map(head => (
                        <th key={head} onClick={() => handleSort(head.toLowerCase())} className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 transition-colors select-none group">
                            <div className="flex items-center gap-1">{head} {sortConfig.key === head.toLowerCase() && (sortConfig.direction === 'asc' ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}</div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? paginatedData.map((emp) => (
                <tr key={emp.id} className={`hover:bg-slate-50 transition-colors cursor-pointer group ${selectedEmp?.id === emp.id ? 'bg-red-50' : ''}`} onClick={() => setSelectedEmp(emp)}>
                  <td className="p-4">
                      <div className="flex items-center gap-3">
                          <img src={emp.avatar} className="w-9 h-9 rounded-full bg-slate-200 border border-slate-100" alt="" />
                          <div><p className="font-bold text-slate-800 text-sm group-hover:text-[#D12027] transition-colors">{emp.name}</p><p className="text-[10px] text-slate-500">{emp.id}</p></div>
                      </div>
                  </td>
                  <td className="p-4"><Badge type="outline">{emp.dept}</Badge><p className="text-xs text-slate-500 mt-1">{emp.role}</p></td>
                  <td className="p-4 w-40">
                      <div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-slate-700">{emp.progress}%</span></div>
                      <ProgressBar value={emp.progress} color={emp.progress < 50 ? 'bg-red-500' : 'bg-[#D12027]'} height="h-1.5" />
                  </td>
                  <td className="p-4"><StatusBadge status={emp.compliance} /></td>
                  <td className="p-4"><button className="p-2 text-slate-400 hover:text-[#D12027] hover:bg-red-50 rounded-lg transition-all"><ChevronRight size={16} /></button></td>
                </tr>
              )) : (
                  <tr><td colSpan="5"><EmptyState icon={Users} title="No employees found" description="Try adjusting your filters or search query." /></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-2xl">
            <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} icon={ChevronLeft}></Button>
                <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} icon={ChevronRight}></Button>
            </div>
        </div>
      </div>

      {/* RIGHT: DETAIL VIEW (SLIDING PANEL) */}
      {selectedEmp ? (
        <div className={`fixed inset-0 lg:static lg:w-1/3 bg-white lg:rounded-2xl shadow-xl border-l lg:border border-slate-200 flex flex-col z-50 animate-slideInRight lg:animate-slideIn`}>
          {/* Mobile Header */}
          <div className="h-16 flex items-center px-4 border-b border-slate-100 lg:hidden bg-white">
              <button onClick={() => setSelectedEmp(null)} className="flex items-center gap-2 text-slate-500 font-bold"><ArrowLeft size={20}/> Back to List</button>
          </div>
          
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-br from-[#D12027] to-[#801318]">
              <button onClick={() => setSelectedEmp(null)} className="hidden lg:block absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 rounded-full p-1.5 backdrop-blur-sm transition-all"><X size={16}/></button>
              <div className="absolute -bottom-10 left-6">
                  <div className="relative">
                      <img src={selectedEmp.avatar} className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md" alt=""/>
                      <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${selectedEmp.progress > 50 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
              </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="pt-12 px-6 pb-6 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{selectedEmp.name}</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedEmp.role}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedEmp.branch}</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <Card noPadding className="p-3 bg-slate-50 border-slate-100 text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Assigned</p>
                    <p className="text-2xl font-black text-slate-800">{selectedEmp.courses_assigned}</p>
                </Card>
                <Card noPadding className="p-3 bg-slate-50 border-slate-100 text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Completed</p>
                    <p className="text-2xl font-black text-[#D12027]">{selectedEmp.courses_completed}</p>
                </Card>
            </div>

            {/* Performance Mini Chart */}
            <div className="mb-6">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><BarChart2 size={16}/> Performance Trend</h4>
                <div className="h-32 w-full bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[{m:'Jan',s:65},{m:'Feb',s:70},{m:'Mar',s:68},{m:'Apr',s:75},{m:'May',s:selectedEmp.performance_score}]}>
                            <Line type="monotone" dataKey="s" stroke="#D12027" strokeWidth={2} dot={{r:3}} />
                            <Tooltip contentStyle={{fontSize:'12px', borderRadius:'8px'}}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Contact Details</h4>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Mail size={16}/></div>
                    <span className="truncate">{selectedEmp.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0"><Phone size={16}/></div>
                    <span>{selectedEmp.phone}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3 pb-8 lg:pb-0 sticky bottom-0 bg-white pt-2">
               <Button fullWidth icon={Plus} onClick={() => addToast('Simulating assignment workflow...', 'info')}>Assign New Course</Button>
               <Button fullWidth variant="secondary" icon={Edit3}>Edit Profile</Button>
               <Button fullWidth variant="danger" icon={Trash2} onClick={() => { addToast(`${selectedEmp.name} deleted`, 'error'); setSelectedEmp(null); }}>Remove Employee</Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State for Right Panel (Desktop) */
        <div className="hidden lg:flex lg:w-1/3 bg-slate-50 rounded-2xl border border-slate-200 border-dashed items-center justify-center flex-col text-slate-400 p-8 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <UserCheck size={40} className="text-slate-300"/>
            </div>
            <h3 className="font-bold text-slate-600 text-lg">No Employee Selected</h3>
            <p className="text-sm max-w-[200px]">Select a row from the directory to view detailed profile and performance metrics.</p>
        </div>
      )}

      <AddEmployeeModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleNewEmployee} />
    </div>
  );
};

// ==========================================
// 7. DASHBOARD OVERVIEW & ANALYTICS
// ==========================================

const DashboardOverview = ({ analyticsTrigger, addToast }) => (
  <div className="space-y-6 animate-fadeIn pb-20">
    {/* KPI CARDS */}
    <div className="tour-stats-overview grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[{ title: 'Total Learners', value: '342', sub: '+12 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'up' }, 
        { title: 'Avg Completion', value: '78%', sub: '+2.4% vs last mo', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', trend: 'up' }, 
        { title: 'Pending Requests', value: '8', sub: 'Action Needed', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: 'neutral' }, 
        { title: 'At Risk Users', value: '14', sub: 'Non-compliant', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', trend: 'down' }]
        .map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 card-hover group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
                <kpi.icon size={80} className={kpi.color.replace('text-', 'text-')} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} shadow-sm`}><kpi.icon size={24} /></div>
                {kpi.trend === 'up' ? <div className="flex text-green-500 text-xs font-bold items-center bg-green-50 px-2 py-1 rounded-full"><ArrowUp size={10}/> 2.4%</div> : 
                 kpi.trend === 'down' ? <div className="flex text-red-500 text-xs font-bold items-center bg-red-50 px-2 py-1 rounded-full"><ArrowDown size={10}/> 1.1%</div> : null}
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1 relative z-10">{kpi.value}</h3>
            <p className="text-slate-500 text-sm font-medium relative z-10">{kpi.title}</p>
            <p className={`text-xs mt-2 font-medium ${kpi.sub.includes('Action') || kpi.sub.includes('Non') ? 'text-red-500' : 'text-slate-400'} relative z-10`}>{kpi.sub}</p>
          </div>
      ))}
    </div>

    {/* MAIN CHARTS AREA */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Chart */}
      <div className="tour-activity-chart lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Learning Activity Trends</h3>
                <p className="text-xs text-slate-500">Total learning hours per week across all branches.</p>
              </div>
              <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-bold bg-slate-100 rounded-lg text-slate-600">Weekly</button>
                  <button className="px-3 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600">Monthly</button>
              </div>
          </div>
          <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ name: 'Mon', hours: 40 }, { name: 'Tue', hours: 65 }, { name: 'Wed', hours: 50 }, { name: 'Thu', hours: 85 }, { name: 'Fri', hours: 60 }, { name: 'Sat', hours: 30 }, { name: 'Sun', hours: 20 }]}>
                      <defs>
                          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D12027" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#D12027" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} cursor={{stroke: '#cbd5e1', strokeDasharray: '5 5'}}/>
                      <Area type="monotone" dataKey="hours" stroke="#D12027" fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} activeDot={{r: 6, strokeWidth: 0}} />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>

      {/* Completion Donut & Stats */}
      <div className="tour-dept-progress bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Completion Status</h3>
          <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie data={[{name: 'Done', value: 75}, {name: 'Pending', value: 25}]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          <Cell fill="#10b981" />
                          <Cell fill="#f1f5f9" />
                      </Pie>
                  </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-800">75%</span>
                  <span className="text-xs text-slate-400 font-bold uppercase">Overall</span>
              </div>
          </div>
          <div className="space-y-4 mt-4 flex-1">
               {[{ name: 'Frontliner', val: 85 }, { name: 'Kitchen', val: 72 }, { name: 'Operational', val: 95 }].map((dept) => (
                   <div key={dept.name}>
                       <div className="flex justify-between text-xs mb-1">
                           <span className="font-medium text-slate-600">{dept.name}</span>
                           <span className="font-bold text-slate-800">{dept.val}%</span>
                       </div>
                       <ProgressBar value={dept.val} color={dept.val > 80 ? "bg-green-500" : "bg-yellow-500"} height="h-1.5" />
                   </div>
               ))}
          </div>
          <Button fullWidth variant="outline" className="mt-6 tour-dashboard-analytics-btn" onClick={analyticsTrigger} icon={PieIcon}>Detailed Analysis</Button>
      </div>
    </div>
  </div>
);

// ==========================================
// 8. APP SHELL & NAVIGATION
// ==========================================

const AdminApp = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  
  // Custom Toast System Hook
  const { toasts, addToast, removeToast } = useToast();

  // --- TUTORIAL CONFIGURATION (JOYRIDE) ---
  const [runTour, setRunTour] = useState(false);
  
  const tourSteps = useMemo(() => {
    const commonSteps = [
        { target: '.tour-sidebar', content: 'Main Navigation: Gunakan sidebar ini untuk mengakses modul HR yang berbeda (Employee, Curriculum, dll).', placement: 'right' }
    ];
    
    switch(activeView) {
        case 'dashboard':
            return [
                { target: 'body', content: <div className="text-left"><h4 className="font-bold mb-2">👋 Welcome Admin!</h4><p>Ini adalah Karsa Learning Management System. Mari kita lihat ringkasan kesehatan organisasi Anda.</p></div>, placement: 'center' },
                ...commonSteps,
                { target: '.tour-stats-overview', content: 'KPI Cards: Monitor metrik vital secara real-time. Perhatikan kartu "At Risk Users" untuk intervensi cepat.', placement: 'bottom' },
                { target: '.tour-activity-chart', content: 'Grafik ini menunjukkan tren jam belajar total per minggu.', placement: 'top' },
                { target: '.tour-dashboard-analytics-btn', content: 'Klik di sini untuk deep dive ke analisa skill gap.', placement: 'top' }
            ];
        case 'employees':
            return [
                { target: '.tour-emp-search', content: 'Smart Search: Filter karyawan berdasarkan Nama atau Email.', placement: 'bottom' },
                { target: '.tour-emp-add', content: 'Tambah karyawan baru ke database di sini.', placement: 'left' },
                { target: '.tour-emp-table', content: 'Klik baris karyawan untuk melihat detail lengkap di panel kanan.', placement: 'top' }
            ];
        default: return [];
    }
  }, [activeView]);

  useEffect(() => {
      const seenKey = `hasSeen_${activeView}_v3`; 
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) setRunTour(true);
  }, [activeView]);

  const handleJoyrideCallback = (data) => {
      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
          setRunTour(false);
          localStorage.setItem(`hasSeen_${activeView}_v3`, 'true');
      }
  };

  const MENUS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Progress', icon: Users },
    { id: 'curriculum', label: 'Curriculum & Assign', icon: BookOpen },
    { id: 'requests', label: 'Training Requests', icon: FileText },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart2 },
  ];

  // Helper Functions for Data Manipulation
  const handleAddEmployee = (newEmp) => setEmployees(prev => [newEmp, ...prev]);
  const handleAddCourse = (newCourse) => setCourses(prev => [newCourse, ...prev]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-800 font-sans selection:bg-red-100 selection:text-red-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
        .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pop { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .card-hover { transition: all 0.2s; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
      `}</style>

      {/* Global Components */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Joyride steps={tourSteps} run={runTour} continuous showSkipButton showProgress callback={handleJoyrideCallback} 
        styles={{ options: { primaryColor: '#D12027', zIndex: 9999, width: 380, arrowColor: '#fff', backgroundColor: '#fff', textColor: '#333' } }} 
      />

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm animate-fadeIn" onClick={() => setIsSidebarOpen(false)}/>}
      
      {/* SIDEBAR */}
      <aside className={`tour-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between lg:justify-start">
           <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-gradient-to-br from-[#D12027] to-[#b91c22] rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                   <span className="text-white font-black text-xl tracking-tighter">K</span>
               </div>
               <div><h1 className="font-bold text-lg tracking-tight text-slate-900 leading-tight">KARSA<br/><span className="text-[#D12027] text-xs font-bold uppercase tracking-widest">Admin</span></h1></div>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={24} /></button>
        </div>
        
        <nav className="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {MENUS.map((menu) => (
            <button key={menu.id} onClick={() => { setActiveView(menu.id); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${activeView === menu.id ? 'bg-red-50 text-[#D12027]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <div className="flex items-center gap-3 relative z-10">
                  <menu.icon size={20} className={`transition-colors ${activeView === menu.id ? 'text-[#D12027]' : 'text-slate-400 group-hover:text-slate-600'}`}/>
                  {menu.label}
              </div>
              {activeView === menu.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D12027] rounded-l-xl"></div>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
           <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
               <p className="text-xs font-bold text-slate-300 mb-1">Pro Status</p>
               <p className="text-sm font-bold mb-3">Enterprise Plan</p>
               <div className="w-full bg-white/20 h-1.5 rounded-full mb-1"><div className="w-3/4 bg-[#D12027] h-full rounded-full"></div></div>
               <p className="text-[10px] text-slate-400">75% Storage Used</p>
           </div>
           <div className="mt-4 flex items-center justify-between px-2">
               <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs font-bold text-slate-500 hover:text-[#D12027] transition-colors">Reset Tour</button>
               <button className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-xs font-bold"><LogOut size={14}/> Sign Out</button>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen relative w-full overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Menu size={24}/></button>
              <span className="font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</span>
          </div>
          
          {/* Breadcrumb (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
              <span className="cursor-pointer hover:text-[#D12027] font-medium flex items-center gap-1"><LayoutDashboard size={14}/> Home</span>
              <ChevronRight size={14} className="text-slate-300"/>
              <span className="font-bold text-slate-800 capitalize bg-slate-100 px-2 py-0.5 rounded-md">{activeView.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={() => setRunTour(true)} className="hidden md:flex text-sm font-bold text-[#D12027] bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-colors items-center gap-2">
                <HelpCircle size={16}/> Help
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors group">
                <Bell size={20} className="group-hover:text-slate-600"/>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#D12027] rounded-full border border-white animate-pulse"></span>
            </button>
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors group">
                <Settings size={20} className="group-hover:text-slate-600"/>
            </button>
            
            <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-colors">
               <div className="text-right hidden md:block leading-tight">
                   <p className="text-sm font-bold text-slate-800">Admin HR</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Superadmin</p>
               </div>
               <div className="w-9 h-9 lg:w-10 lg:h-10 bg-slate-900 rounded-full text-white flex items-center justify-center font-bold border-2 border-slate-100 shadow-sm text-sm">HR</div>
            </div>
          </div>
        </header>

        {/* CONTENT SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth w-full bg-[#f8fafc]">
           <div className="max-w-7xl mx-auto">
             {/* Dynamic Page Header */}
             <div className="hidden lg:flex mb-8 justify-between items-end animate-fadeIn">
               <div>
                   <h2 className="text-3xl font-bold text-slate-800 mb-2 capitalize tracking-tight flex items-center gap-3">
                       {activeView === 'dashboard' ? 'Executive Dashboard' : activeView.replace('-', ' ')}
                   </h2>
                   <p className="text-slate-500 text-lg">Manage your organization's learning ecosystem and performance.</p>
               </div>
               {activeView === 'dashboard' && (
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                       <Calendar size={16} className="text-[#D12027]"/> Today: {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </div>
               )}
             </div>

             {/* View Rendering */}
             {activeView === 'dashboard' && <DashboardOverview analyticsTrigger={() => setActiveView('analytics')} addToast={addToast} />}
             {activeView === 'employees' && <EmployeeManager employees={employees} courses={courses} onAddEmployee={handleAddEmployee} addToast={addToast} />}
             
             {/* Placeholder for other views to maintain structure */}
             {(activeView === 'curriculum' || activeView === 'requests' || activeView === 'analytics') && (
                 <EmptyState 
                    icon={Briefcase} 
                    title="Module Under Construction" 
                    description="We are adding detailed features to this module to match the complexity of the Employee Manager."
                    action={<Button onClick={() => setActiveView('dashboard')} variant="outline">Return Home</Button>} 
                 />
             )}
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminApp;