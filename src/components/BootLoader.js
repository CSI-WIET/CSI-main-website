/**
 * BootLoader.js
 * High-performance terminal-style boot animation
 * Runs once on initial load, then smoothly transitions to main content
 * 
 * Features:
 * - Fake boot logs with typewriter effect
 * - Blinking cursor animation
 * - Placeholder logo (easily replaceable)
 * - Optimized performance with cleanup
 * - Smooth fade-out transition
 */

import React, { useState, useEffect } from 'react';

const BootLoader = ({ onComplete }) => {
  const [bootLogs, setBootLogs] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Boot sequence messages
  const bootSequence = [
    { text: '> Initializing CSI Core Systems...', delay: 200 },
    { text: '> Loading security protocols...', delay: 300 },
    { text: '> Connecting to developer network...', delay: 250 },
    { text: '> Loading event modules...', delay: 280 },
    { text: '> Mounting user interface...', delay: 200 },
    { text: '> Optimizing performance...', delay: 220 },
    { text: '> System Ready ✓', delay: 300, success: true }
  ];

  useEffect(() => {
    // Boot sequence controller
    if (currentLogIndex < bootSequence.length) {
      const currentLog = bootSequence[currentLogIndex];
      
      const timer = setTimeout(() => {
        setBootLogs(prev => [...prev, currentLog]);
        setCurrentLogIndex(prev => prev + 1);
        
        // Update progress
        const newProgress = ((currentLogIndex + 1) / bootSequence.length) * 100;
        setProgress(newProgress);
        
        // Show logo after first few logs
        if (currentLogIndex === 2) {
          setShowLogo(true);
        }
      }, currentLog.delay);

      return () => clearTimeout(timer);
    } else {
      // Boot complete - fade out after brief delay
      const exitTimer = setTimeout(() => {
        setFadeOut(true);
        // Notify parent component after fade animation
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 600); // Match fade-out duration
      }, 500);

      return () => clearTimeout(exitTimer);
    }
  }, [currentLogIndex, bootSequence.length, onComplete]);

  return (
    <div 
      className={`boot-loader-overlay ${fadeOut ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Courier New', monospace",
        color: '#60a5fa',
        overflow: 'hidden'
      }}
    >
      <style>{`
        /* Boot Loader Animations */
        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: scale(0.98);
          }
        }

        @keyframes logoReveal {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes progressPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        }

        .boot-loader-overlay.fade-out {
          animation: fadeOut 0.6s ease-out forwards;
        }

        .boot-logo {
          animation: logoReveal 0.8s ease-out;
        }

        .cursor-blink {
          animation: cursorBlink 1s step-end infinite;
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(59, 130, 246, 0.3),
            transparent
          );
          pointer-events: none;
          animation: scanLine 4s linear infinite;
        }

        .boot-log-line {
          margin: 4px 0;
          font-size: 14px;
          letter-spacing: 0.5px;
          text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }

        .boot-log-line.success {
          color: #3b82f6;
          font-weight: bold;
        }

        .progress-bar-container {
          width: 300px;
          height: 4px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 20px;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 0.3s ease-out;
          animation: progressPulse 1.5s ease-in-out infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .boot-logo {
            font-size: 0.7rem !important;
          }
          .boot-log-line {
            font-size: 12px;
          }
          .progress-bar-container {
            width: 250px;
          }
        }
      `}</style>

      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Main content container */}
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '600px', 
        width: '90%',
        padding: '20px'
      }}>
        
        {/* Logo placeholder - ASCII art style */}
        {showLogo && (
          <div 
            className="boot-logo"
            style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              lineHeight: '1.2',
              marginBottom: '30px',
              color: '#60a5fa',
              textShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)',
              whiteSpace: 'pre',
              fontFamily: 'monospace'
            }}
          >
            {`
   ██████╗███████╗██╗
  ██╔════╝██╔════╝██║
  ██║     ███████╗██║
  ██║     ╚════██║██║
  ╚██████╗███████║██║
   ╚═════╝╚══════╝╚═╝
            `}
          </div>
        )}

        {/* Boot logs terminal */}
        <div style={{
          textAlign: 'left',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          minHeight: '180px',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          {bootLogs.map((log, index) => (
            <div 
              key={index} 
              className={`boot-log-line ${log.success ? 'success' : ''}`}
            >
              {log.text}
            </div>
          ))}
          
          {/* Blinking cursor */}
          {currentLogIndex < bootSequence.length && (
            <span 
              className="cursor-blink"
              style={{
                display: 'inline-block',
                width: '10px',
                height: '16px',
                backgroundColor: '#60a5fa',
                marginLeft: '4px',
                verticalAlign: 'middle'
              }}
            />
          )}
        </div>

        {/* Progress bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#60a5fa',
          opacity: 0.7,
          letterSpacing: '1px'
        }}>
          {Math.round(progress)}% COMPLETE
        </div>
      </div>

      {/* Grid pattern overlay for tech aesthetic */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        opacity: 0.5
      }} />
    </div>
  );
};

export default BootLoader;
