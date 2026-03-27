import React, { useRef } from 'react';
import './AnimatedOrderButton.css';

export default function AnimatedOrderButton({ onClick, isLoading }) {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const button = buttonRef.current;
    if (button && !button.classList.contains('animate')) {
      button.classList.add('animate');
      
      // Delay to let the truck animation play before executing onClick
      // The box drops into the truck around 2-3s.
      setTimeout(() => {
        if (onClick) onClick();
      }, 4000); 

      setTimeout(() => {
        button.classList.remove('animate');
      }, 10000); // Reset after full 10s animation loop
    }
  };

  return (
    <div className="flex justify-center w-full my-6 scale-90 sm:scale-100 transform origin-center">
      <button 
        ref={buttonRef} 
        className={`order ${isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}`}
        onClick={handleClick}
        type="button"
      >
        <span className="default">{isLoading ? "INITIALIZING..." : "Complete Order"}</span>
        <span className="success">
          Order Placed
          <svg viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <div className="box"></div>
        <div className="truck">
          <div className="back"></div>
          <div className="front">
            <div className="window"></div>
          </div>
          <div className="light top"></div>
          <div className="light bottom"></div>
        </div>
        <div className="lines"></div>
      </button>
    </div>
  );
}
