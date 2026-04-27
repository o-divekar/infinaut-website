import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const problems = [
  {
    num: "01",
    symbol: "⬡",
    title: "Fragmented Tools",
    sub: "Disconnected platforms",
    body: "Multiple tools with no clear system or structure.",
    stat: "3×",
    statLabel: "more tools, half the efficiency",
  },
  {
    num: "02",
    symbol: "◎",
    title: "Outdated Identity",
    sub: "Brand misalignment",
    body: "Your Brand no longer reflects your vlaue or direction.",
    stat: "2.4×",
    statLabel: "higher bounce rates",
  },
  {
    num: "03",
    symbol: "△",
    title: "No AI Integration",
    sub: "Falling behind",
    body: "Manual work where automation should exist.",
    stat: "60%",
    statLabel: "of competitors use AI today",
  },
  {
    num: "04",
    symbol: "◈",
    title: "Stalled Growth",
    sub: "No scale system",
    body: "No system to scale, optimize, or convert consistently  .",
    stat: "∞",
    statLabel: "potential left on the table",
  },
];

function Problem() {
  const [sectionRef, inView] = useInView(0.15);
  const [activeCard, setActiveCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const innerRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  // Particle network for background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const N = 45;
    particlesRef.current = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.2 + 0.3,
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
      
      // Draw connections with purple from Hero
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist/100)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168,85,247,0.25)";
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const handleMouseMove = (e) => {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        .prob-section {
          /* Exact colors from Hero component */
          --pu:         #7c3aed;
          --pu-bright:  #a855f7;
          --pu-light:   #c084fc;
          --pu-dim:     rgba(124,58,237,0.12);
          --pu-line:    rgba(168,85,247,0.28);
          --bg:         #02000a;
          --bg2:        #0a0712;
          --text:       #f0eeff;
          --text-muted: rgba(240,238,255,0.38);
          --text-dim:   rgba(240,238,255,0.62);
          --border:     rgba(168,85,247,0.2);

          /* Exact Hero background */
          background: radial-gradient(ellipse 90% 70% at 50% 0%, #120028 0%, #06000f 45%, #02000a 100%);
          padding: 140px 0 120px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Canvas background - matching Hero */
        .prob-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }

        /* Grid overlay - matching Hero */
        .prob-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none; z-index: 1;
        }

        /* Purple orb - matching Hero */
        .prob-orb {
          position: absolute;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.11) 0%, rgba(88,28,220,0.04) 50%, transparent 68%);
          transform: translate(-50%,-50%);
          pointer-events: none;
          transition: left 1.1s cubic-bezier(0.2,0,0.2,1), top 1.1s cubic-bezier(0.2,0,0.2,1);
          z-index: 1;
        }

        /* Secondary orb - matching Hero */
        .prob-orb-secondary {
          position: absolute;
          width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 65%);
          transform: translate(-50%,-50%);
          pointer-events: none;
          transition: left 0.35s cubic-bezier(0.2,0,0.2,1), top 0.35s cubic-bezier(0.2,0,0.2,1);
          z-index: 1;
        }

        /* Static orbs - matching Hero */
        .prob-orb-static-tl {
          position: absolute; top: -150px; left: -150px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
          animation: orbFloatProb 14s ease-in-out infinite;
        }
        .prob-orb-static-br {
          position: absolute; bottom: -120px; right: -120px;
          width: 450px; height: 450px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
          animation: orbFloatProb 12s ease-in-out infinite reverse;
        }
        @keyframes orbFloatProb {
          0%,100%{ transform: translate(0,0); }
          50%{ transform: translate(30px, -20px); }
        }

        /* Corner marks - matching Hero line color */
        .prob-corner {
          position: absolute; width: 60px; height: 60px;
          pointer-events: none; z-index: 2;
          opacity: 0; transition: opacity 0.8s ease 0.3s;
        }
        .prob-corner.visible { opacity: 1; }
        .prob-corner.tl { 
          top: 40px; left: 40px; 
          border-top: 1px solid var(--pu-line); 
          border-left: 1px solid var(--pu-line); 
        }
        .prob-corner.br { 
          bottom: 40px; right: 40px; 
          border-bottom: 1px solid var(--pu-line); 
          border-right: 1px solid var(--pu-line); 
        }

        .prob-inner {
          max-width: 1300px; margin: 0 auto;
          padding: 0 48px;
          position: relative; z-index: 3;
        }

        /* ── Header ── */
        .prob-header {
          display: grid;
          grid-template-columns: 1.2fr 0.9fr;
          gap: 80px;
          align-items: end;
          margin-bottom: 80px;
        }

        .prob-eyebrow {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 24px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .prob-eyebrow.visible { opacity: 1; transform: translateY(0); }

        .prob-eyebrow-line { 
          width: 48px; 
          height: 1px; 
          background: var(--pu-bright);
        }
        .prob-eyebrow-text {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase; 
          color: var(--pu-bright);
        }

        .prob-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(48px, 6vw, 72px);
          font-weight: 800; line-height: 1.05;
          color: var(--text);
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
          letter-spacing: -0.02em;
        }
        .prob-headline.visible { opacity: 1; transform: translateY(0); }
        .prob-headline em { 
          font-style: italic; 
          color: var(--pu-light);
        }

        .prob-right-col {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
        }
        .prob-right-col.visible { opacity: 1; transform: translateY(0); }

        .prob-desc {
          font-size: 15px; font-weight: 300; line-height: 1.8;
          color: var(--text-dim); margin-bottom: 32px;
        }

        /* Warning callout with purple */
        .prob-warning {
          display: flex; gap: 16px; align-items: flex-start;
          padding: 20px 24px;
          border: 1px solid var(--pu-line);
          background: var(--pu-dim);
          backdrop-filter: blur(2px);
          border-radius: 4px;
        }

        .prob-warning-icon {
          font-size: 18px; 
          color: var(--pu-bright);
          flex-shrink: 0; margin-top: 2px;
        }

        .prob-warning-text {
          font-size: 13px; font-weight: 300; line-height: 1.7;
          color: var(--text-muted);
        }
        .prob-warning-text strong { 
          color: var(--text); 
          font-weight: 500;
        }

        /* ── Cards ── */
        .prob-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          background: var(--border);
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s;
          margin-bottom: 2px;
        }
        .prob-cards.visible { opacity: 1; transform: translateY(0); }

        .prob-card {
          background: linear-gradient(145deg, rgba(2,0,10,0.9), rgba(10,7,18,0.95));
          padding: 42px 32px 38px;
          position: relative; overflow: hidden;
          cursor: default;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
          border: 1px solid transparent;
        }
        .prob-card:hover { 
          background: linear-gradient(145deg, rgba(10,7,22,0.95), rgba(15,10,25,0.98));
          border-color: var(--pu-line);
        }

        /* Top accent bar — purple gradient */
        .prob-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--pu-bright), var(--pu-light), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.45s ease;
        }
        .prob-card:hover::before,
        .prob-card.active::before { transform: scaleX(1); }
        .prob-card.active { 
          background: linear-gradient(145deg, rgba(15,8,25,0.98), rgba(20,10,30,0.98));
          border-color: var(--pu-line);
        }

        /* Number */
        .prob-card-num {
          font-size: 12px; letter-spacing: 0.3em;
          text-transform: uppercase; 
          color: var(--text-muted);
          margin-bottom: 24px; display: block;
        }

        /* Symbol - FIXED: No movement, only glow on hover */
        .prob-card-symbol {
          font-size: 32px; 
          color: var(--pu-light);
          opacity: 0.7; display: block;
          margin-bottom: 24px;
          transition: opacity 0.25s ease, text-shadow 0.25s ease;
          /* No transform properties - completely static position */
        }
        .prob-card:hover .prob-card-symbol { 
          opacity: 1; 
          color: #c084fc;
          text-shadow: 
            0 0 8px rgba(168,85,247,0.6),
            0 0 16px rgba(124,58,237,0.4),
            0 0 24px rgba(168,85,247,0.3);
        }

        /* Title */
        .prob-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px; font-weight: 700;
          color: var(--text); line-height: 1.2;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .prob-card-sub {
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; 
          color: var(--pu-bright);
          opacity: 0.8; margin-bottom: 20px; display: block;
        }

        .prob-card-body {
          font-size: 15px; font-weight: 300;
          line-height: 1.7; color: var(--text-muted);
          margin-bottom: 32px;
        }

        /* Stat */
        .prob-card-stat-block {
          border-top: 1px solid var(--border);
          padding-top: 20px;
          margin-top: auto;
        }

        .prob-card-stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 42px; font-weight: 700;
          color: var(--text);
          line-height: 1;
          margin-bottom: 8px;
          transition: all 0.25s ease;
        }
        .prob-card:hover .prob-card-stat-value { 
          color: var(--pu-light);
          text-shadow: 0 0 12px rgba(168,85,247,0.3);
        }

        .prob-card-stat-label {
          font-size: 10px; font-weight: 300;
          line-height: 1.5; color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* ── Bottom banner with purple theme ── */
        .prob-banner {
          background: linear-gradient(145deg, rgba(124,58,237,0.08), rgba(2,0,10,0.95));
          border: 1px solid var(--pu-line);
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 24px 36px;
          opacity: 0;
          transition: opacity 0.7s ease 0.6s;
          backdrop-filter: blur(4px);
        }
        .prob-banner.visible { opacity: 1; }

        .prob-banner-left {
          display: flex; align-items: center; gap: 20px;
        }

        .prob-banner-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--pu-bright);
          opacity: 0.8;
          animation: bannerPulse 2s ease-in-out infinite;
        }
        @keyframes bannerPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.6); }
        }

        .prob-banner-text {
          font-size: 13px; font-weight: 300;
          letter-spacing: 0.02em; color: var(--text-dim);
        }
        .prob-banner-text strong { 
          color: var(--text); 
          font-weight: 500;
        }

        .prob-banner-cta {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--text);
          background: none; border: none;
          cursor: pointer; padding: 0;
          position: relative;
          transition: opacity 0.2s ease;
        }
        .prob-banner-cta::after {
          content: '';
          position: absolute; bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, var(--pu), var(--pu-bright));
          transition: width 0.3s ease;
        }
        .prob-banner-cta:hover::after { width: 100%; }
        .prob-banner-cta:hover {
          color: var(--pu-light);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .prob-header { grid-template-columns: 1fr; gap: 40px; }
          .prob-cards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .prob-cards { grid-template-columns: 1fr; }
          .prob-inner { padding: 0 24px; }
          .prob-banner { flex-direction: column; gap: 20px; align-items: flex-start; }
        }
      `}</style>

      <section
        className="prob-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        {/* Canvas background with purple particles */}
        <canvas className="prob-canvas" ref={canvasRef} />
        <div className="prob-grid-bg" />
        <div className="prob-orb-static-tl" />
        <div className="prob-orb-static-br" />
        <div
          className="prob-orb"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div
          className="prob-orb-secondary"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div className={`prob-corner tl ${inView ? "visible" : ""}`} />
        <div className={`prob-corner br ${inView ? "visible" : ""}`} />

        <div className="prob-inner">

          {/* Header */}
          <div className="prob-header">
            <div>
              <div className={`prob-eyebrow ${inView ? "visible" : ""}`}>
                <div className="prob-eyebrow-line" />
                <span className="prob-eyebrow-text">The Problem</span>
              </div>
              <h2 className={`prob-headline ${inView ? "visible" : ""}`}>
                Most Businesses Are<br />
                Stuck in a<br />
                <em>Digital Gap.</em>
              </h2>
            </div>

            <div className={`prob-right-col ${inView ? "visible" : ""}`}>
              <p className="prob-desc">
                Most businesses have a digital presence but not a system.
                Disconnected tools, weak branding, and lack of 
                automation<br/> create a gap between where they are 
                and where they want to be.
              </p>
              <div className="prob-warning">
                <span className="prob-warning-icon">⚠</span>
                <p className="prob-warning-text">
                  <strong>The gap is compounding.</strong> Every quarter without
                  a unified digital strategy puts businesses further behind
                  competitors who are already scaling with intelligent systems.
                </p>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className={`prob-cards ${inView ? "visible" : ""}`}>
            {problems.map((p, i) => (
              <div
                key={p.num}
                className={`prob-card ${activeCard === i ? "active" : ""}`}
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
                style={{
                  transitionDelay: `${i * 0.06}s`,
                }}
              >
                <span className="prob-card-num">{p.num}</span>
                <span className="prob-card-symbol">{p.symbol}</span>
                <div className="prob-card-title">{p.title}</div>
                <span className="prob-card-sub">{p.sub}</span>
                <p className="prob-card-body">{p.body}</p>
                <div className="prob-card-stat-block">
                  <div className="prob-card-stat-value">{p.stat}</div>
                  <div className="prob-card-stat-label">{p.statLabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom banner */}
          <div className={`prob-banner ${inView ? "visible" : ""}`}>
            <div className="prob-banner-left">
              <div className="prob-banner-dot" />
              <p className="prob-banner-text">
                <strong>Sound familiar?</strong> — Infinaut was built to close exactly this gap.
              </p>
            </div>
            <button className="prob-banner-cta">See How We Solve It →</button>
          </div>

        </div>
      </section>
    </>
  );
}

export default Problem;