  import { useEffect, useState } from "react";
  import { HelmetProvider } from 'react-helmet-async';
  import { lazy, Suspense } from 'react';
  
  const Navbar = lazy(() => import("./components/Navbar"));
  const Hero = lazy(() => import("./components/Hero"));
  const About = lazy(() => import("./components/About"));
  const Problem = lazy(() => import("./components/Problem"));
  const Services = lazy(() => import("./components/Services"));
  const Process = lazy(() => import("./components/Process"));
  const Contact = lazy(() => import("./components/Contact"));
  const Footer = lazy(() => import("./components/Footer"));

  function LoaderScreen({ onDone }) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
      const steps = [
        { target: 30, delay: 0,    duration: 400 },
        { target: 60, delay: 420,  duration: 350 },
        { target: 85, delay: 800,  duration: 300 },
        { target: 100,delay: 1150, duration: 250 },
      ];

      steps.forEach(({ target, delay, duration }) => {
        setTimeout(() => {
          const start = Date.now();
          const startVal = progress;
          const tick = () => {
            const p = Math.min((Date.now() - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setProgress(Math.round(startVal + (target - startVal) * ease));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, delay);
      });

      const phaseTimers = [300, 700, 1100].map((t, i) =>
        setTimeout(() => setPhase(i + 1), t)
      );

      const exitTimer = setTimeout(() => {
        setLeaving(true);
        setTimeout(onDone, 800);
      }, 1700);

      return () => {
        phaseTimers.forEach(clearTimeout);
        clearTimeout(exitTimer);
      };
    }, []);

    const labels = ["Initializing systems", "Loading assets", "Building ecosystem", "Ready"];

    return (
      <HelmetProvider>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

          .ldr-root {
            position: fixed; inset: 0; z-index: 9999;
            background: #060608;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            font-family: 'DM Mono', monospace;
            transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.4,0,0.2,1);
          }
          .ldr-root.leaving {
            opacity: 0;
            transform: translateY(-24px);
          }

          /* Grid */
          .ldr-grid {
            position: absolute; inset: 0;
            background-image:
              linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px);
            background-size: 64px 64px; pointer-events: none;
          }

          /* Center hex mark */
          .ldr-mark {
            position: relative; margin-bottom: 36px;
          }
          .ldr-mark svg {
            width: 64px; height: 64px;
            animation: ldrSpin 3s linear infinite;
          }
          @keyframes ldrSpin {
            to { transform: rotate(60deg); }
          }
          .ldr-mark-inner {
            position: absolute; inset: 0;
            display: flex; align-items: center; justify-content: center;
          }
          .ldr-mark-core {
            width: 8px; height: 8px; border-radius: 50%;
            background: #c8a96e;
            animation: ldrPulse 1s ease-in-out infinite;
          }
          @keyframes ldrPulse {
            0%,100% { transform: scale(1); opacity: 1; }
            50%      { transform: scale(1.6); opacity: 0.5; }
          }

          /* Wordmark */
          .ldr-wordmark {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px; font-weight: 700;
            letter-spacing: 0.28em; color: #f0ede8;
            margin-bottom: 6px;
          }

          .ldr-sub {
            font-size: 9px; font-weight: 300;
            letter-spacing: 0.32em; text-transform: uppercase;
            color: #c8a96e; margin-bottom: 48px;
          }

          /* Progress bar */
          .ldr-bar-wrap {
            width: 240px; height: 1px;
            background: rgba(255,255,255,0.06);
            position: relative; margin-bottom: 16px; overflow: hidden;
          }
          .ldr-bar-fill {
            position: absolute; inset-block: 0; left: 0;
            background: linear-gradient(90deg, #c8a96e, rgba(200,169,110,0.5));
            transition: width 0.15s linear;
          }
          .ldr-bar-glow {
            position: absolute; right: 0; top: -2px;
            width: 4px; height: 5px;
            background: #c8a96e;
            filter: blur(3px);
            transition: right 0.15s linear;
          }

          /* Status row */
          .ldr-status {
            display: flex; align-items: center;
            justify-content: space-between; width: 240px;
          }
          .ldr-status-label {
            font-size: 9px; letter-spacing: 0.2em;
            text-transform: uppercase; color: rgba(240,237,232,0.35);
            transition: opacity 0.3s ease;
          }
          .ldr-status-pct {
            font-size: 11px; letter-spacing: 0.12em;
            color: #c8a96e; font-weight: 500;
          }

          /* Corner marks */
          .ldr-corner {
            position: absolute; width: 32px; height: 32px;
          }
          .ldr-corner.tl { top: 32px; left: 32px; border-top: 1px solid rgba(200,169,110,0.3); border-left: 1px solid rgba(200,169,110,0.3); }
          .ldr-corner.tr { top: 32px; right: 32px; border-top: 1px solid rgba(200,169,110,0.3); border-right: 1px solid rgba(200,169,110,0.3); }
          .ldr-corner.bl { bottom: 32px; left: 32px; border-bottom: 1px solid rgba(200,169,110,0.3); border-left: 1px solid rgba(200,169,110,0.3); }
          .ldr-corner.br { bottom: 32px; right: 32px; border-bottom: 1px solid rgba(200,169,110,0.3); border-right: 1px solid rgba(200,169,110,0.3); }
        `}</style>

        <div className={`ldr-root ${leaving ? "leaving" : ""}`}>
          <div className="ldr-grid" />
          <div className="ldr-corner tl" />
          <div className="ldr-corner tr" />
          <div className="ldr-corner bl" />
          <div className="ldr-corner br" />

          <div className="ldr-mark">
            <svg viewBox="0 0 64 64" fill="none">
              <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.9"/>
              <polygon points="32,14 50,24 50,40 32,50 14,40 14,24" stroke="rgba(200,169,110,0.35)" strokeWidth="0.7" fill="none"/>
            </svg>
            <div className="ldr-mark-inner">
              <div className="ldr-mark-core" />
            </div>
          </div>

          <div className="ldr-wordmark">INFINAUT</div>
          <div className="ldr-sub">Digital Ecosystems</div>

          <div className="ldr-bar-wrap">
            <div className="ldr-bar-fill" style={{ width: `${progress}%` }} />
            <div className="ldr-bar-glow" style={{ right: `${100 - progress}%` }} />
          </div>

          <div className="ldr-status">
            <span className="ldr-status-label">{labels[Math.min(phase, 3)]}</span>
            <span className="ldr-status-pct">{progress}%</span>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  function App() {
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
      if (!loading) setTimeout(() => setShow(true), 50);
    }, [loading]);

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          html { scroll-behavior: smooth; }

          body {
            background: #080808;
            color: #f0ede8;
            overflow-x: hidden;
          }

          /* Scroll bar */
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #080808; }
          ::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.4); border-radius: 2px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(200,169,110,0.7); }

          /* Page reveal after loader */
          .app-root {
            opacity: 0;
            transition: opacity 0.8s ease;
          }
          .app-root.show { opacity: 1; }

          /* Section dividers — thin gold gradient lines */
          .section-divider {
            width: 100%; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(200,169,110,0.15), transparent);
          }
        `}</style>

        {loading && <LoaderScreen onDone={() => setLoading(false)} />}

        <div className={`app-root ${show ? "show" : ""}`}>
          <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>}>
          <Navbar />
          <main>
            <Hero />
            <div className="section-divider" />
            <About />
            <div className="section-divider" />
            <Problem />
            <div className="section-divider" />
            <Services />
            <div className="section-divider" />
            <Process />
            <div className="section-divider" />
            <Contact />
          
          </main>
          </Suspense>
          <Footer />
        </div>
      </>
    );
  }

  export default App;