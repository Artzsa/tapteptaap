import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Reset token is required');
      addToast('Reset token is required', 'error');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      addToast('Password must be at least 8 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      addToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/reset-password', { token, password });
      setSuccess(response.data.message);
      addToast('Password reset successful! 🎉', 'success');
      setTimeout(() => navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } }), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to reset password';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 15;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[a-z]/.test(pass)) score += 10;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    return Math.min(100, score);
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabel = passwordStrength < 30 ? 'Weak' : passwordStrength < 60 ? 'Medium' : passwordStrength < 85 ? 'Strong' : 'Very Strong';
  const strengthColor = passwordStrength < 30 ? 'bg-red-500' : passwordStrength < 60 ? 'bg-amber-500' : passwordStrength < 85 ? 'bg-emerald-500' : 'bg-emerald-400';

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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 mb-4 shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[var(--text-primary)]">New Password</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">Enter your new password below.</p>
        </div>

        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border border-[var(--border-color)] rounded-[32px] p-8 shadow-2xl transition-colors duration-300">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              {success}
            </motion.div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Reset Token */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Reset Token</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-zinc-800 font-mono text-xs"
                    placeholder="Paste your reset token here"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border border-[var(--border-color)] rounded-2xl pl-12 pr-12 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-zinc-800"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passwordStrength >= level * 25 ? strengthColor : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[10px] font-bold ${passwordStrength < 30 ? 'text-red-500' : passwordStrength < 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border border-[var(--border-color)] rounded-2xl pl-12 pr-12 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-zinc-800"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password === confirmPassword && (
                  <p className="text-emerald-500 text-[10px] font-bold ml-1 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Passwords match
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 uppercase italic tracking-widest mt-4 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    Reset Password
                    <ShieldCheck size={20} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-8 space-y-3">
          <Link to="/login" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
