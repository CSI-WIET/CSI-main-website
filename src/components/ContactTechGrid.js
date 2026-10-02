/*
  Dev note: ContactTechGrid is a presentation component for the contact area.
  - To update contact text or links, edit the default props near the top of the file.
  - Keep interactions (copy-to-clipboard, map embed URL) as-is unless you intentionally change UX.
  - Avoid changing animation timings unless adjusting overall page rhythm.
*/
import React, { useState, useRef } from 'react';
import { useHtmlDark } from '../hooks/useHtmlDark';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Copy, ExternalLink, Linkedin, Instagram, Youtube } from 'lucide-react';

/**
 * ContactTechGrid
 * A glassmorphism, cyber-tech Contact area with a filtered Google Map, socials, copy-to-clipboard contact info and a location card.
 *
 * Usage: <ContactTechGrid />
 */
const ContactTechGrid = ({
  address = 'Plot No.157, C.H.M Campus, Opp. Ulhasnagar Railway Station, Ulhasnagar-421003',
  mapQuery = 'Watumull Institute Of Electronic Engineering And Computer Technology, Ulhasnagar',
  email = 'csi@watumull.edu',
  phone = '+91 8591768659',
  navigateUrl = 'https://maps.google.com?q=Watumull+Institute+Of+Electronic+Engineering+And+Computer+Technology',
  isDarkMode: propDark,
}) => {
  const [copied, setCopied] = useState({ email: false, phone: false });
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const copyText = async (type, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 1600);
    } catch (e) {
      // fallback
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 1600);
    }
  };

  const iframeSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  // Resolve dark mode: prefer passed prop, else use reactive hook so UI updates immediately
  const hookDark = useHtmlDark();
  const isDark = typeof propDark !== 'undefined' ? propDark : hookDark;

  const rootClass = isDark ? 'w-full bg-slate-950 rounded-3xl p-6 md:p-10 text-white' : 'w-full bg-white/90 rounded-3xl p-6 md:p-10 text-gray-900';
  const cardBase = isDark
    ? 'ctg-card bg-white/5 border border-white/10 backdrop-blur-md text-white rounded-2xl'
    : 'ctg-card bg-white border border-gray-200 shadow-sm text-gray-900 rounded-2xl';
  const iconWrap = isDark ? 'p-3 rounded-lg bg-white/3 hover:bg-white/6' : 'p-3 rounded-lg bg-gray-100 hover:bg-gray-200';
  const navBtn = isDark ? 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 text-black font-semibold hover:opacity-95' : 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600 text-white font-semibold hover:opacity-95';
  const copyBtnClass = isDark ? 'flex items-center gap-2 px-3 py-2 bg-white/6 rounded-md text-sm hover:bg-white/8' : 'flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200';
  const copyTextClass = isDark ? 'text-xs text-gray-100' : 'text-xs text-gray-800';
  const titleClass = isDark ? 'mt-3 text-white text-lg font-semibold' : 'mt-3 text-gray-800 text-lg font-semibold';
  const bodyClass = isDark ? 'mt-2 text-sm text-gray-300' : 'mt-2 text-sm text-gray-600';
  const iconColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const smallMuted = isDark ? 'text-gray-300' : 'text-gray-500';
  const mapFilter = isDark ? 'grayscale(100%) invert(100%) contrast(90%)' : 'grayscale(0%) contrast(100%) saturate(95%)';

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.56, ease: 'easeOut' } },
  };

  return (
    <motion.section className={rootClass} initial="hidden" animate="show" variants={container}>
      <style>{`
        .ctg-card { transition: transform .28s ease, box-shadow .28s ease; }
        .ctg-card:hover { transform: translateY(-6px); }

        /* Social icon glow: stronger colored shadows + subtle lift + background tint */
        .glow-instagram, .glow-linkedin, .glow-youtube { transition: color .18s ease, box-shadow .18s ease, transform .18s ease, background .18s ease; }

        .glow-instagram:hover { color: #E1306C; transform: translateY(-3px); background: rgba(225,48,108,0.04); box-shadow: 0 12px 36px rgba(225,48,108,0.18), 0 3px 10px rgba(225,48,108,0.06); }
        .glow-linkedin:hover  { color: #0A66C2; transform: translateY(-3px); background: rgba(10,102,194,0.03); box-shadow: 0 12px 36px rgba(10,102,194,0.16), 0 3px 10px rgba(10,102,194,0.06); }
        .glow-youtube:hover   { color: #FF0000; transform: translateY(-3px); background: rgba(255,0,0,0.03); box-shadow: 0 12px 36px rgba(255,0,0,0.14), 0 3px 10px rgba(255,0,0,0.06); }

        /* Focus styles for keyboard users */
        .glow-instagram:focus, .glow-linkedin:focus, .glow-youtube:focus { outline: none; box-shadow: 0 0 0 4px rgba(2,6,23,0.04); }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Map Card - Large (spans 2 cols, 2 rows) */}
        <motion.div variants={item} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.998 }} transition={{ duration: 0.22 }} className={`${cardBase} md:col-span-2 md:row-span-2 overflow-hidden p-0 shadow-sm`}>
          <div className="w-full h-80 md:h-full md:min-h-[420px] rounded-2xl overflow-hidden">
            <iframe
              title="location-map"
              src={iframeSrc}
              className="w-full h-full border-0"
              style={{ filter: mapFilter }}
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Connect Card (Socials) */}
        <motion.div variants={item} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.995 }} transition={{ duration: 0.28 }} className={`${cardBase} p-6 flex flex-col justify-between`}>
          <div>
            <h3 className="text-cyan-400 text-sm font-mono uppercase">Connect</h3>
            <p className={titleClass}>Follow us</p>
            <p className={bodyClass}>Stay connected for updates, events and workshops.</p>
          </div>

            <div className="mt-6 flex items-center gap-4">
            <motion.a whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.14 }} href="https://www.instagram.com/csi_wiet/" target="_blank" rel="noreferrer" aria-label="Instagram" className={`${iconWrap} glow-instagram`}>
              <Instagram className={`w-5 h-5 ${iconColor}`} />
            </motion.a>

            <motion.a whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.14 }} href="https://www.linkedin.com/company/csi-wiet/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className={`${iconWrap} glow-linkedin`}>
              <Linkedin className={`w-5 h-5 ${iconColor}`} />
            </motion.a>

            <motion.a whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.14 }} href="https://www.youtube.com/@CSI-WIETCommittee24" target="_blank" rel="noreferrer" aria-label="YouTube" className={`${iconWrap} glow-youtube`}>
              <Youtube className={`w-5 h-5 ${iconColor}`} />
            </motion.a>
          </div>
        </motion.div>

        {/* Direct Line Card (copy email / phone) */}
        <motion.div variants={item} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.995 }} transition={{ duration: 0.28 }} className={`${cardBase} p-6 flex flex-col justify-between`}>
          <div>
            <h3 className="text-cyan-400 text-sm font-mono uppercase">Direct Line</h3>
            <p className={titleClass}>Get in touch</p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Mail className={`w-5 h-5 ${iconColor}`} />
                <div className="text-sm">{email}</div>
              </div>
              <motion.button
                ref={emailRef}
                onClick={() => copyText('email', email)}
                className={copyBtnClass}
                aria-label="Copy email"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12 }}
              >
                <Copy className="w-4 h-4" />
                <span className={copyTextClass}>{copied.email ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Phone className={`w-5 h-5 ${iconColor}`} />
                <div className="text-sm">{phone}</div>
              </div>
              <motion.button
                ref={phoneRef}
                onClick={() => copyText('phone', phone)}
                className={copyBtnClass}
                aria-label="Copy phone"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12 }}
              >
                <Copy className="w-4 h-4" />
                <span className={copyTextClass}>{copied.phone ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Location Text Card */}
        <motion.div variants={item} className={`${cardBase} p-6 flex flex-col justify-between`}>
          <div>
            <h3 className="text-cyan-400 text-sm font-mono uppercase">Location</h3>
            <p className={titleClass}>Our Campus</p>
            <p className={bodyClass}>{address}</p>
          </div>

            <div className="mt-6 flex items-center gap-3">
            <a href={navigateUrl} target="_blank" rel="noreferrer" className={navBtn}>
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Navigate</span>
            </a>
            <div className="ml-auto text-gray-400 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default ContactTechGrid;
