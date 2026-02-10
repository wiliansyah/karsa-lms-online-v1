/**
 * @file AdminApp.js
 * @description Main Entry Point for KARSA LMS Dashboard.
 * * Includes:
 * - Context-Aware Tutorial Engine (Joyride)
 * - Complex State Management for LMS Data
 * - Interactive Data Visualization (Recharts)
 * - Atomic UI Components
 * * @author Senior Frontend Specialist
 * @version 2.0.0 (Production-Ready)
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Download, Award, DollarSign, Briefcase, GraduationCap,
  PieChart as PieIcon, MapPin, X, LogOut,
  Eye, Layers, Menu, ArrowLeft, Target,
  FileCheck, PlayCircle, ToggleLeft, ToggleRight,
  Filter, ArrowUp, ArrowDown, HelpCircle, Save
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Joyride, { STATUS, EVENTS, LIFECYCLE } from 'react-joyride';

// ==========================================
// 1. CONSTANTS & THEME CONFIGURATION
// ==========================================

const THEME = {
  colors: {
    primary: "#D12027",      // Karsa Red
    primaryDark: "#b91c22",
    primaryLight: "#fef2f2",
    secondary: "#FDB913",    // Karsa Yellow
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    dark: "#0f172a",
    slate: "#64748b",
    border: "#e2e8f0",
    bg: "#f8fafc"
  },
  fonts: {
    body: "'Inter', sans-serif"
  }
};

/**
 * Global CSS Styles injected into the head.
 * Handles animations, scrollbars, and utility classes not covered by Tailwind.
 */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { font-family: ${THEME.fonts.body}; background-color: ${THEME.colors.bg}; color: #334155; -webkit-font-smoothing: antialiased; }
    
    /* Animations */
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pop { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* Utility Classes */
    .card-hover { transition: all 0.2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    
    .btn-primary {
      background: ${THEME.colors.primary}; color: white;
      transition: all 0.2s;
    }
    .btn-primary:hover { background: ${THEME.colors.primaryDark}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(209, 32, 39, 0.3); }
    .btn-primary:active { transform: translateY(0); }

    /* Sidebar Active State */
    .sidebar-active {
      background: linear-gradient(90deg, rgba(209, 32, 39, 0.08) 0%, transparent 100%);
      border-left: 4px solid ${THEME.colors.primary};
      color: ${THEME.colors.primary};
    }
  `}</style>
);

// ==========================================
// 2. MOCK DATA FACTORIES
// ==========================================

const INITIAL_EMPLOYEES = [
  { id: 'E001', name: 'Budi Santoso', role: 'Sales Staff', dept: 'Frontliner', branch: 'Kb. Kawung', progress: 85, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', courses_assigned: 12, courses_completed: 10, email: 'budi.s@kartikasari.com', phone: '0812-3456-7890', joinDate: '2022-01-12' },
  { id: 'E002', name: 'Siska Wijaya', role: 'Store Manager', dept: 'Operational', branch: 'Dago', progress: 92, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siska', courses_assigned: 20, courses_completed: 18, email: 'siska.w@kartikasari.com', phone: '0812-9876-5432', joinDate: '2019-03-05' },
  { id: 'E003', name: 'Andi Pratama', role: 'Head Baker', dept: 'Kitchen', branch: 'Central Kitchen', progress: 45, compliance: 'At Risk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', courses_assigned: 15, courses_completed: 6, email: 'andi.p@kartikasari.com', phone: '0813-4567-8901', joinDate: '2021-08-20' },
  { id: 'E004', name: 'Rina Melati', role: 'Supervisor', dept: 'Frontliner', branch: 'Buah Batu', progress: 78, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', courses_assigned: 18, courses_completed: 14, email: 'rina.m@kartikasari.com', phone: '0811-2345-6789', joinDate: '2020-11-10' },
  { id: 'E005', name: 'Dedi Kusuma', role: 'Logistics', dept: 'Warehouse', branch: 'Central', progress: 60, compliance: 'Non-Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi', courses_assigned: 10, courses_completed: 6, email: 'dedi.k@kartikasari.com', phone: '0856-7890-1234', joinDate: '2023-02-15' },
  { id: 'E006', name: 'Siti Aminah', role: 'Cashier', dept: 'Frontliner', branch: 'Dago', progress: 95, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', courses_assigned: 12, courses_completed: 11, email: 'siti.a@kartikasari.com', phone: '0812-1111-2222', joinDate: '2022-06-01' },
];

const INITIAL_COURSES = [
  { 
    id: 'C01', title: 'Food Safety Standard (HACCP)', category: 'Mandatory', level: 'All Staff', 
    assigned: 150, completed: 120, status: 'Active',
    description: 'Comprehensive guide to Hazard Analysis Critical Control Point for food safety. Covers storage, handling, and serving protocols.',
    duration: '2h 30m', modules_count: 5, type: 'Video & Quiz'
  },
  { 
    id: 'C02', title: 'Service Excellence 2.0', category: 'Soft Skill', level: 'Frontliner', 
    assigned: 80, completed: 45, status: 'Active',
    description: 'Advanced customer service techniques for handling complaints, upselling, and providing premium service.',
    duration: '1h 45m', modules_count: 3, type: 'Video'
  },
  { 
    id: 'C03', title: 'POS System Advanced', category: 'Technical', level: 'Cashier', 
    assigned: 40, completed: 38, status: 'Active',
    description: 'Technical mastery of the Point of Sales system including troubleshooting and daily closing reports.',
    duration: '45m', modules_count: 2, type: 'Interactive'
  },
  { 
    id: 'C04', title: 'Leadership 101', category: 'Managerial', level: 'Manager', 
    assigned: 20, completed: 5, status: 'Draft',
    description: 'Basic leadership principles for new supervisors and managers. Includes conflict resolution and team motivation.',
    duration: '3h 00m', modules_count: 8, type: 'Mixed'
  },
];

const INITIAL_REQUESTS = [
  { id: 'R01', employee: 'Siska Wijaya', title: 'Advanced Latte Art', provider: 'Barista Academy', cost: 2500000, date: '2023-11-20', status: 'Pending', justification: 'To improve premium coffee sales variant at Dago branch.', vendor_details: 'Barista Academy BDG', timeline: '2 Days Workshop', leader_approval: true },
  { id: 'R02', employee: 'Andi Pratama', title: 'Industrial Baking Tech', provider: 'Baking Center JKT', cost: 5000000, date: '2023-11-22', status: 'Approved', justification: 'Efficiency for new oven machine.', vendor_details: 'Baking Center JKT', timeline: '1 Week Certification', leader_approval: true },
  { id: 'R03', employee: 'Team Warehouse', title: 'Safety Driving', provider: 'Internal', cost: 0, date: '2023-12-01', status: 'Rejected', justification: 'Budget constraint for Q4.', vendor_details: 'Internal GA Team', timeline: '1 Day', leader_approval: true },
];

const HISTORY_MOCK = [
  { id: 1, action: 'Completed Module', detail: 'Food Safety (HACCP)', date: 'Oct 24, 2023', score: '95%' },
  { id: 2, action: 'Badge Earned', detail: 'Hygiene Hero', date: 'Oct 24, 2023', score: '-' },
  { id: 3, action: 'Quiz Failed', detail: 'Customer Service Basics', date: 'Oct 20, 2023', score: '45%' },
  { id: 4, action: 'Started Course', detail: 'Product Knowledge: Bolen', date: 'Oct 15, 2023', score: '-' },
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
// 3. ATOMIC UI COMPONENTS
// ==========================================

/**
 * Standard Status Badge with varied semantic colors.
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

const ProgressBar = ({ value, colorClass = "bg-blue-600", showLabel = false }) => (
  <div className="flex items-center gap-2 w-full">
    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${value}%` }}></div>
    </div>
    {showLabel && <span className="text-xs font-bold text-slate-600 w-8 text-right">{value}%</span>}
  </div>
);

/**
 * Reusable Form Input with Validation Styling
 */
const InputField = ({ label, value, onChange, placeholder, type = "text", error, required = false, icon: Icon }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-slate-500 uppercase">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-3 text-slate-400" />}
      <input 
        type={type}
        value={value} 
        onChange={onChange} 
        className={`w-full p-2.5 ${Icon ? 'pl-9' : ''} border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-100 bg-red-50' : 'border-slate-200 focus:ring-red-100'}`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><XCircle size={10}/> {error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options, error, required = false }) => (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-500 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select 
          value={value} 
          onChange={onChange} 
          className={`w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-red-100'}`}
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
            <ChevronRight size={16} className="rotate-90" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
);

// ==========================================
// 4. CUSTOM HOOKS
// ==========================================

/**
 * Hook for managing form validation logic.
 */
const useFormValidation = (initialState, validationRules) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setValues(prev => ({ ...prev, [field]: value }));
        // Clear error on change
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;
        Object.keys(validationRules).forEach(key => {
            const rule = validationRules[key];
            if (rule.required && !values[key]) {
                newErrors[key] = 'This field is required';
                isValid = false;
            } else if (rule.pattern && !rule.pattern.test(values[key])) {
                newErrors[key] = rule.message || 'Invalid format';
                isValid = false;
            } else if (rule.min && values[key].length < rule.min) {
                newErrors[key] = `Must be at least ${rule.min} chars`;
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const reset = () => {
        setValues(initialState);
        setErrors({});
    }

    return { values, handleChange, errors, validate, reset, setValues };
};

/**
 * Hook to manage Sorting and Filtering of tabular data.
 */
const useDataGrid = (data, initialSortConfig = { key: 'name', direction: 'asc' }) => {
    const [sortConfig, setSortConfig] = useState(initialSortConfig);
    const [filterText, setFilterText] = useState('');

    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        if (!filterText) return sortedData;
        return sortedData.filter(item => 
            Object.values(item).some(val => 
                String(val).toLowerCase().includes(filterText.toLowerCase())
            )
        );
    }, [sortedData, filterText]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return { items: filteredData, requestSort, sortConfig, filterText, setFilterText };
};

// ==========================================
// 5. COMPLEX MODALS WITH CONTEXT AWARENESS
// ==========================================

const AddEmployeeModal = ({ isOpen, onClose, onSave }) => {
    const { values, handleChange, errors, validate, reset } = useFormValidation(
        { name: '', role: '', dept: 'Frontliner', email: '', phone: '' },
        {
            name: { required: true, min: 3 },
            email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            role: { required: true },
            phone: { required: true, pattern: /^[0-9\-\+]{9,15}$/, message: 'Invalid phone number' }
        }
    );

    useEffect(() => { if (!isOpen) reset(); }, [isOpen]);

    const handleSubmit = () => {
        if (validate()) {
            onSave({
                ...values, id: `E${Math.floor(Math.random() * 10000)}`,
                progress: 0, compliance: 'Compliant', courses_assigned: 0, courses_completed: 0,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
                joinDate: new Date().toISOString().split('T')[0]
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div id="modal-add-employee" className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop border border-slate-100">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">New Employee Onboarding</h3>
                        <p className="text-xs text-slate-500">Create profile & assign default learning path</p>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500 transition-colors"/></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <InputField label="Full Name" value={values.name} onChange={e => handleChange('name', e.target.value)} error={errors.name} placeholder="e.g. John Doe" required />
                    <InputField label="Email Address" value={values.email} onChange={e => handleChange('email', e.target.value)} error={errors.email} placeholder="john@company.com" icon={FileText} required />
                    <InputField label="Phone Number" value={values.phone} onChange={e => handleChange('phone', e.target.value)} error={errors.phone} placeholder="0812-xxxx-xxxx" required />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Department" value={values.dept} onChange={e => handleChange('dept', e.target.value)} options={['Frontliner', 'Kitchen', 'Operational', 'Warehouse', 'Office']} />
                        <InputField label="Job Role" value={values.role} onChange={e => handleChange('role', e.target.value)} error={errors.role} placeholder="e.g. Supervisor" required />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3 text-xs text-blue-700">
                        <HelpCircle size={16} className="shrink-0 mt-0.5" />
                        <p>User will receive an automated email with login credentials and a link to the "New Hire Orientation" module.</p>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                    <button id="btn-save-employee" onClick={handleSubmit} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg shadow-lg flex items-center gap-2">
                        <Save size={16}/> Save & Invite
                    </button>
                </div>
            </div>
        </div>
    );
};

const CourseDetailModal = ({ course, isOpen, onClose, onToggleStatus }) => {
    if(!isOpen || !course) return null;
    const isActive = course.status === 'Active';

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div id="modal-course-detail" className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-pop overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header with Parallax-like effect */}
                <div className="bg-slate-900 text-white p-6 relative shrink-0 overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#D12027] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-40"></div>
                     <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold border border-white/20 mb-2 inline-block backdrop-blur-md">{course.category}</span>
                            <h2 className="text-2xl font-bold tracking-tight">{course.title}</h2>
                            <p className="text-slate-300 text-sm mt-2 flex items-center gap-4">
                                <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                                <span className="flex items-center gap-1"><Layers size={14}/> {course.modules_count} Modules</span>
                                <span className="flex items-center gap-1"><Users size={14}/> {course.level}</span>
                            </p>
                        </div>
                        <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>
                     </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-3 text-lg">Course Description</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{course.description || 'No description provided.'}</p>
                            </div>
                            
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 text-lg">Curriculum</h3>
                                    <button className="text-xs font-bold text-[#D12027] hover:underline">Edit Content</button>
                                </div>
                                <div className="space-y-3">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="group flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all hover:border-red-100">
                                            <div className="w-10 h-10 bg-slate-100 text-slate-500 group-hover:bg-[#D12027] group-hover:text-white rounded-lg flex items-center justify-center font-bold text-sm transition-colors">0{i}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-700 group-hover:text-[#D12027] transition-colors">Introduction to {course.title}</p>
                                                <p className="text-xs text-slate-400">Video Lesson • 15 mins</p>
                                            </div>
                                            <PlayCircle size={20} className="text-slate-300 group-hover:text-[#D12027]"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div id="course-actions-panel" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-0">
                                <h3 className="font-bold text-slate-800 mb-4">Management Actions</h3>
                                
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Visibility</span>
                                        <StatusBadge status={course.status} />
                                    </div>
                                    <p className="text-xs text-slate-400 mb-4">
                                        {isActive ? 'Visible to all assigned employees.' : 'Hidden from student dashboard.'}
                                    </p>
                                    <button 
                                        onClick={() => onToggleStatus(course.id)} 
                                        className={`w-full py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'}`}
                                    >
                                        {isActive ? <><ToggleRight size={18}/> Deactivate</> : <><ToggleLeft size={18}/> Publish Course</>}
                                    </button>
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Enrolled</span>
                                        <span className="font-bold text-slate-800">{course.assigned} Users</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Avg. Score</span>
                                        <span className="font-bold text-green-600">88%</span>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Completion Rate</span>
                                            <span className="font-bold text-slate-800">{Math.round((course.completed/course.assigned)*100)}%</span>
                                        </div>
                                        <ProgressBar value={Math.round((course.completed/course.assigned)*100)} colorClass="bg-[#D12027]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 6. MAIN VIEW COMPONENTS
// ==========================================

const EmployeeManager = ({ employees, onAddEmployee }) => {
    const { items, requestSort, sortConfig, filterText, setFilterText } = useDataGrid(employees);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    // Sorting Indicator Component
    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <div className="w-4" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-[#D12027]" /> : <ArrowDown size={14} className="text-[#D12027]" />;
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fadeIn pb-20 lg:pb-0">
             {/* Toolbar */}
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Directory</h3>
                    <p className="text-sm text-slate-500">Manage {employees.length} registered employees</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                    <div id="tour-emp-search" className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                        <input 
                            value={filterText} 
                            onChange={e => setFilterText(e.target.value)} 
                            placeholder="Search by name, role..." 
                            className="w-full md:w-64 pl-9 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" 
                        />
                    </div>
                    <button 
                        id="tour-emp-add"
                        onClick={() => setAddModalOpen(true)} 
                        className="btn-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold"
                    >
                        <Plus size={16}/> <span className="whitespace-nowrap">Add Employee</span>
                    </button>
                </div>
             </div>

             {/* Data Grid */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table id="tour-emp-table" className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                            <tr>
                                <th onClick={() => requestSort('name')} className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 transition-colors select-none"><div className="flex items-center gap-2">Employee <SortIcon columnKey="name"/></div></th>
                                <th onClick={() => requestSort('role')} className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 transition-colors select-none"><div className="flex items-center gap-2">Role & Dept <SortIcon columnKey="role"/></div></th>
                                <th onClick={() => requestSort('progress')} className="p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 transition-colors select-none"><div className="flex items-center gap-2">Learning Progress <SortIcon columnKey="progress"/></div></th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Compliance</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((emp) => (
                                <tr key={emp.id} onClick={() => setSelectedEmp(emp)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={emp.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" alt="" />
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm group-hover:text-[#D12027] transition-colors">{emp.name}</p>
                                                <p className="text-[11px] text-slate-400 font-mono">{emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-slate-700 font-medium">{emp.role}</p>
                                        <p className="text-xs text-slate-500">{emp.dept} • {emp.branch}</p>
                                    </td>
                                    <td className="p-4 w-64">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-slate-700">{emp.courses_completed}/{emp.courses_assigned} Mods</span>
                                            <span className="text-xs font-bold text-slate-500">{emp.progress}%</span>
                                        </div>
                                        <ProgressBar value={emp.progress} colorClass={emp.progress < 50 ? 'bg-red-500' : emp.progress < 80 ? 'bg-yellow-500' : 'bg-[#D12027]'} />
                                    </td>
                                    <td className="p-4"><StatusBadge status={emp.compliance} /></td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-[#D12027] hover:bg-red-50 rounded-full transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search size={32} className="text-slate-300"/>
                                            <p className="text-sm">No employees match your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
                    <span>Showing {items.length} of {employees.length} entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">Next</button>
                    </div>
                </div>
             </div>

             <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSave={onAddEmployee} />
        </div>
    );
};

// ==========================================
// 7. MAIN LAYOUT & TOUR CONTROLLER
// ==========================================

const AdminApp = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
    const [courses, setCourses] = useState(INITIAL_COURSES);
    const [modalState, setModalState] = useState({ type: null, data: null }); // 'ADD_EMP', 'COURSE_DETAIL', etc.

    // --- CONTEXT-AWARE TOUR ENGINE ---
    const [tourState, setTourState] = useState({
        run: false,
        steps: [],
        stepIndex: 0
    });

    /**
     * The Brain of the Tutorial System.
     * Generates steps dynamically based on:
     * 1. Active View (Dashboard vs Employees vs Curriculum)
     * 2. Active Modal (Is the user trying to Add Employee?)
     */
    const updateTourContext = useCallback(() => {
        let steps = [];

        // CASE A: User is in a Modal
        if (modalState.type === 'ADD_EMP') {
            steps = [
                {
                    target: '#modal-add-employee',
                    content: 'This is the Onboarding Form. It does more than just add data.',
                    placement: 'center',
                    disableBeacon: true,
                },
                {
                    target: 'input[placeholder="john@company.com"]',
                    content: 'Entering the email here triggers an automatic invitation sent to the employee via SendGrid.',
                    placement: 'right',
                },
                {
                    target: '#btn-save-employee',
                    content: 'Clicking Save will also assign the "General Orientation" learning path automatically.',
                    placement: 'top',
                }
            ];
        } 
        else if (modalState.type === 'COURSE_DETAIL') {
            steps = [
                {
                    target: '#modal-course-detail',
                    content: 'This is the Course Control Center. Manage content and visibility here.',
                    placement: 'right',
                },
                {
                    target: '#course-actions-panel',
                    content: 'Use these controls to publish the course or track real-time engagement metrics.',
                    placement: 'left',
                }
            ];
        }
        // CASE B: User is on a Main Page
        else {
            const commonSteps = [
                { target: '#sidebar-nav', content: 'Navigate between modules using this sidebar.', placement: 'right' },
            ];

            switch(activeView) {
                case 'dashboard':
                    steps = [
                        { target: 'body', placement: 'center', content: <div className="text-center"><strong>Welcome to KARSA LMS Admin!</strong><br/>Let's take a quick tour of your new command center.</div> },
                        ...commonSteps,
                        { target: '#kpi-grid', content: 'These cards show live health metrics of your training ecosystem.', placement: 'bottom' },
                        { target: '#chart-activity', content: 'Track learning hours over time to identify peak usage days.', placement: 'top' }
                    ];
                    break;
                case 'employees':
                    steps = [
                        { target: '#tour-emp-table', content: 'This is the master employee database.', placement: 'top' },
                        { target: '#tour-emp-search', content: 'Use real-time search to find staff across branches.', placement: 'bottom' },
                        { target: '#tour-emp-add', content: 'Click here to onboard new staff. (Try clicking it now!)', placement: 'left' }
                    ];
                    break;
                default:
                    steps = commonSteps;
            }
        }

        setTourState(prev => ({ ...prev, steps, run: true, stepIndex: 0 }));
    }, [activeView, modalState.type]);

    // Trigger tour update when context changes
    useEffect(() => {
        // Only auto-start tour if not seen before (mocked with session storage for demo)
        // For demo purposes, we restart tour on view change to show capabilities
        updateTourContext(); 
    }, [updateTourContext]);

    // Handlers
    const handleAddEmployee = (data) => {
        setEmployees(prev => [data, ...prev]);
        setModalState({ type: null }); // Close modal
    };

    const handleJoyrideCallback = (data) => {
        const { status, type } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setTourState(prev => ({ ...prev, run: false }));
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
            <GlobalStyles />
            
            <Joyride
                steps={tourState.steps}
                run={tourState.run}
                stepIndex={tourState.stepIndex}
                continuous={true}
                showSkipButton={true}
                showProgress={true}
                styles={{
                    options: {
                        primaryColor: THEME.colors.primary,
                        textColor: '#334155',
                        zIndex: 10000,
                    },
                    tooltip: {
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    },
                    buttonNext: {
                        fontWeight: 700,
                        borderRadius: '8px',
                        fontSize: '12px',
                        padding: '8px 16px'
                    }
                }}
                callback={handleJoyrideCallback}
            />

            {/* Sidebar */}
            <aside id="sidebar-nav" className="w-64 bg-white border-r border-slate-200 flex flex-col z-40 hidden lg:flex">
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <div className="w-8 h-8 bg-[#D12027] rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-black text-lg">K</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-tight">KARSA<br/><span className="text-[#D12027] text-xs font-bold uppercase tracking-wider">Admin</span></h1>
                    </div>
                </div>
                <nav className="flex-1 py-6 space-y-1">
                    {[
                        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                        { id: 'employees', label: 'Employees', icon: Users },
                        { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                    ].map(menu => (
                        <button 
                            key={menu.id} 
                            onClick={() => { setActiveView(menu.id); setModalState({ type: null }); }}
                            className={`w-full flex items-center gap-3 px-8 py-3.5 text-sm font-medium transition-all ${activeView === menu.id ? 'sidebar-active' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            <menu.icon size={18} className={activeView === menu.id ? 'text-[#D12027]' : 'text-slate-400'}/>
                            {menu.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8 z-30 shrink-0">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium text-slate-400">Admin Portal</span>
                        <ChevronRight size={14}/>
                        <span className="font-bold text-slate-800 capitalize">{activeView}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={updateTourContext} className="flex items-center gap-2 text-sm font-bold text-[#D12027] bg-red-50 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                            <HelpCircle size={16}/> Show Tutorial
                        </button>
                        <div className="w-10 h-10 bg-[#D12027] rounded-full text-white flex items-center justify-center font-bold shadow-md border-2 border-white">HR</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                    <div className="max-w-7xl mx-auto h-full">
                        {activeView === 'dashboard' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div id="kpi-grid" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between mb-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div></div>
                                        <h3 className="text-3xl font-bold text-slate-800">342</h3>
                                        <p className="text-slate-500 text-sm font-medium">Total Learners</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between mb-4"><div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div></div>
                                        <h3 className="text-3xl font-bold text-slate-800">89%</h3>
                                        <p className="text-slate-500 text-sm font-medium">Completion Rate</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between mb-4"><div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock size={24}/></div></div>
                                        <h3 className="text-3xl font-bold text-slate-800">12</h3>
                                        <p className="text-slate-500 text-sm font-medium">Pending Approvals</p>
                                    </div>
                                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between mb-4"><div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24}/></div></div>
                                        <h3 className="text-3xl font-bold text-slate-800">5</h3>
                                        <p className="text-slate-500 text-sm font-medium">At Risk Users</p>
                                    </div>
                                </div>
                                <div id="chart-activity" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-lg text-slate-800 mb-6">Learning Activity Trends</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={[{name:'Mon',v:10},{name:'Tue',v:30},{name:'Wed',v:25},{name:'Thu',v:45},{name:'Fri',v:20}]}>
                                                <defs>
                                                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#D12027" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#D12027" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                                <Area type="monotone" dataKey="v" stroke="#D12027" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeView === 'employees' && (
                            <EmployeeManager 
                                employees={employees} 
                                onAddEmployee={(data) => {
                                    setModalState({ type: 'ADD_EMP' }); // Set modal type first to trigger tour update? 
                                    // Actually, we usually set state to open modal.
                                    setModalState({ type: 'ADD_EMP' }); 
                                }} 
                            />
                        )}
                        
                        {activeView === 'curriculum' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                                {courses.map(course => (
                                    <div key={course.id} onClick={() => setModalState({ type: 'COURSE_DETAIL', data: course })} className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover cursor-pointer group">
                                        <div className="h-40 bg-slate-100 relative">
                                             <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:text-slate-400 transition-colors"><BookOpen size={48}/></div>
                                             <div className="absolute top-4 right-4"><StatusBadge status={course.status}/></div>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-slate-800 text-lg mb-2">{course.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Render Modals based on State */}
            <AddEmployeeModal 
                isOpen={modalState.type === 'ADD_EMP'} 
                onClose={() => setModalState({ type: null })} 
                onSave={handleAddEmployee} 
            />
            <CourseDetailModal 
                isOpen={modalState.type === 'COURSE_DETAIL'} 
                course={modalState.data}
                onClose={() => setModalState({ type: null })}
                onToggleStatus={(id) => {
                     setCourses(prev => prev.map(c => c.id === id ? {...c, status: c.status === 'Active' ? 'Draft' : 'Active'} : c));
                     setModalState(prev => ({ ...prev, data: { ...prev.data, status: prev.data.status === 'Active' ? 'Draft' : 'Active' } }));
                }}
            />
        </div>
    );
};

export default AdminApp;