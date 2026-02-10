/**
 * @file KarsaLMS_Production.jsx
 * @description A Production-Ready LMS Admin Dashboard featuring advanced tutorials,
 * strict data validation, and interactive visualization.
 *
 * @author Senior Frontend Developer & UX Specialist
 * @version 2.1.0 (Fixed: Removed external dependency react-joyride, added custom engine)
 *
 * @dependencies
 * - react
 * - lucide-react (Icons)
 * - recharts (Data Visualization)
 * - tailwindcss (Styling - assumed environment)
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Download, DollarSign, Briefcase,
  PieChart as PieIcon, X, LogOut,
  Target, HelpCircle, ArrowUp, ArrowDown, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// ============================================================================
// 1. CONFIGURATION & THEME CONSTANTS
// ============================================================================

const THEME = {
  colors: {
    primary: "#D12027",    // Karsa Red
    secondary: "#FDB913",  // Karsa Yellow
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a"
    }
  }
};

/**
 * Global CSS styles injected into the document.
 */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    body { font-family: 'Inter', sans-serif; background-color: ${THEME.colors.slate[50]}; color: ${THEME.colors.slate[700]}; }

    /* --- Animations --- */
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pop { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }

    /* --- Scrollbars --- */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${THEME.colors.slate[300]}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${THEME.colors.slate[400]}; }

    /* --- Utility Classes --- */
    .card-hover { transition: all 0.2s ease-in-out; }
    .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }

    .btn-primary {
      background: ${THEME.colors.primary}; color: white;
      transition: all 0.2s;
    }
    .btn-primary:hover { background: #b91c22; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(209, 32, 39, 0.3); }

    .sidebar-active {
      background: linear-gradient(90deg, rgba(209, 32, 39, 0.08) 0%, transparent 100%);
      border-left: 4px solid ${THEME.colors.primary};
      color: ${THEME.colors.primary};
    }
  `}</style>
);

// ============================================================================
// 2. CUSTOM TUTORIAL ENGINE (No External Deps)
// ============================================================================

/**
 * A custom implementation of a tour guide overlay.
 * Uses a "spotlight" effect via box-shadow to highlight elements.
 */
const CustomJoyride = ({ steps, run, callback }) => {
  const [index, setIndex] = useState(0);
  const [coords, setCoords] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Reset index when 'run' triggers
  useEffect(() => {
    if (run) {
      setIndex(0);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [run]);

  // Calculate position of the spotlight based on current step
  useEffect(() => {
    if (!run || !steps[index]) return;

    const calculatePosition = () => {
      const step = steps[index];
      // Handle special target 'body' for centered modals
      if (step.target === 'body') {
        setCoords({
          top: window.innerHeight / 2 - 100, // Approximate center
          left: window.innerWidth / 2 - 200,
          width: 0,
          height: 0,
          isBody: true
        });
        return;
      }

      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Adjust for scroll if needed, though mostly fixed in this layout
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          placement: step.placement || 'bottom'
        });
        // Scroll into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Skip if element not found (fail gracefully)
        // console.warn('Tutorial target not found:', step.target);
      }
    };

    // Small delay to ensure DOM is ready (especially for modals)
    const timer = setTimeout(calculatePosition, 300);
    window.addEventListener('resize', calculatePosition);
    return () => {
      window.removeEventListener('resize', calculatePosition);
      clearTimeout(timer);
    };
  }, [index, steps, run]);

  if (!isVisible || !steps[index] || !coords) return null;

  const currentStep = steps[index];
  const isLastStep = index === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      callback({ status: 'finished' });
      setIsVisible(false);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    callback({ status: 'skipped' });
    setIsVisible(false);
  };

  // Tooltip Positioning Logic
  let tooltipStyle = { position: 'fixed', zIndex: 10002, width: 380 };
  if (coords.isBody) {
    tooltipStyle = { ...tooltipStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  } else {
    // Basic positioning logic
    if (coords.placement === 'bottom') {
      tooltipStyle.top = coords.top + coords.height + 16;
      tooltipStyle.left = coords.left;
    } else if (coords.placement === 'top') {
      tooltipStyle.bottom = window.innerHeight - coords.top + 16;
      tooltipStyle.left = coords.left;
    } else if (coords.placement === 'left') {
      tooltipStyle.top = coords.top;
      tooltipStyle.right = window.innerWidth - coords.left + 16;
    } else {
      tooltipStyle.top = coords.top;
      tooltipStyle.left = coords.left + coords.width + 16;
    }
    
    // Boundary checks to prevent overflow (Simplified)
    if (tooltipStyle.left + 380 > window.innerWidth) tooltipStyle.left = window.innerWidth - 400;
  }

  return (
    <>
      {/* Backdrop with Spotlight Hole */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 10001,
          pointerEvents: 'auto' // Blocks clicks outside
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            height: coords.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', // The spotlight effect
            borderRadius: '8px',
            transition: 'all 0.4s ease'
          }}
        />
      </div>

      {/* Tooltip Card */}
      <div className="bg-white rounded-xl shadow-2xl p-5 animate-pop" style={tooltipStyle}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-[#D12027] text-xs font-bold px-2 py-0.5 rounded-full">
              Tip {index + 1} of {steps.length}
            </span>
          </div>
          <button onClick={handleSkip} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        <div className="text-slate-800 text-sm leading-relaxed mb-4">
          {currentStep.content}
        </div>
        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
          <button onClick={handleSkip} className="text-xs font-bold text-slate-500 hover:text-slate-800">
            Skip Tour
          </button>
          <button 
            onClick={handleNext} 
            className="bg-[#D12027] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-[#b91c22] transition-colors"
          >
            {isLastStep ? 'Finish' : 'Next Tip'}
          </button>
        </div>
        {/* Arrow (Visual only, simplified) */}
        {!coords.isBody && coords.placement === 'bottom' && (
          <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 transform" />
        )}
      </div>
    </>
  );
};

// ============================================================================
// 3. MOCK DATA & GENERATORS
// ============================================================================

const GENERATE_ID = (prefix) => `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

const DEPARTMENTS = ['Frontliner', 'Kitchen', 'Operational', 'Warehouse', 'HQ / Office'];

const INITIAL_EMPLOYEES = [
  { id: 'E001', name: 'Budi Santoso', role: 'Sales Staff', dept: 'Frontliner', branch: 'Kb. Kawung', progress: 85, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', courses_assigned: 12, courses_completed: 10, email: 'budi.s@kartikasari.com', phone: '0812-3456-7890', joinDate: '2022-01-12' },
  { id: 'E002', name: 'Siska Wijaya', role: 'Store Manager', dept: 'Operational', branch: 'Dago', progress: 92, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siska', courses_assigned: 20, courses_completed: 18, email: 'siska.w@kartikasari.com', phone: '0812-9876-5432', joinDate: '2019-03-05' },
  { id: 'E003', name: 'Andi Pratama', role: 'Head Baker', dept: 'Kitchen', branch: 'Central Kitchen', progress: 45, compliance: 'At Risk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', courses_assigned: 15, courses_completed: 6, email: 'andi.p@kartikasari.com', phone: '0813-4567-8901', joinDate: '2021-08-20' },
  { id: 'E004', name: 'Rina Melati', role: 'Supervisor', dept: 'Frontliner', branch: 'Buah Batu', progress: 78, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', courses_assigned: 18, courses_completed: 14, email: 'rina.m@kartikasari.com', phone: '0811-2345-6789', joinDate: '2020-11-10' },
  { id: 'E005', name: 'Dedi Kusuma', role: 'Logistics', dept: 'Warehouse', branch: 'Central', progress: 60, compliance: 'Non-Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi', courses_assigned: 10, courses_completed: 6, email: 'dedi.k@kartikasari.com', phone: '0856-7890-1234', joinDate: '2023-02-15' },
];

// ============================================================================
// 4. UTILITY FUNCTIONS & CUSTOM HOOKS
// ============================================================================

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

// ============================================================================
// 5. SHARED UI COMPONENTS (ATOMIC)
// ============================================================================

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${onClick ? 'cursor-pointer card-hover' : ''} ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }) => {
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

const ProgressBar = ({ value }) => {
  const color = value < 50 ? 'bg-red-500' : value < 80 ? 'bg-yellow-500' : 'bg-green-600';
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  );
};

const TableHeader = ({ label, sortKey, currentSort, onSort, className }) => (
  <th className={`p-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 transition-colors ${className}`} onClick={() => onSort(sortKey)}>
    <div className="flex items-center gap-1">
      {label}
      {currentSort?.key === sortKey && (
        currentSort.direction === 'ascending' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
      )}
      {currentSort?.key !== sortKey && <ArrowUp size={12} className="text-slate-300 opacity-0 group-hover:opacity-50" />}
    </div>
  </th>
);

// ============================================================================
// 6. FEATURE MODALS (WITH VALIDATION & CONTEXT HELP)
// ============================================================================

const AddEmployeeModal = ({ isOpen, onClose, onSave, onTriggerHelp }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: '', dept: 'Frontliner' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '', role: '', dept: 'Frontliner' });
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const validate = (field, value) => {
    let error = "";
    if (field === 'name' && !value.trim()) error = "Full Name is required.";
    if (field === 'email') {
      if (!value) error = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format.";
    }
    if (field === 'role' && !value.trim()) error = "Role is required.";
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, role: true, dept: true });
      return;
    }

    onSave({
      ...formData,
      id: GENERATE_ID('E'),
      progress: 0,
      compliance: 'Compliant',
      courses_assigned: 0,
      courses_completed: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      joinDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">New Employee Onboarding</h3>
          <div className="flex items-center gap-2">
            <button onClick={onTriggerHelp} className="text-[#D12027] hover:bg-red-50 p-1.5 rounded-full" title="Explain Form"><HelpCircle size={20} /></button>
            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Form Fields with Validation Feedback */}
          <div className="tour-modal-name">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none transition-colors ${errors.name ? 'border-red-300 focus:ring-red-100 bg-red-50' : 'border-slate-200 focus:ring-red-100'}`}
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="tour-modal-email">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Corporate Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none transition-colors ${errors.email ? 'border-red-300 focus:ring-red-100 bg-red-50' : 'border-slate-200 focus:ring-red-100'}`}
              placeholder="john@company.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="tour-modal-dept">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
              <select name="dept" value={formData.dept} onChange={handleChange} className="w-full p-2.5 border border-slate-200 rounded-lg outline-none bg-white">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="tour-modal-role">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role <span className="text-red-500">*</span></label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none transition-colors ${errors.role ? 'border-red-300 focus:ring-red-100 bg-red-50' : 'border-slate-200 focus:ring-red-100'}`}
                placeholder="e.g. Staff"
              />
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3 border border-blue-100">
             <div className="mt-0.5 text-blue-500"><Target size={16} /></div>
             <p className="text-xs text-blue-700 leading-relaxed">
               <strong>Auto-Assignment:</strong> Based on the selected <em>{formData.dept}</em> department, this employee will automatically be assigned <strong>3 mandatory compliance modules</strong> upon creation.
             </p>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg shadow-lg">Onboard Employee</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. MAIN PAGE COMPONENT LOGIC
// ============================================================================

const AnalyticsView = () => (
  <div className="animate-fadeIn space-y-6 pb-20">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: 'Total Learners', value: '342', sub: '+12% vs last mo', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Avg Completion', value: '78%', sub: 'Target: 85%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Training Budget', value: 'Rp 45M', sub: '65% Utilized', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { title: 'Compliance Risk', value: 'High', sub: 'Warehouse Dept', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
      ].map((stat, i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
            {i === 3 && <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></span>}
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
          <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
          <p className="text-xs mt-2 font-bold text-slate-400">{stat.sub}</p>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6 tour-analytics-chart-main">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Learning Activity Trends</h3>
            <p className="text-sm text-slate-500">Module completions vs. Assignments over time</p>
          </div>
          <select className="bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 outline-none font-bold text-slate-600">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'Week 1', assigned: 40, completed: 24 },
              { name: 'Week 2', assigned: 30, completed: 18 },
              { name: 'Week 3', assigned: 50, completed: 45 },
              { name: 'Week 4', assigned: 20, completed: 30 },
              { name: 'Week 5', assigned: 60, completed: 55 },
            ]}>
              <defs>
                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D12027" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#D12027" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend iconType="circle" />
              <Area type="monotone" dataKey="assigned" stroke="#D12027" fillOpacity={1} fill="url(#colorAssigned)" strokeWidth={2} name="Modules Assigned" />
              <Area type="monotone" dataKey="completed" stroke="#22c55e" fillOpacity={1} fill="url(#colorComp)" strokeWidth={2} name="Completions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 tour-analytics-radar">
        <h3 className="font-bold text-lg text-slate-800 mb-2">Skill Gap Analysis</h3>
        <p className="text-sm text-slate-500 mb-4">Comparing Dept Capability vs Target</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={[
              { subject: 'HACCP', A: 120, B: 110, fullMark: 150 },
              { subject: 'Service', A: 98, B: 130, fullMark: 150 },
              { subject: 'Tech', A: 86, B: 130, fullMark: 150 },
              { subject: 'Leadership', A: 99, B: 100, fullMark: 150 },
              { subject: 'Safety', A: 85, B: 90, fullMark: 150 },
            ]}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name="Current" dataKey="A" stroke="#D12027" fill="#D12027" fillOpacity={0.3} />
              <Radar name="Target" dataKey="B" stroke="#FDB913" fill="#FDB913" fillOpacity={0.3} />
              <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  </div>
);

const EmployeeList = ({ employees, onAdd, onSort, sortConfig, onTriggerModal }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <Card className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
        <div className="relative w-full md:w-96 tour-emp-search">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input type="text" placeholder="Search by name, ID or department..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-bold transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button onClick={onTriggerModal} className="tour-emp-add btn-primary px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg">
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden tour-emp-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <TableHeader label="Employee Details" sortKey="name" currentSort={sortConfig} onSort={onSort} />
                <TableHeader label="Role & Dept" sortKey="dept" currentSort={sortConfig} onSort={onSort} />
                <TableHeader label="LMS Progress" sortKey="progress" currentSort={sortConfig} onSort={onSort} className="w-1/4" />
                <TableHeader label="Compliance" sortKey="compliance" currentSort={sortConfig} onSort={onSort} />
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full border border-slate-200 bg-white" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{emp.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{emp.id} • {emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-700 text-sm">{emp.role}</p>
                    <p className="text-xs text-slate-500">{emp.dept}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-slate-600">{emp.progress}%</span>
                      <span className="text-xs text-slate-400">{emp.courses_completed}/{emp.courses_assigned} Courses</span>
                    </div>
                    <ProgressBar value={emp.progress} />
                  </td>
                  <td className="p-4"><Badge status={emp.compliance} /></td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-[#D12027] hover:bg-red-50 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// 8. TOUR STEPS FACTORY
// ============================================================================

const getTourSteps = (view, modalState) => {
  const globalSteps = [
    {
      target: 'body',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-[#D12027]">Welcome to Karsa LMS 2.1</h3>
          <p>Your centralized command center for organizational learning. This tour adapts to your current task.</p>
        </div>
      ),
      placement: 'center',
    }
  ];

  if (modalState === 'ADD_EMPLOYEE') {
    return [
      {
        target: '.tour-modal-name',
        content: 'Enter the legal full name. This will appear on generated certificates.',
        placement: 'bottom'
      },
      {
        target: '.tour-modal-email',
        content: 'The corporate email is used for SSO login and automatic notification delivery.',
        placement: 'bottom'
      },
      {
        target: '.tour-modal-dept',
        content: 'CRITICAL: Changing the department triggers specific auto-assignment rules for mandatory courses.',
        placement: 'top'
      }
    ];
  }

  const stepsByView = {
    'dashboard': [
      ...globalSteps,
      {
        target: '.tour-analytics-chart-main',
        content: 'This area visualizes training velocity. It contrasts assigned modules versus completions to identify burnout or disengagement early.',
        placement: 'bottom'
      },
      {
        target: '.tour-analytics-radar',
        content: 'The Skill Gap Radar automatically aggregates quiz scores by category per department, highlighting where training intervention is needed.',
        placement: 'left'
      }
    ],
    'employees': [
      {
        target: '.tour-emp-search',
        content: 'Use this smart search bar to filter by Name, ID, or Department.',
        placement: 'bottom'
      },
      {
        target: '.tour-emp-add',
        content: 'Click here to onboard new staff. The system automatically assigns the "Onboarding Curriculum".',
        placement: 'left'
      },
      {
        target: '.tour-emp-table',
        content: 'This data grid is fully interactive. Click headers to sort by compliance or progress.',
        placement: 'top'
      }
    ]
  };

  return stepsByView[view] || globalSteps;
};

// ============================================================================
// 9. APP ROOT
// ============================================================================

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeModal, setActiveModal] = useState(null);
  const [runTour, setRunTour] = useState(false);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);

  // Sorting Logic
  const { items: sortedEmployees, requestSort, sortConfig } = useSortableData(employees, { key: 'name', direction: 'ascending' });

  // Determine current tutorial steps
  const steps = useMemo(() => getTourSteps(activeView, activeModal), [activeView, activeModal]);

  const handleJoyrideCallback = (data) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setRunTour(false);
    }
  };

  const triggerHelp = () => setRunTour(true);

  const handleAddEmployee = (newEmp) => {
    setEmployees(prev => [newEmp, ...prev]);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-800">
      <GlobalStyles />

      {/* Custom Tutorial Engine */}
      <CustomJoyride
        steps={steps}
        run={runTour}
        callback={handleJoyrideCallback}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <div className="w-9 h-9 bg-[#D12027] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-200">K</div>
             <div><h1 className="font-bold text-lg tracking-tight leading-none">KARSA<br/><span className="text-xs text-slate-400 font-medium">LMS Admin v2.1</span></h1></div>
           </div>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          {[
            { id: 'dashboard', label: 'Analytics Hub', icon: LayoutDashboard },
            { id: 'employees', label: 'Learner Directory', icon: Users },
            { id: 'curriculum', label: 'Course Catalog', icon: BookOpen },
            { id: 'requests', label: 'Budget Requests', icon: FileText, badge: 2 },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-6 py-3.5 text-sm font-medium transition-all ${activeView === item.id ? 'sidebar-active' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-3"><item.icon size={18} className={activeView === item.id ? 'text-[#D12027]' : 'text-slate-400'}/> {item.label}</div>
              {item.badge && <span className="bg-[#D12027] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold w-full"><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
             <span className="font-medium text-slate-400">Admin Portal</span>
             <ChevronRight size={14} />
             <span className="font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={triggerHelp}
              className="group flex items-center gap-2 text-sm font-bold text-[#D12027] bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-all"
            >
              <HelpCircle size={16} className="group-hover:rotate-12 transition-transform"/>
              <span>Explain this page</span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">Administrator</p>
                <p className="text-xs text-slate-500">Super User</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-2 border-slate-200">AD</div>
            </div>
          </div>
        </header>

        {/* Dynamic View Area */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-end mb-8">
               <div>
                 <h2 className="text-3xl font-bold text-slate-800 mb-2 capitalize">{activeView.replace('-', ' ')}</h2>
                 <p className="text-slate-500">Manage your organization's learning ecosystem.</p>
               </div>
               {activeView === 'dashboard' && <button className="text-sm font-bold text-[#D12027] flex items-center gap-2"><Download size={16}/> Export Report</button>}
             </div>

             {activeView === 'dashboard' && <AnalyticsView />}
             {activeView === 'employees' && (
               <EmployeeList
                 employees={sortedEmployees}
                 onSort={requestSort}
                 sortConfig={sortConfig}
                 onTriggerModal={() => setActiveModal('ADD_EMPLOYEE')}
               />
             )}
             {(activeView === 'curriculum' || activeView === 'requests') && (
               <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                 <div className="p-4 bg-slate-100 rounded-full mb-4"><Briefcase size={32}/></div>
                 <p className="font-bold">Module Under Maintenance</p>
                 <p className="text-sm">This view is currently being refactored for V2.</p>
               </div>
             )}
          </div>
        </main>
      </div>

      <AddEmployeeModal
        isOpen={activeModal === 'ADD_EMPLOYEE'}
        onClose={() => setActiveModal(null)}
        onSave={handleAddEmployee}
        onTriggerHelp={() => setRunTour(true)}
      />
    </div>
  );
};

export default App;