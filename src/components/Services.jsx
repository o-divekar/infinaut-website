import { useState, useEffect, useRef } from "react";
import SEO from "./SEO";
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

const services = [
  {
    num: "01",
    symbol: "◈",
    title: "Branding & Identity",
    sub: "Visual Intelligence",
    body: "We build visual systems that dene how your brand looks, feels, and communicates across every touchpoint.",
    tags: ["Logo & Visual Identity", "Brand Guidelines", "Social Media Creatives", "Marketing & Ad Creatives","Ad Shoots & Product Shoots",
            "Typography & Color Systems",
            "Motion Graphics & Visual Assets"],
    stat: "∞", statLabel: "Brand touchpoints unified",
    accent: "#a855f7",
  },
  {
    num: "02",
    symbol: "⬡",
    title: "Web & Product Dev",
    sub: "Engineering Depth",
    body: "Scalable digital products and platforms built for performance, usability, and long-term growth.",
    tags: ["Website Design & Development",
            "Landing Pages",
            "UI/UX Design",
            "Web Applications",
            "Mobile App Development",
            "Custom Software Development",
            "E-commerce Solutions",
            "CMS Integration"],
    stat: "10×", statLabel: "Faster than template builds",
    accent: "#7c3aed",
  },
  {
    num: "03",
    symbol: "◎",
    title: "AI & Automation",
    sub: "Intelligent Systems",
    body: "Intelligent systems that reduce manual work, improve effciency, and scale operations.",
    tags: ["AI Chatbots & Assistants",
"Work ow Automation",
"AI Content Systems",
"Data Processing & Pipelines",
"Business Process Automation",
"Custom AI Integrations"],
    stat: "60%", statLabel: "Reduction in manual task load",
    accent: "#c084fc",
  },
  {
    num: "04",
    symbol: "△",
    title: "Growth Strategy",
    sub: "Systematic Scale",
    body: "Data-driven strategies that increase visibility,engagement, and conversions over time.",
    tags: ["SEO & Search Optimization",
            "Content Strategy",
            "Social Media Strategy",
            "Performance Marketing",
            "Funnel Design",
            "Analytics & Optimization"],
    stat: "3×", statLabel: "Average growth acceleration",
    accent: "#a855f7",
  },
  {
    num: "05",
    symbol: "⊕",
    title: "Digital Infrastructure",
    sub: "Foundation First",
    body: "The backend systems that ensure everything runs smoothly, securely, and at scale.",
    tags: ["Hosting & Deployment",
            "Cloud Infrastructure",
            "Domain & Server Setup",
            "Backend Systems",
            "API Integrations",
            "Security & Maintenanc"],
    stat: "99.9%", statLabel: "Uptime engineered by design",
    accent: "#7c3aed",
  },
];

function ServiceCard({ s, i, inView, isActive, isFaded, onClick }) {
  const [hovered, setHovered] = useState(false);
  const show = isActive || hovered;

  return (
    <div
      className={`svc-card ${inView ? "visible" : ""} ${isActive ? "active" : ""} ${isFaded ? "faded" : ""}`}
      style={{ transitionDelay: `${0.1 + i * 0.09}s` }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar */}
      <div className="svc-card-bar" style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />

      {/* Header row */}
      <div className="svc-card-header">
        <span className="svc-card-num">{s.num}</span>
        <span className="svc-card-symbol" style={{ color: s.accent }}>{s.symbol}</span>
      </div>

      {/* Title block */}
      <div className="svc-card-title-block">
        <div className="svc-card-title">{s.title}</div>
        <span className="svc-card-sub" style={{ color: s.accent }}>{s.sub}</span>
      </div>

      {/* Body */}
      <p className="svc-card-body">{s.body}</p>

      {/* Tags */}
      <div className="svc-card-tags">
        {s.tags.map((t) => (
          <span key={t} className="svc-card-tag">{t}</span>
        ))}
      </div>

      {/* Stat */}
      <div className="svc-card-stat-block">
        <div className="svc-card-stat-value" style={{ color: isActive || hovered ? s.accent : '' }}>{s.stat}</div>
        <div className="svc-card-stat-label">{s.statLabel}</div>
      </div>

      {/* CTA row */}
      <div className={`svc-card-cta ${show ? "show" : ""}`}>
        <span className="svc-card-cta-text" style={{ color: s.accent }}>Explore Service</span>
        <span className="svc-card-cta-arrow" style={{ color: s.accent }}>→</span>
      </div>
    </div>
  );
}

function Services() {
  const [sectionRef, inView] = useInView();
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
      
      // Draw connections with purple
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168,85,247,${0.06 * (1 - dist/100)})`;
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
        ctx.fillStyle = "rgba(168,85,247,0.2)";
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

        .svc-section {
          /* Exact colors from Hero */
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
          --border:     rgba(168,85,247,0.15);

          /* Hero background */
          background: radial-gradient(ellipse 90% 70% at 50% 0%, #120028 0%, #06000f 45%, #02000a 100%);
          padding: 140px 0 120px;
          position: relative; overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Canvas background */
        .svc-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }

        .svc-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none; z-index: 1;
        }

        /* Purple orbs */
        .svc-orb {
          position: absolute; width: 640px; height: 640px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.11) 0%, rgba(88,28,220,0.04) 50%, transparent 68%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 1.1s cubic-bezier(0.2,0,0.2,1), top 1.1s cubic-bezier(0.2,0,0.2,1);
          z-index: 1;
        }

        .svc-orb-secondary {
          position: absolute; width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 65%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 0.35s cubic-bezier(0.2,0,0.2,1), top 0.35s cubic-bezier(0.2,0,0.2,1);
          z-index: 1;
        }

        /* Static orbs */
        .svc-orb-static-tl {
          position: absolute; top: -150px; left: -150px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
          animation: orbFloatSvc 14s ease-in-out infinite;
        }
        .svc-orb-static-br {
          position: absolute; bottom: -120px; right: -120px;
          width: 450px; height: 450px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
          animation: orbFloatSvc 12s ease-in-out infinite reverse;
        }
        @keyframes orbFloatSvc {
          0%,100%{ transform: translate(0,0); }
          50%{ transform: translate(30px, -20px); }
        }

        .svc-corner {
          position: absolute; width: 60px; height: 60px;
          pointer-events: none; z-index: 2;
          opacity: 0; transition: opacity 0.8s ease 0.3s;
        }
        .svc-corner.visible { opacity: 1; }
        .svc-corner.tl { top: 40px; left: 40px; border-top: 1px solid var(--pu-line); border-left: 1px solid var(--pu-line); }
        .svc-corner.br { bottom: 40px; right: 40px; border-bottom: 1px solid var(--pu-line); border-right: 1px solid var(--pu-line); }

        .svc-inner {
          max-width: 1300px; margin: 0 auto;
          padding: 0 48px; position: relative; z-index: 3;
        }

        /* ── Header ── */
        .svc-header {
          display: grid; grid-template-columns: 1.2fr 0.9fr;
          gap: 80px; align-items: end; margin-bottom: 72px;
        }

        .svc-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .svc-eyebrow.visible { opacity: 1; transform: translateY(0); }
        .svc-eyebrow-line { width: 48px; height: 1px; background: var(--pu-bright); }
        .svc-eyebrow-text { 
          font-size: 11px; font-weight: 600; 
          letter-spacing: 0.3em; text-transform: uppercase; 
          color: var(--pu-bright);
        }

        .svc-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(48px, 6vw, 72px); font-weight: 800;
          line-height: 1.05; color: var(--text);
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
          letter-spacing: -0.02em;
        }
        .svc-headline.visible { opacity: 1; transform: translateY(0); }
        .svc-headline em { font-style: italic; color: var(--pu-light); }

        .svc-desc-col {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s;
        }
        .svc-desc-col.visible { opacity: 1; transform: translateY(0); }
        .svc-desc { 
          font-size: 15px; font-weight: 300; line-height: 1.8; 
          color: var(--text-dim); margin-bottom: 24px; 
        }
        .svc-tagline {
          font-family: 'Space Grotesk', sans-serif; font-style: italic;
          font-size: 18px; 
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          padding-left: 20px; border-left: 1px solid var(--pu-line); line-height: 1.5;
        }

        /* ── Service count badge ── */
        .svc-count {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 40px;
          opacity: 0; transition: opacity 0.6s ease 0.4s;
        }
        .svc-count.visible { opacity: 1; }
        .svc-count-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 56px; font-weight: 700; 
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .svc-count-label {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--text-muted); line-height: 1.6;
        }
        .svc-count-div { width: 1px; height: 44px; background: var(--border); }

        /* ── Cards grid ── */
        .svc-cards {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1px; background: var(--border);
        }

        .svc-card {
          background: linear-gradient(145deg, rgba(2,0,10,0.95), rgba(10,7,18,0.98));
          padding: 40px 28px 32px;
          position: relative; overflow: hidden;
          cursor: pointer; display: flex; flex-direction: column; gap: 0;
          opacity: 0; transform: translateY(24px);
          transition:
            opacity 0.65s ease,
            transform 0.65s ease,
            background 0.3s ease,
            filter 0.3s ease;
          backdrop-filter: blur(4px);
          border: 1px solid transparent;
        }
        .svc-card.visible { opacity: 1; transform: translateY(0); }
        .svc-card.faded { opacity: 0.35; filter: saturate(0.4); }
        .svc-card.active { 
          background: linear-gradient(145deg, rgba(15,8,25,0.98), rgba(20,10,30,0.98));
          border-color: var(--pu-line);
        }
        .svc-card:hover:not(.faded) { 
          background: linear-gradient(145deg, rgba(15,10,25,0.98), rgba(20,12,32,0.98));
          border-color: var(--pu-line);
        }

        /* Top bar - now handled inline with dynamic accent color */
        .svc-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .svc-card:hover .svc-card-bar,
        .svc-card.active .svc-card-bar { transform: scaleX(1); }

        .svc-card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 24px;
        }

        .svc-card-num {
          font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; 
          color: var(--text-muted);
        }

        .svc-card-symbol {
          font-size: 26px; 
          transition: all 0.25s ease;
        }
        .svc-card:hover .svc-card-symbol,
        .svc-card.active .svc-card-symbol { 
          transform: scale(1.15) rotate(15deg); 
        }

        .svc-card-title-block { margin-bottom: 16px; }

        .svc-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700;
          color: var(--text); line-height: 1.2; margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .svc-card-sub {
          font-size: 9px; letter-spacing: 0.22em;
          text-transform: uppercase; 
        }

        .svc-card-body {
          font-size: 12px; font-weight: 300; line-height: 1.8;
          color: var(--text-muted); margin-bottom: 24px; flex: 1;
        }

        /* Tags */
        .svc-card-tags {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;
        }

        .svc-card-tag {
          font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--text-muted); border: 1px solid var(--border);
          padding: 5px 10px;
          transition: all 0.25s ease;
          border-radius: 2px;
        }
        .svc-card:hover .svc-card-tag,
        .svc-card.active .svc-card-tag {
          border-color: var(--pu-line); 
          color: var(--text-dim);
          background: var(--pu-dim);
        }

        /* Stat */
        .svc-card-stat-block {
          border-top: 1px solid var(--border); padding-top: 18px; margin-bottom: 18px;
        }
        .svc-card-stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 36px; font-weight: 700; 
          line-height: 1;
          margin-bottom: 6px;
          transition: color 0.25s ease;
        }
        .svc-card-stat-label {
          font-size: 9px; font-weight: 300; color: var(--text-muted); line-height: 1.5;
        }

        /* CTA */
        .svc-card-cta {
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid var(--border); padding-top: 16px;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .svc-card-cta.show { opacity: 1; transform: translateY(0); }

        .svc-card-cta-text {
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; 
        }
        .svc-card-cta-arrow {
          font-size: 14px; 
          transition: transform 0.2s ease;
        }
        .svc-card:hover .svc-card-cta-arrow { transform: translateX(4px); }

        /* ── Bottom strip ── */
        .svc-bottom {
          margin-top: 1px; 
          background: linear-gradient(145deg, rgba(2,0,10,0.95), rgba(10,7,18,0.98));
          border: 1px solid var(--border); border-top: none;
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 36px;
          opacity: 0; transition: opacity 0.6s ease 0.65s;
          backdrop-filter: blur(4px);
        }
        .svc-bottom.visible { opacity: 1; }

        .svc-bottom-left {
          display: flex; align-items: center; gap: 24px;
        }

        .svc-bottom-label {
          font-size: 11px; font-weight: 300; letter-spacing: 0.15em;
          color: var(--text-muted);
        }
        .svc-bottom-label strong { 
          color: var(--text); 
          font-weight: 500;
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .svc-bottom-dots {
          display: flex; gap: 8px; align-items: center;
        }
        .svc-bottom-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--border);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .svc-bottom-dot.active { 
          background: var(--pu-bright);
          box-shadow: 0 0 12px var(--pu-bright);
        }
        .svc-bottom-dot:hover { background: var(--pu-light); }

        .svc-bottom-cta {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background: none; border: none;
          cursor: pointer; padding: 0; position: relative;
        }
        .svc-bottom-cta::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, var(--pu), var(--pu-bright));
          transition: width 0.3s ease;
        }
        .svc-bottom-cta:hover::after { width: 100%; }

        /* Responsive */
        @media (max-width: 1024px) {
          .svc-header { grid-template-columns: 1fr; gap: 40px; }
          .svc-cards { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .svc-cards { grid-template-columns: repeat(2, 1fr); }
          .svc-inner { padding: 0 24px; }
          .svc-bottom { flex-direction: column; gap: 20px; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .svc-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <section
        id="services"
        className="svc-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        {/* Canvas background */}
        <canvas className="svc-canvas" ref={canvasRef} />
        <div className="svc-grid-bg" />
        <div className="svc-orb-static-tl" />
        <div className="svc-orb-static-br" />
        <div
          className="svc-orb"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div
          className="svc-orb-secondary"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div className={`svc-corner tl ${inView ? "visible" : ""}`} />
        <div className={`svc-corner br ${inView ? "visible" : ""}`} />

        <div className="svc-inner" ref={innerRef}>

          {/* Header */}
          <div className="svc-header">
            <div>
              <div className={`svc-eyebrow ${inView ? "visible" : ""}`}>
                <div className="svc-eyebrow-line" />
                <span className="svc-eyebrow-text">What We Build</span>
              </div>
              <h2 className={`svc-headline ${inView ? "visible" : ""}`}>
                Five <em>Interconnected</em><br />
                Capabilities.
              </h2>
            </div>
            <div className={`svc-desc-col ${inView ? "visible" : ""}`}>
              <p className="svc-desc">
                Not isolated services — a unified suite of capabilities designed
                to work together as one cohesive digital ecosystem. Every
                capability compounds the value of the others.
              </p>
              <p className="svc-tagline">
                Designed to deliver lasting digital value.
              </p>
            </div>
          </div>

          {/* Count badge */}
          <div className={`svc-count ${inView ? "visible" : ""}`}>
            <div className="svc-count-num">05</div>
            <div className="svc-count-div" />
            <div className="svc-count-label">
              Interconnected<br />Capabilities
            </div>
          </div>

          {/* Cards */}
          <div className="svc-cards">
            {services.map((s, i) => (
              <ServiceCard
                key={s.num}
                s={s} i={i}
                inView={inView}
                isActive={activeCard === i}
                isFaded={activeCard !== null && activeCard !== i}
                onClick={() => setActiveCard(activeCard === i ? null : i)}
              />
            ))}
          </div>

          {/* Bottom strip */}
          <div className={`svc-bottom ${inView ? "visible" : ""}`}>
            <div className="svc-bottom-left">
              <span className="svc-bottom-label">
                <strong>Each capability</strong> is designed to integrate with the others
              </span>
              <div className="svc-bottom-dots">
                {services.map((_, i) => (
                  <div
                    key={i}
                    className={`svc-bottom-dot ${activeCard === i ? "active" : ""}`}
                    onClick={() => setActiveCard(activeCard === i ? null : i)}
                  />
                ))}
              </div>
            </div>
            <button className="svc-bottom-cta">View All Services →</button>
          </div>
        
        </div>
      </section>
       <SEO 
        title="Our Services - AI, Technology & Creative Solutions"
        description="Explore our comprehensive digital services including AI development, technology consulting, and creative design."
      />
      {/* rest of your component */}

    </>
  );
}

export default Services;