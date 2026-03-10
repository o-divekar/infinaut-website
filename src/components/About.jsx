import { useState, useEffect, useRef } from "react";
const pillars = [
  {
    label: "01",
    title: "Creative Design",
    desc: "Visual identity systems and brand communication built with intention and precision.",
    symbol: "◈",
  },
  {
    label: "02",
    title: "Development",
    desc: "Custom web products and digital infrastructure engineered to perform at scale.",
    symbol: "⬡",
  },
  {
    label: "03",
    title: "AI & Automation",
    desc: "Intelligent workflows and data systems that help your business operate at a new level.",
    symbol: "◎",
  },
  {
    label: "04",
    title: "Digital Growth",
    desc: "Strategic growth systems — SEO, analytics, and conversion architecture that compound over time.",
    symbol: "△",
  },
];

const stats = [
  { value: "∞", label: "Scalability by Design" },
  { value: "3×", label: "Faster Operations" },
  { value: "60%", label: "Task Automation" },
  { value: "01", label: "Unified Partner" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function About() {
  const [sectionRef, inView] = useInView();
  const handleMouseMove = () => {};
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --gold: #c8a96e;
          --gold-dim: rgba(200,169,110,0.15);
          --gold-line: rgba(200,169,110,0.3);
          --bg: #080808;
          --bg2: #0d0d10;
          --text: #f0ede8;
          --text-muted: rgba(240,237,232,0.45);
          --text-dim: rgba(240,237,232,0.65);
          --border: rgba(255,255,255,0.07);
        }

        .about-section {
          background: linear-gradient(160deg, var(--bg) 0%, var(--bg2) 60%, #0a0a0e 100%);
          padding: 120px 0 100px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Mono', monospace;
        }

        /* Geometric background texture */
        .about-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .about-bg-orb {
          position: absolute;
          top: -120px;
          right: -80px;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(200,169,110,0.055) 0%, transparent 70%);
          pointer-events: none;
        }

        .about-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 48px;
          position: relative;
          z-index: 1;
        }

        /* Section eyebrow label */
        .about-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 44px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .about-eyebrow.visible { opacity: 1; transform: translateY(0); }

        .about-eyebrow-line {
          width: 36px;
          height: 1px;
          background: var(--gold);
        }

        .about-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
        }

        /* Top split layout */
        .about-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: end;
          margin-bottom: 72px;
        }

        .about-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 5.5vw, 68px);
          font-weight: 700;
          line-height: 1.05;
          color: var(--text);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .about-headline.visible { opacity: 1; transform: translateY(0); }

        .about-headline em {
          font-style: italic;
          color: var(--gold);
        }

        .about-desc-col {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
        }
        .about-desc-col.visible { opacity: 1; transform: translateY(0); }

        .about-desc {
          font-family: 'DM Mono', monospace;
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.85;
          color: var(--text-dim);
          margin-bottom: 28px;
        }

        .about-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          color: var(--gold);
          letter-spacing: 0.04em;
          padding-left: 16px;
          border-left: 1px solid var(--gold-line);
        }

        /* Stats row */
        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border);
          margin-bottom: 72px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
        }
        .about-stats.visible { opacity: 1; transform: translateY(0); }

        .about-stat {
          padding: 28px 32px;
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }
        .about-stat:last-child { border-right: none; }
        .about-stat:hover { background: rgba(200,169,110,0.04); }

        .about-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 600;
          color: var(--text);
          line-height: 1;
          margin-bottom: 8px;
        }

        .about-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* Pillars grid */
        .about-pillars-label {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
          opacity: 0;
          transition: opacity 0.5s ease 0.4s;
        }
        .about-pillars-label.visible { opacity: 1; }

        .about-pillars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
        }

        .about-pillar {
          background: var(--bg);
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: background 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
        }

        .about-pillar.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-pillar:hover { background: #0f0f12; }

        .about-pillar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .about-pillar:hover::before { transform: scaleX(1); }

        .about-pillar-symbol {
          font-size: 22px;
          color: var(--gold);
          margin-bottom: 20px;
          display: block;
          opacity: 0.8;
        }

        .about-pillar-num {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.25em;
          color: var(--text-muted);
          margin-bottom: 10px;
          display: block;
        }

        .about-pillar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .about-pillar-desc {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--text-muted);
        }
      `}</style>

      <section id="about" className="about-section" ref={sectionRef} onMouseMove={handleMouseMove}>
        <div className="about-bg-grid" />
        <div className="about-bg-orb" />

        <div className="about-inner">

          {/* Eyebrow */}
          <div className={`about-eyebrow ${inView ? "visible" : ""}`}>
            <div className="about-eyebrow-line" />
            <span className="about-eyebrow-text">About Infinaut</span>
          </div>

          {/* Split headline + description */}
          <div className="about-header">
            <h2 className={`about-headline ${inView ? "visible" : ""}`}>
              We Build<br />
              <em>Intelligent</em><br />
              Ecosystems.
            </h2>

            <div className={`about-desc-col ${inView ? "visible" : ""}`}>
              <p className="about-desc">
                Infinaut is a modern Creative, Development, and AI Digital
                Solutions Agency — operating at the intersection of design,
                technology, and intelligence.
              </p>
              <p className="about-desc">
                We don't just deliver projects. We build strategic digital
                ecosystems — partnering with businesses ready to grow beyond
                conventional digital presence.
              </p>
              <p className="about-tagline">
                Creative intelligence meets engineering precision.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={`about-stats ${inView ? "visible" : ""}`}>
            {stats.map((s) => (
              <div className="about-stat" key={s.label}>
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pillars */}
          <div className={`about-pillars-label ${inView ? "visible" : ""}`}>
            Our Intersection
          </div>

          <div className="about-pillars">
            {pillars.map((p, i) => (
              <div
                key={p.label}
                className={`about-pillar ${inView ? "visible" : ""}`}
                style={{ transition: `opacity 0.6s ease ${0.45 + i * 0.1}s, transform 0.6s ease ${0.45 + i * 0.1}s, background 0.3s ease` }}
              >
                <span className="about-pillar-symbol">{p.symbol}</span>
                <span className="about-pillar-num">{p.label}</span>
                <div className="about-pillar-title">{p.title}</div>
                <p className="about-pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>

        </div>
        
      </section>
    </>
  );
}

export default About;