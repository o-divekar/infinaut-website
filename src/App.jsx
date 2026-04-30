import { useEffect, useState } from "react";
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Navbar = lazy(() => import("./components/Navbar"));
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Problem = lazy(() => import("./components/Problem"));
const Services = lazy(() => import("./components/Services"));
const Process = lazy(() => import("./components/Process"));
const Blog = lazy(() => import("./components/Blog"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

// Home page component (your main landing page)
function HomePage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 50);
  }, []);

  return (
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
        <Footer />
      </Suspense>
    </div>
  );
}

// Blog page component - WITHOUT Navbar
function BlogPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 50);
  }, []);

  return (
    <div className={`app-root ${show ? "show" : ""}`}>
      <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>}>
        {/* Navbar is removed - only Blog component shows */}
        <main>
          <Blog />
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

function App() {
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

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.4); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(200,169,110,0.7); }

        .app-root {
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .app-root.show { opacity: 1; }

        .section-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,169,110,0.15), transparent);
        }
      `}</style>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;