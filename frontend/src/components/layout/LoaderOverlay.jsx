import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import '../../loader.css';

export default function LoaderOverlay() {
  const [isAwake, setIsAwake] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Ping the backend to wake up Render free tier container
    API.get('/api/categorys')
      .then(() => {
        setIsAwake(true);
      })
      .catch((err) => {
        console.error("Backend ping failed, still proceeding to awake state", err);
        setIsAwake(true);
      });

    // Fallback: forcefully remove loader if backend takes more than 10 seconds 
    // to prevent user from being stuck indefinitely.
    const fallbackTimer = setTimeout(() => {
      setIsAwake(true);
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (isAwake) {
      // Wait for the fade-out CSS animation to finish before unmounting from DOM
      const timer = setTimeout(() => setIsUnmounted(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isAwake]);

  if (isUnmounted) return null;

  return (
    <div className={`global-loader-overlay ${isAwake ? 'fade-out' : ''}`}>
      <div className="pixel-grid-container">
        {"PIXEL MOBAILS".split('').map((char, index) => (
          <span 
            key={index} 
            className="pixel-letter" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
      <div className="loader-status">
        <div className="status-dot animate-pulse"></div>
        <span className="status-text text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">
          {isAwake ? 'SYSTEM ONLINE' : 'WAKING BACKEND ENVIRONMENT'}
        </span>
      </div>
    </div>
  );
}
