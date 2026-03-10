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
    sub: "No Unified Strategy",
    body: "Disconnected platforms with no unified digital strategy or infrastructure — every tool an island, every system a silo.",
    stat: "73%",
    statLabel: "of businesses run 3+ disconnected platforms",
  },
  {
    num: "02",
    symbol: "◎",
    title: "Outdated Identity",
    sub: "Brand Misalignment",
    body: "Branding that no longer communicates the company's true value or vision — losing trust before a word is spoken.",
    stat: "2.4×",
    statLabel: "more likely to lose leads with weak brand identity",
  },
  {
    num: "03",
    symbol: "△",
    title: "No AI Integration",
    sub: "Falling Behind",
    body: "Businesses are missing automation and intelligence that competitors already have — the gap widens every quarter.",
    stat: "60%",
    statLabel: "of competitors are already automating key workflows",
  },
  {
    num: "04",
    symbol: "◈",
    title: "Stalled Growth",
    sub: "No Scale System",
    body: "Digital activity without a systematic approach to conversion or scale — effort without compounding return.",
    stat: "∞",
    statLabel: "potential locked inside unscaled digital operations",
  },
];

function Problem() {
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
          --red: #c0392b;
          --red-dim: rgba(192,57,43,0.1);
          --red-line: rgba(192,57,43,0.3);
        }

        .prob-section {
          background: linear-gradient(175deg, var(--bg2) 0%, var(--bg) 55%, #09090c 100%);
          padding: 120px 0 100px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Mono', monospace;
        }

        /* Grid */
        .prob-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.022) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* Danger orb — red tint to signal "problem" */
        .prob-orb {
          position: absolute;
          width: 640px; height: 640px; border-radius: 50%;
          background: radial-gradient(circle,
            rgba(192,57,43,0.055) 0%,
            rgba(200,169,110,0.03) 40%,
            transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: left 1s cubic-bezier(0.2,0,0.2,1), top 1s cubic-bezier(0.2,0,0.2,1);
        }

        /* Static bg orb top-right */
        .prob-orb-static {
          position: absolute; top: -100px; right: -100px;
          width: 480px; height: 480px; border-radius: 50%;
          background: radial-gradient(circle, rgba(192,57,43,0.04) 0%, transparent 68%);
          pointer-events: none;
        }

        /* Corner marks */
        .prob-corner {
          position: absolute; width: 40px; height: 40px;
          pointer-events: none; z-index: 1;
          opacity: 0; transition: opacity 0.8s ease 0.3s;
        }
        .prob-corner.visible { opacity: 1; }
        .prob-corner.tl { top: 40px; left: 40px; border-top: 1px solid var(--red-line); border-left: 1px solid var(--red-line); }
        .prob-corner.br { bottom: 40px; right: 40px; border-bottom: 1px solid var(--red-line); border-right: 1px solid var(--red-line); }

        .prob-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 0 48px;
          position: relative; z-index: 1;
        }

        /* ── Header ── */
        .prob-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: end;
          margin-bottom: 72px;
        }

        .prob-eyebrow {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 28px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .prob-eyebrow.visible { opacity: 1; transform: translateY(0); }

        .prob-eyebrow-line { width: 36px; height: 1px; background: var(--red); }
        .prob-eyebrow-text {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase; color: var(--red);
        }

        .prob-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 700; line-height: 1.06;
          color: var(--text);
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .prob-headline.visible { opacity: 1; transform: translateY(0); }
        .prob-headline em { font-style: italic; color: var(--red); opacity: 0.85; }

        .prob-right-col {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
        }
        .prob-right-col.visible { opacity: 1; transform: translateY(0); }

        .prob-desc {
          font-size: 12.5px; font-weight: 300; line-height: 1.9;
          color: var(--text-dim); margin-bottom: 28px;
        }

        /* Warning callout */
        .prob-warning {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 18px 20px;
          border: 1px solid var(--red-line);
          background: var(--red-dim);
        }

        .prob-warning-icon {
          font-size: 16px; color: var(--red); flex-shrink: 0; margin-top: 1px;
        }

        .prob-warning-text {
          font-size: 11px; font-weight: 300; line-height: 1.75;
          color: rgba(240,237,232,0.55);
        }
        .prob-warning-text strong { color: var(--red); font-weight: 400; }

        /* ── Cards ── */
        .prob-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s;
        }
        .prob-cards.visible { opacity: 1; transform: translateY(0); }

        .prob-card {
          background: var(--bg);
          padding: 36px 28px 32px;
          position: relative; overflow: hidden;
          cursor: default;
          transition: background 0.3s ease;
        }
        .prob-card:hover { background: #0e0e12; }

        /* Top accent bar — slides in on hover */
        .prob-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--red), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.45s ease;
        }
        .prob-card:hover::before,
        .prob-card.active::before { transform: scaleX(1); }
        .prob-card.active { background: #0f0c0c; }

        /* Number */
        .prob-card-num {
          font-size: 9px; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--text-muted);
          margin-bottom: 20px; display: block;
        }

        /* Symbol */
        .prob-card-symbol {
          font-size: 26px; color: var(--red);
          opacity: 0.7; display: block;
          margin-bottom: 20px;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .prob-card:hover .prob-card-symbol { opacity: 1; transform: scale(1.1); }

        /* Title */
        .prob-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; font-weight: 600;
          color: var(--text); line-height: 1.2;
          margin-bottom: 4px;
        }

        .prob-card-sub {
          font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--red);
          opacity: 0.7; margin-bottom: 16px; display: block;
        }

        .prob-card-body {
          font-size: 11px; font-weight: 300;
          line-height: 1.8; color: var(--text-muted);
          margin-bottom: 28px;
        }

        /* Stat */
        .prob-card-stat-block {
          border-top: 1px solid var(--border);
          padding-top: 18px;
          margin-top: auto;
        }

        .prob-card-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px; font-weight: 600;
          color: var(--text); line-height: 1;
          margin-bottom: 6px;
          transition: color 0.25s ease;
        }
        .prob-card:hover .prob-card-stat-value { color: var(--red); }

        .prob-card-stat-label {
          font-size: 9px; font-weight: 300;
          line-height: 1.6; color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* ── Bottom banner ── */
        .prob-banner {
          margin-top: 1px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-top: none;
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          opacity: 0;
          transition: opacity 0.7s ease 0.6s;
        }
        .prob-banner.visible { opacity: 1; }

        .prob-banner-left {
          display: flex; align-items: center; gap: 16px;
        }

        .prob-banner-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--red); opacity: 0.75;
          animation: probPulse 2s ease-in-out infinite;
        }
        @keyframes probPulse {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.7); }
        }

        .prob-banner-text {
          font-size: 10.5px; font-weight: 300;
          letter-spacing: 0.1em; color: var(--text-muted);
        }
        .prob-banner-text strong { color: var(--text); font-weight: 400; }

        .prob-banner-cta {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); background: none; border: none;
          cursor: pointer; padding: 0;
          position: relative;
          transition: opacity 0.2s ease;
        }
        .prob-banner-cta::after {
          content: '';
          position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: var(--gold);
          transition: width 0.3s ease;
        }
        .prob-banner-cta:hover::after { width: 100%; }
      `}</style>

      <section
        className="prob-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        <div className="prob-grid-bg" />
        <div className="prob-orb-static" />
        <div
          className="prob-orb"
          ref={innerRef}
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div className={`prob-corner tl ${inView ? "visible" : ""}`} />
        <div className={`prob-corner br ${inView ? "visible" : ""}`} />

        <div className="prob-inner" ref={innerRef}>

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
                They have a digital presence — but not a digital system.
                Fragmented tools, misaligned branding, and absent AI create
                a widening gap between where they are and where they need to be.
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