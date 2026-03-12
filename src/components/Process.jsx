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

const steps = [
  {
    num: "01",
    symbol: "◎",
    title: "Discovery",
    sub: "Deep Dive",
    body: "We immerse ourselves in your business — goals, audience, competitive landscape, and existing digital infrastructure.",
    details: ["Stakeholder interviews", "Competitive audit", "Technical assessment", "Goal mapping"],
    duration: "Week 1–2",
  },
  {
    num: "02",
    symbol: "⬡",
    title: "Strategy",
    sub: "Blueprint",
    body: "We build a digital blueprint — positioning, architecture, and a phased roadmap aligned to your business objectives.",
    details: ["Digital positioning", "System architecture", "Phased roadmap", "KPI framework"],
    duration: "Week 2–3",
  },
  {
    num: "03",
    symbol: "◈",
    title: "Design",
    sub: "Craft",
    body: "Visual identity, UX wireframes, and full system design — every element aligned to brand strategy and user intent.",
    details: ["Brand identity system", "UX wireframes", "UI design", "Motion language"],
    duration: "Week 3–6",
  },
  {
    num: "04",
    symbol: "△",
    title: "Build",
    sub: "Engineer",
    body: "Development, AI integration, testing, and infrastructure deployment — engineered for precision and performance.",
    details: ["Custom development", "AI integration", "QA & testing", "Infrastructure deploy"],
    duration: "Week 5–10",
  },
  {
    num: "05",
    symbol: "∞",
    title: "Launch",
    sub: "Activate",
    body: "Coordinated go-live with full QA, documentation, handoff — then we stay on to activate your growth systems.",
    details: ["Go-live coordination", "Full documentation", "Team handoff", "Growth activation"],
    duration: "Week 10–12",
  },
];

function Process() {
  const [sectionRef, inView] = useInView();
  const [activeStep, setActiveStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [lineProgress, setLineProgress] = useState(0);
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

  // Animate the connector line progress when in view
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const duration = 1400;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setLineProgress(p);
      if (p < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), 600);
    return () => clearTimeout(timer);
  }, [inView]);

  // Auto-cycle active step
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, 2800);
    return () => clearInterval(t);
  }, [inView]);

  const active = steps[activeStep];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        .proc-section {
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
        .proc-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }

        .proc-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none; z-index: 1;
        }

        /* Purple orbs */
        .proc-orb {
          position: absolute; width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.11) 0%, rgba(88,28,220,0.04) 50%, transparent 68%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 1.1s cubic-bezier(0.2,0,0.2,1), top 1.1s cubic-bezier(0.2,0,0.2,1);
          z-index: 1;
        }

        .proc-orb-secondary {
          position: absolute; width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 65%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 0.35s cubic-bezier(0.2,0,0.2,1), top 0.35s cubic-bezier(0.2,0,0.2,1);
          z-index: 1;
        }

        /* Static orbs */
        .proc-orb-static-tl {
          position: absolute; top: -150px; left: -150px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
          animation: orbFloatProc 14s ease-in-out infinite;
        }
        .proc-orb-static-br {
          position: absolute; bottom: -120px; right: -120px;
          width: 450px; height: 450px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
          animation: orbFloatProc 12s ease-in-out infinite reverse;
        }
        @keyframes orbFloatProc {
          0%,100%{ transform: translate(0,0); }
          50%{ transform: translate(30px, -20px); }
        }

        .proc-corner {
          position: absolute; width: 60px; height: 60px;
          pointer-events: none; z-index: 2;
          opacity: 0; transition: opacity 0.8s ease 0.3s;
        }
        .proc-corner.visible { opacity: 1; }
        .proc-corner.tl { top: 40px; left: 40px; border-top: 1px solid var(--pu-line); border-left: 1px solid var(--pu-line); }
        .proc-corner.br { bottom: 40px; right: 40px; border-bottom: 1px solid var(--pu-line); border-right: 1px solid var(--pu-line); }

        .proc-inner {
          max-width: 1300px; margin: 0 auto;
          padding: 0 48px; position: relative; z-index: 3;
        }

        /* ── Header ── */
        .proc-header {
          display: grid; grid-template-columns: 1.2fr 0.9fr;
          gap: 80px; align-items: end; margin-bottom: 80px;
        }

        .proc-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .proc-eyebrow.visible { opacity: 1; transform: translateY(0); }
        .proc-eyebrow-line { width: 48px; height: 1px; background: var(--pu-bright); }
        .proc-eyebrow-text { 
          font-size: 11px; font-weight: 600; 
          letter-spacing: 0.3em; text-transform: uppercase; 
          color: var(--pu-bright);
        }

        .proc-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(48px, 6vw, 72px); font-weight: 800;
          line-height: 1.05; color: var(--text);
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
          letter-spacing: -0.02em;
        }
        .proc-headline.visible { opacity: 1; transform: translateY(0); }
        .proc-headline em { font-style: italic; color: var(--pu-light); }

        .proc-desc-col {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s;
        }
        .proc-desc-col.visible { opacity: 1; transform: translateY(0); }
        .proc-desc {
          font-size: 15px; font-weight: 300; line-height: 1.8;
          color: var(--text-dim); margin-bottom: 24px;
        }
        .proc-tagline {
          font-family: 'Space Grotesk', sans-serif; font-style: italic;
          font-size: 18px; 
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          padding-left: 20px; border-left: 1px solid var(--pu-line); line-height: 1.5;
        }

        /* ── Step nodes row ── */
        .proc-nodes-wrap {
          position: relative; margin-bottom: 2px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.42s, transform 0.7s ease 0.42s;
        }
        .proc-nodes-wrap.visible { opacity: 1; transform: translateY(0); }

        /* Connector line */
        .proc-connector {
          position: absolute; top: 32px; left: 28px;
          right: 28px; height: 1px;
          background: var(--border); z-index: 0;
        }
        .proc-connector-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--pu-bright), var(--pu-light));
          transition: width 0.05s linear;
        }

        .proc-nodes {
          display: flex; justify-content: space-between;
          position: relative; z-index: 2;
        }

        .proc-node {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          cursor: pointer; flex: 1;
          transition: opacity 0.25s ease;
        }

        .proc-node-circle {
          width: 64px; height: 64px; border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; 
          background: linear-gradient(145deg, rgba(2,0,10,0.9), rgba(10,7,18,0.95));
          position: relative; z-index: 2;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }

        .proc-node.active .proc-node-circle {
          border-color: var(--pu-bright);
          background: var(--pu-dim);
          transform: scale(1.15);
          box-shadow: 0 0 30px rgba(168,85,247,0.3);
        }

        .proc-node-symbol {
          font-size: 24px; 
          background: linear-gradient(135deg, var(--text-muted), var(--text-dim));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          transition: all 0.3s ease;
        }
        .proc-node.active .proc-node-symbol { 
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .proc-node-label {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--text-muted); text-align: center;
          transition: color 0.3s ease;
        }
        .proc-node.active .proc-node-label { color: var(--text); }

        .proc-node-num {
          font-size: 9px; letter-spacing: 0.2em;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .proc-node.active .proc-node-num { color: var(--pu-bright); }

        /* ── Detail panel ── */
        .proc-panel {
          border: 1px solid var(--border);
          background: linear-gradient(145deg, rgba(2,0,10,0.95), rgba(10,7,18,0.98));
          display: grid; grid-template-columns: 1fr 1fr;
          overflow: hidden;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s;
          backdrop-filter: blur(4px);
        }
        .proc-panel.visible { opacity: 1; transform: translateY(0); }

        .proc-panel-left {
          padding: 48px 44px;
          border-right: 1px solid var(--border);
          position: relative; overflow: hidden;
        }

        /* Purple top bar on panel */
        .proc-panel-left::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--pu-bright), var(--pu-light), transparent);
          animation: panelBar 0.4s ease forwards;
        }
        @keyframes panelBar {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        .proc-panel-num {
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--pu-bright); margin-bottom: 12px; display: block;
        }

        .proc-panel-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 42px; font-weight: 700; 
          background: linear-gradient(135deg, var(--text), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1.1; margin-bottom: 8px;
        }

        .proc-panel-sub {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 24px; display: block;
        }

        .proc-panel-body {
          font-size: 14px; font-weight: 300; line-height: 1.8;
          color: var(--text-dim); margin-bottom: 32px;
        }

        .proc-panel-duration {
          display: inline-flex; align-items: center; gap: 12px;
          border: 1px solid var(--pu-line); 
          padding: 10px 18px;
          background: var(--pu-dim);
        }
        .proc-panel-duration-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--pu-bright);
          animation: procPulse 1.6s ease-in-out infinite;
        }
        @keyframes procPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.65); }
        }
        .proc-panel-duration-text {
          font-size: 11px; letter-spacing: 0.2em; 
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* Right panel — details list */
        .proc-panel-right {
          padding: 48px 44px;
          display: flex; flex-direction: column; justify-content: center;
        }

        .proc-panel-details-label {
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 28px;
          display: flex; align-items: center; gap: 16px;
        }
        .proc-panel-details-label::after {
          content: ''; flex: 1; height: 1px; 
          background: linear-gradient(90deg, var(--border), transparent);
        }

        .proc-detail-item {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 0; border-bottom: 1px solid var(--border);
          opacity: 0; transform: translateX(12px);
          animation: detailSlide 0.4s ease forwards;
        }
        .proc-detail-item:last-child { border-bottom: none; }

        @keyframes detailSlide {
          to { opacity: 1; transform: translateX(0); }
        }

        .proc-detail-icon {
          width: 32px; height: 32px; border: 1px solid var(--pu-line);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; 
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          flex-shrink: 0;
        }

        .proc-detail-text {
          font-size: 13px; font-weight: 300; color: var(--text-dim);
          letter-spacing: 0.04em;
        }

        /* ── Step progress bar ── */
        .proc-progress {
          display: flex; gap: 6px; margin-top: 28px;
          opacity: 0; transition: opacity 0.6s ease 0.65s;
        }
        .proc-progress.visible { opacity: 1; }

        .proc-progress-seg {
          height: 3px; flex: 1;
          background: var(--border); position: relative; overflow: hidden;
          cursor: pointer;
          border-radius: 2px;
        }

        .proc-progress-fill {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, var(--pu-bright), var(--pu-light));
          transform: scaleX(0); transform-origin: left;
        }
        .proc-progress-fill.active {
          animation: segFill 2.8s linear forwards;
        }
        @keyframes segFill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .proc-progress-fill.done { transform: scaleX(1); }

        /* Responsive */
        @media (max-width: 1024px) {
          .proc-header { grid-template-columns: 1fr; gap: 40px; }
          .proc-panel { grid-template-columns: 1fr; }
          .proc-panel-left { border-right: none; border-bottom: 1px solid var(--border); }
        }
        @media (max-width: 768px) {
          .proc-inner { padding: 0 24px; }
          .proc-nodes { flex-wrap: wrap; gap: 20px; }
          .proc-node { flex: 0 0 calc(33.33% - 20px); }
        }
      `}</style>

      <section
        id="process"
        className="proc-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        {/* Canvas background */}
        <canvas className="proc-canvas" ref={canvasRef} />
        <div className="proc-grid-bg" />
        <div className="proc-orb-static-tl" />
        <div className="proc-orb-static-br" />
        <div
          className="proc-orb"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div
          className="proc-orb-secondary"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div className={`proc-corner tl ${inView ? "visible" : ""}`} />
        <div className={`proc-corner br ${inView ? "visible" : ""}`} />

        <div className="proc-inner" ref={innerRef}>

          {/* Header */}
          <div className="proc-header">
            <div>
              <div className={`proc-eyebrow ${inView ? "visible" : ""}`}>
                <div className="proc-eyebrow-line" />
                <span className="proc-eyebrow-text">Our Process</span>
              </div>
              <h2 className={`proc-headline ${inView ? "visible" : ""}`}>
                How We<br />Work —<br /><em>Precisely.</em>
              </h2>
            </div>
            <div className={`proc-desc-col ${inView ? "visible" : ""}`}>
              <p className="proc-desc">
                A clear, collaborative process from brief to launch — and beyond.
                Every phase is intentional, every deliverable part of a larger system.
              </p>
              <p className="proc-tagline">
                Nothing we build exists in isolation.
              </p>
            </div>
          </div>

          {/* Node timeline */}
          <div className={`proc-nodes-wrap ${inView ? "visible" : ""}`}>
            <div className="proc-connector">
              <div
                className="proc-connector-fill"
                style={{ width: `${lineProgress * 100}%` }}
              />
            </div>
            <div className="proc-nodes">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className={`proc-node ${activeStep === i ? "active" : ""}`}
                  onClick={() => setActiveStep(i)}
                >
                  <span className="proc-node-num">{s.num}</span>
                  <div className="proc-node-circle">
                    <span className="proc-node-symbol">{s.symbol}</span>
                  </div>
                  <span className="proc-node-label">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className={`proc-panel ${inView ? "visible" : ""}`} key={activeStep}>
            <div className="proc-panel-left">
              <span className="proc-panel-num">{active.num} — {active.sub}</span>
              <div className="proc-panel-title">{active.title}</div>
              <span className="proc-panel-sub">Phase {active.num} of 05</span>
              <p className="proc-panel-body">{active.body}</p>
              <div className="proc-panel-duration">
                <div className="proc-panel-duration-dot" />
                <span className="proc-panel-duration-text">{active.duration}</span>
              </div>
            </div>

            <div className="proc-panel-right">
              <div className="proc-panel-details-label">Deliverables</div>
              {active.details.map((d, i) => (
                <div
                  key={d}
                  className="proc-detail-item"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="proc-detail-icon">✓</div>
                  <span className="proc-detail-text">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress segments */}
          <div className={`proc-progress ${inView ? "visible" : ""}`}>
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="proc-progress-seg"
                onClick={() => setActiveStep(i)}
              >
                <div
                  className={`proc-progress-fill ${
                    i === activeStep ? "active" : i < activeStep ? "done" : ""
                  }`}
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default Process;