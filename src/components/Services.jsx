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

const services = [
  {
    num: "01",
    symbol: "◈",
    title: "Branding & Identity",
    sub: "Visual Intelligence",
    body: "Complete visual language systems — logo, typography, color, motion, and brand communication strategy built with precision.",
    tags: ["Logo Systems", "Brand Guidelines", "Typography", "Motion Identity"],
    stat: "∞", statLabel: "Brand touchpoints unified",
    accent: "#c8a96e",
  },
  {
    num: "02",
    symbol: "⬡",
    title: "Web & Product Dev",
    sub: "Engineering Depth",
    body: "Custom websites, web applications, and digital products engineered for performance, scalability, and long-term maintainability.",
    tags: ["Custom Websites", "Web Apps", "E-Commerce", "CMS Integration"],
    stat: "10×", statLabel: "Faster than template builds",
    accent: "#c8a96e",
  },
  {
    num: "03",
    symbol: "◎",
    title: "AI & Automation",
    sub: "Intelligent Systems",
    body: "Intelligent workflows, AI chatbots, data pipelines, and automation systems that help businesses operate at a fundamentally new level.",
    tags: ["AI Chatbots", "Workflow Automation", "Data Pipelines", "Predictive Systems"],
    stat: "60%", statLabel: "Reduction in manual task load",
    accent: "#c8a96e",
  },
  {
    num: "04",
    symbol: "△",
    title: "Growth Strategy",
    sub: "Systematic Scale",
    body: "SEO architecture, content systems, analytics, and conversion-focused digital growth planning that compounds over time.",
    tags: ["SEO Architecture", "Content Strategy", "Analytics", "Funnel Design"],
    stat: "3×", statLabel: "Average growth acceleration",
    accent: "#c8a96e",
  },
  {
    num: "05",
    symbol: "⊕",
    title: "Digital Infrastructure",
    sub: "Foundation First",
    body: "CMS, hosting, domain architecture, and full backend digital setups — the invisible foundation every great digital product needs.",
    tags: ["CMS Setup", "Cloud Hosting", "Domain Architecture", "Backend Systems"],
    stat: "99.9%", statLabel: "Uptime engineered by design",
    accent: "#c8a96e",
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
      <div className="svc-card-bar" />

      {/* Header row */}
      <div className="svc-card-header">
        <span className="svc-card-num">{s.num}</span>
        <span className="svc-card-symbol">{s.symbol}</span>
      </div>

      {/* Title block */}
      <div className="svc-card-title-block">
        <div className="svc-card-title">{s.title}</div>
        <span className="svc-card-sub">{s.sub}</span>
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
        <div className="svc-card-stat-value">{s.stat}</div>
        <div className="svc-card-stat-label">{s.statLabel}</div>
      </div>

      {/* CTA row */}
      <div className={`svc-card-cta ${show ? "show" : ""}`}>
        <span className="svc-card-cta-text">Explore Service</span>
        <span className="svc-card-cta-arrow">→</span>
      </div>
    </div>
  );
}

function Services() {
  const [sectionRef, inView] = useInView();
  const [activeCard, setActiveCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const innerRef = useRef(null);

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

        .svc-section {
          background: linear-gradient(168deg, var(--bg2) 0%, var(--bg) 55%, #09090c 100%);
          padding: 120px 0 100px;
          position: relative; overflow: hidden;
          font-family: 'DM Mono', monospace;
        }

        .svc-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.022) 1px, transparent 1px);
          background-size: 64px 64px; pointer-events: none;
        }

        .svc-orb {
          position: absolute; width: 640px; height: 640px; border-radius: 50%;
          background: radial-gradient(circle, rgba(200,169,110,0.052) 0%, transparent 68%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 1s cubic-bezier(0.2,0,0.2,1), top 1s cubic-bezier(0.2,0,0.2,1);
        }

        .svc-corner {
          position: absolute; width: 40px; height: 40px;
          pointer-events: none; z-index: 1;
          opacity: 0; transition: opacity 0.8s ease 0.3s;
        }
        .svc-corner.visible { opacity: 1; }
        .svc-corner.tl { top: 40px; left: 40px; border-top: 1px solid var(--gold-line); border-left: 1px solid var(--gold-line); }
        .svc-corner.br { bottom: 40px; right: 40px; border-bottom: 1px solid var(--gold-line); border-right: 1px solid var(--gold-line); }

        .svc-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 48px; position: relative; z-index: 1;
        }

        /* ── Header ── */
        .svc-header {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: end; margin-bottom: 72px;
        }

        .svc-eyebrow {
          display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .svc-eyebrow.visible { opacity: 1; transform: translateY(0); }
        .svc-eyebrow-line { width: 36px; height: 1px; background: var(--gold); }
        .svc-eyebrow-text { font-size: 10px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }

        .svc-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 5vw, 64px); font-weight: 700;
          line-height: 1.06; color: var(--text);
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .svc-headline.visible { opacity: 1; transform: translateY(0); }
        .svc-headline em { font-style: italic; color: var(--gold); }

        .svc-desc-col {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s;
        }
        .svc-desc-col.visible { opacity: 1; transform: translateY(0); }
        .svc-desc { font-size: 12.5px; font-weight: 300; line-height: 1.9; color: var(--text-dim); margin-bottom: 20px; }
        .svc-tagline {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 15px; color: var(--gold);
          padding-left: 14px; border-left: 1px solid var(--gold-line); line-height: 1.5;
        }

        /* ── Service count badge ── */
        .svc-count {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 32px;
          opacity: 0; transition: opacity 0.6s ease 0.4s;
        }
        .svc-count.visible { opacity: 1; }
        .svc-count-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px; font-weight: 700; color: var(--text); line-height: 1;
        }
        .svc-count-label {
          font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase;
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
          background: var(--bg);
          padding: 36px 26px 28px;
          position: relative; overflow: hidden;
          cursor: pointer; display: flex; flex-direction: column; gap: 0;
          opacity: 0; transform: translateY(24px);
          transition:
            opacity 0.65s ease,
            transform 0.65s ease,
            background 0.3s ease,
            filter 0.3s ease;
        }
        .svc-card.visible { opacity: 1; transform: translateY(0); }
        .svc-card.faded { opacity: 0.35; filter: saturate(0.4); }
        .svc-card.active { background: #0f0f13; }
        .svc-card:hover:not(.faded) { background: #0f0f13; }

        /* Gold top bar */
        .svc-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
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
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--text-muted);
        }

        .svc-card-symbol {
          font-size: 22px; color: var(--gold); opacity: 0.65;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .svc-card:hover .svc-card-symbol,
        .svc-card.active .svc-card-symbol { opacity: 1; transform: scale(1.1) rotate(15deg); }

        .svc-card-title-block { margin-bottom: 16px; }

        .svc-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 700;
          color: var(--text); line-height: 1.2; margin-bottom: 4px;
        }

        .svc-card-sub {
          font-size: 8.5px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--gold); opacity: 0.7;
        }

        .svc-card-body {
          font-size: 10.5px; font-weight: 300; line-height: 1.8;
          color: var(--text-muted); margin-bottom: 20px; flex: 1;
        }

        /* Tags */
        .svc-card-tags {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px;
        }

        .svc-card-tag {
          font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--text-muted); border: 1px solid var(--border);
          padding: 4px 8px;
          transition: border-color 0.25s ease, color 0.25s ease;
        }
        .svc-card:hover .svc-card-tag,
        .svc-card.active .svc-card-tag {
          border-color: var(--gold-line); color: var(--text-dim);
        }

        /* Stat */
        .svc-card-stat-block {
          border-top: 1px solid var(--border); padding-top: 16px; margin-bottom: 16px;
        }
        .svc-card-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 600; color: var(--text); line-height: 1;
          margin-bottom: 4px;
          transition: color 0.25s ease;
        }
        .svc-card:hover .svc-card-stat-value,
        .svc-card.active .svc-card-stat-value { color: var(--gold); }
        .svc-card-stat-label {
          font-size: 8.5px; font-weight: 300; color: var(--text-muted); line-height: 1.5;
        }

        /* CTA */
        .svc-card-cta {
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid var(--border); padding-top: 14px;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .svc-card-cta.show { opacity: 1; transform: translateY(0); }

        .svc-card-cta-text {
          font-size: 9px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--gold);
        }
        .svc-card-cta-arrow {
          font-size: 13px; color: var(--gold);
          transition: transform 0.2s ease;
        }
        .svc-card:hover .svc-card-cta-arrow { transform: translateX(4px); }

        /* ── Bottom strip ── */
        .svc-bottom {
          margin-top: 1px; background: var(--bg2);
          border: 1px solid var(--border); border-top: none;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 32px;
          opacity: 0; transition: opacity 0.6s ease 0.65s;
        }
        .svc-bottom.visible { opacity: 1; }

        .svc-bottom-left {
          display: flex; align-items: center; gap: 20px;
        }

        .svc-bottom-label {
          font-size: 9.5px; font-weight: 300; letter-spacing: 0.15em;
          color: var(--text-muted);
        }
        .svc-bottom-label strong { color: var(--text); font-weight: 400; }

        .svc-bottom-dots {
          display: flex; gap: 6px; align-items: center;
        }
        .svc-bottom-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--border);
          transition: background 0.25s ease;
          cursor: pointer;
        }
        .svc-bottom-dot.active { background: var(--gold); }

        .svc-bottom-cta {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); background: none; border: none;
          cursor: pointer; padding: 0; position: relative;
        }
        .svc-bottom-cta::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px; background: var(--gold);
          transition: width 0.3s ease;
        }
        .svc-bottom-cta:hover::after { width: 100%; }
      `}</style>

      <section
        id="services"
        className="svc-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        <div className="svc-grid-bg" />
        <div
          className="svc-orb"
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
    </>
  );
}

export default Services;