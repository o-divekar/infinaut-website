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
  const lineRef = useRef(null);

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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --gold: #c8a96e;
          --gold-dim: rgba(200,169,110,0.1);
          --gold-line: rgba(200,169,110,0.28);
          --bg: #080808;
          --bg2: #0c0c0f;
          --text: #f0ede8;
          --text-muted: rgba(240,237,232,0.38);
          --text-dim: rgba(240,237,232,0.62);
          --border: rgba(255,255,255,0.06);
        }

        .proc-section {
          background: linear-gradient(170deg, var(--bg) 0%, var(--bg2) 50%, var(--bg) 100%);
          padding: 120px 0 100px;
          position: relative; overflow: hidden;
          font-family: 'DM Mono', monospace;
        }

        .proc-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.022) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .proc-orb {
          position: absolute; width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,169,110,0.055) 0%, transparent 68%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 1s cubic-bezier(0.2,0,0.2,1), top 1s cubic-bezier(0.2,0,0.2,1);
        }

        .proc-corner {
          position: absolute; width: 40px; height: 40px;
          pointer-events: none; z-index: 1;
          opacity: 0; transition: opacity 0.8s ease 0.3s;
        }
        .proc-corner.visible { opacity: 1; }
        .proc-corner.tl { top: 40px; left: 40px; border-top: 1px solid var(--gold-line); border-left: 1px solid var(--gold-line); }
        .proc-corner.br { bottom: 40px; right: 40px; border-bottom: 1px solid var(--gold-line); border-right: 1px solid var(--gold-line); }

        .proc-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 0 48px; position: relative; z-index: 1;
        }

        /* ── Header ── */
        .proc-header {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: end; margin-bottom: 80px;
        }

        .proc-eyebrow {
          display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .proc-eyebrow.visible { opacity: 1; transform: translateY(0); }
        .proc-eyebrow-line { width: 36px; height: 1px; background: var(--gold); }
        .proc-eyebrow-text { font-size: 10px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }

        .proc-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 5vw, 64px); font-weight: 700;
          line-height: 1.06; color: var(--text);
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .proc-headline.visible { opacity: 1; transform: translateY(0); }
        .proc-headline em { font-style: italic; color: var(--gold); }

        .proc-desc-col {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s;
        }
        .proc-desc-col.visible { opacity: 1; transform: translateY(0); }
        .proc-desc {
          font-size: 12.5px; font-weight: 300; line-height: 1.9;
          color: var(--text-dim); margin-bottom: 20px;
        }
        .proc-tagline {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 15px; color: var(--gold);
          padding-left: 14px; border-left: 1px solid var(--gold-line); line-height: 1.5;
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
          position: absolute; top: 28px; left: 28px;
          right: 28px; height: 1px;
          background: var(--border); z-index: 0;
        }
        .proc-connector-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold), rgba(200,169,110,0.3));
          transition: width 0.05s linear;
        }

        .proc-nodes {
          display: flex; justify-content: space-between;
          position: relative; z-index: 1;
        }

        .proc-node {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          cursor: pointer; flex: 1;
          transition: opacity 0.25s ease;
        }

        .proc-node-circle {
          width: 56px; height: 56px; border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; background: var(--bg);
          position: relative; z-index: 1;
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }

        .proc-node.active .proc-node-circle {
          border-color: var(--gold);
          background: var(--gold-dim);
          transform: scale(1.15);
          box-shadow: 0 0 24px rgba(200,169,110,0.2);
        }

        .proc-node-symbol {
          font-size: 20px; color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .proc-node.active .proc-node-symbol { color: var(--gold); }

        .proc-node-label {
          font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--text-muted); text-align: center;
          transition: color 0.3s ease;
        }
        .proc-node.active .proc-node-label { color: var(--text); }

        .proc-node-num {
          font-size: 8px; letter-spacing: 0.2em;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .proc-node.active .proc-node-num { color: var(--gold); }

        /* ── Detail panel ── */
        .proc-panel {
          border: 1px solid var(--border);
          background: var(--bg2);
          display: grid; grid-template-columns: 1fr 1fr;
          overflow: hidden;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s;
        }
        .proc-panel.visible { opacity: 1; transform: translateY(0); }

        .proc-panel-left {
          padding: 44px 40px;
          border-right: 1px solid var(--border);
          position: relative; overflow: hidden;
        }

        /* Gold top bar on panel */
        .proc-panel-left::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          animation: panelBar 0.4s ease forwards;
        }
        @keyframes panelBar {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        .proc-panel-num {
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 10px; display: block;
        }

        .proc-panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 700; color: var(--text);
          line-height: 1.1; margin-bottom: 6px;
        }

        .proc-panel-sub {
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 22px; display: block;
        }

        .proc-panel-body {
          font-size: 12px; font-weight: 300; line-height: 1.85;
          color: var(--text-dim); margin-bottom: 28px;
        }

        .proc-panel-duration {
          display: inline-flex; align-items: center; gap: 10px;
          border: 1px solid var(--gold-line); padding: 8px 14px;
        }
        .proc-panel-duration-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold);
          animation: procPulse 1.6s ease-in-out infinite;
        }
        @keyframes procPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.65); }
        }
        .proc-panel-duration-text {
          font-size: 9.5px; letter-spacing: 0.2em; color: var(--gold);
        }

        /* Right panel — details list */
        .proc-panel-right {
          padding: 44px 40px;
          display: flex; flex-direction: column; justify-content: center;
        }

        .proc-panel-details-label {
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
        }
        .proc-panel-details-label::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .proc-detail-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 0; border-bottom: 1px solid var(--border);
          opacity: 0; transform: translateX(12px);
          animation: detailSlide 0.4s ease forwards;
        }
        .proc-detail-item:last-child { border-bottom: none; }

        @keyframes detailSlide {
          to { opacity: 1; transform: translateX(0); }
        }

        .proc-detail-icon {
          width: 28px; height: 28px; border: 1px solid var(--gold-line);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: var(--gold); flex-shrink: 0;
        }

        .proc-detail-text {
          font-size: 11.5px; font-weight: 300; color: var(--text-dim);
          letter-spacing: 0.04em;
        }

        /* ── Step progress bar ── */
        .proc-progress {
          display: flex; gap: 4px; margin-top: 24px;
          opacity: 0; transition: opacity 0.6s ease 0.65s;
        }
        .proc-progress.visible { opacity: 1; }

        .proc-progress-seg {
          height: 2px; flex: 1;
          background: var(--border); position: relative; overflow: hidden;
          cursor: pointer;
        }

        .proc-progress-fill {
          position: absolute; inset: 0;
          background: var(--gold); transform: scaleX(0); transform-origin: left;
        }
        .proc-progress-fill.active {
          animation: segFill 2.8s linear forwards;
        }
        @keyframes segFill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .proc-progress-fill.done { transform: scaleX(1); }
      `}</style>

      <section
        id="process"
        className="proc-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        <div className="proc-grid-bg" />
        <div
          className="proc-orb"
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