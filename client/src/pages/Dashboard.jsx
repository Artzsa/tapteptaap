import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Save, 
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Plus,
  Trash2,
  BarChart3,
  QrCode,
  Palette,
  Layers,
  HelpCircle,
  TrendingUp,
  Users,
  MousePointer2,
  Eye,
  MoreVertical,
  Copy,
  MapPin,
  Briefcase,
  Camera,
  Hash,
  Code2,
  AtSign,
  Sparkles,
  Cpu,
  Sun,
  Moon,
  Menu,
  X,
  Key,
  Shield,
  Trash2 as TrashIcon,
  Globe,
  Zap,
  Webhook,
  Bot,
  MessageSquare,
  ChartLine,
  Plug,
  Unplug,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

const SkeletonPulse = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-[var(--border-color)] ${className}`} />
);

const AnalyticsStatCardSkeleton = () => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 flex flex-col justify-between h-[160px]">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-11 w-11 rounded-2xl shrink-0" />
      <SkeletonPulse className="h-4 w-14" />
    </div>
    <div className="space-y-2">
      <SkeletonPulse className="h-3 w-28" />
      <SkeletonPulse className="h-9 w-24" />
      <SkeletonPulse className="h-2 w-36 bg-[var(--border-color)]" />
    </div>
  </div>
);

const AnalyticsMiniStatSkeleton = () => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
    <SkeletonPulse className="h-3 w-16" />
    <SkeletonPulse className="h-8 w-20" />
  </div>
);

const CHART_SKELETON_HEIGHTS = [35, 55, 40, 70, 45, 85, 50, 65, 75, 48, 60, 42];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  return `${API_BASE}${avatar}`;
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Form State - FIXED: removed duplicate email/phone keys
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    tags: '',
    email: '',
    phone: '',
    theme: 'cyan'
  });

  const [socialLinks, setSocialLinks] = useState([]);
  const [analytics, setAnalytics] = useState({
    stats: { totalViews: 0, totalClicks: 0, uniqueVisitors: 0, clickRate: 0 },
    trends: { totalViews: '0%', totalClicks: '0%', uniqueVisitors: '0%', clickRate: '0%' },
    topLinks: [],
    timeline: [],
    recentActivity: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsDays, setAnalyticsDays] = useState(30);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    if (!storedUserStr) {
      navigate('/login');
      return;
    }
    const storedUser = JSON.parse(storedUserStr);

    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/u/${storedUser.username}?t=${Date.now()}&noTrack=true`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          bio: response.data.bio,
          location: response.data.location || '',
          tags: Array.isArray(response.data.tags) ? response.data.tags.join(', ') : '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          theme: response.data.theme || 'cyan'
        });
        setSocialLinks(response.data.links || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      await api.put('/api/profile', {
        ...formData,
        tags: tagsArray
      });
      
      setUser(prev => ({
        ...prev,
        ...formData,
        tags: tagsArray
      }));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setActiveTab('overview'), 1500);
    } catch (err) {
      console.error('API Error:', err);
      alert('Koneksi ke Server Gagal! Pastikan server jalan di port 5000.');
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);

    try {
      setSaving(true);
      const response = await api.post('/api/profile/avatar', formDataUpload);
      setUser(prev => ({
        ...prev,
        avatar: response.data.avatar + '?t=' + Date.now() // cache bust
      }));
      setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
    } catch (err) {
      console.error('Avatar upload error:', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to upload avatar.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLinks = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/api/profile/links', {
        links: socialLinks
      });
      
      setUser(prev => ({
        ...prev,
        links: socialLinks
      }));
      
      setMessage({ type: 'success', text: 'Social links updated successfully!' });
      
      setTimeout(async () => {
        const response = await api.get(`/api/u/${user.username}?t=${Date.now()}&noTrack=true`);
        setUser(response.data);
        setActiveTab('overview');
      }, 1500);
    } catch (err) {
      console.error('API Error:', err);
      alert('Koneksi ke Server Gagal! Pastikan server jalan di port 5000.');
      setMessage({ type: 'error', text: 'Failed to update links.' });
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setSocialLinks([...socialLinks, { _client_id: Date.now() + Math.random(), platform: 'LinkedIn', url: '' }]);
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const removeLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const fetchAnalytics = async (days = analyticsDays) => {
    if (!localStorage.getItem('token')) return;
    setAnalyticsLoading(true);
    try {
      const response = await api.get(`/api/analytics?days=${days}`);
      if (response.data?.success) {
        setAnalytics((prev) => ({
          stats: response.data.stats || prev.stats,
          trends: response.data.trends || prev.trends,
          topLinks: response.data.topLinks || [],
          timeline: response.data.timeline || [],
          recentActivity: response.data.recentActivity || []
        }));
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchAnalytics(analyticsDays);
    }
  }, [user?.username, analyticsDays]);

  const formatTimeAgo = (value) => {
    const timestamp = new Date(value).getTime();
    if (Number.isNaN(timestamp)) return 'unknown';
    const diffMs = Date.now() - timestamp;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  const formatDayLabel = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  const getPlatformVisual = (platform) => {
    const normalized = String(platform || '').toLowerCase();
    if (normalized.includes('linkedin')) return { icon: <Briefcase size={16} />, color: 'bg-blue-500' };
    if (normalized.includes('instagram')) return { icon: <Camera size={16} />, color: 'bg-pink-500' };
    if (normalized === 'x' || normalized.includes('twitter')) return { icon: <Hash size={16} />, color: 'bg-white' };
    if (normalized.includes('github')) return { icon: <Code2 size={16} />, color: 'bg-purple-500' };
    if (normalized.includes('threads')) return { icon: <AtSign size={16} />, color: 'bg-white' };
    return { icon: <LinkIcon size={16} />, color: 'bg-blue-500' };
  };
  const topLinksDisplay = useMemo(
    () => (analytics.topLinks.length > 0 ? analytics.topLinks : [{ platform: 'No data yet', clicks: 0 }]),
    [analytics.topLinks]
  );
  const recentActivityDisplay = useMemo(
    () => (analytics.recentActivity.length > 0
      ? analytics.recentActivity
      : [{ platform: 'No activity yet', source: 'system', clickedAt: new Date().toISOString() }]),
    [analytics.recentActivity]
  );
  const timelineDisplay = useMemo(
    () => (analytics.timeline.length > 0 ? analytics.timeline : [{ day: 'No data', views: 0 }]),
    [analytics.timeline]
  );

  const handleDownloadQR = () => {
    const svg = document.getElementById('dashboard-profile-qr');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user?.username || 'profile'}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/u/${user?.username || ''}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user?.name || 'My'} VibeTape Card`,
          text: 'Check out my VibeTape profile',
          url: profileUrl
        });
        return;
      }
      await navigator.clipboard.writeText(profileUrl);
      setMessage({ type: 'success', text: 'Profile URL copied to clipboard!' });
    } catch (err) {
      console.error('Share failed:', err);
      setMessage({ type: 'error', text: 'Failed to share profile URL.' });
    }
  };

  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [renderError, setRenderError] = useState(null);

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse" />
        <BarChart3 className="animate-spin text-primary relative z-10" size={48} />
      </div>
    </div>
  );

  if (renderError) return (
    <div className="min-h-screen bg-black text-red-500 p-10 font-mono text-xs overflow-auto">
      <h1 className="text-2xl font-bold mb-4">CRITICAL RENDER ERROR DETECTED</h1>
      <pre className="bg-red-500/10 p-5 rounded-xl border border-red-500/20">
        {renderError}
      </pre>
      <button 
        onClick={() => window.location.reload()}
        className="mt-5 px-6 py-2 bg-red-500 text-white rounded-lg font-bold"
      >
        Force Restart
      </button>
    </div>
  );

  try {
    return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex text-[var(--text-primary)] font-sans selection:bg-primary/30 transition-colors duration-300">
      
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-lg"
      >
        <Menu size={20} className="text-[var(--text-primary)]" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col z-50 lg:hidden"
            >
              {/* Close Button */}
              <div className="p-4 flex justify-end">
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--border-color)] transition-colors"
                >
                  <X size={18} className="text-[var(--text-secondary)]" />
                </button>
              </div>
              {/* User Header */}
              <div className="px-6 pb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-tight truncate w-32">{user?.name}</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-bold truncate w-32 lowercase">{user?.username}.link</span>
                </div>
              </div>
              {/* Navigation */}
              <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
                <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4 px-2">Main Menu</div>
                {[
                  { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
                  { id: 'profile', icon: <User size={18} />, label: 'My Card' },
                  { id: 'social', icon: <LinkIcon size={18} />, label: 'Links' },
                  { id: 'qr', icon: <QrCode size={18} />, label: 'QR Code' },
                  { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
                  { id: 'appearance', icon: <Palette size={18} />, label: 'Appearance' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="pt-6">
                  <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4 px-2">Account</div>
                  {[
                    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
                    { id: 'integrations', icon: <Layers size={18} />, label: 'Integrations' },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        activeTab === item.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </nav>
              {/* Pro Upgrade Card */}
              <div className="p-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                  <Sparkles className="text-white/40 mb-3" size={24} />
                  <h4 className="text-sm font-black mb-1">Upgrade to Pro</h4>
                  <p className="text-[10px] text-white/60 mb-4 font-medium leading-relaxed">Unlock custom themes, advanced analytics, and more.</p>
                  <button className="w-full py-2.5 bg-white text-black rounded-lg text-xs font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Upgrade Now
                  </button>
                </div>
              </div>
              {/* Footer */}
              <div className="p-4 border-t border-[var(--border-color)] space-y-2">
                <button 
                  onClick={() => { toggleTheme(); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-xs font-bold"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-xs font-bold">
                  <HelpCircle size={16} />
                  Need Help?
                </button>
                <button 
                  onClick={() => { handleLogout(); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-500/70 hover:text-red-500 transition-all text-xs font-bold"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR - hidden on mobile */}
      <aside className="hidden lg:flex w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex-col h-screen sticky top-0 z-30">
        {/* User Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
          <span className="text-sm font-black tracking-tight truncate w-32">{user?.name}</span>
          <span className="text-[10px] text-[var(--text-secondary)] font-bold truncate w-32 lowercase">{user?.username}.link</span>
            </div>
          </div>
          <MoreVertical size={16} className="text-[var(--text-secondary)] cursor-pointer" />
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4 px-2">Main Menu</div>
          {[
            { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
            { id: 'profile', icon: <User size={18} />, label: 'My Card' },
            { id: 'social', icon: <LinkIcon size={18} />, label: 'Links' },
            { id: 'qr', icon: <QrCode size={18} />, label: 'QR Code' },
            { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
            { id: 'appearance', icon: <Palette size={18} />, label: 'Appearance' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="pt-6">
            <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4 px-2">Account</div>
            {[
              { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
              }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Pro Upgrade Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <Sparkles className="text-white/40 mb-3" size={24} />
            <h4 className="text-sm font-black mb-1">Upgrade to Pro</h4>
            <p className="text-[10px] text-white/60 mb-4 font-medium leading-relaxed">Unlock custom themes, advanced analytics, and more.</p>
            <button className="w-full py-2.5 bg-white text-black rounded-lg text-xs font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] space-y-2">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-xs font-bold"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-xs font-bold">
            <HelpCircle size={16} />
            Need Help?
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500/70 hover:text-red-500 transition-all text-xs font-bold"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ELITE MAIN CONTENT */}
      <main className="flex-grow h-screen overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
          
          {/* Top Navbar */}
          <header className="flex items-center justify-between">
            <div className="ml-10 lg:ml-0">
              <h2 className="text-lg md:text-2xl font-black tracking-tight text-[var(--text-primary)] uppercase italic">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Agent'}! 👋</h2>
              <p className="text-[var(--text-secondary)] text-xs md:text-sm font-medium">Here's what's happening with your card.</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`/u/${user?.username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-widest italic text-white transition-all"
              >
                <span className="hidden md:inline">View Public Card</span>
                <ExternalLink size={14} />
              </motion.a>
              <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg">
                <MoreVertical size={12} className="text-[var(--text-secondary)]" />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Profile Banner Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[32px] p-8 flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-2xl font-black">
                         {user?.name?.charAt(0)}
                       </div>
                       <div>
                         <h3 className="text-2xl font-black">{user?.name}</h3>
                         <p className="text-white/60 text-sm italic font-medium">"{user?.bio}"</p>
                         <div className="flex items-center gap-2 mt-4 text-xs font-bold text-white/40">
                            <MapPin size={12} /> {user?.location}
                         </div>
                       </div>
                       <div className="flex flex-wrap gap-2 pt-2">
                         {Array.isArray(user?.tags) && user.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                         ))}
                       </div>
                       <button 
                        onClick={() => setActiveTab('profile')}
                        className="mt-4 px-6 py-2.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl text-xs font-black backdrop-blur-md transition-all"
                       >
                         Edit Profile
                       </button>
                    </div>
                    {/* Visual Card Elements */}
                    <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center opacity-50 lg:opacity-100">
                       <div className="relative w-64 h-64">
                          <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-pulse" />
                          <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-40 h-40 bg-white rounded-3xl p-3 shadow-2xl">
                               <QRCodeSVG value={`http://localhost:5173/u/${user?.username}`} size={136} />
                             </div>
                          </div>
                          {/* Orbiting Platform Icons Placeholder */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                             <LinkIcon size={18} />
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Sidebar Info Cards */}
                  <div className="space-y-6">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Your Card Live Link</span>
                         <Copy size={14} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors" />
                       </div>
                       <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between group">
                          <span className="text-xs font-medium text-[var(--text-secondary)] truncate w-48">https://{user?.username}.link</span>
                          <ExternalLink size={14} className="text-[var(--text-secondary)] group-hover:text-blue-500" />
                       </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-6">
                       <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest block">Your QR Code</span>
                       <div className="flex items-center gap-6">
                          <div className="p-3 bg-white rounded-2xl w-24 h-24">
                            <QRCodeSVG id="dashboard-profile-qr" value={`${window.location.origin}/u/${user?.username}`} size={72} />
                          </div>
                          <div className="flex-grow space-y-2">
                             <button onClick={handleDownloadQR} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase transition-all">Download QR</button>
                             <button onClick={handleShareProfile} className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase transition-all">Share</button>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {analyticsLoading ? (
                    [...Array(4)].map((_, i) => <AnalyticsStatCardSkeleton key={i} />)
                  ) : (
                  [
                    { label: 'Total Views', value: analytics.stats.totalViews.toLocaleString(), change: analytics.trends.totalViews, icon: <Eye className="text-blue-500" />, trend: analytics.trends.totalViews.startsWith('-') ? 'down' : 'up' },
                    { label: 'Total Clicks', value: analytics.stats.totalClicks.toLocaleString(), change: analytics.trends.totalClicks, icon: <MousePointer2 className="text-purple-500" />, trend: analytics.trends.totalClicks.startsWith('-') ? 'down' : 'up' },
                    { label: 'Unique Visitors', value: analytics.stats.uniqueVisitors.toLocaleString(), change: analytics.trends.uniqueVisitors, icon: <Users className="text-cyan-500" />, trend: analytics.trends.uniqueVisitors.startsWith('-') ? 'down' : 'up' },
                    { label: 'Click Rate', value: `${analytics.stats.clickRate}%`, change: analytics.trends.clickRate, icon: <TrendingUp className="text-emerald-500" />, trend: analytics.trends.clickRate.startsWith('-') ? 'down' : 'up' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 flex flex-col justify-between h-[160px] group hover:border-blue-500/30 transition-all">
                       <div className="flex items-center justify-between">
                         <div className="p-3 bg-[var(--border-color)] rounded-2xl group-hover:bg-blue-500/10 transition-colors">
                           {stat.icon}
                         </div>
                         <div className={`flex items-center gap-1 text-xs font-black ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                           <TrendingUp size={12} /> {stat.change}
                         </div>
                       </div>
                       <div>
                         <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{stat.label}</span>
                         <h4 className="text-2xl font-black mt-1">{stat.value}</h4>
                         <p className="text-[9px] text-[var(--text-secondary)] font-bold mt-1">vs last {analyticsDays} days</p>
                       </div>
                    </div>
                  ))
                  )}
                </div>

                {/* Bottom Charts & Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Views Chart Placeholder */}
                   <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-lg font-black italic uppercase tracking-tighter">Views Over Time</h3>
                         <select
                           value={analyticsDays}
                           disabled={analyticsLoading}
                           onChange={(e) => setAnalyticsDays(Number(e.target.value))}
                           className="bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-[10px] font-black uppercase outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                         </select>
                      </div>
                      <div className="h-[240px] flex items-end gap-2 px-2 relative">
                         {analyticsLoading ? (
                           CHART_SKELETON_HEIGHTS.map((pct, i) => (
                             <div key={i} className="flex-grow flex flex-col justify-end">
                               <div
                                 className="w-full rounded-t-lg bg-[var(--border-color)] animate-pulse"
                                 style={{ height: `${pct}%` }}
                               />
                             </div>
                           ))
                         ) : (
                           timelineDisplay.map((point, i, arr) => {
                           const maxViews = Math.max(1, ...arr.map((item) => item.views || 0));
                           const h = Math.max(4, Math.round(((point.views || 0) / maxViews) * 100));
                           return (
                           <div key={i} className="flex-grow flex flex-col justify-end group">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className="w-full bg-blue-500/20 group-hover:bg-blue-500 rounded-t-lg transition-all relative"
                              >
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {point.views || 0}
                                 </div>
                              </motion.div>
                           </div>
                         )}))}
                         {/* Grid Lines */}
                         <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-5">
                            {[...Array(5)].map((_, i) => <div key={i} className="h-px bg-white w-full" />)}
                         </div>
                      </div>
                      <div className="flex justify-between px-2 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest pt-2 border-t border-[var(--border-color)]">
                         {analyticsLoading ? (
                           <>
                             <SkeletonPulse className="h-3 w-10 bg-[var(--border-color)]" />
                             <SkeletonPulse className="h-3 w-10 bg-[var(--border-color)]" />
                             <SkeletonPulse className="h-3 w-10 bg-[var(--border-color)]" />
                           </>
                         ) : (
                           <>
                             <span>{timelineDisplay[0]?.day ? formatDayLabel(timelineDisplay[0].day) : '-'}</span>
                             <span>{timelineDisplay[Math.floor((timelineDisplay.length - 1) / 2)]?.day ? formatDayLabel(timelineDisplay[Math.floor((timelineDisplay.length - 1) / 2)].day) : '-'}</span>
                             <span>{timelineDisplay[timelineDisplay.length - 1]?.day ? formatDayLabel(timelineDisplay[timelineDisplay.length - 1].day) : '-'}</span>
                           </>
                         )}
                      </div>
                   </div>

                   {/* Top Links */}
                   <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-lg font-black italic uppercase tracking-tighter">Top Links</h3>
                         <button onClick={() => fetchAnalytics(analyticsDays)} className="text-[10px] font-black uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{analyticsLoading ? 'Loading...' : 'Refresh'}</button>
                      </div>
                      <div className="space-y-5">
                         {analyticsLoading ? (
                           [...Array(5)].map((_, index) => (
                             <div key={index} className="space-y-2 animate-pulse">
                               <div className="flex items-center justify-between text-xs">
                                 <div className="flex items-center gap-2">
                                   <SkeletonPulse className="h-9 w-9 rounded-md shrink-0" />
                                   <SkeletonPulse className="h-4 w-24" />
                                 </div>
                                 <SkeletonPulse className="h-4 w-12" />
                               </div>
                               <SkeletonPulse className="h-1 w-full rounded-full bg-[var(--border-color)]" />
                             </div>
                           ))
                         ) : (
                         topLinksDisplay.map((link, index) => {
                           const platformVisual = getPlatformVisual(link.platform);
                           return (
                           <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                 <div className="flex items-center gap-2 font-bold">
                                    <div className={`p-1.5 ${platformVisual.color} rounded-md text-black`}>{platformVisual.icon}</div>
                                    {link.platform}
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className="font-black">{link.clicks.toLocaleString()}</span>
                                    <span className="text-[10px] font-black text-emerald-400">Clicks</span>
                                 </div>
                              </div>
                              <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                                 <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.max(10, Math.min(100, (link.clicks / Math.max(1, analytics.stats.totalClicks)) * 100))}%` }} 
                                  className={`h-full ${platformVisual.color}`} 
                                 />
                              </div>
                           </div>
                         )}))}
                      </div>
                   </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black italic uppercase tracking-tighter">Recent Activity</h3>
                      <button className="text-[10px] font-black uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">View All</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analyticsLoading ? (
                        [...Array(6)].map((_, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--border-color)] animate-pulse">
                            <SkeletonPulse className="h-10 w-10 rounded-xl shrink-0" />
                            <div className="flex-grow space-y-2 pt-1">
                              <SkeletonPulse className="h-4 w-[85%] max-w-[200px]" />
                              <div className="flex justify-between gap-2 mt-3">
                                <SkeletonPulse className="h-3 w-28" />
                                <SkeletonPulse className="h-3 w-12" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                      recentActivityDisplay.map((activity, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-all group">
                           <div className="w-10 h-10 rounded-xl bg-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-blue-400 transition-colors">
                              {getPlatformVisual(activity.platform).icon}
                           </div>
                           <div className="flex-grow">
                              <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                                <span className="text-[var(--text-secondary)]">Visitor</span> clicked {activity.platform}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] font-bold text-[var(--text-secondary)]">Source: {activity.source || 'unknown'}</span>
                                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase">{formatTimeAgo(activity.clickedAt)}</span>
                              </div>
                           </div>
                        </div>
                      ))
                      )}
                   </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl"
              >
                <form onSubmit={handleUpdateProfile} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Edit Card Profile</h3>
                    <div className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20 italic">Global Sync</div>
                  </div>

                  {message.text && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                      message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      {message.text}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="relative w-24 h-24 rounded-[24px] bg-zinc-900 border border-[var(--border-color)] overflow-hidden group">
                        <img 
                            src={getAvatarUrl(user?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                            className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                            alt="Avatar"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Camera size={24} className="text-white" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest text-center">
                        Upload Neural Avatar<br/>
                        <span className="text-[8px] text-[var(--text-secondary)]">Max 5MB (JPG, PNG)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Full Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700"
                          placeholder="Your identity"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Location</label>
                        <input 
                          type="text" 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700"
                          placeholder="e.g. Tokyo, JP"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Bio / Status</label>
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700 min-h-[120px] resize-none"
                        placeholder="Tell the digital world who you are..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Skill Tags (Comma Separated)</label>
                      <input 
                        type="text" 
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700"
                        placeholder="e.g. Designer, Hacker, Visionary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Email Protocol</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700"
                          placeholder="agent@vibetape.link"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Neural Frequency (Phone)</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700"
                          placeholder="+62..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="flex-grow bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 uppercase italic tracking-widest"
                    >
                      {saving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : (
                        <>
                          <Save size={20} />
                          Commit Changes
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-10 bg-[var(--border-color)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-2xl font-black uppercase italic hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div 
                key="social"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl space-y-8"
              >
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">Social Network Map</h3>
                      <p className="text-[var(--text-secondary)] text-xs font-bold mt-1 uppercase tracking-widest">Manage your active uplink nodes</p>
                    </div>
                    <button 
                      onClick={addLink}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600/20 transition-all italic"
                    >
                      <Plus size={18} />
                      Add Node
                    </button>
                  </div>

                  <Reorder.Group axis="y" values={socialLinks} onReorder={setSocialLinks} className="space-y-4">
                    {socialLinks.map((link, index) => (
                      <Reorder.Item 
                        key={link.id || link._client_id || index} 
                        value={link}
                        className="group relative flex gap-5 items-center p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] hover:border-blue-500/30 transition-all cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex flex-col gap-1 items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
                        </div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 block ml-1 cursor-default">Protocol / Platform</label>
                            <select 
                              value={link.platform}
                              onChange={(e) => updateLink(index, 'platform', e.target.value)}
                              onPointerDown={(e) => e.stopPropagation()}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer font-bold"
                            >
                              {[
                                'LinkedIn', 'X', 'Instagram', 'Threads', 'GitHub', 
                                'YouTube', 'TikTok', 'WhatsApp', 'Discord', 
                                'Facebook', 'Telegram', 'Portfolio'
                              ].map(p => (
                                <option key={p} value={p} className="bg-[var(--bg-secondary)] text-[var(--text-primary)] py-2">{p}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 block ml-1 cursor-default">Uplink Address (URL)</label>
                            <input 
                              type="text" 
                              value={link.url}
                              onChange={(e) => updateLink(index, 'url', e.target.value)}
                              onPointerDown={(e) => e.stopPropagation()}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold placeholder:text-zinc-800"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => removeLink(index)}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/btn shrink-0"
                        >
                          <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                    {socialLinks.length === 0 && (
                      <div className="text-center py-20 bg-[var(--bg-primary)] rounded-[32px] border-2 border-dashed border-[var(--border-color)] group hover:border-blue-500/30 transition-all">
                        <LinkIcon size={48} className="mx-auto text-zinc-800 mb-4 group-hover:text-blue-500 transition-colors" />
                        <h4 className="text-[var(--text-secondary)] font-black uppercase tracking-widest text-sm">No Active Uplink Nodes</h4>
                        <p className="text-zinc-800 text-xs font-bold mt-2 uppercase italic">Initialize your first connection above</p>
                      </div>
                    )}

                  <div className="pt-8 border-t border-[var(--border-color)]">
                    <button 
                      onClick={handleUpdateLinks}
                      disabled={saving}
                      className="w-full bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 uppercase italic tracking-widest"
                    >
                      {saving ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-black"></div> : (
                        <>
                          <Save size={24} />
                          Establish Network Connection
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'qr' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-6"
              >
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">QR Code Center</h3>
                <p className="text-[var(--text-secondary)] text-sm font-medium">Scan, download, atau bagikan QR profile kamu.</p>
                <div className="p-6 bg-white rounded-3xl inline-block">
                  <QRCodeSVG id="dashboard-profile-qr-tab" value={`${window.location.origin}/u/${user?.username}`} size={220} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const svg = document.getElementById('dashboard-profile-qr-tab');
                      if (!svg) return;
                      const serializer = new XMLSerializer();
                      const svgData = serializer.serializeToString(svg);
                      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${user?.username || 'profile'}-qr.svg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase transition-all"
                  >
                    Download QR
                  </button>
                  <button onClick={handleShareProfile} className="w-full py-3 bg-[var(--border-color)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-black uppercase transition-all">
                    Share Profile
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Analytics</h3>
                  <button onClick={() => fetchAnalytics(analyticsDays)} className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-black uppercase">
                    {analyticsLoading ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analyticsLoading ? (
                    [...Array(4)].map((_, i) => <AnalyticsMiniStatSkeleton key={i} />)
                  ) : (
                    <>
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5"><p className="text-[var(--text-secondary)] text-xs uppercase">Views</p><h4 className="text-2xl font-black mt-2">{analytics.stats.totalViews.toLocaleString()}</h4></div>
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5"><p className="text-[var(--text-secondary)] text-xs uppercase">Clicks</p><h4 className="text-2xl font-black mt-2">{analytics.stats.totalClicks.toLocaleString()}</h4></div>
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5"><p className="text-[var(--text-secondary)] text-xs uppercase">Unique Visitors</p><h4 className="text-2xl font-black mt-2">{analytics.stats.uniqueVisitors.toLocaleString()}</h4></div>
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5"><p className="text-[var(--text-secondary)] text-xs uppercase">Click Rate</p><h4 className="text-2xl font-black mt-2">{analytics.stats.clickRate}%</h4></div>
                    </>
                  )}
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
                  <h4 className="text-sm font-black uppercase text-[var(--text-secondary)] mb-4">Top Platforms ({analyticsDays} Days)</h4>
                  <div className="space-y-3">
                    {analyticsLoading ? (
                      [...Array(3)].map((_, i) => <SkeletonPulse key={i} className="h-10 w-full" />)
                    ) : (
                      topLinksDisplay.map((link, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="font-bold">{link.platform}</span>
                          <span className="font-black text-emerald-400">{link.clicks} clicks</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Theme Picker */}
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-8">
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Appearance</h3>
                      <p className="text-[var(--text-secondary)] text-xs font-bold mt-1 uppercase tracking-widest">Customize your Neural Link aesthetic</p>
                    </div>

                    {message.text && activeTab === 'appearance' && (
                      <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                        message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                      </div>
                    )}

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block ml-1">Accent Color Theme</label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { id: 'cyan', name: 'Neon Cyan', hex: '#06b6d4', ring: 'ring-cyan-500', desc: 'Classic cyberpunk vibe' },
                          { id: 'emerald', name: 'Matrix Green', hex: '#10b981', ring: 'ring-emerald-500', desc: 'Digital green aesthetic' },
                          { id: 'purple', name: 'Royal Purple', hex: '#a855f7', ring: 'ring-purple-500', desc: 'Premium & mysterious' },
                          { id: 'rose', name: 'Cyber Rose', hex: '#f43f5e', ring: 'ring-rose-500', desc: 'Bold & energetic' },
                          { id: 'amber', name: 'Gold Pro', hex: '#f59e0b', ring: 'ring-amber-500', desc: 'Warm & exclusive' }
                        ].map(themeOpt => (
                          <button
                            key={themeOpt.id}
                            onClick={() => setFormData({ ...formData, theme: themeOpt.id })}
                            className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all ${
                              formData.theme === themeOpt.id 
                              ? `bg-[var(--border-color)] ${themeOpt.ring} ring-2` 
                              : 'bg-[var(--bg-primary)] border border-[var(--border-color)] hover:bg-[var(--border-color)]'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full shadow-lg shrink-0" style={{ backgroundColor: themeOpt.hex, boxShadow: `0 0 20px ${themeOpt.hex}60` }} />
                            <div className="text-left flex-grow">
                              <span className="text-sm font-black uppercase tracking-wider">{themeOpt.name}</span>
                              <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-0.5">{themeOpt.desc}</p>
                            </div>
                            {formData.theme === themeOpt.id && (
                              <CheckCircle2 size={20} className="text-[var(--text-primary)] shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-[var(--border-color)]">
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        className="w-full bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 uppercase italic tracking-widest"
                      >
                        {saving ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-black"></div> : (
                          <>
                            <Palette size={24} />
                            Apply Appearance
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-black italic uppercase tracking-tighter">Live Preview</h3>
                      <p className="text-[var(--text-secondary)] text-[10px] font-bold mt-1 uppercase tracking-widest">See how your card will look</p>
                    </div>
                    
                    <div className="bg-[var(--bg-primary)] rounded-3xl p-6 border border-[var(--border-color)]">
                      {/* Mini Card Preview */}
                      <div className="relative rounded-[32px] border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-3xl p-5 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-4">
                            <div className={`absolute inset-[-6px] rounded-[24px] border ${THEMES[formData.theme]?.borderFadeStrong || 'border-cyan-500/30'} animate-[spin_10s_linear_infinite]`} />
                            <div className="relative w-16 h-16 rounded-[18px] bg-zinc-900 border border-[var(--border-color)] overflow-hidden">
                              <img 
                                src={getAvatarUrl(user?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                                className="w-full h-full object-cover"
                                alt="Avatar"
                              />
                            </div>
                          </div>
                          <h4 className="text-lg font-black italic tracking-tighter text-[var(--text-primary)] uppercase">{user?.name || 'Your Name'}</h4>
                          <div className={`flex items-center gap-1 text-[8px] font-black ${THEMES[formData.theme]?.textLight || 'text-cyan-400'} ${THEMES[formData.theme]?.bgFade || 'bg-cyan-500/10'} px-2 py-0.5 rounded-md border ${THEMES[formData.theme]?.borderFade || 'border-cyan-500/20'} uppercase tracking-[0.2em] mt-1`}>
                            <Cpu size={8} />
                            Core ID: {user?.username}
                          </div>
                        </div>

                        {/* Mini QR */}
                        <div className="flex justify-center my-4">
                          <div className="w-16 h-16 rounded-full bg-white p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <QRCodeSVG value={`${window.location.origin}/u/${user?.username}`} size={52} level="H" />
                          </div>
                        </div>

                        {/* Mini Link Button */}
                        <div className={`w-full py-2 ${THEMES[formData.theme]?.bg || 'bg-cyan-500'} text-black rounded-xl text-[8px] font-black uppercase italic tracking-widest text-center`}>
                          Initiate Link
                        </div>
                      </div>
                    </div>

                    <p className="text-[9px] text-[var(--text-secondary)] font-bold text-center">
                      Theme will be applied to your public card at <span className="text-[var(--text-secondary)]">/{user?.username}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl space-y-8"
              >
                {/* Account Settings */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-8">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Account Settings</h3>
                    <p className="text-[var(--text-secondary)] text-xs font-bold mt-1 uppercase tracking-widest">Manage your account details</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Username</label>
                      <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] font-bold opacity-60 cursor-not-allowed flex items-center gap-2">
                        <AtSign size={16} />
                        {user?.username}
                      </div>
                      <p className="text-[9px] text-[var(--text-secondary)] font-bold ml-1">Username cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Email</label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700"
                        placeholder="agent@vibetape.link"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Display Name</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold placeholder:text-zinc-700"
                        placeholder="Your name"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        setSaving(true);
                        try {
                          await api.put('/api/settings/account', { email: formData.email, name: formData.name });
                          addToast('Account updated successfully!', 'success');
                          setUser(prev => ({ ...prev, email: formData.email, name: formData.name }));
                        } catch (err) {
                          addToast(err.response?.data?.error || 'Failed to update account', 'error');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase italic tracking-widest"
                    >
                      {saving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : (
                        <><Save size={20} /> Save Changes</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-8">
                  <div className="flex items-center gap-3">
                    <Key size={24} className="text-blue-500" />
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Change Password</h3>
                      <p className="text-[var(--text-secondary)] text-xs font-bold mt-1 uppercase tracking-widest">Update your security credentials</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">Current Password</label>
                      <input 
                        type="password"
                        id="currentPassword"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 block ml-1">New Password</label>
                      <input 
                        type="password"
                        id="newPassword"
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        const currentPassword = document.getElementById('currentPassword').value;
                        const newPassword = document.getElementById('newPassword').value;
                        if (!currentPassword || !newPassword) {
                          addToast('Please fill in both password fields', 'error');
                          return;
                        }
                        if (newPassword.length < 6) {
                          addToast('New password must be at least 6 characters', 'error');
                          return;
                        }
                        setSaving(true);
                        try {
                          await api.put('/api/settings/password', { currentPassword, newPassword });
                          addToast('Password changed successfully!', 'success');
                          document.getElementById('currentPassword').value = '';
                          document.getElementById('newPassword').value = '';
                        } catch (err) {
                          addToast(err.response?.data?.error || 'Failed to change password', 'error');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase italic tracking-widest"
                    >
                      {saving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : (
                        <><Shield size={20} /> Update Password</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <TrashIcon size={24} className="text-red-500" />
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-red-500">Danger Zone</h3>
                      <p className="text-red-400/60 text-xs font-bold mt-1 uppercase tracking-widest">Irreversible actions</p>
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                  <div className="space-y-4">
                    <input 
                      type="password"
                      id="deletePassword"
                      className="w-full bg-[var(--bg-primary)] border border-red-500/20 rounded-2xl px-5 py-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-bold"
                      placeholder="Enter your password to confirm"
                    />
                    <button
                      onClick={async () => {
                        const password = document.getElementById('deletePassword').value;
                        if (!password) {
                          addToast('Please enter your password to delete account', 'error');
                          return;
                        }
                        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) return;
                        setSaving(true);
                        try {
                          await api.delete('/api/settings/account', { data: { password } });
                          addToast('Account deleted successfully', 'success');
                          setTimeout(() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            navigate('/login');
                          }, 1500);
                        } catch (err) {
                          addToast(err.response?.data?.error || 'Failed to delete account', 'error');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase italic tracking-widest"
                    >
                      {saving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : (
                        <><TrashIcon size={20} /> Delete My Account</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl space-y-8"
              >
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 space-y-8">
                  <div className="flex items-center gap-3">
                    <Zap size={24} className="text-blue-500" />
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Integrations</h3>
                      <p className="text-[var(--text-secondary)] text-xs font-bold mt-1 uppercase tracking-widest">Connect your card with external platforms</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Google Analytics', icon: <ChartLine size={20} />, desc: 'Track visitor analytics with Google', color: 'bg-yellow-500' },
                      { name: 'Facebook Pixel', icon: <Globe size={20} />, desc: 'Track conversions from Facebook ads', color: 'bg-blue-600' },
                      { name: 'Twitter/X', icon: <Hash size={20} />, desc: 'Share card activity to Twitter/X', color: 'bg-white' },
                      { name: 'Discord Webhook', icon: <MessageSquare size={20} />, desc: 'Send notifications to Discord channel', color: 'bg-indigo-500' },
                      { name: 'Slack', icon: <Bot size={20} />, desc: 'Get updates in your Slack workspace', color: 'bg-green-500' },
                      { name: 'Telegram Bot', icon: <Webhook size={20} />, desc: 'Receive alerts via Telegram bot', color: 'bg-blue-400' },
                    ].map((integration) => (
                      <div key={integration.name} className="group flex items-center gap-5 p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] hover:border-blue-500/30 transition-all">
                        <div className={`w-12 h-12 rounded-2xl ${integration.color} flex items-center justify-center text-black shrink-0`}>
                          {integration.icon}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-black uppercase tracking-wider">{integration.name}</h4>
                          <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-0.5">{integration.desc}</p>
                        </div>
                        <button
                          onClick={async () => {
                            setSaving(true);
                            try {
                              await api.post('/api/integrations/connect', { platform: integration.name });
                              addToast(`${integration.name} connected successfully!`, 'success');
                            } catch (err) {
                              addToast(err.response?.data?.error || 'Failed to connect', 'error');
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <Plug size={14} />
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[var(--border-color)]">
                    <p className="text-[9px] text-[var(--text-secondary)] font-bold text-center">
                      More integrations coming soon. API access available for developers.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
    );
  } catch (err) {
    console.error('Render Crash:', err);
    setRenderError(err.toString() + '\n' + err.stack);
    return null;
  }
};

export default Dashboard;
