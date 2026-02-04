import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, Target, TrendingUp, Award, MessageCircle,
  CheckCircle, Play, Zap, ArrowRight, ChevronRight,
  Star, Menu, Home, LogOut, Bell, X, Check, AlertCircle,
  PlayCircle, Lock, RefreshCw, MousePointer, ChevronLeft,
  Lightbulb, Search, MessageSquare, Video, Mic, Headphones,
  FileText, Download, Share2, AlertTriangle, UserCheck,
  ThumbsUp, Calendar, Briefcase, ExternalLink, Clock,
  BarChart2, Send, Plus, Trash2, Camera, MicOff, Sun,
  MoreHorizontal, Edit2, Save, Gauge, LayoutTemplate,
  Loader, ChevronDown, ChevronUp, Coffee, Layers, Unlock,
  Shield, Rocket, Trophy, Medal, Crown, PlusCircle, Sparkles,
  FileSignature, Building, CalendarClock, PenTool, TrendingDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid
} from 'recharts';

// --- 1. GLOBAL STYLES & THEME ---

const KARSA_RED = "#D12027"; // Kartika Sari Red
const KARSA_YELLOW = "#FDB913"; // Accent Yellow
const KARSA_WHITE = "#FFFFFF";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #334155; }
    
    /* Animations */
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pop { 0% { transform: scale(0.9); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
    
    .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    /* Gradients for Leaderboard */
    .bg-gold { background: linear-gradient(135deg, #FDB913 0%, #F59E0B 100%); }
    .bg-silver { background: linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%); }
    .bg-bronze { background: linear-gradient(135deg, #FED7AA 0%, #FB923C 100%); }

    /* Custom UI Elements */
    .btn-primary {
      background: ${KARSA_RED};
      color: white;
      transition: all 0.2s;
    }
    .btn-primary:hover {
      background: #b01b21;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(209, 32, 39, 0.3);
    }
    
    .btn-accent {
      background: ${KARSA_YELLOW};
      color: #7c2d12;
      font-weight: bold;
    }

    .nav-item-active {
      background: linear-gradient(135deg, ${KARSA_RED} 0%, #b01b21 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(209, 32, 39, 0.2);
    }

    .tab-active {
        border-bottom: 3px solid ${KARSA_RED};
        color: ${KARSA_RED};
        font-weight: bold;
    }

    .tab-inactive {
        color: #64748b;
        font-weight: 500;
        border-bottom: 3px solid transparent;
    }
    .tab-inactive:hover {
        color: #334155;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `}</style>
);

// --- 2. DATA CONSTANTS ---

const KARTIKA_LOGO = "https://kartikasari.com/static/img/logo-kartika-sari-new-2.webp";

const MENU_ITEMS = [
    { id: 'dashboard', icon: LayoutTemplate, label: 'KARSA University', mobileLabel: 'Home' }, 
    { id: 'course', icon: BookOpen, label: 'Training Saya', mobileLabel: 'Training' },
    { id: 'community', icon: Users, label: 'Squad Diskusi', mobileLabel: 'Squad' },
    { id: 'analytics', icon: Trophy, label: 'Leaderboard', mobileLabel: 'Rank' },
    { id: 'ideas', icon: Lightbulb, label: 'KARSA Ideas', mobileLabel: 'Ideas' }
];

const INITIAL_USER_DATA = {
  name: "Budi Santoso",
  role: "Sales Staff",
  department: "Frontliner",
  hasAccelerationAccess: true,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&mouth=smile",
  level: 4,
  xp: 1450,
  streak: 12,
  checkedIn: false,
  badges: ["Customer First", "Hygiene Hero"],
  completedModules: [],
  preTestScore: 0,
  postTestScore: 0,
};

const TRAINING_CATEGORIES = [
    {
        id: 'mandatory',
        title: 'Mandatory (Regulations)',
        icon: Shield,
        nurture: [
            { id: 'reg1', title: 'Food Safety Standard (HACCP)', status: 'completed', subtitle: 'Basic Hygiene' },
            { id: 'reg2', title: 'Employee Code of Conduct', status: 'completed', subtitle: 'General Rules' }
        ],
        acceleration: [
            { id: 'acc_reg1', title: 'HACCP Audit Certification', status: 'locked', subtitle: 'Auditor Level' },
            { id: 'acc_reg2', title: 'Crisis Management Protocol', status: 'locked', subtitle: 'Supervisor Handling' }
        ]
    },
    {
        id: 'managerial',
        title: 'Managerial Training',
        icon: Briefcase,
        nurture: [
            { id: 'c1', title: 'Strategic Communication (PREP)', status: 'active', subtitle: 'Role Responsibility: Staff', tag: 'Recommended' },
            { id: 'man2', title: 'Time Management Matrix', status: 'locked', subtitle: 'Personal Productivity' }
        ],
        acceleration: [
            { id: 'acc_man1', title: 'Strategic Negotiation', status: 'locked', subtitle: 'Vendor Management' },
            { id: 'acc_man2', title: 'Team Performance Review', status: 'locked', subtitle: 'KPI Setting' }
        ]
    },
    {
        id: 'leadership',
        title: 'Leadership Training',
        icon: Users,
        nurture: [
            { id: 'lead1', title: 'Self Leadership', status: 'locked', subtitle: 'Owning your tasks' }
        ],
        acceleration: [
            { id: 'acc_lead1', title: 'Situational Leadership II', status: 'locked', subtitle: 'Leading Others' },
            { id: 'acc_lead2', title: 'Emotional Intelligence for Managers', status: 'locked', subtitle: 'Conflict Resolution' }
        ]
    },
    {
        id: 'technical',
        title: 'Technical Training',
        icon: Coffee,
        nurture: [
            { id: 'tech1', title: 'Product Knowledge: Bolen', status: 'completed', subtitle: 'Basic Ingredients' },
            { id: 'tech2', title: 'POS System Operation', status: 'active', subtitle: 'Cashier Basics' }
        ],
        acceleration: [
            { id: 'acc_tech1', title: 'Inventory Management System', status: 'locked', subtitle: 'Stock Control' },
            { id: 'acc_tech2', title: 'Advanced Baking Techniques', status: 'locked', subtitle: 'Pastry Chef Level' }
        ]
    }
];

const MODULES_LIST = [
  { id: "m0", title: "Baseline: Pre-Test Assessment", type: "pre_test", duration: "5:00", category: "Evaluation", xp: 50 },
  { id: "m1", title: "The Art of Communication", type: "video", duration: "13:00", category: "10% Formal", xp: 100 },
  { id: "m2", title: "Framework: The Executive Pitch (PREP)", type: "theory", duration: "15:00", category: "10% Formal", xp: 150 },
  { id: "m3", title: "Ritual: The 'Digital Handshake'", type: "checklist", duration: "8:00", category: "70% Practice", xp: 50 },
  { id: "m4", title: "Lab: Handling Customer Issue", type: "simulation", duration: "15:00", category: "70% Practice", xp: 200 }, 
  { id: "m5", title: "Squad: Peer Review Challenge", type: "peer_review", duration: "10:00", category: "20% Social", xp: 150 },
  { id: "m6", title: "Certification: Final Quiz", type: "quiz", duration: "10:00", category: "Evaluation", xp: 300 },
];

const SQUAD_POSTS = [
  {
    id: 1,
    user: "Siska (Store Mgr)",
    role: "Manager",
    content: "Team, penerapan metode PREP sangat membantu saat handover shift. Lebih singkat dan jelas!",
    likes: 12,
    likedByMe: false,
    time: "2h ago",
    commentsList: []
  },
  {
    id: 2,
    user: "Andi (Baker)",
    role: "Technical",
    content: "Ada yang sudah ambil modul Hygiene terbaru? Kuisnya agak tricky di bagian suhu oven.",
    likes: 8,
    likedByMe: false,
    time: "4h ago",
    commentsList: []
  }
];

const MOCK_LEARNING_LEADERBOARD = [
    { rank: 1, name: "Siska Wijaya", role: "Store Manager", dept: "Operational", xp: 3200, level: 6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska&mouth=smile", label: "Top Learner", trend: 'up' },
    { rank: 2, name: "Andi Pratama", role: "Head Baker", dept: "Kitchen", xp: 2950, level: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi&mouth=smile", trend: 'same' },
    { rank: 3, name: "Rina Melati", role: "Supervisor", dept: "Frontliner", xp: 2800, level: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina&mouth=smile", trend: 'up' },
    { rank: 4, name: "Budi Santoso", role: "Sales Staff", dept: "Frontliner", xp: 1450, level: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&mouth=smile", isMe: true, trend: 'up' },
    { rank: 5, name: "Dedi Kusuma", role: "Logistics", dept: "Warehouse", xp: 1200, level: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi&mouth=smile", trend: 'down' },
    { rank: 6, name: "Sari Indah", role: "Cashier", dept: "Frontliner", xp: 1150, level: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sari&mouth=smile", trend: 'same' },
];

const MOCK_INNOVATION_LEADERBOARD = [
    { rank: 1, name: "Budi Santoso", role: "Sales Staff", dept: "Frontliner", ideasApproved: 5, xp: 500, label: "Top Innovator", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&mouth=smile", isMe: true, trend: 'up' },
    { rank: 2, name: "Andi Pratama", role: "Head Baker", dept: "Kitchen", ideasApproved: 3, xp: 300, label: "Solution Maker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi&mouth=smile", trend: 'up' },
    { rank: 3, name: "Siska Wijaya", role: "Store Manager", dept: "Operational", ideasApproved: 2, xp: 200, label: "Initiator", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska&mouth=smile", trend: 'down' },
    { rank: 4, name: "Dedi Kusuma", role: "Logistics", dept: "Warehouse", ideasApproved: 1, xp: 100, label: "Contributor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dedi&mouth=smile", trend: 'same' },
];

const CHART_DATA_DEPT = [
    { name: 'Frontliner', completion: 85 },
    { name: 'Kitchen', completion: 92 },
    { name: 'Warehouse', completion: 78 },
    { name: 'Office', completion: 65 },
];

const MOCK_IDEAS = [
    { id: 1, title: "Optimasi Packing Bolen", category: "Technical", desc: "Menggunakan teknik lipatan baru untuk mengurangi waktu packing 5 detik/box.", status: "Approved", feedback: "Great idea! Will be tested in Batch 2.", date: "10 Oct 2023" },
    { id: 2, title: "Checklist Handover Digital", category: "Managerial", desc: "Mengganti buku log fisik dengan Google Form agar data bisa ditarik real-time.", status: "Review", feedback: "Under review by HR.", date: "15 Oct 2023" },
];

const MOCK_TRAINING_REQUESTS = [
    { id: 1, title: "Advanced Latte Art Workshop", provider: "External", vendor: "Barista Academy BDG", date: "2023-11-20", status: "Approved", currentStep: 3 },
    { id: 2, title: "Customer Service Excellence", provider: "Internal", vendor: "HR Dept", date: "2023-12-05", status: "Waiting HR", currentStep: 2 },
];

// --- 3. HELPER COMPONENTS ---

const LevelBar = ({ xp, level }) => {
  const nextLevelXp = (level + 1) * 500;
  const progress = ((xp % 500) / 500) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold text-[#D12027]">Lvl {level}</span>
        <span className="text-slate-400">{xp} / {nextLevelXp} XP</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#D12027] to-[#FDB913] transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }}></div>
      </div>
    </div>
  );
};

// --- 4. MODULE COMPONENTS ---

// MODULE 0: PRE-TEST
const PreTestLesson = ({ onComplete, updateUser }) => {
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: 1, q: "Apa kepanjangan dari PREP?", options: ["Point, Reason, Example, Point", "Plan, Review, Execute, Publish"], correct: 0 },
    { id: 2, q: "Dalam komunikasi 'High Context', kita mengandalkan:", options: ["Kata-kata eksplisit", "Pemahaman tersirat & sopan santun"], correct: 1 },
    { id: 3, q: "Aturan 7-38-55 membahas tentang:", options: ["Manajemen Waktu Baking", "Komunikasi Non-Verbal"], correct: 1 }
  ];

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) s++; });
    const finalScore = Math.round((s / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    updateUser({ preTestScore: finalScore });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-red-50 text-[#D12027] rounded-full mb-3"><BarChart2 size={24}/></div>
        <h2 className="text-2xl font-bold text-slate-800">Baseline Assessment</h2>
        <p className="text-slate-500">Mari cek pengetahuan awal Anda tentang Komunikasi Efektif.</p>
      </div>
      {!submitted ? (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="font-bold text-slate-800 mb-3">{q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <button key={optIdx} onClick={() => setAnswers({...answers, [i]: optIdx})} className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${answers[i] === optIdx ? 'bg-[#D12027] text-white border-[#D12027]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length} className="btn-primary w-full py-3 rounded-xl font-bold">Submit Baseline</button>
        </div>
      ) : (
        <div className="text-center animate-pop bg-white p-8 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Skor Awal: {score}%</h3>
          <p className="text-slate-500 mb-6">Jangan khawatir, course ini akan membantu Anda meningkatkannya!</p>
          <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold">Mulai Belajar</button>
        </div>
      )}
    </div>
  );
};

// MODULE 1: VIDEO
const VideoLesson = ({ onComplete }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
        <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-lg">Video Player Placeholder (YouTube Embed)</p>
        </div>
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/lg48Bi9DA54" title="Video" className="relative z-10 opacity-90" allowFullScreen></iframe>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Pentingnya Kejelasan</h3>
            <p className="text-sm text-slate-500">Mengapa komunikasi yang berbelit-belit merugikan operasional toko.</p>
          </div>
          <button onClick={onComplete} className="btn-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2">Selesai Menonton <CheckCircle size={18}/></button>
      </div>
    </div>
  );
};

// MODULE 2: PREP BUILDER (Theory)
const TheoryLesson = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "POINT", task: "Manager bertanya: 'Bagaimana stok Pisang Bolen?' Pilih jawaban terbaik:", options: [{txt: "Hmm, anu pak, tadi supplier agak telat...", correct: false}, {txt: "Stok aman untuk 2 jam ke depan, tapi butuh restock jam 2 siang.", correct: true}] },
    { title: "REASON", task: "Jelaskan 'Kenapa' butuh restock jam 2?", options: [{txt: "Karena prediksi sales weekend meningkat 20%.", correct: true}, {txt: "Ya biar aman aja pak.", correct: false}] },
    { title: "EVIDENCE", task: "Berikan data pendukung:", options: [{txt: "Feeling saya sih bakal ramai.", correct: false}, {txt: "Data POS menunjukkan lonjakan traffic jam 3 sore.", correct: true}] },
    { title: "POINT", task: "Tutup dengan kesimpulan/aksi:", options: [{txt: "Jadi tolong approve PO tambahan sekarang.", correct: true}, {txt: "Gimana menurut bapak?", correct: false}] }
  ];

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center animate-fadeIn text-center">
      <h2 className="text-3xl font-black text-[#D12027] mb-2">Latihan PREP</h2>
      <p className="text-slate-500 mb-8">Susun kalimat yang efektif untuk laporan ke atasan.</p>
      
      <div className="flex justify-center gap-2 mb-8">
        {['P','R','E','P'].map((l, i) => (
          <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${i === step ? 'bg-[#D12027] text-white border-[#D12027] scale-110' : i < step ? 'bg-green-500 text-white border-green-500' : 'bg-slate-100 text-slate-300'}`}>{l}</div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border shadow-lg relative">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{steps[step].title}</h3>
        <p className="mb-6 text-slate-600">{steps[step].task}</p>
        <div className="space-y-3">
          {steps[step].options.map((opt, i) => (
            <button key={i} onClick={() => opt.correct ? (step < 3 ? setStep(s=>s+1) : onComplete()) : alert("Kurang tepat, coba lagi.")} className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-[#D12027] hover:bg-red-50 font-medium text-left transition-all">
              {opt.txt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// MODULE 4: SIMULATION
const SimulationLesson = ({ onComplete }) => {
  const [msgs, setMsgs] = useState([{ sender: 'boss', text: 'Budi, ada komplain customer soal brownies yang agak keras. Gimana situasinya?' }]);
  const [step, setStep] = useState(0);

  const choices = [
    [
      { txt: "Waduh gatau bu, resep dari pusat kan gitu.", correct: false },
      { txt: "P: Kami sudah cek batch pagi. R: Ada deviasi suhu oven. E: 3 loyang terdampak.", correct: true }
    ],
    [
      { txt: "Solusi: Kami tarik produk batch tersebut dan ganti baru untuk customer.", correct: true },
      { txt: "Solusi: Ya kita minta maaf aja bu.", correct: false }
    ]
  ];

  const handleChoice = (c) => {
    setMsgs([...msgs, { sender: 'me', text: c.txt }, { sender: 'boss', text: c.correct ? "Oke, good response. Lanjutkan." : "Kurang tepat. Coba lebih solutif." }]);
    if(c.correct) {
      if(step < 1) setStep(s => s+1);
      else setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-slate-50 rounded-2xl border shadow-lg overflow-hidden animate-fadeIn">
      <div className="bg-[#D12027] p-4 text-white flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Users size={16}/></div>
        <span className="font-bold">Store Manager</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-[#D12027] text-white rounded-br-none' : 'bg-white border text-slate-700 rounded-bl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t space-y-2">
        {step < 2 ? choices[step].map((c, i) => (
          <button key={i} onClick={() => handleChoice(c)} className="w-full p-3 border rounded-xl text-sm text-left hover:bg-slate-50 transition-colors">
            {c.txt}
          </button>
        )) : <div className="text-center text-green-600 font-bold">Simulasi Selesai!</div>}
      </div>
    </div>
  );
};

// --- 5. MAIN COMPONENTS ---

const LoginScreen = ({ onLogin }) => (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="bg-[#D12027] p-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 <img src={KARTIKA_LOGO} alt="Logo" className="h-12 brightness-0 invert mx-auto mb-4 relative z-10"/>
                 <h1 className="text-2xl font-bold text-white relative z-10">KARSA University</h1>
                 <p className="text-red-100 relative z-10">Portal Learning & Innovation</p>
            </div>
            <div className="p-8 space-y-4">
                <p className="text-center text-slate-500 text-sm mb-4">Silakan login untuk melanjutkan training.</p>
                <button onClick={() => onLogin(false)} className="w-full bg-white border-2 border-slate-100 hover:border-[#D12027] hover:bg-red-50 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-between px-6 group shadow-sm hover:shadow-md">
                    <div className="text-left">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Login as</span>
                        <span className="text-lg flex items-center gap-2"><UserCheck size={18}/> Staff / Frontliner</span>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-[#D12027] transition-colors" />
                </button>
                <button onClick={() => onLogin(true)} className="w-full bg-white border-2 border-slate-100 hover:border-[#FDB913] hover:bg-yellow-50 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-between px-6 group shadow-sm hover:shadow-md">
                    <div className="text-left">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Login as</span>
                        <span className="text-lg flex items-center gap-2"><Crown size={18}/> Supervisor (Access)</span>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-[#FDB913] transition-colors" />
                </button>
            </div>
            <div className="bg-slate-50 p-4 text-center text-xs text-slate-400">
                &copy; 2024 Kartika Sari Internal Development
            </div>
        </div>
    </div>
);

// --- NEW COMPONENT: TRAINING REQUEST SYSTEM ---

const TrainingRequestView = () => {
    const [activeTab, setActiveTab] = useState('form');
    const [requests, setRequests] = useState(MOCK_TRAINING_REQUESTS);
    const [form, setForm] = useState({ title: '', provider: 'Internal', vendor: '', reason: '', date: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const newRequest = {
                id: Date.now(),
                title: form.title,
                provider: form.provider,
                vendor: form.provider === 'Internal' ? 'Kartika Sari L&D' : form.vendor,
                date: form.date,
                status: "Waiting SPV",
                currentStep: 1 // 1: SPV, 2: HR, 3: Approved
            };
            setRequests([newRequest, ...requests]);
            setForm({ title: '', provider: 'Internal', vendor: '', reason: '', date: '' });
            setIsSubmitting(false);
            setActiveTab('history');
        }, 1500);
    };

    const getStatusColor = (status) => {
        if(status.includes('Approved')) return 'text-green-600 bg-green-50 border-green-200';
        if(status.includes('Waiting')) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
        return 'text-slate-500 bg-slate-100';
    };

    const getProgressWidth = (step) => {
        if(step === 1) return '33%';
        if(step === 2) return '66%';
        if(step === 3) return '100%';
        return '0%';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                           <FileSignature className="text-[#D12027]"/> Request Offline Training
                        </h2>
                        <p className="text-slate-500 mt-1">Submit request for internal workshops or external vendor training.</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-white shadow-sm text-[#D12027]' : 'text-slate-500'}`}>New Request</button>
                        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-[#D12027]' : 'text-slate-500'}`}>My History</button>
                    </div>
                </div>

                {activeTab === 'form' ? (
                    <div className="animate-fadeIn max-w-3xl">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Training Topic / Title</label>
                                <input 
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100" 
                                    placeholder="Ex: Advanced Pastry Technique..."
                                    value={form.title}
                                    onChange={e => setForm({...form, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Provider Type</label>
                                <select 
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100"
                                    value={form.provider}
                                    onChange={e => setForm({...form, provider: e.target.value})}
                                >
                                    <option value="Internal">Internal (Kartika Sari Expert)</option>
                                    <option value="External">External Vendor / Course</option>
                                </select>
                            </div>
                        </div>

                        {form.provider === 'External' && (
                             <div className="space-y-2 mb-6 animate-slideIn">
                                <label className="text-sm font-bold text-slate-700">Vendor Name & Contact</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                    <input 
                                        className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100" 
                                        placeholder="Enter vendor details..."
                                        value={form.vendor}
                                        onChange={e => setForm({...form, vendor: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Preferred Date</label>
                                <input 
                                    type="date"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 text-slate-600"
                                    value={form.date}
                                    onChange={e => setForm({...form, date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Business Justification</label>
                                <textarea 
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 h-[52px]" 
                                    placeholder="Why is this training needed?"
                                    value={form.reason}
                                    onChange={e => setForm({...form, reason: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 mb-8">
                            <div className="mt-1"><AlertCircle size={18} className="text-blue-600"/></div>
                            <div>
                                <p className="text-sm font-bold text-blue-800">Approval Workflow Required</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    External training requests require approval from:
                                    <span className="font-bold"> 1. Direct Supervisor</span> &rarr;
                                    <span className="font-bold"> 2. HR Manager</span>.
                                </p>
                            </div>
                        </div>

                        <button 
                            disabled={!form.title || !form.date || (form.provider === 'External' && !form.vendor) || isSubmitting}
                            onClick={handleSubmit}
                            className="btn-primary w-full md:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? 'Submitting Request...' : <><Send size={18}/> Submit Request</>}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fadeIn">
                        {requests.map((req) => (
                            <div key={req.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${req.provider === 'External' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{req.provider}</span>
                                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><CalendarClock size={12}/> {req.date}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800">{req.title}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><Building size={14}/> {req.vendor}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        <span className={req.currentStep >= 1 ? 'text-[#D12027]' : ''}>1. Supervisor</span>
                                        <span className={req.currentStep >= 2 ? 'text-[#D12027]' : ''}>2. HR Dept</span>
                                        <span className={req.currentStep >= 3 ? 'text-green-600' : ''}>3. Scheduled</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                                        <div className="absolute top-0 left-0 h-full bg-slate-200 w-full"></div>
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-[#D12027] transition-all duration-500" 
                                            style={{width: getProgressWidth(req.currentStep)}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CoursePlayer = ({ user, updateUser, onBack }) => {
    const [activeModule, setActiveModule] = useState(MODULES_LIST[0]);
  
    const handleComplete = () => {
      const currentIndex = MODULES_LIST.findIndex(m => m.id === activeModule.id);
      if(currentIndex < MODULES_LIST.length - 1) {
          setActiveModule(MODULES_LIST[currentIndex + 1]);
      } else {
        alert("Selamat! Anda telah menyelesaikan rangkaian modul ini.");
        onBack();
      }
      
      // Prevent adding duplicate completion
      if (!user.completedModules.includes(activeModule.id)) {
          updateUser({
              xp: user.xp + activeModule.xp,
              completedModules: [...user.completedModules, activeModule.id]
          });
      }
    };
  
    return (
      <div className="flex flex-col h-[75vh] bg-white rounded-b-2xl overflow-hidden border border-t-0 border-slate-200 shadow-xl animate-slideIn">
          <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-72 border-r overflow-y-auto p-4 space-y-2 bg-slate-50 hidden md:block">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3 px-2">Course Modules</h4>
                  {MODULES_LIST.map(m => {
                      const isActive = activeModule.id === m.id;
                      const isCompleted = user.completedModules.includes(m.id);
                      
                      return (
                        <button 
                            key={m.id} 
                            onClick={() => setActiveModule(m)} 
                            className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all relative overflow-hidden group
                                ${isActive ? 'bg-[#D12027] text-white shadow-md' : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-300'}
                            `}
                        >
                            <div className="flex justify-between mb-1 relative z-10">
                                <span className={`flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {isCompleted ? <CheckCircle size={12}/> : <PlayCircle size={12}/>}
                                    {m.type.toUpperCase().replace('_', ' ')}
                                </span>
                                <span className="opacity-80">{m.duration}</span>
                            </div>
                            <div className="relative z-10 text-sm">{m.title}</div>
                        </button>
                      )
                  })}
              </div>
              {/* Main Content */}
              <div className="flex-1 relative bg-slate-100">
                  <div className="absolute inset-0 overflow-y-auto p-4 md:p-8">
                      {activeModule.id === 'm0' && <PreTestLesson onComplete={handleComplete} updateUser={updateUser} />}
                      {activeModule.id === 'm1' && <VideoLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm2' && <TheoryLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm4' && <SimulationLesson onComplete={handleComplete} />}
                      
                      {/* Placeholder for locked/unimplemented modules */}
                      {['m3', 'm5', 'm6'].includes(activeModule.id) && (
                          <div className="flex items-center justify-center h-full flex-col text-center">
                              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                  <Lock size={32} className="text-slate-400"/>
                              </div>
                              <h3 className="text-xl font-bold text-slate-700 mb-2">Modul Sedang Dipersiapkan</h3>
                              <p className="text-slate-500 max-w-md mx-auto mb-8">Modul ini belum tersedia dalam versi demo. Anda dapat melewati modul ini untuk melihat modul selanjutnya.</p>
                              <button onClick={handleComplete} className="btn-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all">
                                  Skip & Complete (+{activeModule.xp} XP)
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    )
  }

const TrainingCenter = ({ user, updateUser, onBack }) => {
    const [activeTab, setActiveTab] = useState('lms');

    return (
        <div className="animate-slideIn">
             <div className="flex items-center gap-2 mb-4">
                 <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><ChevronLeft size={20}/></button>
                 <h2 className="text-2xl font-bold text-slate-800">Training Center</h2>
             </div>
             
             <div className="flex gap-1 bg-white p-1 rounded-t-2xl border-b border-slate-200 w-fit">
                 <button 
                    onClick={() => setActiveTab('lms')}
                    className={`px-6 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'lms' ? 'text-[#D12027] border-[#D12027] bg-red-50' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}
                 >
                    <BookOpen size={16}/> E-Learning (LMS)
                 </button>
                 <button 
                    onClick={() => setActiveTab('offline')}
                    className={`px-6 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'offline' ? 'text-[#D12027] border-[#D12027] bg-red-50' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}
                 >
                    <PenTool size={16}/> Request Offline Training
                 </button>
             </div>

             <div className="bg-white min-h-[500px] rounded-b-2xl rounded-tr-2xl shadow-sm border border-slate-200 p-0 overflow-hidden">
                 {activeTab === 'lms' ? (
                     <CoursePlayer user={user} updateUser={updateUser} onBack={onBack}/>
                 ) : (
                     <div className="p-8">
                         <TrainingRequestView />
                     </div>
                 )}
             </div>
        </div>
    );
};

const SquadFeed = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-slideIn">
        <div className="bg-gradient-to-r from-[#D12027] to-[#b01b21] rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="text-[#FDB913]"/> Squad Diskusi</h2>
                <p className="text-red-100 text-sm">Berbagi insight dan tanya jawab seputar operasional.</p>
            </div>
            <div className="hidden md:block">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#D12027] bg-slate-200 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user"/>
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#D12027] bg-white text-[#D12027] flex items-center justify-center font-bold text-xs">+12</div>
                </div>
            </div>
        </div>

        {/* Post Input */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <textarea className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all" rows="3" placeholder="Bagikan progress belajar atau tanya sesuatu ke squad..."></textarea>
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Camera size={18}/></button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Video size={18}/></button>
                </div>
                <button className="btn-primary px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <Send size={14} /> Post
                </button>
            </div>
        </div>

        {/* Feed */}
        {SQUAD_POSTS.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 border border-slate-100 overflow-hidden">
                             <span className="text-xs">{post.user.substring(0,2)}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{post.user}</p>
                            <p className="text-xs text-slate-400">{post.role} • {post.time}</p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16}/></button>
                </div>
                <p className="text-slate-700 text-sm mb-4 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-6 border-t border-slate-50 pt-4">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-[#D12027] text-sm font-bold transition-colors"><ThumbsUp size={16}/> {post.likes} Likes</button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm font-bold transition-colors"><MessageSquare size={16}/> Comment</button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-green-600 text-sm font-bold ml-auto transition-colors"><Share2 size={16}/> Share</button>
                </div>
            </div>
        ))}
    </div>
);

const SuggestionSystem = () => {
    const [activeTab, setActiveTab] = useState('submit');
    const [form, setForm] = useState({ title: '', category: '', problem: '', solution: '', impact: '' });
    const [submittedIdeas, setSubmittedIdeas] = useState(MOCK_IDEAS);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            const newIdea = {
                id: Date.now(),
                title: form.title,
                category: form.category,
                desc: form.solution,
                status: "Pending",
                feedback: "Awaiting Review",
                date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            };
            setSubmittedIdeas([newIdea, ...submittedIdeas]);
            setForm({ title: '', category: '', problem: '', solution: '', impact: '' });
            setIsSubmitting(false);
            setActiveTab('history');
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Lightbulb className="text-[#FDB913]"/> KARSA Ideas</h2>
                    <p className="text-slate-300 max-w-xl">Punya ide perbaikan berdasarkan training yang sudah dipelajari? Sampaikan di sini.</p>
                </div>
            </div>

            <div className="flex gap-6 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('submit')} 
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'submit' ? 'text-[#D12027] border-b-2 border-[#D12027]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <PlusCircle size={16}/> Submit New Idea
                </button>
                <button 
                    onClick={() => setActiveTab('history')} 
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'history' ? 'text-[#D12027] border-b-2 border-[#D12027]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <FileText size={16}/> My Submissions
                </button>
            </div>

            {activeTab === 'submit' ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-slideIn">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Judul Inovasi</label>
                            <input 
                                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100" 
                                placeholder="Contoh: Efisiensi Packing..."
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Kategori</label>
                            <select 
                                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100"
                                value={form.category}
                                onChange={e => setForm({...form, category: e.target.value})}
                            >
                                <option value="">Pilih Kategori...</option>
                                <option value="Managerial">Managerial</option>
                                <option value="Technical">Technical</option>
                                <option value="Operational">Operational</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-bold text-slate-700">Ide Perbaikan</label>
                        <textarea 
                            className="w-full p-3 border border-slate-200 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-red-100"
                            placeholder="Jelaskan ide perbaikan Anda..."
                            value={form.solution}
                            onChange={e => setForm({...form, solution: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            disabled={!form.title || !form.category || !form.solution || isSubmitting}
                            onClick={handleSubmit}
                            className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? 'Submitting...' : <><Send size={18}/> Kirim Ide</>}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 animate-slideIn">
                    {submittedIdeas.map((idea) => (
                        <div key={idea.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">{idea.category} • {idea.date}</span>
                                    <h4 className="text-lg font-bold text-slate-800">{idea.title}</h4>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${idea.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{idea.status}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">{idea.desc}</p>
                            {idea.feedback && (
                                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 flex items-start gap-2">
                                    <MessageSquare size={14} className="mt-0.5 shrink-0"/>
                                    <div><span className="font-bold">Feedback:</span> {idea.feedback}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const LeaderboardView = ({ user }) => {
    const [viewMode, setViewMode] = useState('learning'); 
    
    const currentLeaderboard = viewMode === 'learning' 
        ? [...MOCK_LEARNING_LEADERBOARD].sort((a, b) => b.xp - a.xp) 
        : [...MOCK_INNOVATION_LEADERBOARD].sort((a, b) => b.ideasApproved - a.ideasApproved);

    const topThree = currentLeaderboard.slice(0, 3);
    const rest = currentLeaderboard.slice(3);

    const getRankStyle = (index) => {
        if (index === 0) return { bg: 'bg-gold', border: 'border-yellow-400', shadow: 'shadow-yellow-200', text: 'text-yellow-800', crown: '#7c2d12' };
        if (index === 1) return { bg: 'bg-silver', border: 'border-slate-300', shadow: 'shadow-slate-200', text: 'text-slate-800', crown: '#475569' };
        if (index === 2) return { bg: 'bg-bronze', border: 'border-orange-300', shadow: 'shadow-orange-200', text: 'text-orange-900', crown: '#7c2d12' };
        return {};
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
             {/* Mode Switcher */}
             <div className="flex justify-center mb-6">
                 <div className="bg-slate-100 p-1 rounded-xl inline-flex gap-1 shadow-inner">
                     <button 
                        onClick={() => setViewMode('learning')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'learning' ? 'bg-white text-[#D12027] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                         <BookOpen size={16}/> Top Learners
                     </button>
                     <button 
                        onClick={() => setViewMode('innovator')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'innovator' ? 'bg-white text-[#FDB913] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                         <Lightbulb size={16}/> Top Innovators
                     </button>
                 </div>
             </div>

             {/* Personal Stats Grid */}
             <div className="grid md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">Your Rank</p>
                        <h3 className="text-4xl font-black text-slate-800">#4</h3>
                    </div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Trophy size={28} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">Total XP</p>
                        <h3 className="text-4xl font-black text-slate-800">{user.xp.toLocaleString()}</h3>
                    </div>
                    <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center"><Zap size={28} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">Avg Completion</p>
                        <h3 className="text-4xl font-black text-slate-800">82%</h3>
                    </div>
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><Target size={28} /></div>
                </div>
             </div>

             {/* Podium Section */}
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-hidden text-center min-h-[400px] flex flex-col">
                         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white opacity-50"></div>
                         
                         <h3 className="font-black text-2xl text-slate-800 mb-12 relative z-10 flex items-center justify-center gap-2 uppercase tracking-tight">
                             <Crown size={28} className="text-[#FDB913] fill-[#FDB913]"/> {viewMode === 'learning' ? 'Monthly Champions' : 'Innovation Heroes'}
                         </h3>

                         <div className="flex justify-center items-end gap-4 md:gap-8 relative z-10 flex-1">
                             {/* 2nd Place */}
                             {topThree[1] && (
                                <div className="flex flex-col items-center w-1/3">
                                    <div className="relative mb-3">
                                        <div className="w-20 h-20 rounded-full border-4 border-slate-200 shadow-lg overflow-hidden relative z-10">
                                            <img src={topThree[1].avatar} alt="2nd" className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm z-20">
                                            2nd
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 truncate w-full text-center">{topThree[1].name}</p>
                                    <p className="text-xs text-slate-500 font-medium mb-2">{topThree[1].dept}</p>
                                    <div className={`w-full ${getRankStyle(1).bg} rounded-t-xl flex items-end justify-center pb-4 shadow-inner h-32 relative group`}>
                                        <div className="text-slate-600 font-black text-lg opacity-30 group-hover:opacity-50 transition-opacity">
                                            {viewMode === 'learning' ? topThree[1].xp : topThree[1].ideasApproved}
                                        </div>
                                    </div>
                                </div>
                             )}
                             
                             {/* 1st Place */}
                             {topThree[0] && (
                                <div className="flex flex-col items-center w-1/3 -mt-10">
                                    <div className="relative mb-3">
                                        <div className="w-28 h-28 rounded-full border-4 border-[#FDB913] shadow-xl overflow-hidden relative z-10">
                                            <img src={topThree[0].avatar} alt="1st" className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FDB913] text-white px-3 py-1 rounded-md text-sm font-bold shadow-md z-20">
                                            1st
                                        </div>
                                    </div>
                                    <p className="text-base font-bold text-slate-800 truncate w-full text-center">{topThree[0].name}</p>
                                    <div className="bg-[#D12027] text-white text-[10px] px-2 py-0.5 rounded-full font-bold mb-1 shadow-sm">Department Champion</div>
                                    <div className={`w-full ${getRankStyle(0).bg} rounded-t-xl flex items-end justify-center pb-6 shadow-inner h-44 relative group`}>
                                         <div className="text-yellow-800 font-black text-2xl opacity-30 group-hover:opacity-50 transition-opacity">
                                            {viewMode === 'learning' ? topThree[0].xp : topThree[0].ideasApproved}
                                        </div>
                                    </div>
                                </div>
                             )}

                             {/* 3rd Place */}
                             {topThree[2] && (
                                 <div className="flex flex-col items-center w-1/3">
                                    <div className="relative mb-3">
                                        <div className="w-20 h-20 rounded-full border-4 border-orange-200 shadow-lg overflow-hidden relative z-10">
                                            <img src={topThree[2].avatar} alt="3rd" className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-200 text-orange-800 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm z-20">
                                            3rd
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 truncate w-full text-center">{topThree[2].name}</p>
                                    <p className="text-xs text-slate-500 font-medium mb-2">{topThree[2].dept}</p>
                                    <div className={`w-full ${getRankStyle(2).bg} rounded-t-xl flex items-end justify-center pb-4 shadow-inner h-24 relative group`}>
                                        <div className="text-orange-900 font-black text-lg opacity-30 group-hover:opacity-50 transition-opacity">
                                            {viewMode === 'learning' ? topThree[2].xp : topThree[2].ideasApproved}
                                        </div>
                                    </div>
                                 </div>
                             )}
                         </div>
                     </div>

                     {/* Rest of the list */}
                     <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                         <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                             <h3 className="font-bold text-slate-800">Global Rankings</h3>
                             <button className="text-xs font-bold text-blue-600 hover:underline">View Full Report</button>
                         </div>
                         <div className="divide-y divide-slate-100">
                             {rest.map((entry) => (
                                 <div key={entry.rank} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${entry.isMe ? 'bg-blue-50/50' : ''}`}>
                                     <div className="flex items-center gap-4">
                                         <div className="w-8 text-center font-bold text-slate-400 text-lg">#{entry.rank}</div>
                                         <div className="relative">
                                            <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full bg-slate-200"/>
                                            {entry.isMe && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>}
                                         </div>
                                         <div>
                                             <div className="flex items-center gap-2">
                                                <p className={`text-sm font-bold ${entry.isMe ? 'text-[#D12027]' : 'text-slate-700'}`}>{entry.name} {entry.isMe && '(You)'}</p>
                                                {entry.trend === 'up' && <TrendingUp size={12} className="text-green-500"/>}
                                                {entry.trend === 'down' && <TrendingDown size={12} className="text-red-500"/>}
                                             </div>
                                             <p className="text-xs text-slate-400">{entry.role} • {entry.dept}</p>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-sm font-bold text-slate-700 font-mono">{viewMode === 'learning' ? `${entry.xp.toLocaleString()} XP` : `${entry.ideasApproved} Approved`}</p>
                                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{viewMode === 'learning' ? `Level ${entry.level}` : entry.label}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">Completion by Department</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CHART_DATA_DEPT} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="completion" radius={[0, 4, 4, 0]} barSize={20}>
                                        {CHART_DATA_DEPT.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 1 ? '#D12027' : '#e2e8f0'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-[#D12027] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="font-bold text-lg mb-2 relative z-10">Department Race</h3>
                        <p className="text-red-100 text-sm mb-4 relative z-10">Your department "Frontliner" is currently #2. Complete 5 more modules to take the lead!</p>
                        <button className="w-full bg-white text-[#D12027] font-bold py-2 rounded-lg text-sm shadow-sm relative z-10">Go to Learning</button>
                    </div>
                </div>
             </div>
        </div>
    );
};

const Dashboard = ({ user, setView, onToggleAccess }) => {
  const [activeTab, setActiveTab] = useState('nurture');

  return (
    <div className="space-y-8 animate-slideIn">
      <div className="relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang, {user.name}</h2>
            <p className="text-slate-500 mb-6">Di Portal KARSA University. Teruslah berkembang bersama Kartika Sari.</p>
            <div className="flex gap-4">
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400">Posisi Saat Ini</p>
                    <p className="font-bold text-[#D12027]">{user.role}</p>
                </div>
                {user.hasAccelerationAccess && (
                     <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={onToggleAccess}>
                     <p className="text-xs text-yellow-600">Status Akses</p>
                     <p className="font-bold text-yellow-700 flex items-center gap-1"><Star size={12}/> Acceleration Granted</p>
                 </div>
                )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg relative">
            <LevelBar xp={user.xp} level={user.level} />
            <div className="mt-4 flex gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1"><Zap size={14} className="text-red-500"/> {user.streak} Hari Streak</div>
              <div className="flex items-center gap-1"><Award size={14} className="text-yellow-500"/> {user.badges.length} Badges</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-slate-200 px-2">
        <button 
            onClick={() => setActiveTab('nurture')}
            className={`pb-4 text-sm flex items-center gap-2 transition-all ${activeTab === 'nurture' ? 'tab-active' : 'tab-inactive'}`}
        >
            <Shield size={18}/> KARSA Nurture (Mandatory)
        </button>
        {user.hasAccelerationAccess ? (
            <button 
                onClick={() => setActiveTab('acceleration')}
                className={`pb-4 text-sm flex items-center gap-2 transition-all ${activeTab === 'acceleration' ? 'tab-active' : 'tab-inactive'}`}
            >
                <Rocket size={18}/> KARSA Acceleration
            </button>
        ) : (
            <div className="pb-4 text-sm flex items-center gap-2 text-slate-300 cursor-not-allowed">
                <Lock size={16}/> KARSA Acceleration (Locked)
            </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-bold text-slate-800 text-xl">{activeTab === 'nurture' ? 'Program Nurture (Staff Level)' : 'Program Acceleration (Next Level)'}</h3>
                <p className="text-sm text-slate-500">{activeTab === 'nurture' ? 'Materi wajib dan pengembangan dasar sesuai role Anda.' : 'Materi privilege untuk persiapan promosi ke level selanjutnya.'}</p>
            </div>
            {activeTab === 'acceleration' && <span className="bg-[#FDB913] text-[#7c2d12] px-3 py-1 rounded-full text-xs font-bold shadow-sm">Privilege Access</span>}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRAINING_CATEGORIES.map((cat) => {
                const courses = activeTab === 'nurture' ? cat.nurture : cat.acceleration;
                const isAccel = activeTab === 'acceleration';
                return (
                    <div key={cat.id} className={`bg-white rounded-2xl border p-5 flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1 ${isAccel ? 'border-yellow-200' : 'border-slate-200'}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isAccel ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-[#D12027]'}`}>
                            <cat.icon size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1">{cat.title}</h4>
                        <p className="text-xs text-slate-400 mb-4">{isAccel ? 'Level: Supervisor/Manager' : 'Level: Staff'}</p>
                        <div className="space-y-3 mt-auto">
                            {courses.map((course, idx) => (
                                <button 
                                    key={idx}
                                    disabled={course.status === 'locked'}
                                    onClick={() => course.id === 'c1' ? setView('course') : null}
                                    className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between group transition-colors
                                        ${course.status === 'active' ? 'bg-red-50 border-red-100 cursor-pointer hover:bg-red-100' : 
                                          course.status === 'completed' ? 'bg-green-50 border-green-100 cursor-default' : 
                                          'bg-slate-50 border-slate-100 opacity-70 cursor-not-allowed'}
                                    `}
                                >
                                    <div>
                                        <span className={`font-bold block ${course.status === 'active' ? 'text-[#D12027]' : course.status === 'completed' ? 'text-green-700' : 'text-slate-600'}`}>{course.title}</span>
                                        {course.subtitle && <span className="text-[9px] text-slate-400 block mt-0.5">{course.subtitle}</span>}
                                    </div>
                                    {course.status === 'locked' ? <Lock size={12} className="text-slate-400"/> : course.status === 'completed' ? <CheckCircle size={14} className="text-green-600"/> : <PlayCircle size={14} className="text-[#D12027]"/>}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

const UserApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(INITIAL_USER_DATA);

  const handleLogin = (hasAccess) => {
      setUser({...user, hasAccelerationAccess: hasAccess});
      setIsAuthenticated(true);
  };

  const toggleAccess = () => {
      setUser(prev => ({...prev, hasAccelerationAccess: !prev.hasAccelerationAccess}));
  };

  const updateUser = (data) => setUser(prev => ({...prev, ...data}));

  if (!isAuthenticated) return <><GlobalStyles /><LoginScreen onLogin={handleLogin} /></>;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <GlobalStyles />
      <aside className="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-lg lg:shadow-none">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-center mb-10 bg-[#D12027] p-4 rounded-xl shadow-lg">
              <img src={KARTIKA_LOGO} alt="Logo" className="h-8 brightness-0 invert"/>
          </div>
          <nav className="flex-1 space-y-2">
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Menu Utama</div>
            {[
                { id: 'dashboard', icon: LayoutTemplate, label: 'KARSA University' }, 
                { id: 'course', icon: BookOpen, label: 'Training Saya' },
                { id: 'community', icon: Users, label: 'Squad Diskusi' },
                { id: 'analytics', icon: Trophy, label: 'Leaderboard' },
                { id: 'ideas', icon: Lightbulb, label: 'KARSA Ideas' }
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentView === item.id ? 'nav-item-active' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-3">
              <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
              <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-700 capitalize">
                 {currentView === 'dashboard' ? 'Portal KARSA University' : 
                  currentView === 'analytics' ? 'Learning Dashboard & Leaderboard' : 
                  currentView === 'ideas' ? 'Continuous Improvement System' : currentView.replace('_', ' ')}
              </h2>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#D12027] rounded-full text-xs font-bold border border-red-100 shadow-sm">
                  <Zap size={14} fill="#D12027" /><span>{user.streak} Days</span>
              </div>
              <div className="bg-[#FDB913] text-[#7c2d12] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star size={12} fill="#7c2d12" /> {user.xp} XP
              </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto">
            {currentView === 'dashboard' && <Dashboard user={user} setView={setCurrentView} onToggleAccess={toggleAccess}/>}
            {/* Replaced direct CoursePlayer with TrainingCenter */}
            {currentView === 'course' && <TrainingCenter user={user} updateUser={updateUser} onBack={() => setCurrentView('dashboard')} />}
            {currentView === 'community' && <SquadFeed />}
            {currentView === 'analytics' && <LeaderboardView user={user} />}
            {currentView === 'ideas' && <SuggestionSystem />}
          </div>
        </main>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-6 py-3 flex justify-between items-center pb-safe">
            {MENU_ITEMS.map(item => (
                <button 
                    key={item.id} 
                    onClick={() => setCurrentView(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${currentView === item.id ? 'text-[#D12027]' : 'text-slate-400'}`}
                >
                    <item.icon size={20} className={currentView === item.id ? 'fill-current' : ''} />
                    <span className="text-[10px] font-bold">{item.mobileLabel}</span>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserApp;