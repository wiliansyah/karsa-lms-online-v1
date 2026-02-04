import React, { useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2, Settings,
  Search, Bell, Filter, Plus, ChevronRight, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown,
  Download, Upload, Shield, Award, Calendar, DollarSign,
  Briefcase, GraduationCap, TrendingUp, PieChart as PieIcon,
  ArrowUpRight, ArrowDownRight, Mail, Phone, MapPin, X, LogOut,
  Edit, Eye, Trash2, Layers, Activity, FileVideo, FileQuestion, 
  ListChecks, GripVertical, File, PlayCircle, BarChart as BarChartIcon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

// --- 1. THEME & STYLES ---

const KARSA_RED = "#D12027";
const KARSA_YELLOW = "#FDB913";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; color: #334155; }
    
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pop { 0% { transform: scale(0.95); } 100% { transform: scale(1); } }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

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
  `}</style>
);

// --- 2. MOCK DATA ---

const EMPLOYEES = [
  { id: 'E001', name: 'Budi Santoso', role: 'Sales Staff', dept: 'Frontliner', branch: 'Kb. Kawung', progress: 85, compliance: 'Compliant', lastActive: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', risk: 'low', courses_assigned: 12, courses_completed: 10, email: 'budi.s@kartikasari.com', phone: '+62 812-3456-7890', joinDate: '12 Jan 2022' },
  { id: 'E002', name: 'Siska Wijaya', role: 'Store Manager', dept: 'Operational', branch: 'Dago', progress: 92, compliance: 'Compliant', lastActive: '5m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siska', risk: 'low', courses_assigned: 20, courses_completed: 18, email: 'siska.w@kartikasari.com', phone: '+62 812-9876-5432', joinDate: '05 Mar 2019' },
  { id: 'E003', name: 'Andi Pratama', role: 'Head Baker', dept: 'Kitchen', branch: 'Central Kitchen', progress: 45, compliance: 'At Risk', lastActive: '3d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', risk: 'high', courses_assigned: 15, courses_completed: 6, email: 'andi.p@kartikasari.com', phone: '+62 813-4567-8901', joinDate: '20 Aug 2021' },
  { id: 'E004', name: 'Rina Melati', role: 'Supervisor', dept: 'Frontliner', branch: 'Buah Batu', progress: 78, compliance: 'Compliant', lastActive: '1d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', risk: 'medium', courses_assigned: 18, courses_completed: 14, email: 'rina.m@kartikasari.com', phone: '+62 811-2345-6789', joinDate: '10 Nov 2020' },
  { id: 'E005', name: 'Dedi Kusuma', role: 'Logistics', dept: 'Warehouse', branch: 'Central', progress: 60, compliance: 'Non-Compliant', lastActive: '5d ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi', risk: 'high', courses_assigned: 10, courses_completed: 6, email: 'dedi.k@kartikasari.com', phone: '+62 856-7890-1234', joinDate: '15 Feb 2023' },
];

const INITIAL_COURSES = [
  { 
      id: 'C01', title: 'Food Safety Standard (HACCP)', category: 'Mandatory', level: 'All Staff', 
      assigned: 150, completed: 120, avgScore: 88, status: 'Active', 
      modules: [{ title: 'Intro to Hygiene', type: 'video', duration: '5:00' }, { title: 'HACCP Quiz', type: 'quiz', duration: '15:00' }] 
  },
  { 
      id: 'C02', title: 'Service Excellence 2.0', category: 'Soft Skill', level: 'Frontliner',
      assigned: 80, completed: 45, avgScore: 92, status: 'Active',
      modules: [{ title: 'Customer First Mindset', type: 'video', duration: '10:00' }]
  },
  { 
      id: 'C03', title: 'POS System Advanced', category: 'Technical', level: 'Cashier',
      assigned: 40, completed: 38, avgScore: 95, status: 'Active',
      modules: [{ title: 'System Operation', type: 'doc', duration: '10:00' }]
  },
  { 
      id: 'C04', title: 'Leadership 101', category: 'Managerial', level: 'Manager',
      assigned: 20, completed: 5, avgScore: 0, status: 'Draft',
      modules: []
  },
];

const REQUESTS = [
  { id: 'R01', employee: 'Siska Wijaya', title: 'Advanced Latte Art', provider: 'Barista Academy', cost: 2500000, date: '2023-11-20', status: 'Pending', justification: 'To improve premium coffee sales variant at Dago branch.', vendor_details: 'Barista Academy BDG, Jl. Riau No. 55', timeline: '2 Days Workshop', leader_approval: 'Approval_AM_Siska.pdf' },
  { id: 'R02', employee: 'Andi Pratama', title: 'Industrial Baking Tech', provider: 'Baking Center JKT', cost: 5000000, date: '2023-11-22', status: 'Approved', justification: 'Efficiency for new oven machine operational.', vendor_details: 'Baking Center JKT, South Jakarta', timeline: '1 Week Certification', leader_approval: 'Approval_HeadChef_Andi.pdf' },
  { id: 'R03', employee: 'Team Warehouse', title: 'Safety Driving', provider: 'Internal', cost: 0, date: '2023-12-01', status: 'Rejected', justification: 'Budget constraint for this quarter.', vendor_details: 'Internal GA Team', timeline: '1 Day', leader_approval: 'Approval_LogMgr.pdf' },
];

const ANALYTICS_DATA = [
  { name: 'Frontliner', completion: 85, engagement: 90 },
  { name: 'Kitchen', completion: 72, engagement: 65 },
  { name: 'Operational', completion: 95, engagement: 98 },
  { name: 'Warehouse', completion: 60, engagement: 50 },
  { name: 'Office', completion: 88, engagement: 82 },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Siska Wijaya', xp: 3200, dept: 'Operational' },
  { rank: 2, name: 'Andi Pratama', xp: 2950, dept: 'Kitchen' },
  { rank: 3, name: 'Budi Santoso', xp: 2800, dept: 'Frontliner' },
  { rank: 4, name: 'Rina Melati', xp: 2600, dept: 'Frontliner' },
  { rank: 5, name: 'Dedi Kusuma', xp: 2400, dept: 'Warehouse' },
];

const HISTORY_MOCK = [
  { id: 1, action: 'Completed Module', detail: 'Food Safety (HACCP)', date: 'Oct 24, 2023', score: '95%' },
  { id: 2, action: 'Badge Earned', detail: 'Hygiene Hero', date: 'Oct 24, 2023', score: '-' },
  { id: 3, action: 'Quiz Failed', detail: 'Customer Service Basics', date: 'Oct 20, 2023', score: '45%' },
  { id: 4, action: 'Started Course', detail: 'Product Knowledge: Bolen', date: 'Oct 15, 2023', score: '-' },
];

// --- 3. COMMON COMPONENTS ---

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
    'High': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles['Draft']}`}>
      {status}
    </span>
  );
};

const ProgressBar = ({ value, colorClass = "bg-blue-600" }) => (
  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
    <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }}></div>
  </div>
);

// --- 4. MODALS & SUB-VIEWS ---

// Modal: Assign Course (Updated for Individual Selection)
const AssignCourseModal = ({ isOpen, onClose, courses, preSelectedEmployee = null }) => {
  const [assignMode, setAssignMode] = useState('dept'); // 'dept' or 'user'
  const [selectedIds, setSelectedIds] = useState([]); // Stores dept names or user IDs
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  if (!isOpen) return null;

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
        setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredEmployees = EMPLOYEES.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-pop flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
           <h3 className="font-bold text-lg">Assign Learning</h3>
           <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
             <select 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none bg-white font-medium text-slate-700"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
             >
               <option value="" disabled>-- Select a course --</option>
               {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
             </select>
           </div>
           
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Assign To</label>
             {preSelectedEmployee ? (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <img src={preSelectedEmployee.avatar} className="w-8 h-8 rounded-full" alt=""/>
                    <div>
                        <p className="text-sm font-bold text-slate-800">{preSelectedEmployee.name}</p>
                        <p className="text-xs text-slate-500">{preSelectedEmployee.role}</p>
                    </div>
                </div>
             ) : (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                        onClick={() => setAssignMode('dept')}
                        className={`p-3 border-2 rounded-xl text-sm font-bold text-left flex items-center justify-between transition-all ${assignMode === 'dept' ? 'border-[#D12027] bg-red-50 text-[#D12027]' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
                    >
                       Department <Layers size={16}/>
                    </button>
                    <button 
                        onClick={() => setAssignMode('user')}
                        className={`p-3 border-2 rounded-xl text-sm font-bold text-left flex items-center justify-between transition-all ${assignMode === 'user' ? 'border-[#D12027] bg-red-50 text-[#D12027]' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}
                    >
                       Individual <Users size={16}/>
                    </button>
                </div>
             )}
           </div>

           {!preSelectedEmployee && assignMode === 'dept' && (
            <div className="animate-fadeIn">
             <label className="block text-sm font-bold text-slate-700 mb-2">Select Departments</label>
             <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-100 p-2 rounded-xl">
                {['Operational (All)', 'Kitchen Staff', 'Warehouse & Logistics', 'Frontliners', 'Office / HQ'].map(d => (
                  <label key={d} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(d) ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                    <input 
                        type="checkbox" 
                        checked={selectedIds.includes(d)}
                        onChange={() => toggleSelection(d)}
                        className="accent-[#D12027] w-4 h-4"
                    />
                    <span className="text-sm text-slate-700 font-medium">{d}</span>
                  </label>
                ))}
             </div>
            </div>
           )}

           {!preSelectedEmployee && assignMode === 'user' && (
            <div className="animate-fadeIn">
                <label className="block text-sm font-bold text-slate-700 mb-2">Search Employees</label>
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16}/>
                    <input 
                        type="text" 
                        placeholder="Search by name or role..." 
                        className="w-full pl-10 p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-100 p-2 rounded-xl">
                    {filteredEmployees.map(emp => (
                        <label key={emp.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(emp.id) ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                            <input 
                                type="checkbox" 
                                checked={selectedIds.includes(emp.id)}
                                onChange={() => toggleSelection(emp.id)}
                                className="accent-[#D12027] w-4 h-4"
                            />
                            <img src={emp.avatar} className="w-8 h-8 rounded-full bg-slate-200" alt=""/>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                                <p className="text-xs text-slate-500">{emp.role}</p>
                            </div>
                        </label>
                    ))}
                    {filteredEmployees.length === 0 && <p className="text-center text-xs text-slate-400 py-4">No employees found.</p>}
                </div>
            </div>
           )}

           <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-100">
              <AlertTriangle size={14}/> 
              {preSelectedEmployee 
                ? `Notify ${preSelectedEmployee.name} via email.` 
                : `Notify ${selectedIds.length > 0 ? selectedIds.length : '0'} ${assignMode === 'dept' ? 'departments' : 'users'} via email.`
              }
           </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button>
          <button onClick={() => { alert('Course Assigned Successfully!'); onClose(); }} className="btn-primary px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg">Confirm Assignment</button>
        </div>
      </div>
    </div>
  );
};

// Modal: Full Profile
const FullProfileModal = ({ employee, isOpen, onClose }) => {
    if (!isOpen || !employee) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-pop">
                {/* Header */}
                <div className="bg-slate-900 text-white p-8 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D12027] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-6">
                            <img src={employee.avatar} className="w-24 h-24 rounded-full border-4 border-white/20" alt={employee.name}/>
                            <div>
                                <h2 className="text-3xl font-bold">{employee.name}</h2>
                                <p className="text-slate-300 flex items-center gap-2 mt-1"><Briefcase size={16}/> {employee.role} | {employee.branch}</p>
                                <div className="flex gap-3 mt-4">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20">ID: {employee.id}</span>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold border border-green-500/30">{employee.compliance}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Personal Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={18} className="text-[#D12027]"/> Personal Data</h3>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold">Email</p>
                                        <p className="text-slate-700 font-medium">{employee.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold">Phone</p>
                                        <p className="text-slate-700 font-medium">{employee.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold">Join Date</p>
                                        <p className="text-slate-700 font-medium">{employee.joinDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Award size={18} className="text-[#FDB913]"/> KPI Stats</h3>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600">Attendance</span>
                                    <span className="font-bold text-green-600">98%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4"><div className="w-[98%] h-full bg-green-500 rounded-full"></div></div>
                                
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600">Training Score</span>
                                    <span className="font-bold text-[#D12027]">85/100</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full"><div className="w-[85%] h-full bg-[#D12027] rounded-full"></div></div>
                            </div>
                        </div>

                        {/* Right Column: Training History */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2"><BookOpen size={18} className="text-blue-600"/> Training & Certification</h3>
                                <button className="text-xs text-blue-600 font-bold hover:underline">Download Transcript</button>
                            </div>
                            <div className="space-y-0 divide-y divide-slate-100">
                                {HISTORY_MOCK.map((hist, idx) => (
                                    <div key={idx} className="py-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                                {hist.action.includes('Badge') ? <Award size={20} className="text-yellow-500"/> : 
                                                 hist.action.includes('Failed') ? <XCircle size={20} className="text-red-500"/> :
                                                 <CheckCircle size={20} className="text-green-500"/>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{hist.detail}</p>
                                                <p className="text-xs text-slate-400">{hist.action} • {hist.date}</p>
                                            </div>
                                        </div>
                                        {hist.score !== '-' && (
                                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-bold text-slate-700">{hist.score}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal: Request Detail
const RequestDetailModal = ({ request, isOpen, onClose }) => {
    if(!isOpen || !request) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-pop overflow-hidden">
                <div className="bg-[#D12027] p-6 text-white flex justify-between items-start">
                    <div>
                        <p className="text-red-100 text-xs font-bold uppercase tracking-wider mb-1">Training Request #{request.id}</p>
                        <h3 className="font-bold text-xl">{request.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X size={24}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                            {request.employee.substring(0,2)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{request.employee}</p>
                            <p className="text-xs text-slate-500">Requestor</p>
                        </div>
                        <div className="ml-auto text-right">
                             <StatusBadge status={request.status} />
                             <p className="text-xs text-slate-400 mt-1">{request.date}</p>
                        </div>
                    </div>

                    {/* Leader Approval Attachment Section */}
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-2">Required Attachment</p>
                        <div className="flex items-center justify-between p-3 border border-blue-100 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm border border-blue-50"><FileText size={20}/></div>
                                <div>
                                    <p className="text-sm font-bold text-blue-900">Leader Approval</p>
                                    <p className="text-xs text-blue-600">{request.leader_approval || 'scan_approval.pdf'}</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-blue-700 hover:underline bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">View</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Cost Estimation</p>
                            <p className="font-mono text-lg font-bold text-slate-800">Rp {request.cost.toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Timeline</p>
                            <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Clock size={14}/> {request.timeline || 'TBD'}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Vendor Details</p>
                        <div className="p-3 border border-slate-200 rounded-lg text-sm text-slate-700 flex items-start gap-2">
                             <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400"/>
                             <div>
                                 <p className="font-bold">{request.provider}</p>
                                 <p className="text-slate-500">{request.vendor_details || 'Internal Provider'}</p>
                             </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Justification</p>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg italic">"{request.justification}"</p>
                    </div>
                </div>
                
                {request.status === 'Pending' && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                         <button className="flex-1 py-3 border border-slate-200 bg-white hover:bg-red-50 text-red-600 font-bold rounded-xl transition-colors">Reject</button>
                         <button className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200">Approve Request</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Modal: Course Details View
const CourseDetailModal = ({ course, isOpen, onClose }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-pop flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                            {course.status}
                        </span>
                        <span className="text-slate-400 text-xs font-bold">• {course.category}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{course.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">Level: {course.level || 'All Levels'}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-white">
                <div className="p-4 text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold">Enrolled</p>
                    <p className="text-xl font-bold text-slate-800">{course.assigned}</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold">Completion</p>
                    <p className="text-xl font-bold text-green-600">{course.completed}</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold">Avg. Score</p>
                    <p className="text-xl font-bold text-[#D12027]">{course.avgScore}</p>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ListChecks size={18}/> Curriculum Structure</h4>
                
                {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-3">
                        {course.modules.map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${mod.type === 'video' ? 'bg-red-100 text-red-600' : mod.type === 'quiz' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {mod.type === 'video' ? <FileVideo size={20}/> : mod.type === 'quiz' ? <FileQuestion size={20}/> : <FileText size={20}/>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-700 text-sm">{mod.title}</p>
                                    <p className="text-xs text-slate-400 uppercase font-bold">{mod.type} • {mod.duration}</p>
                                </div>
                                <button className="text-slate-400 hover:text-[#D12027]"><Eye size={18}/></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                        No modules added yet.
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800" onClick={onClose}>Close</button>
                 <button className="btn-primary px-6 py-2 rounded-xl text-sm font-bold shadow-lg">Edit Course</button>
            </div>
        </div>
    </div>
  );
};


// Modal: Course Builder (Full Feature & Connected)
const CreateCourseModal = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    
    // Form State
    const [courseInfo, setCourseInfo] = useState({
        title: '',
        category: 'Mandatory',
        level: 'Staff',
        description: ''
    });

    const [modules, setModules] = useState([
        { id: 1, title: 'Introduction to Topic', type: 'video', duration: '5:00' },
        { id: 2, title: 'Knowledge Check', type: 'quiz', duration: '10:00' }
    ]);

    if(!isOpen) return null;

    const addNewModule = (type) => {
        const newId = modules.length + 1;
        const newModule = {
            id: newId,
            title: type === 'video' ? 'New Video Lesson' : type === 'quiz' ? 'New Assessment' : 'New Document',
            type: type,
            duration: '05:00'
        };
        setModules([...modules, newModule]);
    };

    const handlePublish = () => {
        const newCourse = {
            id: `C${Date.now().toString().slice(-4)}`,
            ...courseInfo,
            assigned: 0,
            completed: 0,
            avgScore: 0,
            status: 'Active',
            modules: modules
        };
        onSave(newCourse);
        onClose();
        // Reset state
        setStep(1);
        setCourseInfo({ title: '', category: 'Mandatory', level: 'Staff', description: '' });
        setModules([]);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl animate-pop flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Course Builder Studio</h3>
                        <p className="text-slate-500 text-sm">Create interactive learning modules.</p>
                    </div>
                    <div className="flex gap-2">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-[#D12027] text-white' : 'bg-green-100 text-green-700'}`}>1</div>
                         <div className="w-8 h-0.5 bg-slate-200 self-center"></div>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-[#D12027] text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                    {step === 1 ? (
                        <div className="max-w-2xl mx-auto space-y-6 animate-slideIn">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-4">Basic Information</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Course Title</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none" 
                                            placeholder="e.g. Advanced Pastry Techniques"
                                            value={courseInfo.title}
                                            onChange={(e) => setCourseInfo({...courseInfo, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                            <select 
                                                className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none"
                                                value={courseInfo.category}
                                                onChange={(e) => setCourseInfo({...courseInfo, category: e.target.value})}
                                            >
                                                <option>Mandatory</option>
                                                <option>Technical</option>
                                                <option>Soft Skill</option>
                                                <option>Managerial</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Level</label>
                                            <select 
                                                className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none"
                                                value={courseInfo.level}
                                                onChange={(e) => setCourseInfo({...courseInfo, level: e.target.value})}
                                            >
                                                <option>Staff</option>
                                                <option>Supervisor</option>
                                                <option>Manager</option>
                                                <option>All Levels</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea 
                                            className="w-full p-3 border border-slate-200 rounded-xl h-24 resize-none outline-none" 
                                            placeholder="What will employees learn?"
                                            value={courseInfo.description}
                                            onChange={(e) => setCourseInfo({...courseInfo, description: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Thumbnail Cover</label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <Upload className="mx-auto text-slate-400 mb-2"/>
                                            <p className="text-sm text-slate-500">Drag & Drop or Click to Upload</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full gap-6 animate-slideIn">
                            {/* Builder Canvas */}
                            <div className="flex-1 space-y-4">
                                {modules.map((mod, idx) => (
                                    <div key={mod.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 group cursor-grab active:cursor-grabbing">
                                        <GripVertical className="text-slate-300"/>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${mod.type === 'video' ? 'bg-red-50 text-red-500' : mod.type === 'quiz' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-500'}`}>
                                            {mod.type === 'video' ? <FileVideo size={20}/> : mod.type === 'quiz' ? <FileQuestion size={20}/> : <FileText size={20}/>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <input 
                                                    className="font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full" 
                                                    defaultValue={mod.title} 
                                                    onChange={(e) => {
                                                        const newModules = [...modules];
                                                        newModules[idx].title = e.target.value;
                                                        setModules(newModules);
                                                    }}
                                                />
                                                <span className="text-xs text-slate-400 font-mono">{mod.duration}</span>
                                            </div>
                                            <div className="flex gap-4 text-xs text-slate-400">
                                                <span className="capitalize">{mod.type} Module</span>
                                                {mod.type === 'quiz' && <span className="text-green-600 font-bold">• 10 Questions</span>}
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded text-slate-500"><Edit size={16}/></button>
                                            <button onClick={() => setModules(modules.filter(m => m.id !== mod.id))} className="p-2 hover:bg-red-50 rounded text-red-500"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                                    <p className="text-sm font-bold text-slate-400">Add New Module</p>
                                    <div className="flex gap-3">
                                        <button onClick={() => addNewModule('video')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 hover:text-[#D12027] hover:border-red-200">
                                            <FileVideo size={16}/> Video
                                        </button>
                                        <button onClick={() => addNewModule('quiz')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 hover:text-[#D12027] hover:border-red-200">
                                            <FileQuestion size={16}/> Quiz
                                        </button>
                                        <button onClick={() => addNewModule('doc')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 hover:text-[#D12027] hover:border-red-200">
                                            <FileText size={16}/> Document
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Settings */}
                            <div className="w-80 shrink-0 space-y-4">
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-3 text-sm">Course Settings</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm text-slate-600">
                                            <input type="checkbox" className="accent-[#D12027]"/> Mandatory Completion
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-600">
                                            <input type="checkbox" className="accent-[#D12027]" defaultChecked/> Enable Certificate
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-600">
                                            <input type="checkbox" className="accent-[#D12027]"/> Sequential Locking
                                        </label>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                    <h4 className="font-bold text-blue-800 mb-2 text-sm flex items-center gap-2"><Activity size={16}/> Est. Duration</h4>
                                    <p className="text-2xl font-black text-blue-900">
                                        {modules.length * 5}m 00s
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">Based on module count.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex justify-between bg-white shrink-0">
                     <button onClick={onClose} className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-800 text-sm">Cancel</button>
                     <div className="flex gap-3">
                         {step === 2 && <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 text-sm">Back</button>}
                         {step === 1 ? (
                             <button disabled={!courseInfo.title} onClick={() => setStep(2)} className="btn-primary px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50">Next: Curriculum</button>
                         ) : (
                             <button onClick={handlePublish} className="btn-primary px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg">Publish Course</button>
                         )}
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- 5. MAIN VIEWS ---

const DashboardOverview = () => (
  <div className="space-y-6 animate-fadeIn">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Total Learners', value: '342', sub: '+12 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Avg Completion', value: '78%', sub: '+2.4% vs last mo', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Pending Requests', value: '8', sub: 'Needs Approval', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { title: 'At Risk Users', value: '14', sub: 'Non-compliant', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
      ].map((kpi, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            {idx === 3 && <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>}
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{kpi.value}</h3>
          <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
          <p className={`text-xs mt-2 ${kpi.sub.includes('Needs') || kpi.sub.includes('Non') ? 'text-red-500 font-bold' : 'text-green-600'}`}>
            {kpi.sub}
          </p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-800">Learning Activity Trends</h3>
          <select className="text-sm border-slate-200 rounded-lg p-2 bg-slate-50">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
          </select>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'W1', hours: 400, active: 240 },
              { name: 'W2', hours: 300, active: 139 },
              { name: 'W3', hours: 500, active: 380 },
              { name: 'W4', hours: 450, active: 300 },
            ]}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D12027" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#D12027" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
              <Area type="monotone" dataKey="hours" stroke="#D12027" fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dept Completion */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800 mb-6">Completion by Dept</h3>
        <div className="space-y-6">
          {ANALYTICS_DATA.slice(0, 4).map((dept) => (
            <div key={dept.name}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">{dept.name}</span>
                <span className="font-bold text-slate-800">{dept.completion}%</span>
              </div>
              <ProgressBar value={dept.completion} colorClass={dept.completion > 80 ? "bg-green-500" : dept.completion > 60 ? "bg-yellow-500" : "bg-red-500"} />
            </div>
          ))}
        </div>
        <button className="w-full mt-8 py-2 text-sm text-[#D12027] font-bold border border-[#D12027] rounded-lg hover:bg-red-50 transition-colors">
          View Detailed Analytics
        </button>
      </div>
    </div>
  </div>
);

const EmployeeManager = ({ courses }) => {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // When clicking assign from the slide-over
  const handleAssignClick = () => {
     setAssignModalOpen(true);
  };
  
  // When clicking view profile
  const handleProfileClick = () => {
     setProfileModalOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fadeIn">
      {/* List View */}
      <div className={`${selectedEmp ? 'w-2/3 hidden lg:block' : 'w-full'} bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-300`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Employee Directory</h3>
            <p className="text-sm text-slate-500">Manage access and track progress</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input placeholder="Search employee..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 w-64" />
            </div>
            <button className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
              <Download size={16} /> Export
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Employee</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role / Dept</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Learning Progress</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Compliance</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EMPLOYEES.map((emp) => (
                <tr key={emp.id} className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedEmp?.id === emp.id ? 'bg-red-50' : ''}`} onClick={() => setSelectedEmp(emp)}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} className="w-10 h-10 rounded-full bg-slate-200" alt="" />
                      <div>
                        <p className="font-bold text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-500">ID: {emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-700 font-medium">{emp.role}</p>
                    <p className="text-xs text-slate-500">{emp.dept}</p>
                  </td>
                  <td className="p-4 w-48">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">{emp.progress}%</span>
                    </div>
                    <ProgressBar value={emp.progress} colorClass={emp.progress < 50 ? 'bg-red-500' : 'bg-[#D12027]'} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={emp.compliance} />
                  </td>
                  <td className="p-4">
                    <button className="text-slate-400 hover:text-[#D12027]"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View (Slide over) */}
      {selectedEmp && (
        <div className="w-1/3 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col animate-slideIn overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#D12027] to-orange-600 relative shrink-0">
            <button onClick={() => setSelectedEmp(null)} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 rounded-full p-1"><X size={18}/></button>
            <div className="absolute -bottom-10 left-6">
              <img src={selectedEmp.avatar} className="w-20 h-20 rounded-full border-4 border-white bg-white" alt=""/>
            </div>
          </div>
          
          <div className="pt-12 px-6 pb-6 flex-1 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">{selectedEmp.name}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Briefcase size={14} /> {selectedEmp.role} • {selectedEmp.branch}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <Mail size={14} /> {selectedEmp.email}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">Assigned</p>
                <p className="text-xl font-bold text-slate-800">{selectedEmp.courses_assigned}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">Completed</p>
                <p className="text-xl font-bold text-[#D12027]">{selectedEmp.courses_completed}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Clock size={16} className="text-[#FDB913]"/> Learning History</h4>
              <div className="space-y-4">
                {HISTORY_MOCK.map((item) => (
                  <div key={item.id} className="relative pl-4 border-l-2 border-slate-200 pb-1 last:pb-0">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.action}</p>
                        <p className="text-xs text-slate-500">{item.detail}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">{item.date}</span>
                        {item.score !== '-' && <span className={`text-xs font-bold ${parseInt(item.score) > 70 ? 'text-green-600' : 'text-red-500'}`}>{item.score}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
               <button onClick={handleAssignClick} className="w-full btn-primary py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2">
                 <Plus size={16}/> Assign New Course
               </button>
               <button onClick={handleProfileClick} className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                 <Users size={16}/> View Full Profile
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals triggered by Employee Manager */}
      <AssignCourseModal 
        isOpen={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)} 
        courses={courses}
        preSelectedEmployee={selectedEmp}
      />
      <FullProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        employee={selectedEmp}
      />
    </div>
  );
};

const CurriculumManager = ({ courses, onAddCourse }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleSaveCourse = (newCourse) => {
    onAddCourse(newCourse);
    setShowCreateModal(false);
    alert(`Course "${newCourse.title}" created successfully and added to library.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="font-bold text-xl text-slate-800">Learning Modules</h3>
           <p className="text-slate-500 text-sm">Create, manage and distribute materials.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAssignModal(true)} className="bg-white border-2 border-[#D12027] text-[#D12027] hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
            <GraduationCap size={18}/> Assign Learning
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
            <Plus size={18}/> Create Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover cursor-pointer group">
            <div className="h-32 bg-slate-100 relative">
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                <BookOpen className="text-slate-300 group-hover:text-white transition-colors" size={48} />
              </div>
              <div className="absolute top-3 right-3">
                 <StatusBadge status={course.status} />
              </div>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                {course.category}
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-slate-800 text-lg mb-1">{course.title}</h4>
              <p className="text-xs text-slate-400 mb-4">Level: {course.level || 'All Staff'}</p>
              
              <div className="flex justify-between items-end mb-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold">Enrolled</p>
                  <p className="font-bold text-lg">{course.assigned}</p>
                </div>
                <div className="text-center border-l pl-4 border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold">Completed</p>
                  <p className="font-bold text-lg text-green-600">{course.completed}</p>
                </div>
                <div className="text-center border-l pl-4 border-slate-100">
                   <div className="w-10 h-10 rounded-full border-4 border-green-500 flex items-center justify-center text-xs font-bold text-slate-700">
                     {course.assigned > 0 ? Math.round((course.completed / course.assigned) * 100) : 0}%
                   </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                 <div className="w-full bg-slate-50 text-slate-400 text-xs font-bold py-2 rounded-lg text-center group-hover:bg-[#D12027] group-hover:text-white transition-colors">
                    Click to View Details
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AssignCourseModal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} courses={courses} />
      <CreateCourseModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleSaveCourse}/>
      <CourseDetailModal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} course={selectedCourse}/>
    </div>
  );
};

const RequestManager = () => {
    const [selectedReq, setSelectedReq] = useState(null);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#D12027] text-white p-3 rounded-xl shadow-lg shadow-red-200">
                <DollarSign size={24}/>
            </div>
            <div>
                <h3 className="font-bold text-xl text-slate-800">Training Requests</h3>
                <p className="text-slate-500 text-sm">Review external training budgets & internal slots.</p>
            </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                <tr>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase">Employee</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase">Training Details</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase">Budget / Cost</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase">Justification</th>
                    <th className="p-5 text-xs font-bold text-slate-500 uppercase text-center">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {REQUESTS.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5">
                        <p className="font-bold text-slate-800">{req.employee}</p>
                        <p className="text-xs text-slate-500">Submitted: {req.date}</p>
                    </td>
                    <td className="p-5">
                        <p className="font-bold text-[#D12027]">{req.title}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin size={12}/> {req.provider}
                        </div>
                    </td>
                    <td className="p-5 font-mono text-sm text-slate-700">
                        Rp {req.cost.toLocaleString('id-ID')}
                    </td>
                    <td className="p-5 text-sm text-slate-600 max-w-xs truncate">
                        {req.justification}
                    </td>
                    <td className="p-5 text-center">
                        <button onClick={() => setSelectedReq(req)} className="text-[#D12027] hover:bg-red-50 p-2 rounded-lg font-bold text-sm">View Detail</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <RequestDetailModal request={selectedReq} isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} />
        </div>
    );
};

const AnalyticsDashboard = () => (
    <div className="animate-fadeIn space-y-6">
        {/* Leaderboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Award size={20} className="text-[#FDB913]"/> Top 5 Learners
                    </h3>
                    <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                    {LEADERBOARD_DATA.map((user, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${idx === 0 ? 'bg-[#FDB913] text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {user.rank}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                                    <p className="text-xs text-slate-400">{user.dept}</p>
                                </div>
                            </div>
                            <div className="font-bold text-[#D12027]">{user.xp} XP</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-lg text-slate-800 mb-6">Budget Utilization</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { month: 'Jan', budget: 50, used: 30 },
                            { month: 'Feb', budget: 50, used: 45 },
                            { month: 'Mar', budget: 50, used: 20 },
                            { month: 'Apr', budget: 50, used: 35 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} unit="jt"/>
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px' }}/>
                            <Bar dataKey="budget" fill="#f1f5f9" radius={[4,4,0,0]} name="Allocated"/>
                            <Bar dataKey="used" fill="#D12027" radius={[4,4,0,0]} name="Used"/>
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>

        {/* Detailed Charts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Department Engagement (Weekly)</h3>
             </div>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                        { week: 'W1', Frontliner: 65, Kitchen: 40, Operational: 80 },
                        { week: 'W2', Frontliner: 70, Kitchen: 55, Operational: 82 },
                        { week: 'W3', Frontliner: 68, Kitchen: 45, Operational: 85 },
                        { week: 'W4', Frontliner: 85, Kitchen: 60, Operational: 90 },
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="Frontliner" stroke="#D12027" strokeWidth={3} />
                        <Line type="monotone" dataKey="Kitchen" stroke="#FDB913" strokeWidth={3} />
                        <Line type="monotone" dataKey="Operational" stroke="#1e293b" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
        </div>
    </div>
);

// --- 6. MAIN APP SHELL ---

const AdminApp = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [coursesList, setCoursesList] = useState(INITIAL_COURSES);

  const handleAddCourse = (newCourse) => {
      setCoursesList([...coursesList, newCourse]);
  };
  
  const MENUS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Progress', icon: Users },
    { id: 'curriculum', label: 'Curriculum & Assign', icon: BookOpen },
    { id: 'requests', label: 'Training Requests', icon: FileText, badge: 3 },
    { id: 'analytics', label: 'Analytics & Leaderboard', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-800 font-sans">
      <GlobalStyles />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D12027] rounded-lg flex items-center justify-center">
                 <span className="text-white font-black text-lg">K</span>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-tight">KARSA<br/><span className="text-[#D12027] text-sm font-medium">Admin Portal</span></h1>
              </div>
           </div>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          {MENUS.map((menu) => (
            <button 
              key={menu.id}
              onClick={() => setActiveView(menu.id)}
              className={`w-full flex items-center justify-between px-8 py-3.5 text-sm font-medium transition-all ${activeView === menu.id ? 'sidebar-active' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <menu.icon size={18} className={activeView === menu.id ? 'text-[#D12027]' : 'text-slate-400'}/>
                {menu.label}
              </div>
              {menu.badge && (
                <span className="bg-[#D12027] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{menu.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold">
             <LogOut size={18}/> Sign Out
           </button>
           <p className="text-[10px] text-slate-300 mt-4">v2.5.1 • Kartika Sari Internal</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
             <span className="cursor-pointer hover:text-[#D12027]">Home</span>
             <ChevronRight size={14}/>
             <span className="font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
               <Bell size={20}/>
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">Admin HR</p>
                  <p className="text-xs text-slate-500">Superadmin Access</p>
               </div>
               <div className="w-10 h-10 bg-[#D12027] rounded-full text-white flex items-center justify-center font-bold border-2 border-red-100 shadow-sm">
                 HR
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth pb-20">
           <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2 capitalize">{activeView.replace('-', ' ')}</h2>
                  <p className="text-slate-500">Manage your organization's learning ecosystem.</p>
                </div>
                {activeView === 'employees' && (
                  <button className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
                    <Plus size={18}/> Add Employee
                  </button>
                )}
              </div>
              
              {activeView === 'dashboard' && <DashboardOverview />}
              {activeView === 'employees' && <EmployeeManager courses={coursesList} />}
              {activeView === 'curriculum' && <CurriculumManager courses={coursesList} onAddCourse={handleAddCourse} />}
              {activeView === 'requests' && <RequestManager />}
              {activeView === 'analytics' && <AnalyticsDashboard />}
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminApp;