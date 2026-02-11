import React, { useState, useEffect, useRef } from 'react';
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
  FileSignature, Building, CalendarClock, PenTool, TrendingDown,
  Volume2, Eye, Brain, Ear, Quote, Gavel, Fingerprint, HelpCircle,
  Search as MagnifyingGlass
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid
} from 'recharts';
import Joyride, { STATUS, ACTIONS, EVENTS, LIFECYCLE } from 'react-joyride';

// --- 1. GLOBAL STYLES & THEME ---

const KARSA_RED = "#D12027"; 
const KARSA_YELLOW = "#FDB913"; 
const KARSA_WHITE = "#FFFFFF";
const KARSA_GREEN = "#2E7D32"; 

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700;900&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #334155; }
    
    /* Animations */
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pop { 0% { transform: scale(0.9); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    
    .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    .bg-gold { background: linear-gradient(135deg, #FDB913 0%, #F59E0B 100%); }
    .bg-silver { background: linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%); }
    .bg-bronze { background: linear-gradient(135deg, #FED7AA 0%, #FB923C 100%); }

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

    .font-serif { font-family: 'Merriweather', serif; }

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

// --- USER DATA (AUTO SUPERVISOR) ---
const INITIAL_USER_DATA = {
  name: "Budi Santoso",
  role: "Supervisor", // Direct Access
  department: "Frontliner",
  hasAccelerationAccess: true, // Direct Access
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&mouth=smile",
  level: 4,
  xp: 1450,
  streak: 12,
  checkedIn: false,
  badges: ["Customer First", "Hygiene Hero"],
  completedModules: [],
  preTestScore: null,
  postTestScore: null,
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
            { id: 'c1', title: 'Communication Mastery 5.0', status: 'active', subtitle: 'Verbal & Written Skills', tag: 'New' },
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
  { id: "m0", title: "Pre-Test: Baseline Assessment", type: "pre_test", duration: "5:00", category: "Evaluation", xp: 50 },
  { id: "m1", title: "Video: The Art of Communication", type: "video", duration: "10:00", category: "Concept", xp: 100 },
  { id: "m2", title: "Fundamentals: Why & What", type: "theory", duration: "10:00", category: "Concept", xp: 100 },
  { id: "m3", title: "Framework: The 7Cs Rule", type: "framework", duration: "12:00", category: "Technique", xp: 150 },
  { id: "m4", title: "Tool: Active Listening (L.A.S.E.R)", type: "tool", duration: "8:00", category: "Technique", xp: 100 },
  { id: "m5", title: "Lab: Email Audit Challenge", type: "lab", duration: "15:00", category: "Practice", xp: 200 },
  { id: "m6", title: "Case Study: The 'Sus Coklat' Incident", type: "case_study", duration: "15:00", category: "Analysis", xp: 250 },
  { id: "m7", title: "Post-Test: Final Certification", type: "post_test", duration: "10:00", category: "Evaluation", xp: 300 },
  { id: "m8", title: "Closing: Action Plan & Pledge", type: "action_plan", duration: "5:00", category: "Commitment", xp: 150 },
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
const PreTestLesson = ({ onComplete, updateUser, score: existingScore }) => {
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: 1, q: "Apa elemen terpenting dalam komunikasi tatap muka (Mehrabian)?", options: ["Kata-kata (Words)", "Bahasa Tubuh (Body Language)", "Nada Suara (Tone)"], correct: 1 },
    { id: 2, q: "Apa arti 'Concise' dalam 7Cs?", options: ["Panjang lebar", "Ringkas & Padat", "Menggunakan istilah teknis"], correct: 1 },
    { id: 3, q: "Metode L.A.S.E.R digunakan untuk?", options: ["Menulis Email", "Active Listening", "Public Speaking"], correct: 1 }
  ];

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) s++; });
    const finalScore = Math.round((s / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    updateUser({ preTestScore: finalScore });
  };

  if (existingScore !== null && !submitted) {
      return (
        <div className="text-center animate-fadeIn max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200">
             <div className="inline-block p-3 bg-slate-100 rounded-full mb-3"><CheckCircle size={32} className="text-green-600"/></div>
             <h2 className="text-2xl font-bold text-slate-800">Pre-Test Completed</h2>
             <p className="text-slate-500 mb-6">Skor Awal Anda: <span className="font-bold text-slate-800">{existingScore}%</span></p>
             <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold">Lanjut ke Video Materi</button>
        </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-red-50 text-[#D12027] rounded-full mb-3"><BarChart2 size={24}/></div>
        <h2 className="text-2xl font-bold text-slate-800">Baseline Assessment (Pre-Test)</h2>
        <p className="text-slate-500">Uji pengetahuan awal Anda sebelum memulai materi.</p>
      </div>
      {!submitted ? (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="font-bold text-slate-800 mb-3">{i+1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <button key={optIdx} onClick={() => setAnswers({...answers, [i]: optIdx})} className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${answers[i] === optIdx ? 'bg-[#D12027] text-white border-[#D12027]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length} className="btn-primary w-full py-3 rounded-xl font-bold disabled:opacity-50">Submit Pre-Test</button>
        </div>
      ) : (
        <div className="text-center animate-pop bg-white p-8 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Skor Awal: {score}%</h3>
          <p className="text-slate-500 mb-6">Skor tersimpan. Mari mulai belajar untuk meningkatkan pemahaman!</p>
          <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold">Lanjut ke Video</button>
        </div>
      )}
    </div>
  );
};

// MODULE 1: VIDEO LESSON
const VideoLesson = ({ onComplete }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            alert("Materi Training 'Communication Mastery.pdf' berhasil diunduh ke perangkat Anda.");
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white p-2 rounded-lg"><PlayCircle size={24}/></div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Video: The Art of Communication</h2>
                        <p className="text-slate-500 text-sm">Pelajari dasar komunikasi efektif di lingkungan kerja.</p>
                    </div>
                </div>
                <button 
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex items-center gap-2 text-red-600 font-bold border border-red-200 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isDownloading ? (
                        <>
                            <Loader size={16} className="animate-spin"/> Mengunduh...
                        </>
                    ) : (
                        <>
                            <Download size={16}/> Download Materi (PDF)
                        </>
                    )}
                </button>
            </div>
             
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/cnJb64Mza-E?start=1" 
                    title="Communication Training Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-slate-600">
                    <p><strong>Key Takeaways:</strong></p>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                        <li>Pentingnya kejelasan dalam operasional toko.</li>
                        <li>Dampak miskomunikasi terhadap pelanggan.</li>
                    </ul>
                </div>
                <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap">
                    Saya Sudah Menonton <CheckCircle size={18}/>
                </button>
            </div>
        </div>
    );
};

// MODULE 2: FUNDAMENTALS
const FundamentalsLesson = ({ onComplete }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-8">
             <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-lg">
                 <h1 className="text-3xl font-serif font-black mb-2">FUNDAMENTALS</h1>
                 <p className="text-emerald-100 font-serif tracking-widest uppercase text-sm">Why & What</p>
             </div>

             <div>
                 <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle className="text-red-500"/> The Cost of Misunderstanding</h3>
                 <div className="grid md:grid-cols-3 gap-4">
                     {[{icon: TrendingDown, t: "Financial Loss", d: "Waste bahan, produk gagal, salah pesanan.", c: "text-red-600 bg-red-50"},
                       {icon: Clock, t: "Time Waste", d: "Meeting berulang, re-work tugas.", c: "text-orange-600 bg-orange-50"},
                       {icon: Users, t: "Team Morale", d: "Konflik, saling menyalahkan, demotivasi.", c: "text-slate-600 bg-slate-100"}
                     ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                             <div className={`w-12 h-12 ${item.c} rounded-full flex items-center justify-center mb-4 mx-auto`}><item.icon size={24}/></div>
                             <h4 className="text-center font-bold text-slate-800 mb-2">{item.t}</h4>
                             <p className="text-center text-xs text-slate-500">{item.d}</p>
                        </div>
                     ))}
                 </div>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-slate-200">
                 <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Brain className="text-emerald-600"/> The 7-38-55 Rule (Mehrabian)</h3>
                 <div className="flex flex-col md:flex-row gap-4 h-48 text-white text-center">
                     <div className="flex-1 bg-emerald-200 rounded-xl p-4 flex flex-col justify-center items-center text-emerald-900">
                         <h2 className="text-4xl font-black mb-1">7%</h2>
                         <p className="text-xs font-bold uppercase">Words</p>
                     </div>
                     <div className="flex-[2] bg-emerald-400 rounded-xl p-4 flex flex-col justify-center items-center text-white">
                         <h2 className="text-5xl font-black mb-1">38%</h2>
                         <p className="text-xs font-bold uppercase">Tone of Voice</p>
                     </div>
                     <div className="flex-[3] bg-emerald-700 rounded-xl p-4 flex flex-col justify-center items-center text-white">
                         <h2 className="text-6xl font-black mb-1">55%</h2>
                         <p className="text-xs font-bold uppercase">Body Language</p>
                     </div>
                 </div>
             </div>

             <div className="flex justify-end">
                <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                    Lanjut ke Framework 7Cs <ArrowRight size={18}/>
                </button>
             </div>
        </div>
    );
};

// MODULE 3: 7Cs
const SevenCsLesson = ({ onComplete }) => {
    const [activeTab, setActiveTab] = useState('Clear');
    const csContent = {
        Clear: { icon: Eye, title: "CLEAR (Jelas)", desc: "Pesan harus mudah dimengerti. Hindari ambiguitas.", bad: "Mungkin nanti kita lihat...", good: "Kita akan review besok jam 9." },
        Concise: { icon: Zap, title: "CONCISE (Ringkas)", desc: "To the point. Hemat waktu pembaca.", bad: "Sehubungan dengan hal tersebut maka...", good: "Maka dari itu..." },
        Concrete: { icon: Building, title: "CONCRETE (Konkret)", desc: "Gunakan fakta/data spesifik.", bad: "Sales kita naik tinggi.", good: "Sales naik 15% dibanding bulan lalu." },
        Correct: { icon: CheckCircle, title: "CORRECT (Benar)", desc: "Bebas kesalahan (Typo, Grammar).", bad: "Trimakasih pa.", good: "Terima kasih, Pak." },
        Coherent: { icon: Layers, title: "COHERENT (Runtut)", desc: "Alur logis dan terhubung.", bad: "Sales naik. AC rusak. Hire orang.", good: "Isu Ops: 1. AC Rusak, 2. Hiring Plan." },
        Complete: { icon: Check, title: "COMPLETE (Lengkap)", desc: "Semua info 5W+1H ada.", bad: "Kita meeting besok.", good: "Meeting Selasa jam 10 pagi di Ruang A." },
        Courteous: { icon: Users, title: "COURTEOUS (Sopan)", desc: "Ramah dan menghargai.", bad: "Kirimin laporannya cepet!", good: "Mohon kirimkan segera. Terima kasih." }
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">The 7Cs Framework</h2>
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[400px]">
                <div className="md:w-1/3 space-y-2 overflow-y-auto pr-2">
                    {Object.keys(csContent).map((key, idx) => (
                        <button key={key} onClick={() => setActiveTab(key)} className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${activeTab === key ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200'}`}>
                            <span className="font-bold text-lg">{idx+1}.</span><span className="font-bold">{key}</span>
                        </button>
                    ))}
                </div>
                <div className="md:w-2/3 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-emerald-700">
                             {React.createElement(csContent[activeTab].icon, { size: 32 })}
                             <h3 className="text-3xl font-black uppercase">{activeTab}</h3>
                        </div>
                        <p className="text-lg text-slate-600 mb-8 font-medium">{csContent[activeTab].desc}</p>
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                            <div className="flex items-start gap-3"><X className="text-red-500 mt-1 shrink-0" size={20}/><div><p className="text-xs font-bold text-red-500 uppercase">Don't</p><p className="text-slate-500 italic">"{csContent[activeTab].bad}"</p></div></div>
                            <div className="w-full h-px bg-slate-200"></div>
                            <div className="flex items-start gap-3"><Check className="text-emerald-600 mt-1 shrink-0" size={20}/><div><p className="text-xs font-bold text-emerald-600 uppercase">Do</p><p className="text-slate-800 font-bold">"{csContent[activeTab].good}"</p></div></div>
                        </div>
                    </div>
                    <div className="mt-auto pt-8 flex justify-end relative z-10">
                        {activeTab === 'Courteous' && <button onClick={onComplete} className="btn-primary px-6 py-2 rounded-lg font-bold">Lanjut ke Active Listening</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// MODULE 4: ACTIVE LISTENING (LASER)
const LaserLesson = ({ onComplete }) => {
    return (
        <div className="max-w-4xl mx-auto animate-fadeIn py-8 text-center">
             <h2 className="text-3xl font-bold text-slate-800 mb-2">Active Listening (L.A.S.E.R)</h2>
             <p className="text-slate-500 mb-10">Jadilah pendengar yang baik dengan metode ini.</p>
             <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-center items-stretch h-64 mb-10">
                 {[
                     { l: 'L', t: 'Look', d: 'Fokus mata ke pembicara.', c: 'bg-emerald-100 text-emerald-800' },
                     { l: 'A', t: 'Ask', d: 'Tanya untuk klarifikasi.', c: 'bg-emerald-200 text-emerald-900' },
                     { l: 'S', t: 'Summarize', d: 'Rangkum poin utama.', c: 'bg-emerald-300 text-emerald-900' },
                     { l: 'E', t: 'Empathize', d: 'Rasakan emosinya.', c: 'bg-emerald-500 text-white' },
                     { l: 'R', t: 'Respond', d: 'Beri respon yang sesuai.', c: 'bg-emerald-700 text-white' },
                 ].map((item) => (
                     <div key={item.l} className={`flex-1 min-w-[100px] rounded-xl p-4 flex flex-col items-center justify-center shadow-sm ${item.c}`}>
                         <h1 className="text-4xl font-black mb-2">{item.l}</h1>
                         <h3 className="font-bold text-sm mb-2">{item.t}</h3>
                         <p className="text-[10px] leading-tight">{item.d}</p>
                     </div>
                 ))}
             </div>
             <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold">Lanjut ke Email Audit</button>
        </div>
    );
};

// MODULE 5: EMAIL AUDIT
const EmailAuditLesson = ({ onComplete }) => {
    const [fixes, setFixes] = useState({ subject: false, greeting: false, body1: false, body2: false, closing: false });
    const handleFix = (key) => {
        setFixes(prev => {
            const newState = { ...prev, [key]: true };
            if (Object.values(newState).every(Boolean)) setTimeout(onComplete, 2000);
            return newState;
        });
    };
    return (
        <div className="max-w-2xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Lab: Email Auditor</h2>
            <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-sm font-mono text-sm leading-relaxed relative">
                <div className="border-b pb-4 mb-4 space-y-2">
                    <div><span className="font-bold text-slate-400">Subject:</span>{' '}
                    {fixes.subject ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2">Laporan Penjualan Q1</span> : <button onClick={() => handleFix('subject')} className="text-red-500 border-b-2 border-dashed border-red-400">Laporan</button>}</div>
                </div>
                <div className="space-y-4">
                    <p>{fixes.greeting ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2">Halo Tim,</span> : <button onClick={() => handleFix('greeting')} className="text-red-500 border-b-2 border-dashed border-red-400">woi semua,</button>}</p>
                    <p>Tolong kirim {fixes.body1 ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2">laporan penjualan</span> : <button onClick={() => handleFix('body1')} className="text-red-500 border-b-2 border-dashed border-red-400">file yg kmrn</button>} dong. Saya butuh {fixes.body2 ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2">jam 15.00 hari ini</span> : <button onClick={() => handleFix('body2')} className="text-red-500 border-b-2 border-dashed border-red-400">cepet</button>} ya.</p>
                    <p>{fixes.closing ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2">Terima kasih,</span> : <button onClick={() => handleFix('closing')} className="text-red-500 border-b-2 border-dashed border-red-400">thx.</button>}</p>
                    <p>- Budi</p>
                </div>
                {Object.values(fixes).every(Boolean) && <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center animate-fadeIn rounded-xl z-10"><CheckCircle size={64} className="text-emerald-600 mb-4"/><h3 className="text-2xl font-bold text-slate-800">Perfect Audit!</h3></div>}
            </div>
        </div>
    );
};

// MODULE 6: CASE STUDY
const CaseStudyLesson = ({ onComplete }) => {
    const [activeTab, setActiveTab] = useState('Evidence');
    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Case Study #101: Kue Sus Incident</h2>
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 min-h-[350px] flex flex-col">
                <div className="flex border-b border-slate-200 bg-slate-50">
                    {['Evidence', 'Suspect', 'Verdict'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-4 font-bold text-sm uppercase ${activeTab === tab ? 'bg-white border-t-4 border-emerald-600 text-emerald-700' : 'text-slate-400'}`}>{tab}</button>
                    ))}
                </div>
                <div className="p-8 flex-1">
                    {activeTab === 'Evidence' && <div className="space-y-4 animate-fadeIn"><div className="bg-red-50 p-6 rounded-xl border border-red-100"><p><strong>Kejadian:</strong> Produksi 500 pcs Sus Coklat (Resep Lama).</p><p><strong>Perintah:</strong> "Buat adonan sus seperti biasa ya."</p></div></div>}
                    {activeTab === 'Suspect' && <div className="space-y-4 animate-fadeIn"><ul className="space-y-3"><li className="bg-orange-50 p-4 rounded-xl"><strong>Ambiguitas:</strong> "Seperti biasa" tidak spesifik.</li></ul></div>}
                    {activeTab === 'Verdict' && <div className="space-y-6 animate-fadeIn"><div className="bg-emerald-50 p-6 rounded-xl"><p><strong>Solusi:</strong> Verbal + Written instruction & Be Specific.</p></div><div className="flex justify-end"><button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold">Lanjut ke Post-Test</button></div></div>}
                </div>
            </div>
        </div>
    );
};

// MODULE 7: POST-TEST
const PostTestLesson = ({ onComplete, updateUser, score: existingScore }) => {
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: 1, q: "Huruf 'S' dalam LASER berarti:", options: ["Speak", "Summarize", "Silence"], correct: 1 },
    { id: 2, q: "Dalam kasus Sus Coklat, apa akar masalah utamanya?", options: ["Alat rusak", "Bahan habis", "Ambiguitas perintah verbal"], correct: 2 },
    { id: 3, q: "Pesan tertulis (Written) lebih unggul dalam hal:", options: ["Kecepatan", "Akurasi & Dokumentasi", "Membangun emosi"], correct: 1 },
    { id: 4, q: "Mana yang BUKAN bagian dari 7Cs?", options: ["Correct", "Complex", "Concise"], correct: 1 },
    { id: 5, q: "Jika email bersifat mendesak (urgent), sebaiknya:", options: ["Tunggu balasan", "Follow up dengan telepon/WA", "Kirim ulang email 5 kali"], correct: 1 }
  ];

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) s++; });
    const finalScore = Math.round((s / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    updateUser({ postTestScore: finalScore });
  };

  if (existingScore !== null && !submitted) {
      return (
        <div className="text-center animate-fadeIn max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200">
             <div className="inline-block p-3 bg-yellow-100 rounded-full mb-3"><Trophy size={32} className="text-yellow-600"/></div>
             <h2 className="text-2xl font-bold text-slate-800">Post-Test Completed</h2>
             <p className="text-slate-500 mb-6">Skor Akhir Anda: <span className="font-bold text-slate-800 text-2xl">{existingScore}%</span></p>
             <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold">Lihat Action Plan</button>
        </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Final Certification (Post-Test)</h2>
        <p className="text-slate-500">Buktikan pemahaman Anda untuk mendapatkan badge.</p>
      </div>
      {!submitted ? (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="font-bold text-slate-800 mb-3">{i+1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <button key={optIdx} onClick={() => setAnswers({...answers, [i]: optIdx})} className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${answers[i] === optIdx ? 'bg-[#D12027] text-white border-[#D12027]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length} className="btn-primary w-full py-3 rounded-xl font-bold disabled:opacity-50">Submit Final Exam</button>
        </div>
      ) : (
        <div className="text-center animate-pop bg-white p-8 rounded-2xl border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Skor Akhir: {score}%</h3>
          {score >= 80 ? (
             <div className="text-emerald-600 font-bold mb-4 flex items-center justify-center gap-2"><Award/> LULUS - BADGE GRANTED</div>
          ) : (
             <div className="text-orange-500 font-bold mb-4">BELUM LULUS - Silakan Review Materi</div>
          )}
          <button onClick={onComplete} className="btn-primary px-8 py-3 rounded-xl font-bold">Lanjut ke Action Plan</button>
        </div>
      )}
    </div>
  );
};

// MODULE 8: ACTION PLAN
const ActionPlanLesson = ({ onComplete }) => {
    return (
        <div className="max-w-3xl mx-auto animate-slideIn pb-12">
            <h2 className="text-3xl font-serif font-black text-center text-slate-800 mb-8">Communication Pledge</h2>
            <div className="bg-slate-800 text-white p-10 rounded-3xl text-center shadow-xl mb-10 relative overflow-hidden">
                 <Quote className="mx-auto text-yellow-500 mb-6" size={48}/>
                 <p className="text-2xl font-bold leading-relaxed mb-8 font-serif">
                     "GOOD COMMUNICATION BUILDS <span className="text-yellow-400">UNDERSTANDING</span>.<br/>
                     GREAT COMMUNICATION BUILDS <span className="text-yellow-400">TRUST</span>."
                 </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-lg mb-2">My Action Plan</h3>
                <input className="w-full p-3 border rounded-xl bg-slate-50" placeholder="1. Kelemahan saya..."/>
                <input className="w-full p-3 border rounded-xl bg-slate-50" placeholder="2. Strategi perbaikan besok..."/>
                <button onClick={onComplete} className="btn-primary w-full py-4 rounded-xl font-bold text-lg mt-4">Selesaikan & Kembali ke Dashboard</button>
            </div>
        </div>
    );
};
// --- 5. MAIN COMPONENTS ---

const TrainingRequestView = ({ onStartGuide }) => {
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
                currentStep: 1 
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
                    <div className="flex gap-2">
                        {/* DEEP TUTORIAL: Sub-feature specific help button */}
                        {activeTab === 'form' && (
                            <button onClick={onStartGuide} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                                <HelpCircle size={16}/> Panduan Pengisian
                            </button>
                        )}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-white shadow-sm text-[#D12027]' : 'text-slate-500'}`}>New Request</button>
                            <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-[#D12027]' : 'text-slate-500'}`}>My History</button>
                        </div>
                    </div>
                </div>

                {activeTab === 'form' ? (
                    <div className="animate-fadeIn max-w-3xl">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Training Topic / Title</label>
                                {/* Added tour target class */}
                                <input 
                                    className="tour-req-title w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100" 
                                    placeholder="Ex: Advanced Pastry Technique..."
                                    value={form.title}
                                    onChange={e => setForm({...form, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Provider Type</label>
                                {/* Added tour target class */}
                                <select 
                                    className="tour-req-provider w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100"
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
                                {/* Added tour target class */}
                                <input 
                                    type="date"
                                    className="tour-req-date w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 text-slate-600"
                                    value={form.date}
                                    onChange={e => setForm({...form, date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Business Justification</label>
                                {/* Added tour target class */}
                                <textarea 
                                    className="tour-req-reason w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 h-[52px]" 
                                    placeholder="Why is this training needed?"
                                    value={form.reason}
                                    onChange={e => setForm({...form, reason: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Added tour target class */}
                        <div className="tour-req-alert bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 mb-8">
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
       alert("Selamat! Anda telah menyelesaikan rangkaian training ini.");
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
      <div className="tour-course-player flex flex-col h-[75vh] bg-white rounded-b-2xl overflow-hidden border border-t-0 border-slate-200 shadow-xl animate-slideIn">
          <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              {/* Added Tour Class */}
              <div className="tour-course-sidebar w-72 border-r overflow-y-auto p-4 space-y-2 bg-slate-50 hidden md:block">
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
              {/* Added Tour Class */}
              <div className="tour-course-content flex-1 relative bg-slate-100">
                  <div className="absolute inset-0 overflow-y-auto p-4 md:p-8">
                      {activeModule.id === 'm0' && <PreTestLesson onComplete={handleComplete} updateUser={updateUser} score={user.preTestScore} />}
                      {activeModule.id === 'm1' && <VideoLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm2' && <FundamentalsLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm3' && <SevenCsLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm4' && <LaserLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm5' && <EmailAuditLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm6' && <CaseStudyLesson onComplete={handleComplete} />}
                      {activeModule.id === 'm7' && <PostTestLesson onComplete={handleComplete} updateUser={updateUser} score={user.postTestScore} />}
                      {activeModule.id === 'm8' && <ActionPlanLesson onComplete={handleComplete} />}
                  </div>
              </div>
          </div>
      </div>
   )
}

const TrainingCenter = ({ user, updateUser, onBack, onStartGuide }) => {
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
                          {/* Pass tour handler specifically for form guide */}
                          <TrainingRequestView onStartGuide={onStartGuide} />
                      </div>
                 )}
             </div>
        </div>
    );
};

const SquadFeed = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-slideIn">
        {/* Added tour target class */}
        <div className="tour-squad-header bg-gradient-to-r from-[#D12027] to-[#b01b21] rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
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
            {/* Added tour target class */}
            <textarea className="tour-squad-input w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all" rows="3" placeholder="Bagikan progress belajar atau tanya sesuatu ke squad..."></textarea>
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
        {/* Added tour target class */}
        <div className="tour-squad-feed">
            {SQUAD_POSTS.map(post => (
                <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
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
            {/* Added tour target class */}
            <div className="tour-idea-header bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
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
                            {/* Added tour target class */}
                            <input 
                                className="tour-idea-title w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100" 
                                placeholder="Contoh: Efisiensi Packing..."
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Kategori</label>
                            {/* Added tour target class */}
                            <select 
                                className="tour-idea-category w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100"
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
                        {/* Added tour target class */}
                        <textarea 
                            className="tour-idea-desc w-full p-3 border border-slate-200 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-red-100"
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
             <div className="tour-lb-switch flex justify-center mb-6">
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
             <div className="tour-lb-podium grid lg:grid-cols-3 gap-8">
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
// --- UPDATED DASHBOARD COMPONENT WITH TARGET CLASSES ---
const Dashboard = ({ user, setView, onToggleAccess }) => {
    const [activeTab, setActiveTab] = useState('nurture');
  
    return (
      <div className="space-y-8 animate-slideIn">
        {/* Target Tutorial: Profile & Stats */}
        <div className="tour-stats relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden">
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
  
        {/* Target Tutorial: Tabs */}
        <div className="tour-tabs flex items-center gap-8 border-b border-slate-200 px-2">
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
  
          {/* Target Tutorial: Course Grid */}
          <div className="tour-courses grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    // LANGSUNG AUTHENTICATED & SUPERVISOR
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [currentView, setCurrentView] = useState('dashboard');
    const [user, setUser] = useState(INITIAL_USER_DATA);
  
    // --- DEEP TUTORIAL ENGINE ---
    const [tourState, setTourState] = useState({
        run: false,
        steps: []
    });

    // 1. DEFINE SCENARIOS: Each view has a unique learning outcome
    // Added 'disableBeacon: true' to the first step of each scenario to force auto-open
    const SCENARIOS = {
        dashboard: [
            {
                target: 'body',
                placement: 'center',
                content: (
                    <div className="text-left space-y-2">
                        <h4 className="font-bold text-lg">Welcome to KARSA University</h4>
                        <p>Platform ini bukan sekadar tempat training, tapi ekosistem untuk pertumbuhan karir Anda.</p>
                        <p className="text-xs text-slate-500 mt-2 italic">Klik 'Next' untuk melihat fitur utama.</p>
                    </div>
                ),
                disableBeacon: true, // Force tutorial to start immediately
            },
            {
                target: '.tour-stats',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Growth Mindset</h5>
                        <p className="text-sm">XP dan Level mencerminkan dedikasi Anda. Level yang lebih tinggi membuka peluang promosi dan akses ke materi "Acceleration".</p>
                    </div>
                ),
                placement: 'bottom',
            },
            {
                target: '.tour-tabs',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Dua Jalur Pengembangan</h5>
                        <ul className="list-disc ml-4 text-sm space-y-1">
                            <li><strong>Nurture:</strong> Wajib untuk posisi Anda saat ini.</li>
                            <li><strong>Acceleration:</strong> Jalur khusus untuk mempersiapkan Anda menjadi Leader.</li>
                        </ul>
                    </div>
                ),
            },
            {
                target: '.tour-courses',
                content: 'Pilih topik yang ingin Anda pelajari. Materi yang aktif ditandai dengan warna merah. Selesaikan satu per satu untuk membuka materi berikutnya.',
                placement: 'top',
            }
        ],
        // SCENARIO for 'Training Saya' (course view)
        course: [
            {
                target: '.tour-course-sidebar',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Learning Path</h5>
                        <p className="text-sm">Ini adalah peta belajar Anda. Modul disusun berurutan untuk memaksimalkan pemahaman. Selesaikan modul saat ini untuk membuka modul berikutnya.</p>
                    </div>
                ),
                placement: 'right',
                disableBeacon: true,
            },
            {
                target: '.tour-course-content',
                content: 'Fokus pada konten di sini. Video interaktif dan kuis akan membantu Anda memahami materi secara mendalam.',
                placement: 'left',
            }
        ],
        community: [
            {
                target: '.tour-squad-header',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Collaborative Learning</h5>
                        <p className="text-sm">Belajar tidak harus sendiri. Di sini kita memecahkan masalah operasional bersama-sama sebagai satu tim (Squad).</p>
                    </div>
                ),
                placement: 'bottom',
                disableBeacon: true,
            },
            {
                target: '.tour-squad-input',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Psychological Safety</h5>
                        <p className="text-sm">Jangan ragu bertanya! Budaya kita menghargai rasa ingin tahu. Pertanyaan "bodoh" adalah pertanyaan yang tidak pernah ditanyakan.</p>
                    </div>
                ),
                placement: 'bottom',
            },
            {
                target: '.tour-squad-feed',
                content: 'Berikan like atau komentar pada solusi teman Anda. Apresiasi kecil membangun tim yang kuat dan suportif.',
                placement: 'top',
            }
        ],
        ideas: [
            {
                target: '.tour-idea-header',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Innovation Culture</h5>
                        <p className="text-sm">Anda yang paling tahu kondisi lapangan. Ide kecil Anda bisa berdampak besar pada efisiensi perusahaan. Kami mendengar suara Anda.</p>
                    </div>
                ),
                placement: 'bottom',
                disableBeacon: true,
            },
            {
                target: '.tour-idea-category',
                content: 'Pilih kategori yang tepat agar ide Anda sampai ke departemen yang relevan (misal: Ops untuk perbaikan toko, atau Tech untuk sistem).',
            }
        ],
        analytics: [
            {
                target: '.tour-lb-switch',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Balanced Performance</h5>
                        <p className="text-sm">Kita menghargai dua hal: Ketekunan (Top Learners) dan Kreativitas (Top Innovators). Jadilah keduanya untuk menjadi karyawan teladan!</p>
                    </div>
                ),
                disableBeacon: true,
            },
            {
                target: '.tour-lb-podium',
                content: 'Champion bulanan akan mendapatkan insentif khusus dan kesempatan lunch bersama direksi. Keep fighting!',
                placement: 'top',
            }
        ],
        // SUB-FEATURE: SPECIFIC FORM GUIDE (Added Tutorial Logic for Training Request)
        requestForm: [
            {
                target: '.tour-req-title',
                content: 'Judul harus spesifik. Hindari "Training Masak". Gunakan "Workshop Teknik Laminasi Pastry Level 2" agar kami paham kebutuhan Anda.',
                disableBeacon: true,
            },
            {
                target: '.tour-req-provider',
                content: 'Pilih "Internal" jika Anda ingin belajar dari senior ahli di Kartika Sari, atau "External" jika butuh sertifikasi dari vendor luar.',
            },
            {
                target: '.tour-req-reason',
                content: (
                    <div className="text-left">
                        <h5 className="font-bold text-[#D12027] mb-1">Business Impact (ROI)</h5>
                        <p className="text-sm">Jelaskan dampak bisnisnya. Contoh: "Training ini akan mengurangi waste adonan sebesar 10% dalam 3 bulan".</p>
                    </div>
                ),
            },
            {
                target: '.tour-req-date',
                content: 'Pilih tanggal minimal 2 minggu dari sekarang untuk memberikan waktu bagi HR dan Finance memproses approval.',
            },
            {
                target: '.tour-req-alert',
                content: 'Perhatikan alur persetujuan. Pastikan Anda sudah berdiskusi dengan atasan sebelum mengajukan request ini.',
            }
        ]
    };

    // 2. DETECT CONTEXT CHANGE & LOAD SCENARIO
    useEffect(() => {
        if (!isAuthenticated) return;

        // Reset tour state momentarily to allow reloading steps
        setTourState(prev => ({ ...prev, run: false }));

        const timer = setTimeout(() => {
            let steps = [];
            // Select steps based on current view
            if (SCENARIOS[currentView]) {
                steps = SCENARIOS[currentView];
            }

            // Check if user has seen this specific scenario
            const seenKey = `seen_tour_${currentView}`;
            const hasSeen = localStorage.getItem(seenKey);

            if (steps.length > 0 && !hasSeen) {
                setTourState({
                    run: true,
                    steps: steps
                });
            }
        }, 800); // DELAY INCREASED: 800ms ensures DOM is ready before Joyride starts

        return () => clearTimeout(timer);
    }, [currentView, isAuthenticated]);

    // 3. HANDLE JOYRIDE CALLBACKS
    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            // Mark current view as seen
            localStorage.setItem(`seen_tour_${currentView}`, 'true');
            setTourState(prev => ({ ...prev, run: false }));
        }
    };

    // 4. SUB-FEATURE TRIGGER (Manual Guide)
    const handleStartFormGuide = () => {
        setTourState({
            run: true,
            steps: SCENARIOS.requestForm
        });
    };
  
    const toggleAccess = () => {
        setUser(prev => ({...prev, hasAccelerationAccess: !prev.hasAccelerationAccess}));
    };
  
    const updateUser = (data) => setUser(prev => ({...prev, ...data}));
  
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
        <GlobalStyles />
        
        {/* JOYRIDE INSTANCE */}
        <Joyride
          steps={tourState.steps}
          run={tourState.run}
          continuous={true}
          showSkipButton={true}
          showProgress={true}
          callback={handleJoyrideCallback}
          disableOverlayClose={true} // Prevent accidental close
          spotlightClicks={true} // Allow interaction
          styles={{
            options: {
              primaryColor: '#D12027',
              zIndex: 10000, // Ensure it's on top
            },
            tooltip: {
                borderRadius: '16px',
                fontFamily: 'Inter, sans-serif'
            },
            buttonNext: {
                backgroundColor: '#D12027',
                fontWeight: 'bold'
            }
          }}
          floaterProps={{
              disableAnimation: true,
          }}
        />
  
        <aside className="tour-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-lg lg:shadow-none">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-center mb-10 bg-[#D12027] p-4 rounded-xl shadow-lg">
                <img src={KARTIKA_LOGO} alt="Logo" className="h-8 brightness-0 invert"/>
            </div>
            <nav className="flex-1 space-y-2">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Menu Utama</div>
              {MENU_ITEMS.map(item => (
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
                    {/* Reset Tutorial Button (For Testing) */}
                    <button 
                      onClick={() => { 
                          // FIX: Safer reload mechanism to prevent blank screen
                          localStorage.clear(); 
                          setTimeout(() => {
                              window.location.href = window.location.href; 
                          }, 100);
                      }}
                      className="text-[10px] text-red-500 underline mt-1 hover:text-red-700"
                    >
                      Reset All Tours
                    </button>
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
              {/* Passed handleStartFormGuide to TrainingCenter to be used in the Request form */}
              {currentView === 'course' && <TrainingCenter user={user} updateUser={updateUser} onBack={() => setCurrentView('dashboard')} onStartGuide={handleStartFormGuide} />}
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