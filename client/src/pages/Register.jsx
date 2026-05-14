import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import api from '../api';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  // Password strength calculation
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

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabel = passwordStrength < 30 ? 'Weak' : passwordStrength < 60 ? 'Medium' : passwordStrength < 85 ? 'Strong' : 'Very Strong';
  const strengthColor = passwordStrength < 30 ? 'bg-red-500' : passwordStrength < 60 ? 'bg-amber-500' : passwordStrength < 85 ? 'bg-emerald-500' : 'bg-emerald-400';

  // Username validation
  const validateUsername = (username) => {
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 30) return 'Username must be less than 30 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Only letters, numbers, and underscores allowed';
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    if (formData.name.length < 2) errors.name = 'Name must be at least 2 characters';
    const usernameErr = validateUsername(formData.username);
    if (usernameErr) errors.username = usernameErr;
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/register', {
        name: formData.name,
        username: formData.username,
        password: formData.password
      });
      
      addToast('Registration successful! 🎉', 'success');
      setTimeout(() => navigate('/login', { state: { message: 'Registration successful! Please login.' } }), 1000);
    } catch (err) {
      const serverError = err.response?.data;
      if (serverError?.details) {
        const serverFieldErrors = {};
        if (serverError.details.username) serverFieldErrors.username = serverError.details.username;
        if (serverError.details.password) serverFieldErrors.password = serverError.details.password;
        if (serverError.details.name) serverFieldErrors.name = serverError.details.name;
        setFieldErrors(serverFieldErrors);
      }
      const msg = serverError?.details ? `${serverError.error}: ${serverError.details}` : (serverError?.error || 'Registration failed. Try again.');
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 mb-4 shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[var(--text-primary)]">Join VibeTape</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">Start your digital identity journey today.</p>
        </div>

        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border border-[var(--border-color)] rounded-[32px] p-8 shadow-2xl transition-colors duration-300">
          {/* General Error */}
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

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Display Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    setFieldErrors({...fieldErrors, name: ''});
                  }}
                  className={`w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border ${fieldErrors.name ? 'border-red-500/50' : 'border-[var(--border-color)]'} rounded-2xl pl-12 pr-4 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-800`}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              {fieldErrors.name && (
                <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Username / ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({...formData, username: e.target.value});
                    setFieldErrors({...fieldErrors, username: ''});
                  }}
                  className={`w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border ${fieldErrors.username ? 'border-red-500/50' : 'border-[var(--border-color)]'} rounded-2xl pl-12 pr-4 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-800`}
                  placeholder="johndoe"
                  required
                />
              </div>
              {fieldErrors.username && (
                <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{fieldErrors.username}</p>
              )}
              {formData.username && !fieldErrors.username && (
                <p className="text-emerald-500 text-[10px] font-bold ml-1 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Username available
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Create Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    setFieldErrors({...fieldErrors, password: ''});
                  }}
                  className={`w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border ${fieldErrors.password ? 'border-red-500/50' : 'border-[var(--border-color)]'} rounded-2xl pl-12 pr-12 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-800`}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
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

              {fieldErrors.password && (
                <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({...formData, confirmPassword: e.target.value});
                    setFieldErrors({...fieldErrors, confirmPassword: ''});
                  }}
                  className={`w-full bg-black/40 dark:bg-black/40 light:bg-white/40 border ${fieldErrors.confirmPassword ? 'border-red-500/50' : 'border-[var(--border-color)]'} rounded-2xl pl-12 pr-12 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-800`}
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
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-[10px] font-bold ml-1 mt-1">{fieldErrors.confirmPassword}</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && !fieldErrors.confirmPassword && (
                <p className="text-emerald-500 text-[10px] font-bold ml-1 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Passwords match
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 uppercase italic tracking-widest mt-4 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[var(--text-secondary)] text-sm font-medium">
          Already have an account? {' '}
          <Link to="/login" className="text-blue-500 font-black uppercase italic tracking-wider hover:text-blue-400 transition-colors">
            Login Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
