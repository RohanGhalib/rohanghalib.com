"use client";

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const GridBackground = () => {
  const canvasRef = useRef(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Grid configuration
    const SPACING = 50; // Optimized: increased spacing
    const MOUSE_RADIUS = 200;
    const MOUSE_FORCE = 0.5;

    let mouse = { x: -1000, y: -1000 };
    let points = [];
    let width, height;

    // ... (Resize handling and Point class remain similar, simplified update below)

    // Simplified Point update to skip if far from mouse (optional but good)
    class Point {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.originX = x; this.originY = y;
        this.vx = 0; this.vy = 0;
        this.mass = 2;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let forceX = 0, forceY = 0;

        if (dist < MOUSE_RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const push = -20 * force * MOUSE_FORCE;
          forceX = Math.cos(angle) * push;
          forceY = Math.sin(angle) * push;
        }

        const springK = 0.05;
        const springX = (this.originX - this.x) * springK;
        const springY = (this.originY - this.y) * springK;

        this.vx += (springX + forceX) / this.mass;
        this.vy += (springY + forceY) / this.mass;
        this.vx *= 0.9;
        this.vy *= 0.9;
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    // ... (initPoints remains same)

    // Resize handling
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          points.push(new Point((i * SPACING) - SPACING, (j * SPACING) - SPACING));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Batch Physics Updates
      // We could optimize this by only updating points near mouse or with velocity
      // But for now, let's keep it consistent.
      points.forEach(p => p.update());

      // 2. Batch Draw Calls (HUGE Performance Boost)
      const isDark = resolvedTheme === 'dark';
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;

      ctx.beginPath(); // Start ONE path for all lines

      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = i * rows + j;
          const p = points[index];
          if (!p) continue;

          const rightP = (i < cols - 1) ? points[(i + 1) * rows + j] : null;
          const downP = (j < rows - 1) ? points[i * rows + (j + 1)] : null;

          if (rightP) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(rightP.x, rightP.y);
          }
          if (downP) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(downP.x, downP.y);
          }
        }
      }

      ctx.stroke(); // Draw EVERYTHING in one go

      animationFrameId = requestAnimationFrame(animate);
    };


    // Event Listeners
    const handleMouseMove = (e) => {
      // Disable interaction on touch devices/mobiles to prevent interference
      if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    // Init
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        background: 'transparent', // Let parent bg show (dark)
        pointerEvents: 'none',
      }}
    />
  );
};

export default GridBackground;
