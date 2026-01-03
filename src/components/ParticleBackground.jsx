"use client";
import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Configuration
        const particleCount = 60;
        const connectionDistance = 150;
        const mouseDistance = 200;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        // Mouse state
        const mouse = { x: null, y: null };

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5; // Very slow velocity
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;

                // Mouse interaction (repulse)
                if (mouse.x != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;

                        // Push away
                        const directionX = forceDirectionX * force * 3;
                        const directionY = forceDirectionY * force * 3;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                // Use a color that works on both dark and light but is subtle
                // Light theme: darkish gray with low opacity
                // Dark theme: whitish gray with low opacity
                // We'll rely on CSS mix-blend-mode or just a neutral color
                ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
                ctx.fill();
            }
        }

        // Widget tracking
        let widgetRect = null;
        const updateWidgetRect = () => {
            const el = document.getElementById('spotify-glass-card');
            if (el) {
                widgetRect = el.getBoundingClientRect();
            } else {
                widgetRect = null;
            }
        };

        // Check initially and on animation frames (since it might move/load)
        setInterval(updateWidgetRect, 1000); // Poll every second for presence
        window.addEventListener('scroll', updateWidgetRect);

        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
            updateWidgetRect();
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();

                // Check intersection with widget
                let isBehindWidget = false;
                if (widgetRect) {
                    if (particles[i].x >= widgetRect.left && particles[i].x <= widgetRect.right &&
                        particles[i].y >= widgetRect.top && particles[i].y <= widgetRect.bottom) {
                        isBehindWidget = true;
                    }
                }

                ctx.beginPath();
                // Glow effect
                if (isBehindWidget) {
                    // Concentrated bright light
                    ctx.arc(particles[i].x, particles[i].y, particles[i].size * 1.5, 0, Math.PI * 2); // Slight size increase
                    ctx.fillStyle = '#FFFFFF'; // Pure White
                    ctx.shadowBlur = 40; // Intense glow
                    ctx.shadowColor = 'rgba(255, 255, 255, 1)'; // Solid white shadow
                } else {
                    ctx.arc(particles[i].x, particles[i].y, particles[i].size, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
                ctx.shadowBlur = 0;

                // Connect particles
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();

                        // Check if BOTH particles are behind widget for strong connection
                        let jBehind = false;
                        if (widgetRect &&
                            particles[j].x >= widgetRect.left && particles[j].x <= widgetRect.right &&
                            particles[j].y >= widgetRect.top && particles[j].y <= widgetRect.bottom) {
                            jBehind = true;
                        }

                        if (isBehindWidget && jBehind) {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${1 * (1 - distance / connectionDistance)})`; // MAX Opacity
                            ctx.lineWidth = 1.5; // Moderate thickness, high brightness
                        } else {
                            ctx.strokeStyle = `rgba(128, 128, 128, ${1 - distance / connectionDistance})`;
                            ctx.lineWidth = 0.5;
                        }

                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);
        window.addEventListener('scroll', updateWidgetRect);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
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
                pointerEvents: 'none', // Allow clicks to pass through
                opacity: 0.4
            }}
        />
    );
}
