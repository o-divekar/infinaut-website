import { useState, useEffect, useRef } from "react";

function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);

    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Canvas particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 55;
    particlesRef.current = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particlesRef.current;

      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200,169,110,${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,169,110,0.35)";
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const pillars = ["Creative", "Technology", "Artificial Intelligence", "Digital Growth"];
  const parallaxY = scrollY * 0.28;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --gold: #c8a96e;
          --gold-dim: rgba(200,169,110,0.1);
          --gold-line: rgba(200,169,110,0.28);
          --bg: #060608;
          --text: #f0ede8;
          --text-muted: rgba(240,237,232,0.38);
          --text-dim: rgba(240,237,232,0.62);
          --border: rgba(255,255,255,0.06);
        }

        .hero-root {
          position: relative;
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'DM Mono', monospace;
        }

        /* Canvas layer */
        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* Grid texture */
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none; z-index: 0;
        }

        /* Mouse-tracking dual orbs */
        .hero-orb-main {
          position: absolute;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 65%);
          transform: translate(-50%, -50%);
          pointer-events: none; z-index: 0;
          transition: left 1.1s cubic-bezier(0.2,0,0.2,1), top 1.1s cubic-bezier(0.2,0,0.2,1);
        }

        .hero-orb-secondary {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 65%);
          transform: translate(-50%, -50%);
          pointer-events: none; z-index: 0;
          transition: left 0.4s cubic-bezier(0.2,0,0.2,1), top 0.4s cubic-bezier(0.2,0,0.2,1);
        }

        /* Hex border decoration */
        .hero-hex {
          position: absolute;
          width: 420px; height: 420px;
          pointer-events: none; z-index: 0;
          opacity: 0;
          transition: opacity 1.4s ease 0.6s;
        }
        .hero-hex.visible { opacity: 1; }

        /* Corner marks */
        .hero-corner {
          position: absolute;
          width: 44px; height: 44px;
          pointer-events: none; z-index: 1;
          opacity: 0;
          transition: opacity 0.8s ease 0.5s;
        }
        .hero-corner.visible { opacity: 1; }
        .hero-corner.tl { top: 36px; left: 36px; border-top: 1px solid var(--gold-line); border-left: 1px solid var(--gold-line); }
        .hero-corner.tr { top: 36px; right: 36px; border-top: 1px solid var(--gold-line); border-right: 1px solid var(--gold-line); }
        .hero-corner.bl { bottom: 80px; left: 36px; border-bottom: 1px solid var(--gold-line); border-left: 1px solid var(--gold-line); }
        .hero-corner.br { bottom: 80px; right: 36px; border-bottom: 1px solid var(--gold-line); border-right: 1px solid var(--gold-line); }

        /* Vertical side labels */
        .hero-side-label {
          position: absolute;
          font-size: 9px; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--text-muted);
          writing-mode: vertical-rl;
          opacity: 0;
          transition: opacity 0.8s ease 0.8s;
          z-index: 1;
        }
        .hero-side-label.visible { opacity: 1; }
        .hero-side-label.left  { left: 36px; top: 50%; transform: translateY(-50%) rotate(180deg); }
        .hero-side-label.right { right: 36px; top: 50%; transform: translateY(-50%); }

        /* ── Content ── */
        .hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          max-width: 860px;
          padding: 0 48px;
        }

        /* Eyebrow */
        .hero-eyebrow {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 36px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .hero-eyebrow.visible { opacity: 1; transform: translateY(0); }
        .hero-eyebrow-line { width: 32px; height: 1px; background: var(--gold); }
        .hero-eyebrow-text {
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold);
        }

        /* Main headline */
        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 7.5vw, 96px);
          font-weight: 700;
          line-height: 1.02;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .hero-headline-line {
          display: block; overflow: hidden;
        }

        .hero-headline-inner {
          display: block;
          transform: translateY(100%);
          opacity: 0;
          transition: transform 0.85s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease;
        }
        .hero-headline-inner.visible {
          transform: translateY(0); opacity: 1;
        }

        .hero-headline em {
          font-style: italic; color: var(--gold);
        }

        /* Sub headline */
        .hero-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 2.8vw, 32px);
          font-weight: 300;
          font-style: italic;
          color: var(--text-dim);
          margin-bottom: 40px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.7s ease 0.65s, transform 0.7s ease 0.65s;
        }
        .hero-sub.visible { opacity: 1; transform: translateY(0); }

        /* Pillars row */
        .hero-pillars {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 52px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.7s ease 0.8s, transform 0.7s ease 0.8s;
        }
        .hero-pillars.visible { opacity: 1; transform: translateY(0); }

        .hero-pillar-item {
          font-size: 9.5px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--text-muted);
          transition: color 0.25s ease;
          cursor: default;
        }
        .hero-pillar-item:hover { color: var(--gold); }

        .hero-pillar-dot {
          width: 3px; height: 3px;
          background: var(--gold-line);
          border-radius: 50%; flex-shrink: 0;
        }

        /* CTA group */
        .hero-cta-group {
          display: flex; align-items: center; gap: 20px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.7s ease 0.95s, transform 0.7s ease 0.95s;
        }
        .hero-cta-group.visible { opacity: 1; transform: translateY(0); }

        /* Primary CTA */
        .hero-cta-primary {
          position: relative;
          font-family: 'DM Mono', monospace;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #000;
          background: var(--gold);
          border: none;
          padding: 15px 32px;
          cursor: pointer; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-cta-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }
        .hero-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(200,169,110,0.32); }
        .hero-cta-primary:hover::before { transform: translateX(100%); }
        .hero-cta-primary:active { transform: translateY(0); }

        .hero-cta-arrow {
          display: inline-block; margin-left: 8px;
          transition: transform 0.2s ease;
        }
        .hero-cta-primary:hover .hero-cta-arrow { transform: translateX(4px); }

        /* Secondary CTA */
        .hero-cta-secondary {
          font-family: 'DM Mono', monospace;
          font-size: 10.5px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--text-dim);
          background: transparent; border: none;
          cursor: pointer; padding: 15px 0;
          position: relative;
          transition: color 0.25s ease;
        }
        .hero-cta-secondary::after {
          content: '';
          position: absolute; bottom: 10px; left: 0;
          width: 0; height: 1px;
          background: var(--gold);
          transition: width 0.3s ease;
        }
        .hero-cta-secondary:hover { color: var(--text); }
        .hero-cta-secondary:hover::after { width: 100%; }

        /* Scroll indicator */
        .hero-scroll {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.8s ease 1.3s;
        }
        .hero-scroll.visible { opacity: 1; }

        .hero-scroll-text {
          font-size: 8.5px; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--text-muted);
        }

        .hero-scroll-track {
          width: 1px; height: 52px;
          background: var(--border);
          position: relative; overflow: hidden;
        }
        .hero-scroll-fill {
          position: absolute; top: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent, var(--gold));
          animation: scrollDrop 1.8s cubic-bezier(0.4,0,0.2,1) 1.5s infinite;
        }
        @keyframes scrollDrop {
          0%   { top: -100%; opacity: 1; }
          80%  { top: 100%;  opacity: 1; }
          100% { top: 100%;  opacity: 0; }
        }
      `}</style>

      <section
        className="hero-root"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        {/* Background layers */}
        <canvas className="hero-canvas" ref={canvasRef} />
        <div className="hero-grid" />

        <div className="hero-orb-main"   style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }} />
        <div className="hero-orb-secondary" style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }} />

        {/* Corner brackets */}
        {["tl","tr","bl","br"].map(c => (
          <div key={c} className={`hero-corner ${c} ${mounted ? "visible" : ""}`} />
        ))}

        {/* Side labels */}
        <span className={`hero-side-label left ${mounted ? "visible" : ""}`}>
          EST. 2025 · Agency Overview
        </span>
        <span className={`hero-side-label right ${mounted ? "visible" : ""}`}>
          Creative · Technology · AI
        </span>

        {/* Hex SVG ring */}
        <svg
          className={`hero-hex ${mounted ? "visible" : ""}`}
          viewBox="0 0 420 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="210,18 390,115 390,305 210,402 30,305 30,115"
            stroke="rgba(200,169,110,0.08)"
            strokeWidth="1"
          />
          <polygon
            points="210,50 362,135 362,285 210,370 58,285 58,135"
            stroke="rgba(200,169,110,0.05)"
            strokeWidth="0.6"
          />
        </svg>

        {/* ── Main content ── */}
        <div
          className="hero-content"
          style={{ transform: `translateY(${parallaxY}px)` }}
        >
          {/* Eyebrow */}
          <div className={`hero-eyebrow ${mounted ? "visible" : ""}`}>
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">Infinaut · 2025 Agency Overview</span>
            <div className="hero-eyebrow-line" />
          </div>

          {/* Headline — line-by-line reveal */}
          <h1 className="hero-headline">
            {[
              <span key="0">Building <em>Digital</em></span>,
              <span key="1">Ecosystems That</span>,
              <span key="2">Drive <em>Intelligent</em> Growth</span>,
            ].map((line, i) => (
              <span className="hero-headline-line" key={i}>
                <span
                  className={`hero-headline-inner ${mounted ? "visible" : ""}`}
                  style={{
                    transitionDelay: mounted ? `${0.2 + i * 0.15}s` : "0s",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* Sub */}
          <p className={`hero-sub ${mounted ? "visible" : ""}`}>
            Where strategy, craft, and intelligence converge.
          </p>

          {/* Pillars */}
          <div className={`hero-pillars ${mounted ? "visible" : ""}`}>
            {pillars.map((p, i) => (
              <span key={p} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span className="hero-pillar-item">{p}</span>
                {i < pillars.length - 1 && <span className="hero-pillar-dot" />}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className={`hero-cta-group ${mounted ? "visible" : ""}`}>
            <button className="hero-cta-primary">
              Start a Conversation
              <span className="hero-cta-arrow">→</span>
            </button>
            <button className="hero-cta-secondary">
              View Our Work
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`hero-scroll ${mounted ? "visible" : ""}`}>
          <span className="hero-scroll-text">Scroll</span>
          <div className="hero-scroll-track">
            <div className="hero-scroll-fill" />
          </div>
        </div>

      </section>
    </>
  );
}

export default Hero;