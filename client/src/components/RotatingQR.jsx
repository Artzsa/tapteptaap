import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MessageCircle, Briefcase, Code2 } from 'lucide-react';

const platforms = [
  { name: 'Instagram', icon: <Camera />, color: '#E1306C', url: 'https://instagram.com/' },
  { name: 'X', icon: <MessageCircle />, color: '#1DA1F2', url: 'https://x.com/' },
  { name: 'LinkedIn', icon: <Briefcase />, color: '#0077B5', url: 'https://linkedin.com/in/' },
  { name: 'GitHub', icon: <Code2 />, color: '#333', url: 'https://github.com/' },
];

const RotatingQR = ({ username }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % platforms.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = platforms[index];

  return (
    <div className="flex flex-col items-center gap-6 p-8 glass rounded-3xl w-full max-w-sm mx-auto shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-20 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: current.color }}
      />

      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <span style={{ color: current.color }}>{current.icon}</span>
            <h3 className="text-xl font-bold font-outfit uppercase tracking-wider">{current.name}</h3>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-4 bg-white rounded-2xl shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <QRCodeSVG 
              value={`${current.url}${username}`}
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: `https://www.google.com/s2/favicons?sz=64&domain=${current.name.toLowerCase()}.com`,
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex gap-3">
        {platforms.map((p, i) => (
          <div 
            key={p.name}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8' : 'w-2 bg-gray-600'}`}
            style={{ backgroundColor: i === index ? p.color : undefined }}
          />
        ))}
      </div>

      <p className="relative z-10 text-gray-400 text-sm font-light">
        Tap or scan to connect via <span className="font-semibold text-white">{current.name}</span>
      </p>
    </div>
  );
};

export default RotatingQR;
