import { useState, useEffect, useRef } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { label: "About",    href: "about"    },
    { label: "Services", href: "services" },
    { label: "Process",  href: "process"  },
    { label: "Contact",  href: "contact"  },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --nav-height: 72px;
          --accent: #c8a96e;
          --accent-glow: rgba(200,169,110,0.35);
          --text-muted: rgba(255,255,255,0.45);
          --text-dim: rgba(255,255,255,0.7);
        }

        /* ── Nav shell ── */
        .inf-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          height: var(--nav-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          background: rgba(6,6,8,0.72);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transform: translateY(-100%);
          opacity: 0;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease;
        }
        .inf-nav.mounted { transform: translateY(0); opacity: 1; }

        .inf-nav::after {
          content: '';
          position: absolute;
          bottom: -1px; left: -100%; right: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          animation: navScan 3.5s cubic-bezier(0.4,0,0.2,1) 0.8s forwards;
        }
        @keyframes navScan {
          0%   { left: -100%; right: 100%; opacity: 1; }
          50%  { left: 0%;    right: 0%;  opacity: 1; }
          100% { left: 100%;  right: -100%; opacity: 0; }
        }

        /* ── Logo ── */
        .inf-logo {
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; text-decoration: none;
          opacity: 0; transform: translateX(-16px);
          transition: opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s;
          z-index: 201;
        }
        .inf-logo.mounted { opacity: 1; transform: translateX(0); }

        .inf-logo-mark { width: 28px; height: 28px; flex-shrink: 0; }

        .inf-logo:hover .inf-logo-hex-outer {
          animation: hexSpin 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .inf-logo:hover .inf-logo-hex-inner {
          animation: hexSpinReverse 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes hexSpin        { to { transform: rotate(60deg);  transform-origin: 14px 14px; } }
        @keyframes hexSpinReverse { to { transform: rotate(-60deg); transform-origin: 14px 14px; } }

        .inf-logo-core {
          animation: corePulse 2.4s ease-in-out infinite;
          transform-origin: 14px 14px;
        }
        @keyframes corePulse {
          0%, 100% { r: 2.5; opacity: 0.9; }
          50%       { r: 3.5; opacity: 0.6; }
        }

        .inf-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 700;
          letter-spacing: 0.22em; color: #fff; line-height: 1;
        }

        .inf-logo-sub {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px; font-weight: 300;
          letter-spacing: 0.3em; color: var(--accent);
          text-transform: uppercase; display: block; margin-top: 3px;
          overflow: hidden; max-width: 0; white-space: nowrap;
          transition: max-width 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s;
        }
        .inf-logo.mounted .inf-logo-sub { max-width: 160px; }

        /* ── Desktop links ── */
        .inf-links {
          display: flex; align-items: center; gap: 36px;
          list-style: none; margin: 0; padding: 0;
        }

        .inf-link {
          position: relative;
          font-family: 'DM Mono', monospace;
          font-size: 11.5px; font-weight: 400;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-dim); cursor: pointer;
          transition: color 0.25s ease;
          padding: 4px 0;
          opacity: 0; transform: translateY(-10px);
        }
        .inf-link.mounted {
          opacity: 1; transform: translateY(0);
          transition:
            opacity 0.5s ease var(--delay, 0.4s),
            transform 0.5s cubic-bezier(0.16,1,0.3,1) var(--delay, 0.4s),
            color 0.25s ease;
        }
        .inf-link::after {
          content: '';
          position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px; background: var(--accent);
          transition: width 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        .inf-link:hover { color: #fff; }
        .inf-link:hover::after, .inf-link.active::after { width: 100%; }
        .inf-link.active { color: #fff; }

        .inf-link-dot {
          position: absolute;
          top: -18px; left: 50%;
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--accent);
          opacity: 0;
          transform: translateX(-50%) translateY(6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .inf-link:hover .inf-link-dot {
          opacity: 1; transform: translateX(-50%) translateY(0);
        }

        /* ── Desktop CTA ── */
        .inf-cta-wrap {
          opacity: 0; transform: translateX(16px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }
        .inf-cta-wrap.mounted { opacity: 1; transform: translateX(0); }

        .inf-cta {
          position: relative;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #000; background: var(--accent);
          border: none; padding: 11px 22px;
          cursor: pointer; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .inf-cta::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.55s ease;
        }
        .inf-cta:hover::before { transform: translateX(100%); }
        .inf-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 24px var(--accent-glow); }
        .inf-cta:active { transform: translateY(0); }
        .inf-cta::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
          transform: translateX(-100%);
          animation: idleShimmer 4s ease 2s infinite;
        }
        @keyframes idleShimmer {
          0%, 60%, 100% { transform: translateX(-100%); }
          30%            { transform: translateX(100%);  }
        }
        .inf-cta-arrow {
          display: inline-block; margin-left: 6px;
          transition: transform 0.2s ease;
        }
        .inf-cta:hover .inf-cta-arrow { transform: translateX(4px); }

        /* ── Hamburger button ── */
        .inf-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px; height: 40px;
          background: none; border: none;
          cursor: pointer; z-index: 201;
          padding: 4px;
        }

        .inf-hamburger-bar {
          width: 24px; height: 1px;
          background: #fff;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.25s ease,
                      width 0.3s ease;
          transform-origin: center;
        }

        /* X state */
        .inf-hamburger.open .inf-hamburger-bar:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .inf-hamburger.open .inf-hamburger-bar:nth-child(2) {
          opacity: 0; width: 0;
        }
        .inf-hamburger.open .inf-hamburger-bar:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* ── Mobile drawer ── */
        .inf-mobile-menu {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 199;
          background: rgba(6,6,8,0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          opacity: 0;
          transform: translateY(-12px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .inf-mobile-menu.open {
          opacity: 1; transform: translateY(0);
          pointer-events: all;
        }

        /* Grid texture inside drawer */
        .inf-mobile-menu::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* Corner marks in drawer */
        .inf-mobile-corner {
          position: absolute; width: 32px; height: 32px;
        }
        .inf-mobile-corner.tl { top: 88px; left: 28px; border-top: 1px solid rgba(200,169,110,0.25); border-left: 1px solid rgba(200,169,110,0.25); }
        .inf-mobile-corner.tr { top: 88px; right: 28px; border-top: 1px solid rgba(200,169,110,0.25); border-right: 1px solid rgba(200,169,110,0.25); }
        .inf-mobile-corner.bl { bottom: 28px; left: 28px; border-bottom: 1px solid rgba(200,169,110,0.25); border-left: 1px solid rgba(200,169,110,0.25); }
        .inf-mobile-corner.br { bottom: 28px; right: 28px; border-bottom: 1px solid rgba(200,169,110,0.25); border-right: 1px solid rgba(200,169,110,0.25); }

        /* Mobile nav links */
        .inf-mobile-links {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
          width: 100%; position: relative; z-index: 1;
        }

        .inf-mobile-link {
          width: 100%; text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 8vw, 52px);
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(240,237,232,0.5);
          cursor: pointer;
          padding: 16px 48px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          position: relative; overflow: hidden;
          transition: color 0.25s ease, background 0.25s ease;

          opacity: 0; transform: translateY(20px);
          transition:
            opacity 0.45s ease var(--mob-delay, 0.1s),
            transform 0.45s cubic-bezier(0.16,1,0.3,1) var(--mob-delay, 0.1s),
            color 0.25s ease,
            background 0.25s ease;
        }
        .inf-mobile-menu.open .inf-mobile-link {
          opacity: 1; transform: translateY(0);
        }

        .inf-mobile-link:hover { color: #fff; background: rgba(200,169,110,0.04); }
        .inf-mobile-link.active { color: var(--accent); }

        /* Number label beside mobile link */
        .inf-mobile-link-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 300;
          color: rgba(200,169,110,0.5);
          letter-spacing: 0.2em;
          position: absolute; left: 48px; top: 50%;
          transform: translateY(-50%);
        }

        /* Mobile CTA */
        .inf-mobile-cta-wrap {
          margin-top: 40px;
          position: relative; z-index: 1;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.45s ease 0.45s, transform 0.45s ease 0.45s;
        }
        .inf-mobile-menu.open .inf-mobile-cta-wrap {
          opacity: 1; transform: translateY(0);
        }

        .inf-mobile-cta {
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #000; background: var(--accent);
          border: none; padding: 16px 40px;
          cursor: pointer; overflow: hidden; position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .inf-mobile-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(200,169,110,0.3);
        }

        /* Contact info at bottom of drawer */
        .inf-mobile-footer {
          position: absolute; bottom: 48px; left: 0; right: 0;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          color: rgba(240,237,232,0.25);
          opacity: 0;
          transition: opacity 0.4s ease 0.5s;
        }
        .inf-mobile-menu.open .inf-mobile-footer { opacity: 1; }

        /* ── Responsive breakpoints ── */
        @media (max-width: 768px) {
          .inf-nav { padding: 0 24px; }
          .inf-links { display: none; }
          .inf-cta-wrap { display: none; }
          .inf-hamburger { display: flex; }
          .inf-mobile-menu { display: flex; }
        }

        @media (max-width: 480px) {
          .inf-logo-text { font-size: 18px; }
          .inf-logo-sub { display: none; }
        }

        /* ── Preview shell ── */
        .inf-preview {
          min-height: 100px;
          background: linear-gradient(160deg, #080808 0%, #0d0d10 100%);
          padding-top: var(--nav-height);
        }
      `}</style>

      {/* ── Mobile full-screen drawer ── */}
      <div className={`inf-mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="inf-mobile-corner tl" />
        <div className="inf-mobile-corner tr" />
        <div className="inf-mobile-corner bl" />
        <div className="inf-mobile-corner br" />

        <ul className="inf-mobile-links">
          {links.map((link, i) => (
            <li
              key={link.label}
              className={`inf-mobile-link ${activeLink === i ? "active" : ""}`}
              style={{ "--mob-delay": `${0.1 + i * 0.07}s` }}
              onClick={() => { setActiveLink(i); scrollTo(link.href); }}
            >
              <span className="inf-mobile-link-num">0{i + 1}</span>
              {link.label}
            </li>
          ))}
        </ul>

        <div className="inf-mobile-cta-wrap">
          <button className="inf-mobile-cta" onClick={() => scrollTo("contact")}>
            Start a Conversation →
          </button>
        </div>

        <div className="inf-mobile-footer">
          hello@infinaut.com · www.infinaut.com
        </div>
      </div>

      <div className="inf-preview">
        <nav className={`inf-nav ${mounted ? "mounted" : ""}`}>

          {/* Logo */}
          <div className={`inf-logo ${mounted ? "mounted" : ""}`} onClick={() => scrollTo("hero")}>
            <div className="inf-logo-mark">
              <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon className="inf-logo-hex-outer" points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#c8a96e" strokeWidth="1.2" fill="none" opacity="0.9"/>
                <polygon className="inf-logo-hex-inner" points="14,7 21,11 21,18 14,22 7,18 7,11" stroke="rgba(200,169,110,0.4)" strokeWidth="0.8" fill="none"/>
                <circle className="inf-logo-core" cx="14" cy="14" r="2.5" fill="#c8a96e" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <span className="inf-logo-text">INFINAUT</span>
              <span className="inf-logo-sub">Digital Ecosystems</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <ul className="inf-links">
            {links.map((link, i) => (
              <li
                key={link.label}
                className={`inf-link ${activeLink === i ? "active" : ""} ${mounted ? "mounted" : ""}`}
                style={{ "--delay": `${0.4 + i * 0.07}s` }}
                onClick={() => { setActiveLink(i); scrollTo(link.href); }}
                onMouseEnter={() => setHoveredLink(i)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="inf-link-dot" />
                {link.label}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className={`inf-cta-wrap ${mounted ? "mounted" : ""}`}>
            <button className="inf-cta" onClick={() => scrollTo("contact")}>
              Start a Conversation
              <span className="inf-cta-arrow">→</span>
            </button>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={`inf-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="inf-hamburger-bar" />
            <span className="inf-hamburger-bar" />
            <span className="inf-hamburger-bar" />
          </button>

        </nav>
      </div>
    </>
  );
}

export default Navbar;