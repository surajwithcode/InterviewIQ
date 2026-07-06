import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiPlusCircle,
  FiBriefcase,
  FiClock,
  FiBookOpen,
  FiArrowRight,
  FiLoader,
  FiSearch,
  FiFilter,
  FiZap
} from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExp, setFilterExp] = useState("all");
  
  // Dynamic States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [themeConfig, setThemeConfig] = useState({
    greeting: "Welcome 👋",
    bgGradient: "from-orange-50 via-white to-orange-100",
    headerGradient: "from-orange-500 via-pink-500 to-red-500"
  });

  // 1. Fully Dynamic Time-based Themes
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs >= 5 && hrs < 12) {
      setThemeConfig({
        greeting: "Good Morning, Achiever! 🌅",
        bgGradient: "from-amber-50/60 via-white to-orange-50/60",
        headerGradient: "from-amber-500 via-orange-500 to-red-500"
      });
    } else if (hrs >= 12 && hrs < 17) {
      setThemeConfig({
        greeting: "Good Afternoon! Ready to Upskill? ☀️",
        bgGradient: "from-orange-50 via-white to-amber-50",
        headerGradient: "from-orange-500 to-amber-500"
      });
    } else {
      setThemeConfig({
        greeting: "Good Evening! Night Routine Practice? 🌆",
        bgGradient: "from-slate-900 via-indigo-950 to-slate-900 text-slate-100", // Night premium look
        headerGradient: "from-indigo-600 via-purple-600 to-pink-600"
      });
    }
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async () => {
    if (!role.trim() || !experience.trim()) {
      return alert("Fill all fields");
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role: role.trim(),
        experience: experience.trim(),
        questions: [],
        lastAccessed: new Date() // tracking for "Recent" badge
      });

      setRole("");
      setExperience("");
      
      if (res.data?.session) {
        setSessions((prev) => [res.data.session, ...prev]);
      } else {
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 2. Dynamic Search & Filter Logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterExp === "all" || session.experience.toLowerCase().includes(filterExp.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  // Unique Check: Find the latest accessed session to give a "Resume" tag
  const latestSessionId = sessions.length > 0 ? sessions[0]._id : null; 
  const isNight = themeConfig.bgGradient.includes("from-slate-900");

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.bgGradient} transition-colors duration-500 pb-16`}>
      
      {/* HEADER */}
      <div className={`bg-gradient-to-r ${themeConfig.headerGradient} text-white px-6 md:px-12 py-12 rounded-b-[50px] shadow-2xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div>
            <span className="bg-white/20 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
              AI Interview Platform
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-3 tracking-tight drop-shadow-sm">
              {themeConfig.greeting}
            </h1>
            <p className="opacity-90 mt-2 text-sm md:text-lg font-medium">
              Your AI Copilot is tuned and ready.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg font-medium"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        
        {/* STATS WITH INTERACTIVE HOVERS */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <FiBookOpen className="text-orange-500" />, title: sessions.length, desc: "Total Interviews", color: "hover:border-orange-400" },
            { icon: <FiZap className="text-yellow-500 animate-pulse" />, title: sessions.filter(s => !s.isCompleted).length, desc: "Active Sessions", color: "hover:border-yellow-400" },
            { icon: <FiClock className="text-emerald-500" />, title: "Instant", desc: "AI Response Feedback", color: "hover:border-emerald-400" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`rounded-3xl p-6 shadow-sm border transition-all duration-300 ${isNight ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-gray-100'} ${stat.color}`}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <h2 className="text-3xl font-black">{stat.title}</h2>
              <p className={isNight ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CREATE INTERVIEW PLATFORM */}
        <div className={`rounded-3xl shadow-xl p-6 md:p-8 mb-12 border transition-all ${isNight ? 'bg-slate-800/50 border-slate-700 backdrop-blur-md' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping"/>
            <h2 className="text-xl font-bold">Launch a Mock Session</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Target Role (e.g. React Engineer)"
              disabled={isSubmitting}
              className={`rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400 transition border ${isNight ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
            />

            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Experience level (e.g. 3+ Years)"
              disabled={isSubmitting}
              className={`rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400 transition border ${isNight ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
            />

            <button
              onClick={createSession}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 disabled:from-gray-400 disabled:to-gray-500 rounded-xl text-white flex items-center justify-center gap-2 font-bold transition shadow-lg shadow-orange-500/20"
            >
              {isSubmitting ? <FiLoader className="animate-spin text-xl" /> : <><FiPlusCircle size={18} /> Start Custom Track</>}
            </button>
          </div>
        </div>

        {/* CONTROLS (SEARCH & FILTER) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-black tracking-tight">Your Interview Tracks</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isNight ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <FiSearch className="text-gray-400" />
              <input 
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-40 focus:w-56 transition-all"
              />
            </div>

            {/* Quick Experience Filter */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isNight ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <FiFilter className="text-gray-400" />
              <select 
                value={filterExp} 
                onChange={(e) => setFilterExp(e.target.value)}
                className="bg-transparent outline-none text-sm cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="fresher">Fresher</option>
                <option value="years">Experienced</option>
              </select>
            </div>
          </div>
        </div>

        {/* SESSIONS CONTENT LIST */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`rounded-3xl p-7 animate-pulse border ${isNight ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-gray-100'}`}>
                <div className="h-12 w-12 bg-gray-300/30 rounded-2xl mb-4" />
                <div className="h-6 bg-gray-300/30 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-300/30 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-3xl p-16 text-center border ${isNight ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-100'}`}>
            <h3 className="text-xl font-bold">No tracks match your layout</h3>
            <p className="text-gray-400 mt-2 text-sm">Try searching something else or create a naya track above.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredSessions.map((session) => {
                const isRecent = session._id === latestSessionId;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    key={session._id}
                    onClick={() => navigate(`/interview/${session._id}`)}
                    className={`rounded-3xl p-7 cursor-pointer border transition-all duration-300 flex flex-col justify-between relative group ${
                      isNight ? 'bg-slate-800 border-slate-700/80 hover:border-indigo-500' : 'bg-white border-gray-100 hover:border-orange-400 shadow-md shadow-gray-100/50'
                    }`}
                  >
                    {isRecent && (
                      <span className="absolute -top-3 left-6 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md animate-bounce">
                        ⚡ Last Active Track
                      </span>
                    )}

                    <div>
                      <div className="flex justify-between items-center">
                        <div className={`p-4 rounded-2xl ${isNight ? 'bg-slate-900 text-indigo-400' : 'bg-orange-50 text-orange-500'}`}>
                          <FiBriefcase size={24} />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gray-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiArrowRight size={16} />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold mt-6 tracking-tight line-clamp-1">{session.role}</h3>
                      <p className={`mt-1 text-sm ${isNight ? 'text-slate-400' : 'text-gray-500'}`}>
                        Experience Profile: <span className="font-semibold text-orange-500">{session.experience}</span>
                      </p>
                    </div>

                    <button className="mt-8 w-full py-3 rounded-xl bg-slate-900 group-hover:bg-orange-500 text-white font-bold transition-all duration-300 text-sm tracking-wide shadow-sm">
                      Resume Simulator
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;