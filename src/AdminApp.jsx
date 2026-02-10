import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FileText, BarChart2,
  Search, Bell, Plus, ChevronRight, MoreVertical,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Download, Award, DollarSign, Briefcase, GraduationCap,
  PieChart as PieIcon, MapPin, X, LogOut,
  Eye, Layers, Menu, ArrowLeft, Target,
  FileCheck, PlayCircle, ToggleLeft, ToggleRight,
  HelpCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Joyride, { STATUS, EVENTS, ACTIONS } from 'react-joyride'; 

// --- 1. THEME & STYLES ---

const KARSA_RED = "#D12027";
const KARSA_YELLOW = "#FDB913";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #334155; }
    
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
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1); }
    
    .btn-primary {
      background: ${KARSA_RED}; color: white;
      transition: all 0.2s;
    }
    .btn-primary:hover { background: #b91c22; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(209, 32, 39, 0.2); }
    
    .sidebar-active {
      background: linear-gradient(90deg, rgba(209, 32, 39, 0.08) 0%, transparent 100%);
      border-left: 4px solid ${KARSA_RED};
      color: ${KARSA_RED};
    }
    
    /* Custom Tooltip Joyride Style Override */
    .__floater__body div { border-radius: 12px !important; }
  `}</style>
);

// --- 2. MOCK DATA ---
const INITIAL_EMPLOYEES = [
  { id: 'E001', name: 'Budi Santoso', role: 'Sales Staff', dept: 'Frontliner', branch: 'Kb. Kawung', progress: 85, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', courses_assigned: 12, courses_completed: 10, email: 'budi.s@kartikasari.com', phone: '0812-3456-7890', joinDate: '12 Jan 2022' },
  { id: 'E002', name: 'Siska Wijaya', role: 'Store Manager', dept: 'Operational', branch: 'Dago', progress: 92, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siska', courses_assigned: 20, courses_completed: 18, email: 'siska.w@kartikasari.com', phone: '0812-9876-5432', joinDate: '05 Mar 2019' },
  { id: 'E003', name: 'Andi Pratama', role: 'Head Baker', dept: 'Kitchen', branch: 'Central Kitchen', progress: 45, compliance: 'At Risk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', courses_assigned: 15, courses_completed: 6, email: 'andi.p@kartikasari.com', phone: '0813-4567-8901', joinDate: '20 Aug 2021' },
  { id: 'E004', name: 'Rina Melati', role: 'Supervisor', dept: 'Frontliner', branch: 'Buah Batu', progress: 78, compliance: 'Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', courses_assigned: 18, courses_completed: 14, email: 'rina.m@kartikasari.com', phone: '0811-2345-6789', joinDate: '10 Nov 2020' },
  { id: 'E005', name: 'Dedi Kusuma', role: 'Logistics', dept: 'Warehouse', branch: 'Central', progress: 60, compliance: 'Non-Compliant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi', courses_assigned: 10, courses_completed: 6, email: 'dedi.k@kartikasari.com', phone: '0856-7890-1234', joinDate: '15 Feb 2023' },
];

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

const INITIAL_REQUESTS = [
  { id: 'R01', employee: 'Siska Wijaya', title: 'Advanced Latte Art', provider: 'Barista Academy', cost: 2500000, date: '2023-11-20', status: 'Pending', justification: 'To improve premium coffee sales variant at Dago branch.', vendor_details: 'Barista Academy BDG', timeline: '2 Days Workshop', leader_approval: true },
  { id: 'R02', employee: 'Andi Pratama', title: 'Industrial Baking Tech', provider: 'Baking Center JKT', cost: 5000000, date: '2023-11-22', status: 'Approved', justification: 'Efficiency for new oven machine.', vendor_details: 'Baking Center JKT', timeline: '1 Week Certification', leader_approval: true },
  { id: 'R03', employee: 'Team Warehouse', title: 'Safety Driving', provider: 'Internal', cost: 0, date: '2023-12-01', status: 'Rejected', justification: 'Budget constraint.', vendor_details: 'Internal GA Team', timeline: '1 Day', leader_approval: true },
];

const HISTORY_MOCK = [
  { id: 1, action: 'Completed Module', detail: 'Food Safety (HACCP)', date: 'Oct 24, 2023', score: '95%' },
  { id: 2, action: 'Badge Earned', detail: 'Hygiene Hero', date: 'Oct 24, 2023', score: '-' },
  { id: 3, action: 'Quiz Failed', detail: 'Customer Service Basics', date: 'Oct 20, 2023', score: '45%' },
];

const SKILL_RADAR_DATA = [
  { subject: 'HACCP', A: 120, B: 110, fullMark: 150 },
  { subject: 'Service', A: 98, B: 130, fullMark: 150 },
  { subject: 'Tech', A: 86, B: 130, fullMark: 150 },
  { subject: 'Managerial', A: 99, B: 100, fullMark: 150 },
  { subject: 'Safety', A: 85, B: 90, fullMark: 150 },
  { subject: 'Product', A: 65, B: 85, fullMark: 150 },
];

// --- 3. COMMON UTILS ---

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
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border whitespace-nowrap shadow-sm ${styles[status] || styles['Draft']}`}>
      {status}
    </span>
  );
};

const ProgressBar = ({ value, colorClass = "bg-blue-600" }) => (
  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
    <div className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`} style={{ width: `${value}%` }}></div>
  </div>
);

// --- 4. MODALS (Simplified for brevity but functional) ---
// (Modals are identical to previous context, preserved for functionality)
const AddEmployeeModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', role: '', dept: 'Frontliner', email: '' });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-pop border border-slate-200">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-lg">Add New Employee</h3><button onClick={onClose}><X size={20} className="text-slate-400"/></button></div>
                <div className="p-6 space-y-4">
                    <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-100 outline-none"/>
                    <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-100 outline-none"/>
                    <select value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white"><option>Frontliner</option><option>Kitchen</option><option>Operational</option></select>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500">Cancel</button><button onClick={() => { onSave({...formData, id: 'E'+Math.random().toString().substr(2,3), progress:0, compliance:'Compliant', avatar:`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}); onClose(); }} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg">Save Employee</button></div>
            </div>
        </div>
    );
};

const CreateCourseModal = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ title: '', category: 'Mandatory', description: '', duration: '' });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-pop border border-slate-200">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-lg">Create Course Module</h3><button onClick={onClose}><X size={20} className="text-slate-400"/></button></div>
                <div className="p-6 space-y-4">
                    {step === 1 ? (
                        <>
                            <input placeholder="Course Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-100 outline-none"/>
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-100 outline-none h-24"/>
                        </>
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed rounded-xl bg-slate-50">
                            <Download className="mx-auto text-slate-300 mb-2"/>
                            <p className="text-sm font-bold text-slate-600">Upload SCORM / Video</p>
                        </div>
                    )}
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-between">
                    {step === 2 ? <button onClick={() => setStep(1)} className="text-sm font-bold text-slate-500">Back</button> : <button onClick={onClose} className="text-sm font-bold text-slate-500">Cancel</button>}
                    {step === 1 ? <button onClick={() => setStep(2)} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg">Next Step</button> : <button onClick={() => {onSave({...formData, id: 'C'+Math.random().toString().substr(2,3), status: 'Draft', assigned: 0}); onClose(); setStep(1);}} className="btn-primary px-6 py-2 text-sm font-bold rounded-lg">Create</button>}
                </div>
            </div>
        </div>
    );
};

// --- 5. MAIN VIEWS WITH TUTORIAL CLASSES ---

// VIEW: ANALYTICS
const AnalyticsDashboard = ({ onOpenDeptDetail }) => (
    <div className="animate-fadeIn space-y-6 pb-20">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="tour-kpi-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase mb-2">Total Learners</p>
              <h3 className="text-3xl font-bold text-slate-800">342</h3>
              <p className="text-xs text-green-600 font-bold mt-1">+12 this month</p>
           </div>
           <div className="tour-kpi-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase mb-2">Completion Rate</p>
              <h3 className="text-3xl font-bold text-slate-800">78%</h3>
              <p className="text-xs text-green-600 font-bold mt-1">+2.4% vs last mo</p>
           </div>
           <div className="tour-kpi-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase mb-2">Pending Requests</p>
              <h3 className="text-3xl font-bold text-slate-800">8</h3>
              <p className="text-xs text-yellow-600 font-bold mt-1">Needs Approval</p>
           </div>
           <div className="tour-kpi-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase mb-2">Budget Used</p>
              <h3 className="text-3xl font-bold text-slate-800">45%</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">Rp 45.2jt / 100jt</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-slate-800">Budget Utilization</h3></div>
                <div className="h-64 tour-chart-budget"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{m:'Jan',b:50,u:30},{m:'Feb',b:50,u:45},{m:'Mar',b:50,u:20},{m:'Apr',b:50,u:35}]}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="m" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px' }}/><Bar dataKey="b" fill="#f1f5f9" radius={[4,4,0,0]} /><Bar dataKey="u" fill="#D12027" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-slate-800">Engagement Trends</h3><button onClick={onOpenDeptDetail} className="tour-btn-deepdive text-xs font-bold text-[#D12027] border border-[#D12027] px-3 py-1.5 rounded-lg hover:bg-red-50">View Deep Dive</button></div>
                 <div className="h-64 tour-chart-engagement"><ResponsiveContainer width="100%" height="100%"><LineChart data={[{w:'W1',F:65,K:40},{w:'W2',F:70,K:55},{w:'W3',F:68,K:45},{w:'W4',F:85,K:60}]}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="w" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '12px' }}/><Legend /><Line type="monotone" dataKey="F" stroke="#D12027" strokeWidth={3} name="Frontliner"/><Line type="monotone" dataKey="K" stroke="#FDB913" strokeWidth={3} name="Kitchen"/></LineChart></ResponsiveContainer></div>
            </div>
        </div>
    </div>
);

// VIEW: EMPLOYEE MANAGER
const EmployeeManager = ({ employees, onAddEmployee }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg text-slate-800">Employee Directory</h3>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="tour-emp-search relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                <input placeholder="Search name, role..." className="w-full pl-9 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
             </div>
             <button onClick={() => onAddEmployee(true)} className="tour-emp-add btn-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shrink-0"><Plus size={16}/> Add New</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="tour-emp-table w-full text-left border-collapse">
            <thead className="bg-slate-50"><tr>{['Employee', 'Role', 'Progress', 'Compliance', 'Action'].map(h => <th key={h} className="p-4 text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp, i) => (
                <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${i === 0 ? 'tour-emp-row-first' : ''}`}>
                  <td className="p-4"><div className="flex items-center gap-3"><img src={emp.avatar} className="w-8 h-8 rounded-full bg-slate-200" alt="" /><span className="font-bold text-slate-800 text-sm">{emp.name}</span></div></td>
                  <td className="p-4 text-sm text-slate-600">{emp.role}</td>
                  <td className="p-4 w-40"><div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold text-slate-700">{emp.progress}%</span></div><ProgressBar value={emp.progress} colorClass={emp.progress < 50 ? 'bg-red-500' : 'bg-[#D12027]'} /></td>
                  <td className="p-4"><StatusBadge status={emp.compliance} /></td>
                  <td className="p-4"><button className="text-slate-400 hover:text-[#D12027]"><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// VIEW: CURRICULUM
const CurriculumManager = ({ courses, onAddCourse }) => (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex justify-between items-center">
        <div><h3 className="font-bold text-xl text-slate-800">Learning Modules</h3></div>
        <div className="flex gap-3">
            <button className="tour-curr-assign bg-white border border-[#D12027] text-[#D12027] hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><GraduationCap size={16}/> Bulk Assign</button>
            <button onClick={() => onAddCourse(true)} className="tour-curr-create btn-primary px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg"><Plus size={16}/> Create Course</button>
        </div>
      </div>
      <div className="tour-curr-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <div key={course.id} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover group flex flex-col ${i === 0 ? 'tour-curr-card-first' : ''}`}>
            <div className="h-32 bg-slate-100 relative shrink-0">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300"><BookOpen size={40} /></div>
                <div className="absolute top-3 right-3"><StatusBadge status={course.status} /></div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-1"><span className="text-[10px] font-bold text-[#D12027] bg-red-50 px-2 py-0.5 rounded border border-red-100">{course.category}</span></div>
                <h4 className="font-bold text-slate-800 text-base mb-2">{course.title}</h4>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                <div className="mt-auto flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-50">
                    <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={12}/> {course.assigned}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
);

// VIEW: REQUESTS
const RequestManager = ({ requests }) => (
    <div className="animate-fadeIn pb-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-lg">Training Requests</h3></div>
            <div className="overflow-x-auto">
            <table className="tour-req-table w-full text-left">
                <thead className="bg-slate-50"><tr>{['Employee', 'Training Details', 'Cost', 'Leader Approval', 'Action'].map(h => <th key={h} className="p-4 text-xs font-bold text-slate-500 uppercase">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">
                {requests.map((req, i) => (
                    <tr key={req.id} className={`hover:bg-slate-50 transition-colors ${i === 0 ? 'tour-req-row-first' : ''}`}>
                    <td className="p-4"><p className="font-bold text-slate-800 text-sm">{req.employee}</p><p className="text-[10px] text-slate-500">{req.date}</p></td>
                    <td className="p-4"><p className="font-bold text-[#D12027] text-sm">{req.title}</p><p className="text-[10px] text-slate-500">{req.provider}</p></td>
                    <td className="p-4 font-mono text-sm text-slate-700">Rp {req.cost.toLocaleString('id-ID')}</td>
                    <td className="p-4">{req.leader_approval ? <span className="text-green-600 flex items-center gap-1 text-[10px] font-bold bg-green-50 px-2 py-1 rounded w-fit"><CheckCircle size={10}/> Verified</span> : <span className="text-red-500 flex items-center gap-1 text-[10px] font-bold bg-red-50 px-2 py-1 rounded w-fit"><XCircle size={10}/> Missing</span>}</td>
                    <td className="p-4"><button className="text-[#D12027] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold text-xs">Review</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    </div>
);

// --- 6. MAIN APP SHELL WITH DEEP TUTORIAL LOGIC ---

const AdminApp = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [modalOpen, setModalOpen] = useState({ addEmp: false, addCourse: false, deptDetail: false });
  
  // --- TUTORIAL STATE ---
  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);

  // --- TUTORIAL CONTENT GENERATOR ---
  const generateSteps = (view) => {
    const commonStyles = {
        title: <div className="flex items-center gap-2 text-[#D12027] font-bold mb-1"><HelpCircle size={16}/> Tutorial Guide</div>,
    };

    const dashboardSteps = [
        { 
            target: 'body', 
            content: <div className="text-left"><strong>Selamat Datang di Admin Portal!</strong><br/>Ini adalah pusat kendali HR Anda. Mari kita pelajari fitur-fitur kunci untuk memonitor performa training perusahaan.</div>, 
            placement: 'center',
            title: commonStyles.title
        },
        {
            target: '.tour-sidebar',
            content: 'Navigasi Utama. Gunakan ini untuk berpindah antara Dashboard, Data Karyawan, Kurikulum, dan Approval Request.',
            placement: 'right'
        },
        {
            target: '.tour-kpi-1',
            content: 'Kartu KPI Real-time. Menunjukkan total karyawan yang aktif belajar. Angka hijau menandakan pertumbuhan positif bulan ini.',
            placement: 'bottom'
        },
        {
            target: '.tour-kpi-3',
            content: 'Pending Requests. Klik kartu ini untuk langsung melihat pengajuan budget training yang membutuhkan persetujuan Anda.',
            placement: 'bottom'
        },
        {
            target: '.tour-chart-budget',
            content: 'Monitoring Budget Tahunan. Grafik ini membandingkan alokasi vs penggunaan aktual per bulan untuk mencegah over-spending.',
            placement: 'top'
        },
        {
            target: '.tour-chart-engagement',
            content: 'Tren Keaktifan. Membandingkan tingkat partisipasi antar departemen (Frontliner vs Kitchen) per minggu.',
            placement: 'top'
        },
        {
            target: '.tour-btn-deepdive',
            content: 'Fitur Premium: Deep Dive. Klik tombol ini untuk melihat analisis Radar Chart mengenai Skill Gap karyawan.',
            placement: 'left'
        }
    ];

    const employeeSteps = [
        {
            target: '.tour-emp-search',
            content: 'Smart Search. Ketik nama, role, atau departemen untuk memfilter tabel secara instan.',
            placement: 'bottom'
        },
        {
            target: '.tour-emp-add',
            content: 'Tambah Data. Gunakan tombol ini untuk mendaftarkan karyawan baru atau import data bulk via CSV.',
            placement: 'left'
        },
        {
            target: '.tour-emp-table',
            content: 'Database Karyawan. Menampilkan status kepatuhan (Compliance) berdasarkan penyelesaian training wajib.',
            placement: 'top'
        },
        {
            target: '.tour-emp-row-first',
            content: 'Detail Karyawan. Klik pada baris mana saja untuk membuka profil lengkap, history training, dan sertifikat.',
            placement: 'bottom'
        }
    ];

    const curriculumSteps = [
        {
            target: '.tour-curr-create',
            content: 'Course Authoring. Buat materi baru berupa Video, PDF, atau SCORM interaktif di sini.',
            placement: 'left'
        },
        {
            target: '.tour-curr-assign',
            content: 'Bulk Assignment. Kirim satu course ke seluruh departemen (misal: "Operational") dalam sekali klik.',
            placement: 'bottom'
        },
        {
            target: '.tour-curr-grid',
            content: 'Katalog Modul. Kartu ini menunjukkan status (Active/Draft) dan jumlah karyawan yang sudah ditugaskan.',
            placement: 'top'
        }
    ];

    const requestSteps = [
        {
            target: '.tour-req-table',
            content: 'Daftar Pengajuan. Karyawan dapat mengajukan training eksternal. Tugas Anda memvalidasi budget dan relevansi.',
            placement: 'top'
        },
        {
            target: '.tour-req-row-first',
            content: 'Validasi Dokumen. Kolom "Leader Approval" otomatis mengecek apakah atasan langsung sudah menyetujui secara digital.',
            placement: 'bottom'
        }
    ];

    switch(view) {
        case 'dashboard': return dashboardSteps;
        case 'employees': return employeeSteps;
        case 'curriculum': return curriculumSteps;
        case 'requests': return requestSteps;
        default: return [];
    }
  };

  // Trigger tour on view change
  useEffect(() => {
    const steps = generateSteps(activeView);
    setTourSteps(steps);
    setStepIndex(0);
    setRunTour(true);
  }, [activeView]);

  const MENUS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <GlobalStyles />
      
      {/* --- JOYRIDE INSTANCE --- */}
      <Joyride 
        steps={tourSteps}
        run={runTour}
        stepIndex={stepIndex}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        disableOverlayClose={true}
        spotlightClicks={true}
        styles={{
            options: {
                primaryColor: KARSA_RED,
                zIndex: 10000,
            },
            tooltipContainer: {
                textAlign: 'left'
            },
            buttonNext: {
                backgroundColor: KARSA_RED,
                fontSize: 12,
                fontWeight: 700
            },
            buttonBack: {
                color: '#64748b',
                marginRight: 10
            }
        }}
        callback={(data) => {
            const { action, index, status, type } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                setRunTour(false);
            } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
                setStepIndex(index + 1);
            }
        }}
      />

      {/* SIDEBAR */}
      <aside className="tour-sidebar w-64 bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
           <div className="w-8 h-8 bg-[#D12027] rounded-lg flex items-center justify-center mr-3"><span className="text-white font-black text-lg">K</span></div>
           <h1 className="font-bold text-lg text-slate-900 leading-tight">KARSA<br/><span className="text-[#D12027] text-xs font-medium">LMS Admin</span></h1>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          {MENUS.map((menu) => (
            <button key={menu.id} onClick={() => setActiveView(menu.id)} className={`w-full flex items-center gap-3 px-8 py-3.5 text-sm font-medium transition-all ${activeView === menu.id ? 'sidebar-active' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <menu.icon size={18}/> {menu.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100">
            <button onClick={() => { setStepIndex(0); setRunTour(true); }} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#D12027] mb-4 w-full"><HelpCircle size={14}/> Reset Tutorial</button>
            <button className="flex items-center gap-3 text-slate-500 text-sm font-bold"><LogOut size={18}/> Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen relative bg-[#f8fafc] w-full">
        <header className="h-20 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
           <div className="flex items-center gap-2 text-sm text-slate-500"><span className="hover:text-[#D12027] cursor-pointer">Home</span><ChevronRight size={14}/><span className="font-bold text-slate-800 capitalize">{activeView}</span></div>
           <div className="flex items-center gap-6">
              <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Bell size={20}/><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden md:block"><p className="text-sm font-bold text-slate-800">Admin HR</p><p className="text-xs text-slate-500">Superadmin</p></div>
                 <div className="w-10 h-10 bg-[#D12027] rounded-full text-white flex items-center justify-center font-bold shadow-sm text-sm">HR</div>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
           <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                 <h2 className="text-2xl font-bold text-slate-800 capitalize mb-2">{activeView}</h2>
                 <p className="text-slate-500 text-sm">Manage your organization's learning ecosystem efficiently.</p>
              </div>

              {/* DYNAMIC VIEW RENDERING */}
              {activeView === 'dashboard' && <AnalyticsDashboard onOpenDeptDetail={() => setModalOpen({...modalOpen, deptDetail: true})} />}
              {activeView === 'employees' && <EmployeeManager employees={employees} onAddEmployee={(v) => setModalOpen({...modalOpen, addEmp: v})} />}
              {activeView === 'curriculum' && <CurriculumManager courses={courses} onAddCourse={(v) => setModalOpen({...modalOpen, addCourse: v})} />}
              {activeView === 'requests' && <RequestManager requests={INITIAL_REQUESTS} />}
              
              {/* PLACEHOLDER FOR ANALYTICS VIEW */}
              {activeView === 'analytics' && <div className="text-center py-20 text-slate-400">Analytics Module Loading...</div>}
           </div>
        </main>
      </div>

      {/* MODALS RENDERED HERE */}
      <AddEmployeeModal isOpen={modalOpen.addEmp} onClose={() => setModalOpen({...modalOpen, addEmp: false})} onSave={(d) => setEmployees([...employees, d])} />
      <CreateCourseModal isOpen={modalOpen.addCourse} onClose={() => setModalOpen({...modalOpen, addCourse: false})} onSave={(d) => setCourses([...courses, d])} />
    </div>
  );
};

export default AdminApp;