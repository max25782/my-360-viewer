import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { MessageCircle } from 'lucide-react';
import { DomainLogoImg } from '../DomainLogo';
import { getLogoByDomain, getLogoAltByDomain } from '../../utils/getLogoByDomain';

interface HeroAdvertisementBannerProps {
  isDark: boolean;
  onOpenChat: () => void;
}

export function HeroAdvertisementBanner({ isDark, onOpenChat }: HeroAdvertisementBannerProps) {
  const [logoPath, setLogoPath] = useState('/Website.png');
  const [logoAlt, setLogoAlt] = useState('Logo');
  const [companyName, setCompanyName] = useState('Seattle ADU');
  const [tagline, setTagline] = useState('Premium Accessory Dwelling Units');
  const [locationText, setLocationText] = useState("Seattle's #1 ADU Builder | 200+ Happy Clients");
  const [hostname, setHostname] = useState('');

  useEffect(() => {
    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
    setHostname(currentHostname);
    
    // Determine logo and text based on domain
    if (currentHostname === 'alpha-adu.com' || currentHostname === 'www.alpha-adu.com') {
      setLogoPath('/logo2.jpeg');
      setLogoAlt('Alpha Dream Construction Logo');
      setCompanyName('Alpha Dream Construction');
      setTagline('Premium Accessory Dwelling Units');
      setLocationText("Alpha Dream Construction | Quality ADU Solutions");
    } else if (currentHostname === 'seattle-catalog.com' || currentHostname === 'www.seattle-catalog.com') {
      setLogoPath('/logo.png');
      setLogoAlt('Seattle ADU Logo');
      setCompanyName('Seattle ADU');
      setTagline('Premium Accessory Dwelling Units');
      setLocationText("Seattle's #1 ADU Builder | 200+ Happy Clients");
    } else {
      setLogoPath(getLogoByDomain());
      setLogoAlt(getLogoAltByDomain());
      setCompanyName('ADU Collection');
      setTagline('Premium Accessory Dwelling Units');
      setLocationText('Premium ADU Solutions');
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div 
        className="relative h-32 px-8 flex items-center justify-center"
        style={{
          background: isDark 
            ? `
              linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(147, 51, 234, 0.15) 50%, rgba(59, 130, 246, 0.15) 100%),
              radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
              linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%)
            `
            : `
              linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(147, 51, 234, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%),
              radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%),
              linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)
            `,
          backdropFilter: 'blur(20px)',
          border: 'none'
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isDark 
              ? 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)'
          }}
          animate={{
            background: isDark ? [
              'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 800px 400px at 70% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
            ] : [
              'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
              'radial-gradient(ellipse 800px 400px at 70% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
              'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex items-center gap-8 max-w-6xl mx-auto">
          {/* Logo & Title */}
          <motion.div 
            className="flex items-center gap-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Animated Logo */}
            <motion.div 
              className="relative"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div 
                className="w-20 h-20 rounded-full p-1"
                style={{
                  background: (hostname === 'alpha-adu.com' || hostname === 'www.alpha-adu.com')
                    ? '#ffffff' // Белый фон для Alpha ADU
                    : (isDark 
                      ? 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #9333ea, #06b6d4)'
                      : 'conic-gradient(from 0deg, #0891b2, #2563eb, #7c3aed, #0891b2)')
                }}
              >
                <div className={`w-full h-full rounded-full flex items-center justify-center ${
                  (hostname === 'alpha-adu.com' || hostname === 'www.alpha-adu.com')
                    ? 'bg-white' // Белый фон для Alpha ADU
                    : (isDark ? 'bg-slate-900' : 'bg-white')
                }`}>
                  <DomainLogoImg 
                    className={`w-12 h-12 object-contain ${
                      (hostname === 'alpha-adu.com' || hostname === 'www.alpha-adu.com')
                        ? 'mix-blend-mode-multiply' // Убирает белый фон у логотипа для Alpha ADU
                        : ''
                    }`}
                    style={{
                      ...((hostname === 'alpha-adu.com' || hostname === 'www.alpha-adu.com') && {
                        filter: 'contrast(1.1) brightness(0.95)',
                        mixBlendMode: 'multiply'
                      })
                    }}
                    alt={logoAlt}
                  />
                </div>
              </div>
            </motion.div>

            {/* Title & Tagline */}
            <div>
              <motion.h1 
                className="text-4xl bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark 
                    ? 'linear-gradient(90deg, #ffffff, #06b6d4, #3b82f6)'
                    : 'linear-gradient(90deg, #1e293b, #0891b2, #2563eb)'
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {companyName}
              </motion.h1>
              <motion.p 
                className={`text-lg ${isDark ? 'text-cyan-200' : 'text-cyan-700'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {tagline}
              </motion.p>
            </div>
          </motion.div>

          {/* Central CTA Message */}
          <motion.div 
            className="flex-1 text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div
              className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🏡 Transform Your Property Today
            </motion.div>
            <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {locationText}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="text-right"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className={`text-lg ${isDark ? 'text-cyan-200' : 'text-cyan-700'}`}>
              💬 Ask DANIEL
            </div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Your Project Manager
            </div>
            <Button
              onClick={onOpenChat}
              className="mt-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-sm px-4 py-2"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className={`absolute top-4 left-1/4 w-2 h-2 rounded-full ${
            isDark ? 'bg-cyan-400/60' : 'bg-cyan-600/40'
          }`}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-4 right-1/3 w-1.5 h-1.5 rounded-full ${
            isDark ? 'bg-purple-400/60' : 'bg-purple-600/40'
          }`}
          animate={{
            y: [10, -10, 10],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>
    </div>
  );
}
