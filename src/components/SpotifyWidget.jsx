                        "use client";

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());



// --- Sub-Component: Animated Visualizer Bar ---
const VisualizerBar = ({ isPlaying, index }) => {
  return (
    <motion.div
      className="sw-viz-bar"
      animate={{
        height: isPlaying ? ["20%", "85%", "30%", "100%", "20%"] : "20%",
      }}
      transition={{
        duration: isPlaying ? 0.4 + Math.random() * 0.4 : 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        delay: index * 0.05,
        ease: "easeInOut",
      }}
    />
  );
};

// --- Main Component ---
export default function SpotifyWidget({ isDark = false }) {
    const { data: nowPlayingData } = useSWR('/api/now-playing', fetcher, { refreshInterval: 10000 });
    const { data: topTracksData } = useSWR('/api/top-tracks', fetcher);
  const [isPlaying, setIsPlaying] = useState(false);
  // Default State (Fallback/Loading)
  const [nowPlaying, setNowPlaying] = useState({
    title: "Offline",
    artist: "Spotify",
    albumArt: "", 
    link: "#"
  });
  const [topTracks, setTopTracks] = useState([]);
  const audioRef = useRef(null);

  // --- API Fetching ---
  useEffect(() => {
   if(nowPlayingData) {
    if (nowPlayingData && nowPlayingData.isPlaying) {
        setIsPlaying(true);
        setNowPlaying({
          title: nowPlayingData.title,
          artist: nowPlayingData.artist,
          albumArt: nowPlayingData.albumImageUrl,
          link: nowPlayingData.songUrl
        });
        
     } else {
        setIsPlaying(false);
     }
   }
   if(topTracksData) {
    const tracks = Array.isArray(topTracksData) ? topTracksData : (topTracksData.tracks || []);
    setTopTracks(tracks.slice(0, 3)); // Take top 3
   }

    // Audio Object for Visualizer Demo
    audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lo-fi-112891.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [nowPlayingData, topTracksData]);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    // This controls the "Mock" audio for the visualizer effect
    // Since real Spotify APIs don't auto-play audio in browser due to policy
    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    } else {
      audioRef.current.pause();
    }
  };

  // Helper to determine active state visually if data is missing
  const hasActiveTrack = nowPlaying.albumArt && nowPlaying.title !== "Offline";

  return (
    <>
      <style jsx>{`
        /* --- Unique Widget CSS (Scoped) --- */
        /* RESET: Critical for Bootstrap sites to prevent ugly gaps */
        .sw-widget p, 
        .sw-widget h3, 
        .sw-widget h4, 
        .sw-widget span {
          margin: 0;
          padding: 0;
          line-height: normal;
        }

        .sw-widget {
          position: relative;
          width: 100%;
          max-width: 380px;
          padding: 1.5rem;
          border: 3px solid black;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Inter', system-ui, sans-serif; /* Ensure font loads */
          background-color: white;
          color: black;
          transition: all 0.2s ease-in-out;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          text-align: left; /* Reset text align */
        }

        .sw-widget * {
          box-sizing: border-box;
        }

        /* Hover Effect: Invert Colors */
        .sw-widget:hover {
          background-color: black;
          color: white;
        }

        /* --- Dark Mode Overrides --- */
        .sw-widget.sw-dark {
          background-color: black;
          border-color: white;
          color: white;
        }
        
        .sw-widget.sw-dark:hover {
          background-color: white;
          color: black;
          border-color: black;
        }

        /* --- Header Section --- */
        .sw-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid currentColor;
          opacity: 0.9;
        }

        .sw-avatar-frame {
          height: 40px;
          width: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid currentColor;
          flex-shrink: 0;
        }
        .sw-avatar-img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          display: block; /* Remove inline gap */
        }

        .sw-user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
        }
        .sw-user-name {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sw-user-status {
          font-size: 0.7rem;
          opacity: 0.8;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        .sw-status-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          display: inline-block;
        }

        .sw-link-icon {
          margin-left: auto;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .sw-widget:hover .sw-link-icon { opacity: 1; }

        /* --- Status Bar --- */
        .sw-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .sw-status-label-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sw-indicator-wrap {
          position: relative;
          display: flex;
          height: 12px;
          width: 12px;
        }
        .sw-ping {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #4ade80;
          opacity: 0.75;
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .sw-dot {
          position: relative;
          display: inline-flex;
          border-radius: 50%;
          height: 12px;
          width: 12px;
          background-color: #1DB954;
        }
        .sw-dot-inactive { background-color: #9ca3af; }

        .sw-status-text {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .sw-mute-btn {
          padding: 0.4rem;
          border-radius: 6px;
          border: 2px solid currentColor;
          background: transparent;
          color: currentColor;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sw-mute-btn:hover {
          background-color: #1DB954;
          border-color: #1DB954;
          color: white;
        }

        /* --- Active Track Card --- */
        .sw-track-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 2px solid currentColor;
          text-decoration: none; /* In case wrapped in A tag */
          color: inherit;
        }
        
        .sw-album-art {
          position: relative;
          height: 56px;
          width: 56px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid currentColor;
          background-color: #333; /* Placeholder */
        }
        .sw-album-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: currentColor; 
          z-index: 10;
        }
        
        .sw-track-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          justify-content: center;
        }
        .sw-track-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px; /* Space between title and artist */
        }
        .sw-track-title {
          font-weight: 800;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
        .sw-track-artist {
          font-size: 0.85rem;
          font-weight: 500;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sw-visualizer {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 20px;
          min-width: 60px;
          justify-content: flex-end;
        }
        .sw-viz-bar {
          width: 5px;
          min-height: 4px;
          border-radius: 2px;
          background-color: #1DB954;
        }

        /* --- Recent List --- */
        .sw-recent-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .sw-recent-title {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding-left: 2px;
          opacity: 0.7;
          margin-bottom: 0.5rem;
        }
        .sw-recent-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.1s;
        }
        /* Subtle hover on list items */
        .sw-widget:hover .sw-recent-item:hover {
           background-color: rgba(255,255,255,0.1); 
        }
        
        .sw-recent-art {
          height: 36px;
          width: 36px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid currentColor;
          opacity: 0.8;
          flex-shrink: 0;
          background-color: #333;
        }
        .sw-placeholder-art {
          width: 100%;
          height: 100%;
        }
        .sw-recent-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sw-recent-name {
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sw-recent-artist {
          font-size: 0.75rem;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sw-widget ${isDark ? 'sw-dark' : ''}`}
      >
        {/* --- Header --- */}
        <div className="sw-header">
          <div className="sw-avatar-frame">
            {/* User Profile - You can update this URL to your own */}
            <img src="/profile.jpg" alt="Profile" className="sw-avatar-img" />
          </div>
          <div className="sw-user-info">
            <span className="sw-user-name">Rohan's Spotify</span>
            <span className="sw-user-status">
               <span className="sw-status-dot" />
               Online
            </span>
          </div>
          <div className="sw-link-icon">
             {/* Link to your actual Spotify Profile */}
             <a href="https://open.spotify.com/user/31o2t5s6owr2lgtymyebeocbe7sa" target="_blank" rel="noopener noreferrer" style={{color:'inherit'}}>
               <ExternalLink size={18} />
             </a>
          </div>
        </div>

        {/* --- Status Bar --- */}
        <div className="sw-status-bar">
          <div className="sw-status-label-group">
              <span className="sw-indicator-wrap">
                {isPlaying && <span className="sw-ping"></span>}
                <span className={`sw-dot ${!isPlaying ? 'sw-dot-inactive' : ''}`}></span>
              </span>
              <span className="sw-status-text">
                  {isPlaying ? 'Currently Listening' : 'Offline / Idle'}
              </span>
          </div>
          
          <button onClick={toggleMute} className="sw-mute-btn" title="Toggle Visualizer Demo">
            {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* --- Active Track Card --- */}
        <a 
          href={nowPlaying.link}
          target="_blank" 
          rel="noopener noreferrer" 
          className="sw-track-card"
        >
          <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="sw-album-art"
          >
               {hasActiveTrack ? (
                 <img src={nowPlaying.albumArt} alt="Album Art" className="sw-avatar-img" />
               ) : (
                 <div className="sw-avatar-img" style={{background: '#444'}} />
               )}
               <div className="sw-album-hole" />
          </motion.div>

          <div className="sw-track-info">
               <div className="sw-track-top">
                   <h3 className="sw-track-title">
                      {nowPlaying.title}
                   </h3>
                   <div className="sw-visualizer">
                    {[...Array(5)].map((_, i) => (
                      <VisualizerBar key={i} index={i} isPlaying={isPlaying} />
                    ))}
                   </div>
               </div>
               <p className="sw-track-artist">
                  {nowPlaying.artist}
               </p>
          </div>
        </a>

        {/* --- Top Tracks / Recent --- */}
        <div className="sw-recent-section">
          <div className="sw-recent-title">
              Top Tracks
          </div>
          
          {topTracks.map((track, i) => (
              <a 
                key={i} 
                href={track.songUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="sw-recent-item" 
                style={{textDecoration: 'none', color: 'inherit'}}
              >
                  <div className="sw-recent-art">
                      {track.imageUrl ? (
                        <img src={track.imageUrl} alt={track.title} className="sw-avatar-img" />
                      ) : (
                        <div className="sw-placeholder-art" style={{background: '#555'}} />
                      )}
                  </div>
                  <div className="sw-recent-details">
                      <h4 className="sw-recent-name">{track.title}</h4>
                      <p className="sw-recent-artist">{track.artist}</p>
                  </div>
              </a>
          ))}
          {topTracks.length === 0 && (
             <div className="sw-recent-artist" style={{padding:'0.5rem'}}>Loading tracks...</div>
          )}
        </div>
      </motion.div>
    </>
  );
}
