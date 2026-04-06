import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import '../../loader.css';
import { initFluid } from '../../utils/fluidSimulation';

export default function LoaderOverlay() {
  const [isAwake, setIsAwake] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize Fluid Simulation
    let cleanupFluid = null;
    if (canvasRef.current) {
        cleanupFluid = initFluid(canvasRef.current);
    }

    // Ping the backend to wake up Render free tier container
    API.get('/api/categorys')
      .then(() => {
        setIsAwake(true);
      })
      .catch((err) => {
        console.error("Backend ping failed, still proceeding to awake state", err);
        setIsAwake(true);
      });

    // Fallback: forcefully set awake if backend takes too long (10 seconds max)
    const fallbackTimer = setTimeout(() => {
      setIsAwake(true);
    }, 10000);

    return () => {
        clearTimeout(fallbackTimer);
        if (cleanupFluid) cleanupFluid();
    };
  }, []);

  // Handle Progress Loading Logic
  useEffect(() => {
    let animationFrame;
    let currentProgress = 0;

    const performLoading = () => {
        // If not awake, limit to 85% maximum
        // If awake, go to 100%
        let targetProgress = isAwake ? 100 : 85;
        
        if (currentProgress < targetProgress) {
            let increment = Math.random() > 0.8 ? 2 : 1;
            // If awake, speed up
            if (isAwake) increment = 3;

            currentProgress += increment;
            if (currentProgress > 100) currentProgress = 100;
            
            setProgress(currentProgress);
        }

        // Wait before next frame
        if (currentProgress < 100) {
            animationFrame = setTimeout(performLoading, currentProgress > 85 ? 100 : 40);
        }
    };

    animationFrame = setTimeout(performLoading, 500);

    return () => clearTimeout(animationFrame);
  }, [isAwake]);

  // Handle unmounting once complete
  useEffect(() => {
    if (progress >= 100) {
      // Wait for the fade-out CSS animation to finish before unmounting from DOM
      const timer = setTimeout(() => setIsUnmounted(true), 800);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (isUnmounted) return null;

  return (
    <div className={`global-loader-overlay ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className={`loader-container ${progress >= 100 ? 'complete' : ''}`}>
          <h1 
            className="text-wrapper" 
            style={{ '--mask-y': `${progress}%` }}
          >
              PIXEL MOBAILS
          </h1>
          <div className="counter">loading... {progress}%</div>
      </div>

      <div className="fluid-container">
        <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }}></canvas>
      </div>
    </div>
  );
}
