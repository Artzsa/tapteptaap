import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// ============================================================
// VARIAN 1: Particle Burst
// QR muncul dengan efek partikel meledak
// ============================================================
export const ParticleBurstQR = ({ value, activeSocial, theme }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles when value changes
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 0.3,
      color: i % 2 === 0 ? '#ffffff' : (theme?.text || '#06b6d4')
    }));
    setParticles(newParticles);
  }, [value]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.3, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative"
        >
          <QRCodeSVG value={value} size={80} level="H" />
        </motion.div>
      </AnimatePresence>
      
      {/* Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.x, y: p.y, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{ 
              width: p.size, 
              height: p.size, 
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// VARIAN 2: Glitch Scan
// QR muncul dengan efek glitch/scanline
// ============================================================
export const GlitchScanQR = ({ value, activeSocial, theme }) => {
  const [glitching, setGlitching] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState(0);

  useEffect(() => {
    // Trigger glitch effect on value change
    setGlitching(true);
    const interval = setInterval(() => {
      setGlitchOffset(Math.random() * 10 - 5);
      setTimeout(() => setGlitchOffset(0), 100);
    }, 2000);
    
    const timeout = setTimeout(() => setGlitching(false), 500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [value]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Scan line */}
      <motion.div
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[2px] z-10"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${theme?.text || '#06b6d4'}, transparent)`,
          boxShadow: `0 0 10px ${theme?.text || '#06b6d4'}`
        }}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          exit={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transform: `translateX(${glitchOffset}px)` }}
          className="relative"
        >
          <QRCodeSVG value={value} size={80} level="H" />
          
          {/* Glitch overlay */}
          {glitching && (
            <div 
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  ${theme?.text || '#06b6d4'}22 2px,
                  ${theme?.text || '#06b6d4'}22 4px
                )`,
                mixBlendMode: 'overlay'
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// VARIAN 3: Hologram Fade
// QR muncul dengan efek hologram (fade + scale + blur)
// ============================================================
export const HologramFadeQR = ({ value, activeSocial, theme }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Holographic rings */}
      <AnimatePresence>
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={`ring-${ring}-${value}`}
            initial={{ opacity: 0.6, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: ring * 0.15, ease: 'easeOut' }}
            className="absolute rounded-full border"
            style={{ 
              width: 40, 
              height: 40,
              borderColor: theme?.text || '#06b6d4',
              boxShadow: `0 0 15px ${theme?.text || '#06b6d4'}40`
            }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          {/* Holographic shimmer */}
          <motion.div
            animate={{ 
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${theme?.text || '#06b6d4'}33 50%, transparent 100%)`,
              backgroundSize: '200% 100%',
              mixBlendMode: 'overlay'
            }}
          />
          <QRCodeSVG value={value} size={80} level="H" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// VARIAN 4: Matrix Digital Rain
// QR muncul dengan efek matrix rain di sekitarnya
// ============================================================
export const MatrixRainQR = ({ value, activeSocial, theme }) => {
  const canvasRef = useRef(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setShowQR(false);
    const timer = setTimeout(() => setShowQR(true), 800);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 160;
    canvas.height = 160;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const fontSize = 8;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 15, 30, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Fade effect - brighter at top
        const alpha = Math.max(0.1, 1 - (drops[i] / (canvas.height / fontSize)));
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.3})`;
        ctx.fillText(char, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-40"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <AnimatePresence>
        {showQR && (
          <motion.div
            key={value}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 bg-[#0A0F1E]/80 p-2 rounded-xl"
          >
            <QRCodeSVG value={value} size={70} level="H" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// VARIAN 5: Pulse Wave
// QR muncul dengan efek gelombang melingkar
// ============================================================
export const PulseWaveQR = ({ value, activeSocial, theme }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Pulse waves */}
      <AnimatePresence>
        {[0, 1, 2].map((wave) => (
          <motion.div
            key={`wave-${wave}-${value}`}
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              delay: wave * 0.4, 
              repeat: Infinity,
              ease: 'easeOut'
            }}
            className="absolute rounded-full"
            style={{ 
              width: 60, 
              height: 60,
              border: `2px solid ${theme?.text || '#06b6d4'}`,
              boxShadow: `0 0 20px ${theme?.text || '#06b6d4'}40`
            }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 20 
          }}
          className="relative"
        >
          <QRCodeSVG value={value} size={80} level="H" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// VARIAN 6: Cube Flip 3D
// QR di dalam kubus 3D yang berputar
// ============================================================
export const CubeFlipQR = ({ value, activeSocial, theme }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reset rotation on value change
    setRotation({ x: 0, y: 0 });
    const timer = setTimeout(() => {
      setRotation({ x: 360, y: 360 });
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[400px]">
      <motion.div
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        {/* Front face */}
        <motion.div
          animate={{ 
            boxShadow: [
              `0 0 20px ${theme?.text || '#06b6d4'}40`,
              `0 0 40px ${theme?.text || '#06b6d4'}60`,
              `0 0 20px ${theme?.text || '#06b6d4'}40`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-white p-3 rounded-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <QRCodeSVG value={value} size={70} level="H" />
        </motion.div>
        
        {/* Back face */}
        <div 
          className="absolute inset-0 bg-white p-3 rounded-2xl"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <QRCodeSVG value={value} size={70} level="H" />
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
// CONTROLLER: Untuk ganti-ganti animasi dengan mudah
// ============================================================
const QR_ANIMATIONS = {
  'particle': ParticleBurstQR,
  'glitch': GlitchScanQR,
  'hologram': HologramFadeQR,
  'matrix': MatrixRainQR,
  'pulse': PulseWaveQR,
  'cubeflip': CubeFlipQR,
};

export default QR_ANIMATIONS;
