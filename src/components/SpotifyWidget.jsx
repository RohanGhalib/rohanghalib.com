"use client";

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { ExternalLink, Disc, Volume2, User } from 'lucide-react';
import { motion } from 'framer-motion';

// --- CONFIGURATION ---
// You can replace these with real user data if needed
const USER_NAME = "Rohan Ghalib";
const AVATAR_URL = "/profile.jpg"; // Ensure this image exists in your public folder

// SVG Noise Pattern
const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E`;

const fetcher = (url) => fetch(url).then((res) => res.json());

// --- Sub-Component: Equalizer Bar ---
const EqualizerBar = ({ delay, isPlaying, theme }) => {
  return (
    <motion.div
      className={`eq-bar ${theme === 'light' ? 'eq-bar-light' : ''}`}
      animate={isPlaying ? {
        height: ["20%", "100%", "50%", "80%", "20%"],
      } : { height: "20%" }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
        delay: delay,
        ease: "linear",
      }}
    />
  );
};

export default function SpotifyWidget({ theme = 'dark' }) {
  // --- API HOOKS ---
  const { data: nowPlayingData } = useSWR('/api/now-playing', fetcher, { 
    refreshInterval: 5000 
  });
  const { data: topTracksData } = useSWR('/api/top-tracks', fetcher);

  // --- STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({
    title: "Loading...",
    artist: "Spotify",
    albumArt: "",
    link: "#"
  });
  const [topTracks, setTopTracks] = useState([]);

  // --- DATA SYNC ---
  useEffect(() => {
    // Sync Now Playing Data
    if (nowPlayingData) {
      if (nowPlayingData.title) {
        setNowPlaying({
          title: nowPlayingData.title,
          artist: nowPlayingData.artist,
          albumArt: nowPlayingData.albumImageUrl,
          link: nowPlayingData.songUrl
        });
      }
      setIsPlaying(nowPlayingData.isPlaying);
    }

    // Sync Top Tracks Data
    if (topTracksData) {
      const tracks = Array.isArray(topTracksData) ? topTracksData : (topTracksData.tracks || []);
      setTopTracks(tracks.slice(0, 3));
    }
  }, [nowPlayingData, topTracksData]);

  // Check if we have valid album art to show (for the background blur)
  const hasActiveArt = nowPlaying.albumArt && nowPlaying.albumArt !== "";

  return (
    <div className="widget-centering-container">
      <style>{`
        /* --- CONTAINER STYLES --- */
        .widget-centering-container {
          display: flex;
          flex-direction: column;
          /* Align to Top-Left */
          justify-content: flex-start; 
          align-items: flex-start;
          width: 100%;         /* Restored to 100% to fill parent */
          height: auto;        /* Wraps height around the widget */
          background: transparent;
          padding: 0; 
        }

        /* --- WIDGET STYLES --- */
        .spotify-card {
          position: relative;
          width: 100%;
          max-width: 100%; /* Increased from 380px to make it wider */
          border-radius: 32px;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          box-shadow: 0 20px 50px -10px rgba(0,0,0,0.3);
          user-select: none;
          transition: all 0.5s ease;
          border: 1px solid rgba(255,255,255,0.1);
          color: white; /* Default text color */
        }
        
        .spotify-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.4);
        }

        /* Dark Mode Defaults */
        .card-dark {
          background: #000;
          color: white;
        }
        
        /* Light Mode Overrides */
        .card-light {
          background: #fff;
          color: #1a1a1a;
          border-color: rgba(0,0,0,0.05);
          box-shadow: 
            0 20px 40px -12px rgba(0,0,0,0.1), 
            0 0 0 1px rgba(0,0,0,0.05);
        }

        /* 1. Ambient Background Layer */
        .ambient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          transition: all 1s ease;
          background: #111; /* Fallback color */
        }
        
        .ambient-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.5);
          transition: opacity 0.5s ease;
        }
        
        /* Dark Mode: Darken the glow */
        .card-dark .ambient-img {
          filter: blur(60px) saturate(200%) brightness(0.6);
        }
        /* Light Mode: Lighten the glow to be pastel */
        .card-light .ambient-img {
          filter: blur(60px) saturate(150%) brightness(1.2) opacity(0.6);
        }

        /* 2. Noise Overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: url("${NOISE_SVG}");
          opacity: 0.35;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        /* 3. Glass Content Layer */
        .content-layer {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          padding: 1.75rem;
          height: 100%;
          backdrop-filter: blur(20px);
          transition: background 0.3s ease;
        }

        .card-dark .content-layer {
          background: rgba(0, 0, 0, 0.2); 
        }
        .card-light .content-layer {
          background: rgba(255, 255, 255, 0.3);
        }

        /* --- HEADER SECTION --- */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .avatar-wrap {
          position: relative;
          width: 42px;
          height: 42px;
        }
        
        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.2);
        }
        .card-light .avatar-img { border-color: rgba(0,0,0,0.1); }
        
        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #000;
        }
        .card-light .status-dot { border-color: #fff; }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .username {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .listening-status {
          font-size: 0.7rem;
          opacity: 0.7;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .brand-icon {
          opacity: 0.5;
        }

        /* --- ACTIVE TRACK --- */
        .main-track {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          margin-bottom: 2rem;
          text-decoration: none;
          color: inherit;
        }
        
        .art-container {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          flex-shrink: 0;
          background: #333; /* Loading placeholder */
        }
        .card-light .art-container {
           box-shadow: 0 10px 30px rgba(0,0,0,0.15);
           background: #eee;
        }
        
        .track-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.5s ease;
        }

        .track-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .track-title {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.03em;
        }

        .track-artist {
          font-size: 1rem;
          opacity: 0.8;
          margin: 4px 0 0 0;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Equalizer */
        .equalizer-wrap {
          display: flex;
          gap: 4px;
          height: 24px;
          align-items: flex-end;
          margin-top: 10px;
        }
        .eq-bar {
          width: 5px;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(255,255,255,0.4);
        }
        .eq-bar-light {
          background-color: #1a1a1a;
          box-shadow: none;
        }

        /* Divider */
        .divider {
          height: 1px;
          width: 100%;
          margin-bottom: 1.5rem;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
        }
        .card-light .divider {
          background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
        }

        /* List Section */
        .list-header {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.6;
          margin-bottom: 0.75rem;
          padding-left: 8px;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          margin-bottom: 4px;
        }
        
        .card-dark .list-item:hover { background: rgba(255,255,255,0.1); }
        .card-light .list-item:hover { background: rgba(0,0,0,0.05); }

        .list-art {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          background: #333;
        }
        .card-light .list-art { box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #eee; }
        
        .list-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .list-title {
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .list-artist {
          font-size: 0.75rem;
          opacity: 0.7;
        }
        .external-icon {
          margin-left: auto;
          opacity: 0;
          transition: all 0.2s;
          transform: translateX(-5px);
        }
        .list-item:hover .external-icon {
          opacity: 0.5;
          transform: translateX(0);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* --- WIDGET CONTENT --- */}
      <motion.div 
        className={`spotify-card ${theme === 'light' ? 'card-light' : 'card-dark'}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Ambient Background */}
        <div className="ambient-bg">
           {hasActiveArt && (
             <img 
                src={nowPlaying.albumArt} 
                alt="bg" 
                className="ambient-img"
                style={{ opacity: isPlaying ? 1 : 0.5 }} 
              />
           )}
        </div>

        {/* Texture Overlay */}
        <div className="noise-overlay" />

        <div className="content-layer">
          
          {/* Header */}
          <div className="header">
            <div className="user-profile">
              <div className="avatar-wrap">
                <img src={AVATAR_URL} alt="User" className="avatar-img" />
                <div 
                  className="status-dot" 
                  style={{ background: isPlaying ? '#22c55e' : '#fbbf24' }} 
                  title={isPlaying ? "Online" : "Idle"}
                />
              </div>
              <div className="user-info">
                <span className="username">{USER_NAME}</span>
                <span className="listening-status">
                   {isPlaying ? (
                     <>
                      <Volume2 size={10} /> is listening to
                     </>
                   ) : "was listening to"}
                </span>
              </div>
            </div>

            <div className="brand-icon">
              <Disc size={20} className={isPlaying ? "animate-spin-slow" : ""} 
                    style={{ animation: isPlaying ? 'spin 4s linear infinite' : 'none' }} 
              />
            </div>
          </div>

          {/* Active Track */}
          <a href={nowPlaying.link || "#"} target="_blank" rel="noopener noreferrer" className="main-track">
            <motion.div 
              className="art-container"
              animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {hasActiveArt ? (
                <img 
                  src={nowPlaying.albumArt} 
                  alt="Album Art" 
                  className="track-img"
                  style={{ filter: isPlaying ? 'none' : 'grayscale(30%)' }}
                />
              ) : (
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', opacity:0.3}}>
                  <Disc size={32} />
                </div>
              )}
            </motion.div>
            
            <div className="track-details">
              <h3 className="track-title">{nowPlaying.title}</h3>
              <p className="track-artist">{nowPlaying.artist}</p>

              <div className="equalizer-wrap">
                {[0, 0.2, 0.4, 0.1].map((d, i) => (
                  <EqualizerBar key={i} delay={d} isPlaying={isPlaying} theme={theme} />
                ))}
              </div>
            </div>
          </a>

          <div className="divider" />

          {/* Top Tracks */}
          <div className="list-section">
            <div className="list-header">On Repeat</div>
            {topTracks.length > 0 ? (
              topTracks.map((track, i) => (
                <a 
                  key={i} 
                  href={track.songUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="list-item"
                >
                  <img src={track.imageUrl} alt={track.title} className="list-art" />
                  <div className="list-info">
                    <span className="list-title">{track.title}</span>
                    <span className="list-artist">{track.artist}</span>
                  </div>
                  <ExternalLink size={14} className="external-icon" />
                </a>
              ))
            ) : (
              <div style={{fontSize:'0.8rem', opacity:0.5, padding:'10px'}}>Loading tracks...</div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}