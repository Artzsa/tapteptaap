import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink,
  Cpu,
  Wifi,
  UserPlus,
  Camera,
  MessageCircle,
  Briefcase,
  Code2,
  Video,
  Sun,
  Moon,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '../context/ThemeContext';
import api from '../api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  return `${API_BASE}${avatar}`;
};

const SOCIAL_BASE = {
  instagram: { icon: Camera, color: '#E1306C' },
  twitter: { icon: MessageCircle, color: '#1DA1F2' },
  x: { icon: MessageCircle, color: '#1DA1F2' },
  github: { icon: Code2, color: '#333' },
  linkedin: { icon: Briefcase, color: '#0077B5' },
  youtube: { icon: Video, color: '#FF0000' }
};

const THEMES = {
  cyan: {
    border: 'border-cyan-500',
    borderFade: 'border-cyan-500/20',
    borderFadeStrong: 'border-cyan-500/30',
    text: 'text-cyan-500',
    textLight: 'text-cyan-400',
    bg: 'bg-cyan-500',
    bgFade: 'bg-cyan-500/10',
    bgMedium: 'bg-cyan-500/50',
    shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    shadowLarge: 'shadow-[0_10px_30px_rgba(6,182,212,0.3)]',
    beam: 'from-cyan-500/20',
    gradientBg: 'bg-cyan-600/10'
  },
  emerald: {
    border: 'border-emerald-500',
    borderFade: 'border-emerald-500/20',
    borderFadeStrong: 'border-emerald-500/30',
    text: 'text-emerald-500',
    textLight: 'text-emerald-400',
    bg: 'bg-emerald-500',
    bgFade: 'bg-emerald-500/10',
    bgMedium: 'bg-emerald-500/50',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    shadowLarge: 'shadow-[0_10px_30px_rgba(16,185,129,0.3)]',
    beam: 'from-emerald-500/20',
    gradientBg: 'bg-emerald-600/10'
  },
  purple: {
    border: 'border-purple-500',
    borderFade: 'border-purple-500/20',
    borderFadeStrong: 'border-purple-500/30',
    text: 'text-purple-500',
    textLight: 'text-purple-400',
    bg: 'bg-purple-500',
    bgFade: 'bg-purple-500/10',
    bgMedium: 'bg-purple-500/50',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    shadowLarge: 'shadow-[0_10px_30px_rgba(168,85,247,0.3)]',
    beam: 'from-purple-500/20',
    gradientBg: 'bg-purple-600/10'
  },
  rose: {
    border: 'border-rose-500',
    borderFade: 'border-rose-500/20',
    borderFadeStrong: 'border-rose-500/30',
    text: 'text-rose-500',
    textLight: 'text-rose-400',
    bg: 'bg-rose-500',
    bgFade: 'bg-rose-500/10',
    bgMedium: 'bg-rose-500/50',
    shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    shadowLarge: 'shadow-[0_10px_30px_rgba(244,63,94,0.3)]',
    beam: 'from-rose-500/20',
    gradientBg: 'bg-rose-600/10'
  },
  amber: {
    border: 'border-amber-500',
    borderFade: 'border-amber-500/20',
    borderFadeStrong: 'border-amber-500/30',
    text: 'text-amber-500',
    textLight: 'text-amber-400',
    bg: 'bg-amber-500',
    bgFade: 'bg-amber-500/10',
    bgMedium: 'bg-amber-500/50',
    shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    shadowLarge: 'shadow-[0_10px_30px_rgba(245,158,11,0.3)]',
    beam: 'from-amber-500/20',
    gradientBg: 'bg-amber-600/10'
  }
};

// Particle Dissolve Canvas Component
const ParticleDissolveQR = ({ value, themeHex, onComplete }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const [showQR, setShowQR] = useState(true);

  const initParticles = useCallback((canvas, qrData) => {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    // Sample QR pixels
    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = [];
    
    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < w; x += 3) {
        const i = (y * w + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const brightness = (r + g + b) / 3;
        
        if (brightness < 128) {
          pixels.push({ x, y });
        }
      }
    }
    
    // Create particles from sampled pixels
    particlesRef.current = pixels.map(p => ({
      x: p.x,
      y: p.y,
      originX: p.x,
      originY: p.y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 4,
      size: Math.random() * 2 + 1,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
      color: themeHex || '#06b6d4'
    }));
  }, [themeHex]);

  const animateDissolve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let allDead = true;
    
    particlesRef.current.forEach(p => {
      if (p.life <= 0) return;
      allDead = false;
      
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= p.decay;
      
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
    
    if (!allDead) {
      animFrameRef.current = requestAnimationFrame(animateDissolve);
    } else {
      setShowQR(false);
      if (onComplete) setTimeout(onComplete, 100);
    }
  }, [onComplete]);

  const animateAssemble = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let allHome = true;
    
    particlesRef.current.forEach(p => {
      const dx = p.originX - p.x;
      const dy = p.originY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0.5) {
        allHome = false;
        p.x += dx * 0.08;
        p.y += dy * 0.08;
        p.life = Math.min(1, p.life + 0.03);
      } else {
        p.x = p.originX;
        p.y = p.originY;
        p.life = 1;
      }
      
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
    
    if (!allHome) {
      animFrameRef.current = requestAnimationFrame(animateAssemble);
    } else {
      setShowQR(true);
    }
  }, []);

  const triggerDissolve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Draw current QR to canvas
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    
    // Render QR to temp canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw white background
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, size, size);
    
    // Draw QR modules manually
    const qrSize = 21; // QR version 2
    const moduleSize = size / qrSize;
    
    // Simple QR-like pattern based on value
    const hash = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        // Finder patterns
        const inTopLeft = row < 7 && col < 7;
        const inTopRight = row < 7 && col >= qrSize - 7;
        const inBottomLeft = row >= qrSize - 7 && col < 7;
        
        if (inTopLeft || inTopRight || inBottomLeft) {
          const isOuter = row === 0 || row === 6 || col === 0 || col === 6;
          const isInner = row >= 2 && row <= 4 && col >= 2 && col <= 4;
          if (isOuter || isInner) {
            tempCtx.fillStyle = '#000';
            tempCtx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        } else {
          // Data modules
          const seed = (hash * (row + 1) * (col + 1)) % 3;
          if (seed < 2) {
            tempCtx.fillStyle = '#000';
            tempCtx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
    }
    
    // Copy to main canvas
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Initialize particles from canvas
    initParticles(canvas, value);
    
    // Start dissolve animation
    setShowQR(false);
    animateDissolve();
  }, [value, initParticles, animateDissolve]);

  const triggerAssemble = useCallback(() => {
    // Re-init particles scattered
    particlesRef.current.forEach(p => {
      p.x = Math.random() * canvasRef.current.width;
      p.y = Math.random() * canvasRef.current.height;
      p.vx = 0;
      p.vy = 0;
      p.life = 0.3;
    });
    
    animateAssemble();
  }, [animateAssemble]);

  // Expose trigger functions via ref
  useEffect(() => {
    if (canvasRef.current && window.__particleQR) {
      window.__particleQR.dissolve = triggerDissolve;
      window.__particleQR.assemble = triggerAssemble;
    }
  }, [triggerDissolve, triggerAssemble]);

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <canvas 
        ref={canvasRef}
        width={80}
        height={80}
        className="absolute inset-0 w-full h-full"
      />
      {showQR && (
        <div className="absolute inset-0 flex items-center justify-center">
          <QRCodeSVG 
            value={value}
            size={80}
            level="H"
          />
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNewQR, setShowNewQR] = useState(true);
  const prevUrlRef = useRef(null);
  const particleRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/u/${username}?t=${Date.now()}`);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Neural Link Offline");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const downloadVCard = () => {
    if (!user) return;
    
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
TEL;TYPE=CELL:${user.phone || ''}
EMAIL:${user.email || ''}
URL:${window.location.href}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${user.name}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayLinks = useMemo(() => {
    if (!user) return [];
    const links = user.links || [];
    
    return links.map((link, index) => ({
      ...link,
      ...(SOCIAL_BASE[link.platform] || { icon: ExternalLink, color: '#00D1FF' }),
      angle: index * (360 / (links.length || 1))
    }));
  }, [user]);

  useEffect(() => {
    if (displayLinks.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % displayLinks.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [displayLinks.length]);

  const activeSocial = displayLinks[activeIndex] || null;

  // Trigger particle dissolve when link changes
  useEffect(() => {
    const currentUrl = activeSocial?.url || window.location.href;
    if (prevUrlRef.current && prevUrlRef.current !== currentUrl) {
      setIsTransitioning(true);
      setShowNewQR(false);
      
      // Trigger dissolve of old QR
      if (window.__particleQR?.dissolve) {
        window.__particleQR.dissolve();
      }
      
      // After dissolve, assemble new QR
      setTimeout(() => {
        setShowNewQR(true);
        setTimeout(() => {
          if (window.__particleQR?.assemble) {
            window.__particleQR.assemble();
          }
          setTimeout(() => setIsTransitioning(false), 800);
        }, 50);
      }, 600);
    }
    prevUrlRef.current = currentUrl;
  }, [activeSocial]);

  const trackAndOpenLink = async (event, link) => {
    event.preventDefault();
    if (!link?.url) return;

    try {
      await api.post('/api/analytics/click', {
        username,
        platform: link.platform,
        url: link.url,
        source: 'public_profile'
      });
    } catch (_err) {
      // Ignore tracking failures so navigation still works.
    } finally {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getPosition = (angle, radius) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
  };

  const themeKey = user?.theme || 'cyan';
  const theme = THEMES[themeKey] || THEMES.cyan;
  
  // Map theme key to hex color for QR animations
  const themeHexMap = {
    cyan: '#06b6d4',
    emerald: '#10b981',
    purple: '#a855f7',
    rose: '#f43f5e',
    amber: '#f59e0b'
  };
  const themeHex = themeHexMap[themeKey] || '#06b6d4';

  if (loading) return (
    <div className="min-h-screen bg-[#02040A] flex flex-col items-center justify-center">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-16 h-16 border-t-2 border-r-2 ${theme.border} rounded-full mb-4 ${theme.shadow}`}
        />
        <div className={`${theme.text} font-mono text-xs tracking-[0.5em] animate-pulse`}>INITIALIZING NEURAL LINK...</div>
    </div>
  );

  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-4 relative font-sans overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:scale-105 shadow-lg"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Neural Network Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #1E293B 1px, transparent 0)`,
            backgroundSize: '32px 32px'
        }} />
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                animate={{ 
                    x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                    y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear' }}
                className={`absolute w-[300px] h-[300px] ${theme.gradientBg} blur-[100px] rounded-full`}
            />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        
        {/* Futuristic Card Shell */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-[48px] border-2 border-white/5 bg-[#0A0F1E]/80 backdrop-blur-3xl p-6 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Top Tech Decoration */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent`} />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
             <div className={`w-1 h-1 rounded-full ${theme.bg} animate-pulse`} />
             <div className="w-8 h-1 rounded-full bg-white/10" />
             <div className={`w-1 h-1 rounded-full ${theme.bg} animate-pulse`} />
          </div>

          {/* Profile Header */}
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="relative mb-6">
                <div className={`absolute inset-[-8px] rounded-[32px] border ${theme.borderFadeStrong} animate-[spin_10s_linear_infinite]`} />
                <div className="absolute inset-[-4px] rounded-[28px] border border-white/10 animate-[spin_7s_linear_infinite_reverse]" />
                <div className="relative w-24 h-24 rounded-[24px] bg-zinc-900 border border-white/10 overflow-hidden">
                    <img 
                        src={getAvatarUrl(user?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                        className="w-full h-full object-cover grayscale-[0.2] contrast-125"
                        alt="Agent"
                    />
                </div>
            </div>

            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{user?.name}</h1>
            <div className="flex items-center gap-3 mt-2">
                <div className={`flex items-center gap-1 text-[9px] font-black ${theme.textLight} ${theme.bgFade} px-2 py-1 rounded-md border ${theme.borderFade} uppercase tracking-[0.2em]`}>
                    <Cpu size={10} />
                    Core ID: {user?.username}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20 uppercase tracking-[0.2em]">
                    <Wifi size={10} className="animate-pulse" />
                    Online
                </div>
            </div>

            {/* Save Contact Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadVCard}
              className={`mt-6 flex items-center gap-2 ${theme.bg} text-black px-6 py-2.5 rounded-2xl font-black uppercase italic tracking-wider text-xs ${theme.shadowLarge} transition-all`}
            >
              <UserPlus size={16} />
              Add to Contacts
            </motion.button>
          </div>

          {/* Holographic Rotary System */}
          <div className="relative h-[320px] flex items-center justify-center my-8">
            {/* Background Tech Rings */}
            <div className="absolute w-64 h-64 border border-white/5 rounded-full" />
            <div className={`absolute w-72 h-72 border border-dashed ${theme.borderFade} rounded-full animate-[spin_30s_linear_infinite]`} />
            
            {/* Active Glow Beam */}
            {activeSocial && (
                <motion.div
                    animate={{ rotate: activeSocial.angle }}
                    transition={{ type: 'spring', stiffness: 40, damping: 12 }}
                    className="absolute inset-0 flex justify-center"
                >
                    <div className={`w-[100px] h-[150px] bg-gradient-to-b ${theme.beam} to-transparent blur-[30px] rounded-full`} />
                </motion.div>
            )}

            {/* Central Node with Particle Dissolve QR */}
            <div className="relative z-20 w-36 h-36 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                
                {/* Particle Dissolve QR */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <canvas 
                    ref={el => {
                      if (el && !particleRef.current) {
                        particleRef.current = el;
                        window.__particleQR = window.__particleQR || {};
                      }
                    }}
                    width={80}
                    height={80}
                    className="absolute inset-0 w-full h-full"
                  />
                  {showNewQR && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QRCodeSVG 
                        value={activeSocial?.url || window.location.href}
                        size={80}
                        level="H"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-2 text-[8px] font-black tracking-[0.4em] text-black uppercase opacity-60">
                  {activeSocial ? `Link: ${activeSocial.platform}` : 'Handshake'}
                </div>
            </div>

            {/* Orbiting Platform Nodes */}
            {displayLinks.map((item, idx) => {
              const pos = getPosition(item.angle, 135);
              const isActive = activeIndex === idx;
              const Icon = item.icon;

              return (
                <motion.button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{ x: pos.x, y: pos.y }}
                  className="absolute z-30"
                  whileHover={{ scale: 1.2 }}
                >
                  <div className={`w-12 h-12 rounded-[14px] border-2 transition-all duration-500 flex items-center justify-center ${
                    isActive 
                    ? 'bg-white border-white text-black shadow-[0_0_25px_rgba(255,255,255,0.5)]' 
                    : 'bg-[#0A0F1E] border-white/10 text-white/40 hover:text-white hover:border-white/30'
                  }`}>
                    <Icon size={20} />
                    {isActive && (
                        <div className="absolute -inset-1 rounded-[16px] border border-white/20 animate-pulse" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Action Interface */}
          <AnimatePresence mode="wait">
            {activeSocial ? (
              <motion.div
                key={activeSocial.platform}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="flex items-end justify-between px-2">
                    <div>
                        <div className={`text-[8px] font-black ${theme.text} uppercase tracking-[0.4em] mb-1`}>Target Protocol</div>
                        <div className="text-2xl font-black uppercase italic tracking-tighter text-white">
                            {activeSocial.platform}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Link Status</div>
                        <div className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-1 justify-end">
                            <span className="w-1 h-1 rounded-full bg-green-400" />
                            Encrypted
                        </div>
                    </div>
                </div>

                <a 
                  href={activeSocial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => trackAndOpenLink(event, activeSocial)}
                  className={`group relative flex items-center justify-center w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-[0.2em] shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:${theme.bg} transition-colors duration-300`}
                >
                  Initiate Link
                  <ExternalLink size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </motion.div>
            ) : (
                <div className="text-center text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] py-8">
                    Awaiting Uplink...
                </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Animated Tech Stats */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-zinc-600 tracking-widest uppercase">
          <span>Lat: 0.24ms</span>
          <div className="flex gap-2">
              <div className={`w-1 h-1 rounded-full ${theme.bgMedium}`} />
              <div className={`w-1 h-1 rounded-full ${theme.bgMedium}`} />
              <div className={`w-1 h-1 rounded-full ${theme.bg}`} />
          </div>
          <span>Uptime: 99.9%</span>
        </div>

        {/* Brand Footer */}
        <div className="mt-10 text-center space-y-2 opacity-40">
           <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.6em]">Neural Link ID-7742</div>
           <div className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">Powered by VibeTape</div>
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;
