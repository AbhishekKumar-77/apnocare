import React, { useEffect, useRef } from 'react';

/**
 * InteractiveFlowBackground
 * GPU-accelerated canvas background providing:
 * - Fluid undulating organic ribbons reacting in real-time to cursor coordinates
 * - Dynamic parallax flow streaming triggered by scroll position and velocity
 * - Subtle floating healthcare motifs (ECG pulse waveform, care constellation nodes, soft glowing halos)
 * - Zero pointer-events interference so all page interactions remain snappy
 */
export default function InteractiveFlowBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse tracking with smooth lerp interpolation
    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 3,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 3,
      radius: 220,
      active: false
    };

    // Scroll tracking
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;
    let scrollVelocity = 0;
    let lastScrollY = scrollY;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleResize();

    // Floating care constellation nodes
    const particleCount = 28;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.5,
        baseAlpha: Math.random() * 0.35 + 0.15,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Time counter for fluid simulation
    let time = 0;

    const render = () => {
      time += 0.012;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Smooth scroll interpolation & velocity
      scrollVelocity = (targetScrollY - scrollY) * 0.12;
      scrollY += scrollVelocity;
      const scrollDiff = scrollY - lastScrollY;
      lastScrollY = scrollY;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient glowing halos
      const mouseGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        mouse.radius * 1.5
      );
      mouseGrad.addColorStop(0, 'rgba(20, 184, 166, 0.09)');
      mouseGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
      mouseGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // Top corner ambient medical aura
      const auraGrad = ctx.createRadialGradient(
        width * 0.85,
        120,
        20,
        width * 0.85,
        120,
        380
      );
      auraGrad.addColorStop(0, 'rgba(13, 148, 136, 0.06)');
      auraGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.03)');
      auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Multi-layer organic flowing waves
      const waves = [
        {
          baseY: height * 0.28,
          amplitude: 45,
          wavelength: 0.0018,
          speed: 0.8,
          color: 'rgba(13, 148, 136, 0.07)',
          strokeColor: 'rgba(20, 184, 166, 0.22)',
          lineWidth: 1.8
        },
        {
          baseY: height * 0.52,
          amplitude: 55,
          wavelength: 0.0014,
          speed: -0.65,
          color: 'rgba(6, 182, 212, 0.05)',
          strokeColor: 'rgba(6, 182, 212, 0.18)',
          lineWidth: 1.5
        },
        {
          baseY: height * 0.78,
          amplitude: 60,
          wavelength: 0.002,
          speed: 0.5,
          color: 'rgba(16, 185, 129, 0.04)',
          strokeColor: 'rgba(16, 185, 129, 0.16)',
          lineWidth: 1.6
        }
      ];

      // Draw each fluid wave ribbon
      waves.forEach((w, waveIndex) => {
        ctx.beginPath();
        // Dynamic scroll influence: vertical shift + curvature modulation
        const scrollInfluence = (scrollY * 0.18 * (waveIndex + 1)) % height;
        const currentY = (w.baseY - scrollInfluence + height) % height;

        const points = [];
        const step = 20;

        for (let x = 0; x <= width + step; x += step) {
          // Base undulating wave
          let y = currentY + Math.sin(x * w.wavelength + time * w.speed) * w.amplitude;
          y += Math.cos(x * w.wavelength * 1.6 - time * 0.4) * (w.amplitude * 0.35);

          // Scroll velocity ripple effect
          y += Math.sin(x * 0.01 + time * 2) * Math.min(Math.abs(scrollDiff) * 0.8, 25);

          // Cursor attraction & distortion flow
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 35;
            // Push or pull depending on movement
            y += Math.sin(dist * 0.05 - time * 3) * force;
          }

          points.push({ x, y });
        }

        // Draw smooth curve through points
        if (points.length > 0) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }

          ctx.strokeStyle = w.strokeColor;
          ctx.lineWidth = w.lineWidth;
          ctx.stroke();

          // Fill soft gradient under the wave
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fillStyle = w.color;
          ctx.fill();
        }
      });

      // 3. Draw subtle Heartbeat ECG Waveform drifting across the screen
      const ecgY = (height * 0.42 - (scrollY * 0.1) % height + height) % height;
      const ecgProgress = ((time * 70) % (width + 300)) - 150;
      
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(13, 148, 136, 0.16)';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 4]);

      const ecgSegments = 16;
      for (let i = 0; i < ecgSegments; i++) {
        const segX = ecgProgress + i * 22;
        if (segX >= 0 && segX <= width) {
          let segY = ecgY;
          if (i === 6) segY -= 6;
          else if (i === 7) segY += 8;
          else if (i === 8) segY -= 32; // QRS peak
          else if (i === 9) segY += 18;
          else if (i === 10) segY -= 10; // T wave
          
          if (i === 0) ctx.moveTo(segX, segY);
          else ctx.lineTo(segX, segY);
        }
      }
      ctx.stroke();
      ctx.restore();

      // 4. Care Constellation Nodes & Connected energetic threads
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse proximity reaction
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 160) {
          p.x -= (mdx / mDist) * 0.8;
          p.y -= (mdy / mDist) * 0.8;
        }

        // Draw particle with gentle breathing pulse
        const pulse = Math.sin(time * 2 + p.pulseOffset) * 0.5 + 0.5;
        const alpha = p.baseAlpha * (0.6 + 0.4 * pulse);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${alpha})`;
        ctx.fill();

        // Connect nearby nodes with delicate threads
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(13, 148, 136, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // 5. Subtle medical shield/cross faint aura watermark (right backdrop)
      const motifX = width * 0.92;
      const motifY = height * 0.65;
      ctx.save();
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.07)';
      ctx.lineWidth = 1.5;
      
      // Floating cross
      const crossSize = 14;
      ctx.beginPath();
      ctx.moveTo(motifX - crossSize, motifY);
      ctx.lineTo(motifX + crossSize, motifY);
      ctx.moveTo(motifX, motifY - crossSize);
      ctx.lineTo(motifX, motifY + crossSize);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0" 
      aria-hidden="true"
    >
      {/* Dynamic interactive canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block opacity-90 transition-opacity duration-700" 
      />
      {/* Ambient gradient mesh backdrops */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-cyan-200/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
