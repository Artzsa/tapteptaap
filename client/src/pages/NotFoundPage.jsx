import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFoundPage = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
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
        className="text-center max-w-md relative z-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-8">
          <Search size={48} className="text-[var(--text-secondary)]" />
        </div>
        
        <h1 className="text-8xl font-black italic tracking-tighter text-[var(--text-primary)] mb-2">404</h1>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6" />
        <p className="text-[var(--text-secondary)] text-lg font-medium mb-2">Neural Link Not Found</p>
        <p className="text-zinc-700 text-sm font-bold mb-10 uppercase tracking-widest">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all uppercase italic tracking-widest text-xs shadow-xl shadow-blue-600/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home size={18} />
          Return to Home Base
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
