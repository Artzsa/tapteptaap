import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Loader2, Sun, Moon } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (location.state?.message) {
      addToast(location.state.message, 'success');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/api/login', {
        username,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        addToast('Welcome back! 🚀', 'success');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError('Invalid credentials');
        addToast('Invalid credentials', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:scale-105 shadow-lg"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[var(--text-primary)]">VibeTape</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">Log in to manage your digital identity.</p>
        </div>

        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border border-[var(--border-color)] rounded-[32px] p-8 shadow-2xl transition-colors duration-300">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-800"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-[10px] font-bold text-zinc-600 hover:text-amber-500 transition-colors uppercase tracking-widest">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 uppercase italic tracking-widest hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Enter Dashboard
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[var(--text-secondary)] text-sm font-medium">
          Don't have an account? {' '}
          <Link to="/register" className="text-blue-500 font-black uppercase italic tracking-wider hover:text-blue-400 transition-colors">
            Register Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
