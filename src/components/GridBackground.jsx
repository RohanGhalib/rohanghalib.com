"use client";

import { useEffect, useRef } from 'react';

const GridBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Grid configuration
    const SPACING = 40; // Space between grid lines
    const MOUSE_RADIUS = 200; // Range of mouse influence
    const MOUSE_FORCE = 0.5; // Strength of push/pull

    let mouse = { x: -1000, y: -1000 };
    let points = [];
    let width, height;

    // Resize handling
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initPoints();
    };

    // Point class (Physics node)
    class Point {
      constructor(x, y) {
        this.x = x; // Current position
        this.y = y;
        this.originX = x; // Resting position
        this.originY = y;
        this.vx = 0; // Velocity
        this.vy = 0;
        this.mass = 2; // Inertia
      }

      update() {
        // 1. Calculate distance to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 2. Mouse Repulsion/Attraction (Gravity)
        let forceX = 0;
        let forceY = 0;

        if (dist < MOUSE_RADIUS) {
          const angle = Math.atan2(dy, dx);
          // Negative force = Repulsion (push away), Positive = Attraction (black hole)
          // Let's go with a slight push for a "rippling fabric" feel
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const push = -20 * force * MOUSE_FORCE;

          forceX = Math.cos(angle) * push;
          forceY = Math.sin(angle) * push;
        }

        // 3. Elasticity (Return to origin)
        const springK = 0.05; // Stiffness
        const springX = (this.originX - this.x) * springK;
        const springY = (this.originY - this.y) * springK;

        // 4. Apply forces
        this.vx += (springX + forceX) / this.mass;
        this.vy += (springY + forceY) / this.mass;

        // 5. Friction (Damping)
        this.vx *= 0.9;
        this.vy *= 0.9;

        // 6. Move
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    const initPoints = () => {
      points = [];
      const cols = Math.ceil(width / SPACING) + 2; // Extra buffer
      const rows = Math.ceil(height / SPACING) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Start slightly off-screen for buffer
          points.push(new Point((i * SPACING) - SPACING, (j * SPACING) - SPACING));
        }
      }
    };

    const drawLine = (p1, p2) => {
      // Draw only if distance is reasonable (don't cross-connect heavily distorted points weirdly)
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distSq = dx * dx + dy * dy;

      // Optimize: Don't draw if too far (broken link? nah, just physics limit)
      if (distSq > SPACING * SPACING * 4) return;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      // Dynamic Opacity based on distortion? 
      // Let's keep it subtle constant for now, maybe pulsate slightly near mouse
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update Physics
      points.forEach(p => p.update());

      // Draw Grid Lines
      // We need to know neighbors. Since it's a grid, we can calculate indices.
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = i * rows + j;
          const p = points[index];
          if (!p) continue;

          // Draw Right
          if (i < cols - 1) {
            const rightP = points[(i + 1) * rows + j];
            if (rightP) drawLine(p, rightP);
          }
          // Draw Down
          if (j < rows - 1) {
            const downP = points[i * rows + (j + 1)];
            if (downP) drawLine(p, downP);
          }

          // Optional: Draw vertices
          // ctx.fillStyle = 'rgba(255,255,255,0.1)';
          // ctx.fillRect(p.x-1, p.y-1, 2, 2);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Listeners
    const handleMouseMove = (e) => {
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
  }, []);

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
