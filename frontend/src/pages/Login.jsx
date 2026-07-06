import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { FiMail, FiLock, FiArrowRight, FiCpu, FiTerminal, FiCheckCircle } from "react-icons/fi";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleForm = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email and password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // MAIN MASTER WRAPPER (Split View Layout)
    <div className="min-h-screen bg-[#030712] text-slate-100 flex font-sans antialiased">
      
      {/* ================= LEFT SIDE: VISUAL BRANDING PANEL (Hidden on Mobile) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#070a13] p-16 flex-col justify-between overflow-hidden border-r border-slate-800/40">
        
        {/* Ambient Glows for Left Section */}
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Brand/Logo Top */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <FiCpu className="text-white text-xl animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              INTERVIEW.AI
            </span>
            <span className="text-[9px] block text-orange-400 font-mono uppercase tracking-widest mt-[-2px]">
              Advanced Simulator
            </span>
          </div>
        </div>

        {/* Feature List Graphic in Center */}
        <div className="my-auto relative z-10 max-w-md space-y-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
          >
            Sharpen your responses. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400">
              Conquer the panel.
            </span>
          </motion.h1>

          <div className="space-y-4">
            {[
              "Real-time AI behavioral analysis feedback",
              "Custom tech tracks based on your tech-stack",
              "Instant performance scoring & analytics reports"
            ].map((text, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 + 0.3 }}
                key={i} 
                className="flex items-center gap-3 text-sm text-slate-400"
              >
                <FiCheckCircle className="text-emerald-500 shrink-0" size={18} />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Terminal Status Footer */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono relative z-10">
          <FiTerminal className="text-orange-500" />
          <span>SYS_STATUS: ONLINE // COGNITIVE_ENGINE_ACTIVE</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: AUTH/LOGIN PANEL ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 relative">
        
        {/* Floating background blur elements just for mobile viewport */}
        <div className="lg:hidden absolute top-0 left-0 w-72 h-72 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />
        <div className="lg:hidden absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo variant for Mobile view */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <FiCpu className="text-orange-500 text-2xl animate-pulse" />
            <span className="text-xl font-black tracking-tight">INTERVIEW.AI</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-white">Sign In</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Enter your credentials to enter the simulation matrix.
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-400 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full border border-slate-800 bg-slate-900/40 text-slate-100 rounded-xl p-3.5 pl-12 outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/70 transition-all text-sm"
                  onChange={handleForm}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-slate-500 hover:text-orange-400 transition">Forgot?</a>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full border border-slate-800 bg-slate-900/40 text-slate-100 rounded-xl p-3.5 pl-12 outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/70 transition-all text-sm"
                  onChange={handleForm}
                />
              </div>
            </div>

            {/* Dynamic Interactive Button */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-white text-slate-950 hover:bg-slate-100 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mt-6 flex items-center justify-center gap-2 shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">Loading Matrix...</span>
              ) : (
                <>
                  <span>Login</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>

          {/* Divider line */}
          <div className="h-[1px] bg-slate-800/80 my-8 w-full" />

          {/* Footer Routing */}
          <p className="text-center lg:text-left text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-400 font-bold hover:text-orange-500 transition hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;