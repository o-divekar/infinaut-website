import { useState, useEffect, useRef } from "react";
import SEO from "./SEO";

// Import SVG assets (adjust paths as needed)
import creativeDesignIcon from "../assets/creative-design.svg";
import developmentIcon from "../assets/development.svg";
import aiAutomationIcon from "../assets/ai-automation.svg";
import digitalGrowthIcon from "../assets/digital-growth.svg";
import step1Icon from "../assets/step1.svg";
import step2Icon from "../assets/step2.svg";
import step3Icon from "../assets/step3.svg";
import step4Icon from "../assets/step4.svg";

// Fallback inline SVGs in case imports fail — replace with actual imported paths
const pillars = [
  {
    label: "01",
    title: "Creative Design",
    desc: "Visual identity systems and brand communication built with intention and precision.",
    icon: creativeDesignIcon,
    fallbackSvg: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  },
  {
    label: "02",
    title: "Development",
    desc: "Custom web products and digital infrastructure engineered to perform at scale.",
    icon: developmentIcon,
    fallbackSvg: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l-4 4 4 4M18 6l4 4-4 4M12 2L8 22"/></svg>`,
  },
  {
    label: "03",
    title: "AI & Automation",
    desc: "Intelligent workflows and data systems that help your business operate at a new level.",
    icon: aiAutomationIcon,
    fallbackSvg: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.07.07a8 8 0 0 0 11.66 0z"/></svg>`,
  },
  {
    label: "04",
    title: "Digital Growth",
    desc: "Strategic growth systems — SEO, analytics, and conversion architecture that compound over time.",
    icon: digitalGrowthIcon,
    fallbackSvg: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9"/></svg>`,
  },
];

const stats = [
  { value: "25+", label: "Digital Projects" },
  { value: "15+", label: "Clients & Collaborations" },
  { value: "60%", label: "Workflow Efficiency" },
  { value: "3x", label: "Execution Speed" },
];

const processSteps = [
  {
    step: "01",
    title: "Understand the Business",
    desc: "We analyze your brand, audience, and current digital presence to identify real growth opportunities.",
    icon: step1Icon,
    fallbackSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  },
  {
    step: "02",
    title: "Design the System",
    desc: "We create a structured plan combining design, technology, and workflows tailored to your business.",
    icon: step2Icon,
    fallbackSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>`,
  },
  {
    step: "03",
    title: "Build & Integrate",
    desc: "We develop and implement everything — from brand to platform to automation systems.",
    icon: step3Icon,
    fallbackSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>`,
  },
  {
    step: "04",
    title: "Optimize & Scale",
    desc: "We continuously improve performance, efficiency, and growth over time.",
    icon: step4Icon,
    fallbackSvg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20L8 14M22 20L16 14M12 4V12M12 12L9 9M12 12L15 9"/><circle cx="12" cy="15" r="2"/></svg>`,
  },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Image component with fallback
function PillarIcon({ icon, fallbackSvg, alt }) {
  const [imgError, setImgError] = useState(false);
  
  if (!imgError && icon) {
    return (
      <img 
        src={icon} 
        alt={alt}
        className="pillar-icon-img"
        onError={() => setImgError(true)}
      />
    );
  }
  
  return (
    <div 
      className="pillar-icon-fallback"
      dangerouslySetInnerHTML={{ __html: fallbackSvg }}
    />
  );
}

function StepIcon({ icon, fallbackSvg, alt }) {
  const [imgError, setImgError] = useState(false);
  
  if (!imgError && icon) {
    return (
      <img 
        src={icon} 
        alt={alt}
        className="step-icon-img"
        onError={() => setImgError(true)}
      />
    );
  }
  
  return (
    <div 
      className="step-icon-fallback"
      dangerouslySetInnerHTML={{ __html: fallbackSvg }}
    />
  );
}

function About() {
  const [sectionRef, inView] = useInView();
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        /* ── Purple design system ── */
        .about-section {
          --pu:       #7c3aed;
          --pu-bright:#a855f7;
          --pu-dim:   rgba(124,58,237,0.12);
          --pu-line:  rgba(168,85,247,0.3);
          --pu-glow:  rgba(124,58,237,0.18);
          --bg:       #06000f;
          --bg2:      #0d0020;
          --text:     #f0eeff;
          --text-muted: rgba(240,238,255,0.4);
          --text-dim:   rgba(240,238,255,0.65);
          --border:     rgba(168,85,247,0.12);

          background: linear-gradient(160deg, var(--bg2) 0%, var(--bg) 55%, #0a0118 100%);
          padding: 120px 0 100px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* ── Circuit grid background ── */
        .about-circuit-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* Circuit crosshair decorations */
        .about-crosshair {
          position: absolute; width: 16px; height: 16px;
          pointer-events: none;
        }
        .about-crosshair::before,
        .about-crosshair::after {
          content: ''; position: absolute;
          background: rgba(168,85,247,0.4);
        }
        .about-crosshair::before { width: 1px; height: 100%; left: 50%; top: 0; }
        .about-crosshair::after  { width: 100%; height: 1px; top: 50%; left: 0; }
        .about-crosshair.c1 { top: 80px;  left: 80px;  }
        .about-crosshair.c2 { top: 180px; right: 120px; }
        .about-crosshair.c3 { bottom: 120px; left: 200px; }

        /* Circuit lines */
        .about-circuit-svg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none; opacity: 0.18;
        }

        /* Mouse-tracking purple orb */
        .about-orb {
          position: absolute;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(168,85,247,0.06) 40%, transparent 70%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 1s cubic-bezier(0.2,0,0.2,1), top 1s cubic-bezier(0.2,0,0.2,1);
        }

        /* Static top-right glow */
        .about-orb-static {
          position: absolute; top: -150px; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 65%);
          pointer-events: none;
          animation: orbFloat 6s ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-20px); }
        }

        .about-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 0 48px; position: relative; z-index: 1;
        }

        /* ── Eyebrow ── */
        .about-eyebrow {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 48px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .about-eyebrow.visible { opacity: 1; transform: translateY(0); }

        .about-eyebrow-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(124,58,237,0.15);
          border: 1px solid var(--pu-line, rgba(168,85,247,0.3));
          border-radius: 100px;
          padding: 6px 14px;
        }
        .about-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #a855f7;
          animation: eyebrowPulse 2s ease-in-out infinite;
        }
        @keyframes eyebrowPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.7); }
        }
        .about-eyebrow-text {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #a855f7;
        }

        /* ── Header split ── */
        .about-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: end;
          margin-bottom: 72px;
        }

        .about-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(38px, 5vw, 62px);
          font-weight: 700;
          line-height: 1.08;
          color: var(--text, #f0eeff);
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .about-headline.visible { opacity: 1; transform: translateY(0); }

        .about-headline .hl-purple {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #c084fc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-desc-col {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
        }
        .about-desc-col.visible { opacity: 1; transform: translateY(0); }

        .about-desc {
          font-size: 18px; font-weight: 300; line-height: 1.85;
          color: var(--text-dim, rgba(240,238,255,0.65));
          margin-bottom: 24px;
        }

        .about-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px; font-weight: 500;
          color: #a855f7;
          padding-left: 16px;
          border-left: 2px solid rgba(168,85,247,0.4);
          line-height: 1.6;
        }

        /* ── Stats row ── */
        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border, rgba(168,85,247,0.12));
          margin-bottom: 72px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
          border-radius: 2px;
          overflow: hidden;
        }
        .about-stats.visible { opacity: 1; transform: translateY(0); }

        .about-stat {
          padding: 28px 24px;
          border-right: 1px solid var(--border, rgba(168,85,247,0.12));
          position: relative; overflow: hidden;
          transition: background 0.3s ease;
          cursor: default;
        }
        .about-stat:last-child { border-right: none; }
        .about-stat:hover { background: rgba(124,58,237,0.08); }

        .about-stat::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .about-stat:hover::before { transform: scaleX(1); }

        .about-stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 36px; font-weight: 700;
          background: linear-gradient(135deg, #f0eeff, #a855f7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1; margin-bottom: 8px;
        }

        .about-stat-label {
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted, rgba(240,238,255,0.4));
        }

        /* ── Pillars Section - Our Intersection ── */
        .about-pillars-header {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 24px;
          opacity: 0; transition: opacity 0.5s ease 0.4s;
        }
        .about-pillars-header.visible { opacity: 1; }

        .about-pillars-label {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--text-muted, rgba(240,238,255,0.4));
        }
        .about-pillars-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(124,58,237,0.3), transparent);
        }

        .about-pillars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(124,58,237,0.15);
          border-radius: 2px; overflow: hidden;
          margin-bottom: 80px;
        }

        .about-pillar {
          background: var(--bg, #06000f);
          padding: 32px 24px;
          position: relative; overflow: hidden;
          cursor: default;
          transition: background 0.3s ease;
          opacity: 0; transform: translateY(20px);
        }
        .about-pillar.visible { opacity: 1; transform: translateY(0); }
        .about-pillar:hover { background: #110030; }

        /* Purple glow top bar on hover */
        .about-pillar::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #7c3aed, #a855f7, transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .about-pillar:hover::before { transform: scaleX(1); }

        /* Pillar Icon Styles */
        .pillar-icon-img,
        .pillar-icon-fallback {
          width: 44px;
          height: 44px;
          margin-bottom: 20px;
          display: block;
          transition: all 0.3s ease;
        }
        .pillar-icon-fallback svg {
          width: 44px;
          height: 44px;
          stroke: #a855f7;
          stroke-width: 1.5;
          fill: none;
        }
        .about-pillar:hover .pillar-icon-img {
          transform: scale(1.05);
          filter: drop-shadow(0 0 8px rgba(168,85,247,0.5));
        }
        .about-pillar:hover .pillar-icon-fallback svg {
          stroke: #c084fc;
          filter: drop-shadow(0 0 6px rgba(168,85,247,0.4));
        }

        .about-pillar-num {
          font-size: 9px; letter-spacing: 0.28em;
          color: rgba(168,85,247,0.5);
          margin-bottom: 10px; display: block;
        }

        .about-pillar-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 17px; font-weight: 600;
          color: var(--text, #f0eeff);
          margin-bottom: 12px; line-height: 1.3;
        }

        .about-pillar-desc {
          font-size: 11.5px; font-weight: 300; line-height: 1.75;
          color: var(--text-muted, rgba(240,238,255,0.4));
        }

        /* ── Process Section ── */
        .about-process-header {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 40px;
          opacity: 0; transition: opacity 0.5s ease 0.45s;
        }
        .about-process-header.visible { opacity: 1; }

        .about-process-label {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--text-muted, rgba(240,238,255,0.4));
        }
        .about-process-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(124,58,237,0.3), transparent);
        }

        .about-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .about-process-step {
          background: rgba(124,58,237,0.04);
          border: 1px solid var(--border, rgba(168,85,247,0.12));
          padding: 28px 20px;
          transition: all 0.4s ease;
          opacity: 0; transform: translateY(20px);
          border-radius: 2px;
        }
        .about-process-step.visible { opacity: 1; transform: translateY(0); }
        .about-process-step:hover {
          background: rgba(124,58,237,0.1);
          border-color: rgba(168,85,247,0.3);
          transform: translateY(-4px);
        }

        /* Step Icon Styles */
        .step-icon-img,
        .step-icon-fallback {
          width: 36px;
          height: 36px;
          margin-bottom: 18px;
          display: block;
          transition: all 0.3s ease;
        }
        .step-icon-fallback svg {
          width: 36px;
          height: 36px;
          stroke: #a855f7;
          stroke-width: 1.5;
          fill: none;
        }
        .about-process-step:hover .step-icon-img {
          transform: scale(1.08);
          filter: drop-shadow(0 0 8px rgba(168,85,247,0.5));
        }
        .about-process-step:hover .step-icon-fallback svg {
          stroke: #c084fc;
          filter: drop-shadow(0 0 6px rgba(168,85,247,0.4));
        }

        .about-step-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 17px; font-weight: 600;
          color: var(--text, #f0eeff);
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .about-step-desc {
          font-size: 12px; font-weight: 300;
          line-height: 1.7;
          color: var(--text-muted, rgba(240,238,255,0.5));
        }

        /* Remove step number since we have images now, but keep for layout compatibility */
        .about-step-number {
          display: none;
        }

        /* ── Bottom Quote ── */
        .about-quote {
          margin-top: 72px;
          padding-top: 48px;
          border-top: 1px solid var(--border, rgba(168,85,247,0.12));
          text-align: center;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s;
        }
        .about-quote.visible { opacity: 1; transform: translateY(0); }

        .about-quote-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(18px, 3vw, 24px);
          font-weight: 600;
          color: var(--text-dim, rgba(240,238,255,0.8));
          line-height: 1.4;
          max-width: 800px;
          margin: 0 auto;
        }

        .about-quote-text span {
          background: linear-gradient(135deg, #a855f7, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .about-inner { padding: 0 32px; }
          .about-header { gap: 40px; }
          .about-pillars { grid-template-columns: repeat(2, 1fr); }
          .about-process-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .about-stats { grid-template-columns: repeat(2, 1fr); }
          .about-stats .about-stat:nth-child(2) { border-right: none; }
          .about-stats .about-stat:nth-child(3) { border-top: 1px solid rgba(168,85,247,0.12); }
          .about-stats .about-stat:nth-child(4) { border-top: 1px solid rgba(168,85,247,0.12); border-right: none; }
        }

        @media (max-width: 768px) {
          .about-section { padding: 80px 0 72px; }
          .about-inner { padding: 0 20px; }

          .about-header {
            grid-template-columns: 1fr;
            gap: 28px; margin-bottom: 48px;
          }

          .about-headline { font-size: clamp(32px, 8vw, 44px); }

          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: 48px;
          }

          .about-stat { padding: 20px 16px; }
          .about-stat-value { font-size: 28px; }

          .about-pillars {
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: 56px;
          }
          .about-pillar { padding: 24px 18px; }

          .about-process-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .about-process-step { padding: 20px 16px; }

          .about-quote { margin-top: 48px; padding-top: 32px; }
          .about-quote-text { font-size: 16px; }
        }

        @media (max-width: 480px) {
          .about-section { padding: 64px 0 56px; }
          .about-inner { padding: 0 16px; }

          .about-eyebrow { margin-bottom: 28px; }

          .about-headline { font-size: clamp(28px, 9vw, 38px); }

          .about-stats { grid-template-columns: repeat(2, 1fr); }

          .about-pillars { grid-template-columns: 1fr; }
          .about-process-grid { grid-template-columns: 1fr; }

          .about-pillar { padding: 20px 16px; }
          .about-process-step { padding: 18px 16px; }

          .about-crosshair { display: none; }
        }
      `}</style>

      <section
        id="about"
        className="about-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        {/* Background layers */}
        <div className="about-circuit-grid" />
        <div className="about-orb-static" />
        <div
          className="about-orb"
          ref={innerRef}
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />

        {/* Circuit crosshairs */}
        <div className="about-crosshair c1" />
        <div className="about-crosshair c2" />
        <div className="about-crosshair c3" />

        {/* Animated circuit SVG lines */}
        <svg className="about-circuit-svg" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
          <path d="M0 200 L200 200 L200 300 L500 300" stroke="rgba(124,58,237,0.5)" strokeWidth="1" fill="none"
            strokeDasharray="600" strokeDashoffset="600">
            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="2.5s" begin="0.5s" fill="freeze"/>
          </path>
          <path d="M1440 100 L1200 100 L1200 250 L900 250" stroke="rgba(168,85,247,0.4)" strokeWidth="1" fill="none"
            strokeDasharray="500" strokeDashoffset="500">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="2s" begin="0.8s" fill="freeze"/>
          </path>
          <path d="M300 600 L300 450 L600 450 L600 380" stroke="rgba(124,58,237,0.3)" strokeWidth="1" fill="none"
            strokeDasharray="400" strokeDashoffset="400">
            <animate attributeName="stroke-dashoffset" from="400" to="0" dur="2s" begin="1s" fill="freeze"/>
          </path>
        </svg>

        <div className="about-inner">
          {/* Eyebrow */}
          <div className={`about-eyebrow ${inView ? "visible" : ""}`}>
            <div className="about-eyebrow-pill">
              <div className="about-eyebrow-dot" />
              <span className="about-eyebrow-text">ABOUT INFINAUT</span>
            </div>
          </div>

          {/* Header split */}
          <div className="about-header">
            <h2 className={`about-headline ${inView ? "visible" : ""}`}>
              We Build<br />
              <span className="hl-purple">Intelligent</span><br />
              Ecosystems.
            </h2>

            <div className={`about-desc-col ${inView ? "visible" : ""}`}>
              <p className="about-desc">
                Infinaut helps businesses design, build, and scale modern 
                digital systems.
              </p>
              <p className="about-desc">
                From brand identity to AI-powered workflows, we create 
                solutions that improve how businesses operate and grow.
              </p>
              <p className="about-tagline">
                We don't just deliver projects — we build systems that work 
                long-term.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={`about-stats ${inView ? "visible" : ""}`}>
            {stats.map((s, idx) => (
              <div className="about-stat" key={idx}>
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pillars Section with SVG Icons */}
          <div className={`about-pillars-header ${inView ? "visible" : ""}`}>
            <span className="about-pillars-label">Our Intersection</span>
            <div className="about-pillars-line" />
          </div>

          <div className="about-pillars">
            {pillars.map((p, i) => (
              <div
                key={p.label}
                className={`about-pillar ${inView ? "visible" : ""}`}
                style={{
                  transition: `opacity 0.6s ease ${0.45 + i * 0.1}s, transform 0.6s ease ${0.45 + i * 0.1}s, background 0.3s ease`
                }}
              >
                <PillarIcon 
                  icon={p.icon} 
                  fallbackSvg={p.fallbackSvg} 
                  alt={p.title} 
                />
                <span className="about-pillar-num">{p.label}</span>
                <div className="about-pillar-title">{p.title}</div>
                <p className="about-pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Process Section with SVG Icons */}
          <div className={`about-process-header ${inView ? "visible" : ""}`}>
            <span className="about-process-label">Our Process</span>
            <div className="about-process-line" />
          </div>

          <div className="about-process-grid">
            {processSteps.map((step, i) => (
              <div
                key={step.step}
                className={`about-process-step ${inView ? "visible" : ""}`}
                style={{
                  transition: `opacity 0.6s ease ${0.55 + i * 0.1}s, transform 0.6s ease ${0.55 + i * 0.1}s`
                }}
              >
                <StepIcon 
                  icon={step.icon} 
                  fallbackSvg={step.fallbackSvg} 
                  alt={step.title} 
                />
                <div className="about-step-title">{step.title}</div>
                <p className="about-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Quote */}
          <div className={`about-quote ${inView ? "visible" : ""}`}>
            <div className="about-quote-text">
              "We build systems that <span>compound</span> — 
              every project is a foundation for the next."
            </div>
          </div>
        </div>
      </section>
      <SEO 
        title="About Infinaut - Our Story & Vision"
        description="Learn about our mission to revolutionize digital ecosystems through innovative technology and creative solutions."
      />
    </>
  );
}

export default About;