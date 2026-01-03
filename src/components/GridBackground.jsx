'use client';
import { useEffect, useRef } from 'react';

export default function GridBackground() {
  const gridRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        gridRef.current.style.setProperty('--mouse-x', `${x}%`);
        gridRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div ref={gridRef} className="grid-background" />;
}

