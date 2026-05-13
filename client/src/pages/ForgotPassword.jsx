import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Loader2, CheckCircle2, AlertCircle, KeyRound, Sun, Moon } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/forgot-password', { username });
      setSuccess(true);
      addToast('Reset link sent! Check your email.', 'success');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send reset link';
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
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-400 mb-4 shadow-[0_10px_30px_rgba(245,158,11,0.3)]">
            <KeyRound className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[var(--text-primary)]">Reset Password</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">Enter your username to receive a reset link.</p>
        </div>

        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border border-[var(--border-color)] rounded-[32px] p-8 shadow-2xl transition-colors duration-300">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-[var(--text-primary)]">Check Your Email</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">
                  If an account exists for <strong className="text-[var(--text-primary)]">{username}</strong>, you'll receive a password reset link shortly.
                </p>
              </div>
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-blue-500 font-black uppercase italic tracking-wider hover:text-blue-400 transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-amber-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold placeholder:text-zinc-800"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-600/20 disabled:opacity-50 uppercase italic tracking-widest hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-8 text-[var(--text-secondary)] text-sm font-medium">
          Remember your password? {' '}
          <Link to="/login" className="text-blue-500 font-black uppercase italic tracking-wider hover:text-blue-400 transition-colors">
            Login Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
