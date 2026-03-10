import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.1) {
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

const links = {
  Company: ["About", "Services", "Process", "Insights"],
  Services: ["Branding & Identity", "Web & Product Dev", "AI & Automation", "Growth Strategy", "Digital Infrastructure"],
  Connect: ["hello@infinaut.com", "www.infinaut.com", "LinkedIn", "Twitter / X"],
};

function Footer() {
  const [footerRef, inView] = useInView();
  const [hoveredLink, setHoveredLink] = useState(null);
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --gold: #c8a96e;
          --gold-dim: rgba(200,169,110,0.1);
          --gold-line: rgba(200,169,110,0.25);
          --bg: #060608;
          --text: #f0ede8;
          --text-muted: rgba(240,237,232,0.35);
          --text-dim: rgba(240,237,232,0.6);
          --border: rgba(255,255,255,0.06);
        }

        .footer-root {
          background: var(--bg);
          position: relative;
          overflow: hidden;
          font-family: 'DM Mono', monospace;
          border-top: 1px solid var(--border);
        }

        /* Mouse-tracking orb */
        .footer-orb {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,169,110,0.055) 0%, transparent 68%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: left 1s cubic-bezier(0.2,0,0.2,1), top 1s cubic-bezier(0.2,0,0.2,1);
        }

        /* Grid texture */
        .footer-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.022) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* ── Big wordmark band ── */
        .footer-wordmark-band {
          position: relative;
          overflow: hidden;
          padding: 64px 48px 0;
          z-index: 1;
        }

        .footer-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(72px, 12vw, 148px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(200,169,110,0.2);
          user-select: none;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s ease 0.05s, transform 0.9s ease 0.05s;
          white-space: nowrap;
        }
        .footer-wordmark.visible {
          opacity: 1; transform: translateY(0);
        }

        .footer-wordmark span {
          color: var(--gold);
          -webkit-text-stroke: 0;
        }

        /* ── Main content grid ── */
        .footer-main {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 0;
          border-top: 1px solid var(--border);
          margin-top: 40px;
          position: relative;
          z-index: 1;
        }

        /* Left brand column */
        .footer-brand {
          padding: 52px 48px;
          border-right: 1px solid var(--border);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .footer-brand.visible { opacity: 1; transform: translateY(0); }

        .footer-logo-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px;
        }

        .footer-logo-mark svg { width: 26px; height: 26px; }

        .footer-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 700;
          letter-spacing: 0.2em; color: var(--text);
        }

        .footer-brand-desc {
          font-size: 11.5px; font-weight: 300;
          line-height: 1.85; color: var(--text-muted);
          margin-bottom: 32px;
          max-width: 240px;
        }

        .footer-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 14px;
          color: var(--gold);
          padding-left: 14px;
          border-left: 1px solid var(--gold-line);
          line-height: 1.5;
        }

        /* Link columns */
        .footer-col {
          padding: 52px 36px;
          border-right: 1px solid var(--border);
          opacity: 0;
          transform: translateY(20px);
        }
        .footer-col:last-child { border-right: none; }
        .footer-col.visible { opacity: 1; transform: translateY(0); }

        .footer-col-heading {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 10px;
        }
        .footer-col-heading::after {
          content: ''; flex: 1; height: 1px;
          background: var(--gold-line);
        }

        .footer-col-links {
          display: flex; flex-direction: column; gap: 14px;
          list-style: none; margin: 0; padding: 0;
        }

        .footer-link-item {
          font-size: 11.5px; font-weight: 300;
          color: var(--text-muted);
          cursor: pointer;
          position: relative;
          padding-left: 0;
          transition: color 0.25s ease, padding-left 0.25s ease;
          width: fit-content;
        }

        .footer-link-item::before {
          content: '→';
          position: absolute;
          left: -18px;
          opacity: 0;
          color: var(--gold);
          font-size: 10px;
          transition: opacity 0.2s ease, left 0.2s ease;
        }

        .footer-link-item:hover {
          color: var(--text);
          padding-left: 18px;
        }
        .footer-link-item:hover::before {
          opacity: 1; left: 0;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 48px;
          position: relative;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.7s ease 0.6s;
        }
        .footer-bottom.visible { opacity: 1; }

        .footer-copy {
          font-size: 10px; font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--text-muted);
        }
        .footer-copy strong { color: var(--gold); font-weight: 400; }

        .footer-bottom-right {
          display: flex; align-items: center; gap: 24px;
        }

        .footer-bottom-link {
          font-size: 9.5px; letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .footer-bottom-link:hover { color: var(--gold); }

        .footer-dot {
          width: 3px; height: 3px;
          background: var(--border);
          border-radius: 50%;
        }

        /* Scroll-to-top button */
        .footer-top-btn {
          width: 36px; height: 36px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-size: 14px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        .footer-top-btn:hover {
          border-color: var(--gold-line);
          color: var(--gold);
          background: var(--gold-dim);
          transform: translateY(-2px);
        }

        /* Animated divider */
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold-line), transparent);
          transform: scaleX(0);
          transition: transform 1.2s ease 0.3s;
          position: relative; z-index: 1;
        }
        .footer-divider.visible { transform: scaleX(1); }
      `}</style>

      <footer className="footer-root" ref={footerRef} onMouseMove={handleMouseMove}>
        <div className="footer-grid" />
        <div
          className="footer-orb"
          ref={innerRef}
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />

        {/* Giant ghost wordmark */}
        <div className="footer-wordmark-band">
          <div className={`footer-wordmark ${inView ? "visible" : ""}`}>
            INFIN<span>∞</span>UT
          </div>
        </div>

        <div className={`footer-divider ${inView ? "visible" : ""}`} />

        {/* Main grid */}
        <div className="footer-main">

          {/* Brand col */}
          <div className={`footer-brand ${inView ? "visible" : ""}`}>
            <div className="footer-logo-row">
              <div className="footer-logo-mark">
                <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#c8a96e" strokeWidth="1.2" fill="none" opacity="0.9"/>
                  <polygon points="14,7 21,11 21,18 14,22 7,18 7,11" stroke="rgba(200,169,110,0.4)" strokeWidth="0.8" fill="none"/>
                  <circle cx="14" cy="14" r="2.5" fill="#c8a96e" opacity="0.9"/>
                </svg>
              </div>
              <span className="footer-logo-text">INFINAUT</span>
            </div>

            <p className="footer-brand-desc">
              A modern Creative, Development & AI Digital Solutions Agency —
              operating at the intersection of design, technology, and intelligence.
            </p>

            <p className="footer-tagline">
              Building Digital Ecosystems<br />That Drive Intelligent Growth.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items], i) => (
            <div
              key={heading}
              className={`footer-col ${inView ? "visible" : ""}`}
              style={{ transition: `opacity 0.7s ease ${0.3 + i * 0.1}s, transform 0.7s ease ${0.3 + i * 0.1}s` }}
            >
              <div className="footer-col-heading">{heading}</div>
              <ul className="footer-col-links">
                {items.map((item) => (
                  <li
                    key={item}
                    className="footer-link-item"
                    onMouseEnter={() => setHoveredLink(item)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={`footer-bottom ${inView ? "visible" : ""}`}>
          <p className="footer-copy">
            © 2026 <strong>Infinaut</strong>. All Rights Reserved.
          </p>

          <div className="footer-bottom-right">
            <span className="footer-bottom-link">Privacy</span>
            <div className="footer-dot" />
            <span className="footer-bottom-link">Terms</span>
            <div className="footer-dot" />
            <button
              className="footer-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              title="Back to top"
            >
              ↑
            </button>
          </div>
        </div>

      </footer>
    </>
  );
}

export default Footer;