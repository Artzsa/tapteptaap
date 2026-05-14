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
  MapPin
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { useTheme } from '../context/ThemeContext';
import api from '../api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) return avatar;
  return `${API_BASE}${avatar}`;
};

const SOCIAL_BASE = {
  instagram: { icon: Camera, color: '#E1306C' },
  twitter: { icon: MessageCircle, color: '#1DA1F2' },
  x: { icon: MessageCircle, color: '#1DA1F2' },
  github: { icon: Code2, color: '#333' },
  linkedin: { icon: Briefcase, color: '#0077B5' },
  youtube: { icon: Video, color: '#FF0000' },
  whatsapp: { icon: MessageCircle, color: '#25D366' }
};

const getPlatformLogo = (platform, colored = false) => {
  const p = platform.toLowerCase();
  const base = "https://cdn.simpleicons.org/";
  const suffix = colored ? "" : "/white";
  
  if (p.includes('instagram')) return `${base}instagram${suffix}`;
  if (p.includes('x') || p.includes('twitter')) return `${base}x${suffix}`;
  if (p.includes('whatsapp')) return `${base}whatsapp${suffix}`;
  if (p.includes('facebook')) return `${base}facebook${suffix}`;
  if (p.includes('github')) return `${base}github${suffix}`;
  if (p.includes('linkedin')) return `${base}linkedin${suffix}`;
  if (p.includes('youtube')) return `${base}youtube${suffix}`;
  if (p.includes('tiktok')) return `${base}tiktok${suffix}`;
  if (p.includes('telegram')) return `${base}telegram${suffix}`;
  return null;
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
    border: 'border-blue-600',
    borderFade: 'border-blue-600/20',
    borderFadeStrong: 'border-blue-600/30',
    text: 'text-blue-500',
    textLight: 'text-blue-400',
    bg: 'bg-blue-600',
    bgFade: 'bg-blue-600/10',
    bgMedium: 'bg-blue-600/50',
    shadow: 'shadow-[0_0_20px_rgba(37,99,235,0.5)]',
    shadowLarge: 'shadow-[0_10px_30px_rgba(37,99,235,0.3)]',
    beam: 'from-blue-600/20',
    gradientBg: 'bg-blue-700/10'
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



const CustomQRCode = ({ value, themeHex, logo }) => {
  const ref = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 180,
      height: 180,
      type: 'svg',
      data: value,
      qrOptions: {
        errorCorrectionLevel: 'H'
      },
      dotsOptions: {
        color: themeHex || '#2563eb',
        type: 'rounded'
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: themeHex || '#2563eb',
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        color: themeHex || '#2563eb',
        type: 'dot'
      },
      image: logo,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: 0.4,
        hideBackgroundDots: true // Make the center clean for the logo
      },
      margin: 10
    });

    if (ref.current) {
      qrCodeRef.current.append(ref.current);
    }

    return () => {
      if (ref.current) ref.current.innerHTML = '';
    };
  }, [value, themeHex, logo]);

  return <div ref={ref} className="flex items-center justify-center rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/20" />;
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
    emerald: '#2563eb',
    purple: '#a855f7',
    rose: '#f43f5e',
    amber: '#f59e0b'
  };
  const themeHex = themeHexMap[themeKey] || '#06b6d4';

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
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

          {/* Profile Header (Horizontal Layout) */}
          <div className="mt-10 mb-6 px-2">
            <div className="flex items-center gap-5">
              {/* Left: Avatar */}
              <div className="relative flex-shrink-0">
                  <div className={`absolute inset-[-6px] rounded-[28px] border-2 ${theme.borderFadeStrong} opacity-50`} />
                  <div className="relative w-20 h-20 rounded-[22px] bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl">
                      <img 
                          src={getAvatarUrl(user?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                          className="w-full h-full object-cover"
                          alt="Avatar"
                      />
                  </div>
              </div>

              {/* Right: Identity */}
              <div className="flex flex-col text-left overflow-hidden">
                  <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-tight truncate">{user?.name}</h1>
                  <p className="text-[10px] font-bold text-white/60 leading-relaxed mt-1 line-clamp-2 italic">{user?.bio}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-[8px] font-black text-white/40 uppercase tracking-widest">
                        <MapPin size={10} className={theme.text} />
                        {user?.location || "Neural Space"}
                    </div>
                  </div>
              </div>
            </div>

            {/* Tags / Skills Row */}
            <div className="flex flex-wrap gap-1.5 mt-6">
                {(user?.tags || []).map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black text-white/40 uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          {/* Save Contact Button (Minimal) */}
          <div className="px-2 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadVCard}
              className={`w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/60 py-3 rounded-2xl font-black uppercase italic tracking-wider text-[10px] hover:bg-white/10 hover:text-white transition-all`}
            >
              <UserPlus size={14} />
              Add to Contacts
            </motion.button>
          </div>

          {/* Central QR Display */}
          <div className="flex justify-center my-10 relative">
             <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full animate-pulse" />
             <CustomQRCode 
               value={activeSocial?.url || window.location.href} 
               themeHex="#2563eb" 
               logo={activeSocial ? getPlatformLogo(activeSocial.platform, true) : null}
             />
          </div>

          {/* Social Links Grid (4 Columns) */}
          <div className="grid grid-cols-4 gap-4 px-2 mb-8">
            {displayLinks.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeIndex === idx;
              
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveIndex(idx)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border overflow-hidden ${
                    isActive 
                    ? 'bg-blue-600 border-blue-400 shadow-[0_10px_20px_rgba(37,99,235,0.4)]' 
                    : 'bg-white/5 border-white/10 group-hover:border-white/30'
                  }`}>
                    {getPlatformLogo(item.platform) ? (
                      <img 
                        src={getPlatformLogo(item.platform)} 
                        alt={item.platform}
                        className={`w-6 h-6 transition-all ${isActive ? 'opacity-100 scale-110' : 'opacity-30 group-hover:opacity-100'}`}
                      />
                    ) : (
                      <Icon size={24} className={isActive ? 'text-white' : 'text-white/40'} />
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-white/30'}`}>
                    {item.platform}
                  </span>
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
                <div className="pt-4">
                  <a 
                    href={activeSocial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => trackAndOpenLink(event, activeSocial)}
                    className="group relative flex items-center justify-center w-full bg-white text-blue-700 py-5 rounded-full font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all duration-300"
                  >
                    Open {activeSocial.platform}
                    <ExternalLink size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
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
