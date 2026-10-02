import React from 'react';
import Tilt from 'react-parallax-tilt';

// HoloHighlight
// A lightweight, drop-in component that shows a glassmorphic, interactive
// holographic card using react-parallax-tilt. All styling is inline so you
// can paste this file directly into your project.

const HoloHighlight = ({ src, alt = 'Highlight', width = 560, height = 'auto', className = '' }) => {
  const calcWidth = typeof width === 'number' ? `${width}px` : width;
  const containerStyle = {
    display: 'block',
    perspective: 1200,
    width: calcWidth,
    margin: '0 auto',
  };

  const glassStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: height === 'auto' ? 'auto' : typeof height === 'number' ? `${height}px` : height,
    padding: 15,
    borderRadius: 14,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    // stronger outer glow for more presence
    boxShadow: '0 30px 100px rgba(3,169,244,0.18), 0 12px 36px rgba(3,169,244,0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imgStyle = {
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: 10,
    // slightly stronger inner glow and faint outer highlight
    boxShadow: '0 10px 50px rgba(3,169,244,0.12) inset, 0 8px 40px rgba(3,169,244,0.06)',
    objectFit: 'cover',
  };

  return (
    <div style={containerStyle} className={className}>
      <Tilt
        tiltEnable={true}
        tiltMaxAngleX={12}
        tiltMaxAngleY={12}
        perspective={1000}
        scale={1.05}
        transitionSpeed={400}
        gyroscope={true}
        glareEnable={true}
        glareMaxOpacity={0.5}
        glareColor="#ffffff"
        glarePosition="all"
        style={{ borderRadius: 14 }}
      >
        <div style={glassStyle} aria-hidden="false">
          <img src={src} alt={alt} style={imgStyle} />
        </div>
      </Tilt>
    </div>
  );
};

export default HoloHighlight;
