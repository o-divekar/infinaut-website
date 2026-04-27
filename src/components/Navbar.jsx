import { useState, useEffect } from "react";

const LOGO_SVG = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTkwLjk2IDY1NC4yNiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNhNmE4YWI7fS5jbHMtMntmaWxsOiNiYmJkYmY7fS5jbHMtM3tmaWxsOiNlNmU3ZTg7fS5jbHMtNHtmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE5Ni42Niw1NjIuN3MtNzAtMTM0LjQ1LDMuODYtMTk4LjczQzIwMC41MiwzNjQsNTEuMzEsNDEzLjA3LDE5Ni42Niw1NjIuN1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik00MTkuODksOTRzNDMuNDgsNTIuMTUtLjk0LDk2LjUzQzQxOSwxOTAuNDgsNTE5LDE2Ny44LDQxOS44OSw5NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yMDYuMjQsOTAuNTJTMTczLDkyLjU0LDE2OC42Nyw5N3MyMy40MSwxOC41NiwyMy40MSwxOC41NlMxODYuNjYsMTAxLDIwNi4yNCw5MC41MloiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0xMzQuMTcsNDYwLjJzLTIxLTEwNy45MSwxNjYuNjMtMTA4LjUybDEwOC42Ny02MC42MlM0OTYuNjMsMjY5Ljg0LDQ2MiwxNDEuMzFjMCwwLDUuNDQsNTAtODguMjksNTUuMTcsMCwwLTQ4LjQ1LDUuNDYtNTcuMDUsMTEuNTJzLTExNi4zNyw2Ni42OS0xMTYuMzcsNjYuNjlTMTA5LjcyLDMxNC4xLDEzNC4xNyw0NjAuMloiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik00MTMuOCw1NTguNzRzNDYuMy05Ny4wOS0xMDMuOTItMTk3LjIxTDE4OS40LDI3MS4xOXMtNzktNDYuMTctMzYuNzQtMTM1LjVsMTUuODEtMzguNTFzMTcxLDkyLjI1LDI1OC40MywyMTIuOTNDNDI2LjksMzEwLjExLDUzMi4zOSw0MjAuODEsNDEzLjgsNTU4Ljc0WiIvPjxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTU5MSwyNTMuM2EyNS40MSwyNS40MSwwLDAsMSwwLTM3LjJxOC4xLTcuNDgsMjEtNy41dDIxLDcuMmEyMy4wOSwyMy4wOSwwLDAsMSw4LjEsMTgsMjUuNDcsMjUuNDcsMCwwLDEtOC4xLDE5LjM1cS04LjEsNy42NS0yMSw3LjY1VDU5MSwyNTMuM1ptLTIuNCwzMGg0Ni44VjQ0NC43aC00Ni44WiIvPjxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTgyNS40NCwyOTguOXExOC40NSwxOCwxOC40NSw1My40djkyLjRoLTQ2LjhWMzU5LjVxMC0xOS4xOS04LjQtMjguNjV0LTI0LjMtOS40NXEtMTcuNywwLTI4LjIsMTF0LTEwLjUsMzIuNTV2NzkuOGgtNDYuOFYyODMuM2g0NC43djE4LjlhNjIuMyw2Mi4zLDAsMCwxLDIzLjEtMTUuNzVBODAuNDgsODAuNDgsMCwwLDEsNzc3LDI4MC45UTgwNywyODAuOSw4MjUuNDQsMjk4LjlaIi8+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNOTM3LjQ5LDI4Ni45aDQxLjR2MzZoLTQwLjJWNDQ0LjdoLTQ2LjhWMzIyLjlIODY3di0zNmgyNC45di03LjJxMC0yNy42LDE2LjM1LTQzLjh0NDYtMTYuMmE4NS44OSw4NS44OSwwLDAsMSwyMCwyLjI1QTQ4LjQ5LDQ4LjQ5LDAsMCwxLDk5MCwyMjguNGwtMTIuMywzMy45YTMyLDMyLDAsMCwwLTE4LjktNS43cS0yMS4zLDAtMjEuMywyMy40Wm05MS4yLTMzLjZhMjUuNDEsMjUuNDEsMCwwLDEsMC0zNy4ycTguMS03LjQ4LDIxLTcuNXQyMSw3LjJhMjMuMDksMjMuMDksMCwwLDEsOC4xLDE4LDI1LjQ3LDI1LjQ3LDAsMCwxLTguMSwxOS4zNXEtOC4xLDcuNjUtMjEsNy42NVQxMDI4LjY5LDI1My4zWm0tMi40LDMwaDQ2LjhWNDQ0LjdoLTQ2LjhaIi8+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTI2My4xNCwyOTguOXExOC40NSwxOCwxOC40NSw1My40djkyLjRoLTQ2LjhWMzU5LjVxMC0xOS4xOS04LjQtMjguNjV0LTI0LjMtOS40NXEtMTcuNzEsMC0yOC4yLDExdC0xMC41LDMyLjU1djc5LjhoLTQ2LjhWMjgzLjNoNDQuN3YxOC45YTYyLjE0LDYyLjE0LDAsMCwxLDIzLjEtMTUuNzUsODAuNDEsODAuNDEsMCwwLDEsMzAuMy01LjU1UTEyNDQuNjgsMjgwLjksMTI2My4xNCwyOTguOVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xNDQ2LjU4LDI5OC43NXEyMC4xLDE3Ljg1LDIwLjEsNTMuODV2OTIuMWgtNDMuOFY0MjQuNnEtMTMuMiwyMi41LTQ5LjIsMjIuNS0xOC42LDAtMzIuMjUtNi4zdC0yMC44NS0xNy40YTQ1LjI2LDQ1LjI2LDAsMCwxLTcuMi0yNS4ycTAtMjIuNSwxNi45NS0zNS40dDUyLjM1LTEyLjloMzcuMnEwLTE1LjMtOS4zLTIzLjU1dC0yNy45LTguMjVhODEuNDYsODEuNDYsMCwwLDAtMjUuMzUsNCw2Ny4wNyw2Ny4wNywwLDAsMC0yMS4xNSwxMWwtMTYuOC0zMi43cTEzLjItOS4yOCwzMS42NS0xNC40YTE0MS43OCwxNDEuNzgsMCwwLDEsMzgtNS4xUTE0MjYuNDgsMjgwLjksMTQ0Ni41OCwyOTguNzVabS0zOS45LDExMS4zYTMwLjM3LDMwLjM3LDAsMCwwLDEzLjItMTYuMzVWMzc3LjJoLTMyLjFxLTI4LjgsMC0yOC44LDE4LjlhMTYuODIsMTYuODIsMCwwLDAsNywxNC4yNXE3LDUuMjUsMTkuMzUsNS4yNUE0MC43Niw0MC43NiwwLDAsMCwxNDA2LjY4LDQxMC4wNVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xNjcxLjU4LDI4My4zVjQ0NC43aC00NC40VjQyNS41YTYyLjA3LDYyLjA3LDAsMCwxLTIyLjIsMTYuMDUsNjkuODQsNjkuODQsMCwwLDEtMjcuOSw1LjU1cS0zMS44LDAtNTAuNC0xOC4zdC0xOC42LTU0LjNWMjgzLjNoNDYuOHY4NC4zcTAsMzksMzIuNywzOSwxNi44LDAsMjctMTF0MTAuMi0zMi41NVYyODMuM1oiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xODE5LjE4LDQzNi45YTQ3Ljc1LDQ3Ljc1LDAsMCwxLTE3LDcuNjUsODUuNyw4NS43LDAsMCwxLTIxLjE1LDIuNTVxLTI4LjgsMC00NC41NS0xNC43dC0xNS43NS00My4yVjMyMi45aC0yNC45di0zNmgyNC45VjI0Ny42aDQ2Ljh2MzkuM2g0MC4ydjM2aC00MC4ydjY1LjdxMCwxMC4yLDUuMjUsMTUuNzV0MTQuODUsNS41NXExMS4xLDAsMTguOS02WiIvPjwvc3ZnPg==";

function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [activeLink, setActiveLink]   = useState(null);
  const [mounted, setMounted]         = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --nav-height: 72px;
          --pu:         #7c3aed;
          --pu-bright:  #a855f7;
          --pu-dim:     rgba(124,58,237,0.15);
          --pu-line:    rgba(168,85,247,0.3);
          --pu-glow:    rgba(124,58,237,0.45);
          --text-muted: rgba(240,238,255,0.42);
          --text-dim:   rgba(240,238,255,0.68);
        }

        /* ─── Nav shell ─── */
        .inf-nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 200; height: var(--nav-height);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 44px;
          background: rgba(2,0,10,0.78);
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border-bottom: 1px solid rgba(124,58,237,0.11);
          transform: translateY(-100%); opacity: 0;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease;
        }
        .inf-nav.mounted { transform: translateY(0); opacity: 1; }
        .inf-nav::after {
          content: ''; position: absolute;
          bottom: -1px; left: -100%; right: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--pu-bright), var(--pu), transparent);
          animation: navScan 3.5s cubic-bezier(0.4,0,0.2,1) 0.8s forwards;
        }
        @keyframes navScan {
          0%   { left:-100%; right:100%; opacity:1; }
          50%  { left:0%;    right:0%;  opacity:1; }
          100% { left:100%;  right:-100%; opacity:0; }
        }
        .inf-nav.scrolled {
          background: rgba(2,0,10,0.93);
          border-bottom-color: rgba(124,58,237,0.18);
          box-shadow: 0 4px 32px rgba(0,0,0,0.5);
        }

        /* ═══════════════════════════════
           LOGO LOCKUP
        ═══════════════════════════════ */
        .inf-logo {
          display: flex; align-items: center; gap: 11px;
          cursor: pointer; position: relative;
          opacity: 0; transform: translateX(-16px);
          transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
          z-index: 201; text-decoration: none;
          user-select: none;
        }
        .inf-logo.mounted { opacity: 1; transform: translateX(0); }

        /* ── Icon mark ── */
        .inf-icon-wrap {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          /* gentle idle glow */
          animation: iconBreath 4s ease-in-out infinite;
        }
        @keyframes iconBreath {
          0%,100% { filter: brightness(0.88) drop-shadow(0 0 0px rgba(168,85,247,0)); }
          50%      { filter: brightness(1.04) drop-shadow(0 0 7px rgba(168,85,247,0.22)); }
        }

        .inf-icon {
          /* SVG has white fills and dark bg — use mix-blend-mode so black bg disappears on dark navbar */
          height: 38px; width: auto; display: block;
          mix-blend-mode: screen;
          position: relative; z-index: 1;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* hover: icon lifts */
        .inf-logo:hover .inf-icon {
          transform: translateY(-1px) scale(1.04);
        }

        /* hover: stronger glow on wrap */
        .inf-logo:hover .inf-icon-wrap {
          animation: none;
          filter: brightness(1.1) drop-shadow(0 0 14px rgba(168,85,247,0.45));
        }

        /* ── Wordmark ── */
        .inf-wordmark {
          font-family: 'Inter', sans-serif;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: lowercase;
          line-height: 1;
          /* white with a barely-there purple blush */
          color: rgba(255,255,255,0.92);
          transition: color 0.25s ease, letter-spacing 0.3s ease;
          white-space: nowrap;
        }

        .inf-logo:hover .inf-wordmark {
          color: #fff;
          letter-spacing: 0.11em;
        }

        /* ── Desktop links ── */
        .inf-links {
          display: flex; align-items: center; gap: 36px;
          list-style: none; margin: 0; padding: 0;
        }
        .inf-link {
          position: relative;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
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
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, var(--pu), var(--pu-bright));
          transition: width 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        .inf-link:hover { color: #fff; }
        .inf-link:hover::after, .inf-link.active::after { width: 100%; }
        .inf-link.active { color: #fff; }
        .inf-link-dot {
          position: absolute; top: -18px; left: 50%;
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--pu-bright);
          box-shadow: 0 0 6px rgba(168,85,247,0.8);
          opacity: 0; transform: translateX(-50%) translateY(6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }
        .inf-link:hover .inf-link-dot { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* ── Desktop CTA ── */
        .inf-cta-wrap {
          opacity: 0; transform: translateX(16px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }
        .inf-cta-wrap.mounted { opacity: 1; transform: translateX(0); }
        .inf-cta {
          position: relative; overflow: hidden;
          font-family: 'Inter', sans-serif;
          font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, var(--pu) 0%, var(--pu-bright) 100%);
          border: none; border-radius: 8px;
          padding: 11px 22px; cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .inf-cta::before {
          content: ''; position: absolute; inset: 0; border-radius: 8px;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.55s ease;
        }
        .inf-cta:hover::before { transform: translateX(100%); }
        .inf-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 28px var(--pu-glow); }
        .inf-cta:active { transform: translateY(0); }
        .inf-cta::after {
          content: ''; position: absolute; inset: 0; border-radius: 8px;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.13) 50%, transparent 65%);
          transform: translateX(-100%);
          animation: idleShimmer 4s ease 2s infinite;
        }
        @keyframes idleShimmer {
          0%,60%,100% { transform: translateX(-100%); }
          30%          { transform: translateX(100%); }
        }
        .inf-cta-arrow { display: inline-block; margin-left: 6px; transition: transform 0.2s ease; }
        .inf-cta:hover .inf-cta-arrow { transform: translateX(4px); }

        /* ── Hamburger ── */
        .inf-hamburger {
          display: none; flex-direction: column;
          justify-content: center; align-items: center; gap: 5px;
          width: 40px; height: 40px;
          background: none; border: none; cursor: pointer; z-index: 201; padding: 4px;
        }
        .inf-hamburger-bar {
          width: 24px; height: 1.5px; background: #fff; border-radius: 2px;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, width 0.3s ease;
          transform-origin: center;
        }
        .inf-hamburger.open .inf-hamburger-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .inf-hamburger.open .inf-hamburger-bar:nth-child(2) { opacity: 0; width: 0; }
        .inf-hamburger.open .inf-hamburger-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .inf-mobile-menu {
          display: none; position: fixed;
          top: 0; left: 0; right: 0; bottom: 0; z-index: 199;
          background: rgba(2,0,10,0.97);
          backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; transform: translateY(-14px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .inf-mobile-menu.open { opacity: 1; transform: translateY(0); pointer-events: all; }
        .inf-mobile-menu::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px);
          background-size: 64px 64px; pointer-events: none;
        }

        /* Mobile logo lockup */
        .inf-mobile-logo-wrap {
          position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 9px;
          opacity: 0; transition: opacity 0.4s ease 0.15s;
          white-space: nowrap;
        }
        .inf-mobile-menu.open .inf-mobile-logo-wrap { opacity: 1; }
        .inf-mobile-logo-icon {
          height: 28px; width: auto; mix-blend-mode: screen;
          filter: drop-shadow(0 0 8px rgba(168,85,247,0.35));
        }
        .inf-mobile-logo-text {
          font-family: 'Inter', sans-serif; font-size: 17px; font-weight: 700;
          letter-spacing: 0.09em; text-transform: lowercase;
          color: rgba(255,255,255,0.9);
        }

        .inf-mobile-corner { position: absolute; width: 32px; height: 32px; }
        .inf-mobile-corner.tl { top:80px; left:28px; border-top:1px solid var(--pu-line); border-left:1px solid var(--pu-line); }
        .inf-mobile-corner.tr { top:80px; right:28px; border-top:1px solid var(--pu-line); border-right:1px solid var(--pu-line); }
        .inf-mobile-corner.bl { bottom:28px; left:28px; border-bottom:1px solid var(--pu-line); border-left:1px solid var(--pu-line); }
        .inf-mobile-corner.br { bottom:28px; right:28px; border-bottom:1px solid var(--pu-line); border-right:1px solid var(--pu-line); }

        .inf-mobile-links {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; align-items: center;
          width: 100%; position: relative; z-index: 1;
        }
        .inf-mobile-link {
          width: 100%; text-align: center;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(32px, 7.5vw, 48px); font-weight: 700;
          letter-spacing: 0.04em; color: rgba(240,238,255,0.45);
          cursor: pointer; padding: 14px 48px;
          border-bottom: 1px solid rgba(124,58,237,0.08);
          position: relative; overflow: hidden;
          opacity: 0; transform: translateY(20px);
          transition:
            opacity 0.45s ease var(--mob-delay, 0.1s),
            transform 0.45s cubic-bezier(0.16,1,0.3,1) var(--mob-delay, 0.1s),
            color 0.25s ease, background 0.25s ease;
        }
        .inf-mobile-menu.open .inf-mobile-link { opacity: 1; transform: translateY(0); }
        .inf-mobile-link:hover { color: #fff; background: rgba(124,58,237,0.06); }
        .inf-mobile-link.active { color: var(--pu-bright); }
        .inf-mobile-link-num {
          font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 400;
          color: rgba(168,85,247,0.5); letter-spacing: 0.2em;
          position: absolute; left: 48px; top: 50%; transform: translateY(-50%);
        }

        .inf-mobile-cta-wrap {
          margin-top: 36px; position: relative; z-index: 1;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.45s ease 0.45s, transform 0.45s ease 0.45s;
        }
        .inf-mobile-menu.open .inf-mobile-cta-wrap { opacity: 1; transform: translateY(0); }
        .inf-mobile-cta {
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase; color: #fff;
          background: linear-gradient(135deg, var(--pu), var(--pu-bright));
          border: none; border-radius: 8px; padding: 16px 40px;
          cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .inf-mobile-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px var(--pu-glow); }

        .inf-mobile-footer {
          position: absolute; bottom: 44px; left: 0; right: 0; text-align: center;
          font-family: 'Inter', sans-serif; font-size: 10px;
          letter-spacing: 0.2em; color: rgba(240,238,255,0.22);
          opacity: 0; transition: opacity 0.4s ease 0.5s;
        }
        .inf-mobile-menu.open .inf-mobile-footer { opacity: 1; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .inf-nav { padding: 0 24px; }
          .inf-links { display: none; }
          .inf-cta-wrap { display: none; }
          .inf-hamburger { display: flex; }
          .inf-mobile-menu { display: flex; }
        }
        @media (max-width: 480px) {
          .inf-icon { height: 30px; }
          .inf-wordmark { font-size: 16px; }
        }
      `}</style>

      {/* ── Mobile drawer ── */}
      <div className={`inf-mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="inf-mobile-logo-wrap">
          <img src={LOGO_SVG} alt="" className="inf-mobile-logo-icon" />
          <span className="inf-mobile-logo-text">infinaut</span>
        </div>
        <div className="inf-mobile-corner tl" />
        <div className="inf-mobile-corner tr" />
        <div className="inf-mobile-corner bl" />
        <div className="inf-mobile-corner br" />
        <ul className="inf-mobile-links">
          {links.map((link, i) => (
            <li key={link.label}
              className={`inf-mobile-link ${activeLink === i ? "active" : ""}`}
              style={{ "--mob-delay": `${0.1 + i * 0.07}s` }}
              onClick={() => { setActiveLink(i); scrollTo(link.href); }}>
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
          teaminfinaut@gmail.com · www.infinaut.com
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className={`inf-nav ${mounted ? "mounted" : ""} ${scrolled ? "scrolled" : ""}`}>

        {/* Logo lockup */}
        <div
          className={`inf-logo ${mounted ? "mounted" : ""}`}
          onClick={() => scrollTo("hero")}
        >
          <div className="inf-icon-wrap">
            <img src={LOGO_SVG} alt="Infinaut" className="inf-icon" />
          </div>
  
        </div>

        {/* Desktop links */}
        <ul className="inf-links">
          {links.map((link, i) => (
            <li key={link.label}
              className={`inf-link ${activeLink === i ? "active" : ""} ${mounted ? "mounted" : ""}`}
              style={{ "--delay": `${0.4 + i * 0.07}s` }}
              onClick={() => { setActiveLink(i); scrollTo(link.href); }}
              onMouseEnter={() => setHoveredLink(i)}
              onMouseLeave={() => setHoveredLink(null)}>
              <span className="inf-link-dot" />
              {link.label}
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className={`inf-cta-wrap ${mounted ? "mounted" : ""}`}>
          <button className="inf-cta" onClick={() => scrollTo("contact")}
          aria-label="Start a conversation with our team"
          >
             Start a Conversation
            <span className="inf-cta-arrow">→</span>
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={`inf-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu">
          <span className="inf-hamburger-bar" />
          <span className="inf-hamburger-bar" />
          <span className="inf-hamburger-bar" />
        </button>

      </nav>
    </>
  );
}

export default Navbar;