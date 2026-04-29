/**
 * ============================================================
 * Blog.jsx — Infinaut Blog: "How to Use AI to Grow Your Business in India"
 * Theme: Matches Infinaut website (dark navy/purple, Inter font)
 * SEO: Full meta tags, schema.org Article JSON-LD, semantic HTML
 * Sections:
 *   1. SEO Meta Head (Helmet-style constants)
 *   2. Reading Progress Bar
 *   3. Hero / Cover Section
 *   4. Article Meta (author, date, read time, tags)
 *   5. Table of Contents (sticky sidebar)
 *   6. Article Body (7 sections + image slots)
 *   7. Tool Comparison Table
 *   8. Pitfalls Section
 *   9. Q&A / FAQ (schema-ready)
 *  10. CTA Banner
 *  11. Related Articles
 *  12. Share Bar
 *  13. Back to Home Button
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import SVG images from assets folder
import aiHeroImg from "../assets/Heroo.png";
import aiContentImg from "../assets/aicontent.jpeg";
import whatsappBotImg from "../assets/whatsapp.jpeg";
import marketingDashboardImg from "../assets/marketing.jpeg";
import seoRankingsImg from "../assets/seoo.jpeg";

/* SEO CONSTANTS */
const SEO = {
  title: "How to Use AI to Grow Your Business in India (2026 Complete Guide) | Infinaut",
  description:
    "Step-by-step guide for Indian SMEs: 7 proven AI strategies with tools, ROI data & real examples. From content creation to 24/7 chatbots — start today.",
  canonical: "https://www.infinaut.com/blog/how-to-use-ai-to-grow-business-india-2026",
  keywords:
    "AI for Indian business, AI tools India 2026, how to use AI in India, digital marketing India, grow business with AI, SME India AI, ChatGPT India business",
  ogImage: "https://www.infinaut.com/images/blog/ai-india-og.jpg",
  author: "Infinaut Team",
  publishDate: "2026-04-28",
  modifiedDate: "2026-04-28",
  readTime: "9 min read",
  category: "AI & Business Growth",
};

/* JSON-LD Schema */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How to Use AI to Grow Your Business in India (2026 Complete Guide)",
  description: SEO.description,
  author: { "@type": "Organization", name: "Infinaut", url: "https://www.infinaut.com" },
  publisher: {
    "@type": "Organization",
    name: "Infinaut",
    logo: { "@type": "ImageObject", url: "https://www.infinaut.com/logo.svg" },
  },
  datePublished: SEO.publishDate,
  dateModified: SEO.modifiedDate,
  image: SEO.ogImage,
  mainEntityOfPage: SEO.canonical,
};

/* TABLE OF CONTENTS DATA */
const TOC = [
  { id: "why-ai-now",     label: "Why AI Now?" },
  { id: "strategy-1",    label: "1. Content at Scale" },
  { id: "strategy-2",    label: "2. 24/7 Chat Support" },
  { id: "strategy-3",    label: "3. Customer Insights" },
  { id: "strategy-4",    label: "4. Marketing Automation" },
  { id: "strategy-5",    label: "5. Pro Designs" },
  { id: "strategy-6",    label: "6. SEO Magic" },
  { id: "strategy-7",    label: "7. Voice Search" },
  { id: "tool-table",    label: "Tool Comparison" },
  { id: "pitfalls",      label: "Common Pitfalls" },
  { id: "faq",           label: "FAQ" },
];

/* RELATED ARTICLES */
const RELATED = [
  {
    tag: "Tier 1",
    title: "Best AI Tools for Small Businesses in India 2026",
    desc: "Tool-by-tool breakdown with pricing in ₹, free tiers, and India-specific use cases.",
    href: "/blog/best-ai-tools-small-business-india-2026",
    time: "8 min",
  },
  {
    tag: "Tier 2",
    title: "How Indian Businesses Can Use WhatsApp for Marketing in 2026",
    desc: "WhatsApp Business API, broadcast lists, chatbot setup — full playbook.",
    href: "/blog/whatsapp-marketing-indian-businesses-2026",
    time: "7 min",
  },
  {
    tag: "Tier 2",
    title: "SEO for Indian Businesses — Why Your Website Isn't Getting Traffic",
    desc: "Find and fix the exact reasons your site ranks on page 3 (or nowhere).",
    href: "/blog/seo-indian-businesses-no-traffic",
    time: "10 min",
  },
  {
    tag: "Tier 1",
    title: "How to Build a Website for Your Business in India (Cost + Process 2026)",
    desc: "Real cost breakdown, agency vs freelancer, tech stack guide for Indian SMEs.",
    href: "/blog/build-website-india-cost-process-2026",
    time: "9 min",
  },
];

/* TOOL TABLE DATA */
const TOOLS = [
  { name: "ChatGPT",         cost: "₹0 – ₹1,600/mo",  best: "Content & copy",     roi: "500% post engagement" },
  { name: "Canva AI",        cost: "₹500/mo",          best: "Design & visuals",   roi: "60% faster campaigns" },
  { name: "WhatsApp API",    cost: "₹2,000 – ₹5,000/mo",best: "Customer support", roi: "25% sales uplift" },
  { name: "Semrush AI",      cost: "₹8,000+/mo",       best: "SEO & keywords",     roi: "300% organic traffic" },
  { name: "Mailchimp AI",    cost: "₹0 – ₹2,500/mo",  best: "Email automation",   roi: "5x ad efficiency" },
  { name: "Google Analytics 4","cost": "Free",         best: "Insights & data",    roi: "40% conversion boost" },
];

/* FAQ DATA */
const FAQS = [
  {
    q: "Can small businesses in India afford AI tools?",
    a: "Yes. Most powerful AI tools now have free tiers or cost between ₹0–₹2,000/month. ChatGPT, Canva AI, and Google Analytics 4 are all free to start. The cost of NOT using AI — in lost leads, slow content, and manual work — is far higher.",
  },
  {
    q: "Which AI tool should an Indian business start with first?",
    a: "Start with ChatGPT (free). Open it, describe your business, and ask it to write 3 Instagram captions or one promotional email. Once you see the time saved, move to WhatsApp Business API for customer automation.",
  },
  {
    q: "Is AI going to replace my employees?",
    a: "No — it replaces repetitive tasks, not people. AI handles data entry, scheduling, basic customer queries, and first-draft content. Your team focuses on strategy, relationships, and judgment calls that no AI can replicate.",
  },
  {
    q: "How long does it take to see results from AI tools?",
    a: "Content results (more posts, better copy) appear within days. SEO improvements take 2–4 months. Customer support automation can be live within 1–2 weeks. Most Indian businesses see measurable ROI within 90 days.",
  },
  {
    q: "Do I need a tech team to implement AI in my business?",
    a: "Not anymore. Tools like ChatGPT, Canva AI, and Mailchimp have no-code interfaces. For WhatsApp chatbots or deeper integrations, Infinaut handles the full setup — no tech knowledge needed on your end.",
  },
];

export default function Blog() {
  const [readProgress, setReadProgress]   = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [tocOpen, setTocOpen]             = useState(false);
  const [openFaq, setOpenFaq]             = useState(null);
  const [copied, setCopied]               = useState(false);
  const articleRef = useRef(null);
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  const handleContactClick = () => {
    navigate('/', { state: { scrollTo: 'contact' } });
  };

  /* Reading progress bar */
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = Math.max(0, -top);
      const total    = height - window.innerHeight;
      setReadProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active TOC section on scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Copy link */
  const copyLink = () => {
    navigator.clipboard.writeText(SEO.canonical);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* Scroll to section */
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{SEO.title}</title>
        <meta name="description"        content={SEO.description} />
        <meta name="keywords"           content={SEO.keywords} />
        <link rel="canonical"           href={SEO.canonical} />
        <meta property="og:type"        content="article" />
        <meta property="og:title"       content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:image"       content={SEO.ogImage} />
        <meta property="og:url"         content={SEO.canonical} />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content={SEO.title} />
        <meta name="twitter:description"content={SEO.description} />
        <meta name="twitter:image"      content={SEO.ogImage} />
        <meta name="author"             content={SEO.author} />
        <meta name="robots"             content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(SCHEMA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

        :root {
          --bg: #06000f;
          --bg2: #0d0020;
          --bg-card: rgba(13,0,32,0.7);
          --pu: #7c3aed;
          --pu-bright: #a855f7;
          --pu-light: #c084fc;
          --pu-dim: rgba(124,58,237,0.14);
          --pu-line: rgba(168,85,247,0.25);
          --pu-glow: rgba(124,58,237,0.35);
          --text: #f0eeff;
          --text-dim: rgba(240,238,255,0.68);
          --text-muted: rgba(240,238,255,0.38);
          --border: rgba(168,85,247,0.12);
          --border-mid: rgba(168,85,247,0.2);
          --green: #22c55e;
          --amber: #f59e0b;
          --nav-h: 72px;
          --sidebar-w: 260px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .blog-page {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          padding-top: var(--nav-h);
        }

        /* Back to Home Button Styles */
        .back-home-btn {
          position: fixed;
          top: 20px;
          left: 24px;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(13,0,32,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-mid);
          border-radius: 40px;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-dim);
        }
        .back-home-btn:hover {
          border-color: var(--pu-bright);
          background: rgba(124,58,237,0.2);
          color: var(--pu-bright);
          transform: translateY(-2px);
        }
        .back-home-btn span {
          font-size: 16px;
        }

        .progress-bar {
          position: fixed; top: var(--nav-h); left: 0; right: 0;
          height: 2px; z-index: 190;
          background: rgba(124,58,237,0.15);
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--pu), var(--pu-bright), var(--pu-light));
          transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(168,85,247,0.6);
        }

        .blog-hero {
          position: relative; overflow: hidden;
          padding: 80px 24px 0;
          background: linear-gradient(155deg, var(--bg2) 0%, var(--bg) 70%);
        }
        .blog-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }
        .blog-hero-orb1 {
          position: absolute; top: -60px; right: -80px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .blog-hero-orb2 {
          position: absolute; bottom: 0; left: -60px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%);
          pointer-events: none;
        }
        .blog-hero-inner {
          max-width: 860px; margin: 0 auto;
          position: relative; z-index: 1;
          padding-bottom: 0;
        }

        .blog-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-muted);
          margin-bottom: 24px;
        }
        .blog-breadcrumb a {
          color: var(--text-muted); text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .blog-breadcrumb a:hover { color: var(--pu-bright); }
        .blog-breadcrumb-sep { color: var(--pu-line); }
        .blog-breadcrumb-cur { color: var(--pu-bright); }

        .blog-cat-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--pu-dim);
          border: 1px solid var(--pu-line);
          border-radius: 100px; padding: 5px 14px;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--pu-bright); margin-bottom: 20px;
        }
        .blog-cat-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--pu-bright);
          animation: dotPulse 2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.4;transform:scale(0.6)}
        }

        .blog-hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 4.5vw, 52px);
          font-weight: 800; line-height: 1.12;
          color: var(--text); margin-bottom: 18px;
          letter-spacing: -0.01em;
        }
        .blog-hero-title .hl {
          background: linear-gradient(135deg, #a855f7, #7c3aed, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .blog-hero-sub {
          font-size: 16px; font-weight: 300; line-height: 1.8;
          color: var(--text-dim); max-width: 640px; margin-bottom: 32px;
        }

        .blog-meta {
          display: flex; align-items: center; flex-wrap: wrap; gap: 20px;
          padding: 20px 0; border-top: 1px solid var(--border);
          margin-bottom: 0;
        }
        .blog-meta-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; color: var(--text-muted);
        }
        .blog-meta-icon { font-size: 13px; }
        .blog-meta-val { font-weight: 500; color: var(--text-dim); }

        .blog-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
        .blog-tag {
          font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 4px; padding: 4px 10px;
          color: var(--pu-light);
        }

        .blog-hero-image {
          position: relative; margin-top: 40px;
          width: 100%; aspect-ratio: 16/7; min-height: 220px;
          background: linear-gradient(135deg, rgba(13,0,32,0.9) 0%, rgba(30,0,60,0.8) 100%);
          border: 1px solid var(--border-mid);
          border-bottom: none;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .blog-hero-image img {
          width: 100%; height: 100%; object-fit: cover;
        }

        .blog-layout {
          max-width: 1120px; margin: 0 auto;
          padding: 0 24px 100px;
          display: grid;
          grid-template-columns: 1fr var(--sidebar-w);
          gap: 48px;
          align-items: start;
        }

        .blog-article {
          border: 1px solid var(--border-mid);
          border-top: none;
          border-radius: 0 0 16px 16px;
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          padding: 48px 52px 52px;
        }

        .section-anchor {
          display: block;
          height: calc(var(--nav-h) + 24px);
          margin-top: calc(-1 * (var(--nav-h) + 24px));
          visibility: hidden; pointer-events: none;
        }

        .section-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--pu-line), transparent);
          margin: 48px 0;
        }

        .blog-body h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(20px, 2.5vw, 26px); font-weight: 700;
          color: var(--text); margin-bottom: 16px; margin-top: 0;
          line-height: 1.25;
        }
        .blog-body h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 17px; font-weight: 600;
          color: var(--text); margin-bottom: 10px; margin-top: 24px;
        }
        .blog-body p {
          font-size: 15px; font-weight: 300; line-height: 1.85;
          color: var(--text-dim); margin-bottom: 16px;
        }
        .blog-body strong { font-weight: 600; color: var(--text); }
        .blog-body em { font-style: italic; color: var(--pu-light); }

        .blog-body .highlight {
          background: rgba(124,58,237,0.12);
          border-left: 3px solid var(--pu-bright);
          border-radius: 0 6px 6px 0;
          padding: 14px 18px; margin: 20px 0;
          font-size: 14px; color: var(--text-dim); line-height: 1.7;
        }
        .blog-body .highlight strong { color: var(--pu-bright); }

        .stat-row {
          display: flex; flex-wrap: wrap; gap: 16px; margin: 24px 0;
        }
        .stat-chip {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: var(--pu-dim);
          border: 1px solid var(--pu-line);
          border-radius: 10px; padding: 16px 22px;
          min-width: 130px; flex: 1;
          text-align: center;
        }
        .stat-chip-val {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 26px; font-weight: 800;
          background: linear-gradient(135deg, var(--pu-bright), var(--pu-light));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-chip-label {
          font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--text-muted); margin-top: 4px;
        }

        .step-list { list-style: none; padding: 0; margin: 20px 0; }
        .step-item {
          display: flex; gap: 16px; margin-bottom: 18px;
          padding: 16px 18px;
          background: rgba(124,58,237,0.05);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .step-item:hover {
          border-color: var(--pu-line);
          background: rgba(124,58,237,0.09);
        }
        .step-num {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--pu), var(--pu-bright));
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
        }
        .step-content { flex: 1; }
        .step-title { font-weight: 600; color: var(--text); font-size: 14px; margin-bottom: 4px; }
        .step-desc { font-size: 13px; color: var(--text-dim); line-height: 1.6; }

        .roi-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 6px; padding: 3px 10px;
          font-size: 11px; font-weight: 600;
          color: var(--green); letter-spacing: 0.06em;
        }

        .blog-image-slot {
          width: 100%; aspect-ratio: 16/7;
          background: linear-gradient(135deg, rgba(13,0,32,0.9), rgba(30,0,60,0.8));
          border: 1px solid var(--border-mid);
          border-radius: 12px; overflow: hidden;
          display: flex;
          align-items: center; justify-content: center;
          margin: 28px 0;
          transition: border-color 0.25s;
          position: relative;
        }
        .blog-image-slot:hover { border-color: var(--pu-bright); }
        .blog-image-slot img {
          width: 100%; height: 100%; object-fit: cover;
        }

        .blog-img-caption {
          font-size: 11.5px; color: var(--text-muted); text-align: center;
          margin-top: -20px; margin-bottom: 28px; letter-spacing: 0.04em;
        }

        .tool-table-wrap {
          overflow-x: auto; margin: 28px 0;
          border-radius: 10px; border: 1px solid var(--border-mid);
        }
        .tool-table {
          width: 100%; border-collapse: collapse; min-width: 520px;
        }
        .tool-table thead tr {
          background: rgba(124,58,237,0.15);
          border-bottom: 1px solid var(--pu-line);
        }
        .tool-table th {
          padding: 13px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--pu-bright); text-align: left; white-space: nowrap;
        }
        .tool-table td {
          padding: 13px 16px; font-size: 13px; color: var(--text-dim);
          border-bottom: 1px solid var(--border); vertical-align: middle;
        }
        .tool-table tbody tr { transition: background 0.2s; }
        .tool-table tbody tr:hover { background: rgba(124,58,237,0.06); }
        .tool-table tbody tr:last-child td { border-bottom: none; }
        .tool-name { font-weight: 600; color: var(--text); font-size: 14px; }
        .tool-cost { color: var(--pu-light); font-size: 12px; }

        .pitfall-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          margin: 20px 0;
        }
        .pitfall-card {
          background: rgba(220,38,38,0.06);
          border: 1px solid rgba(220,38,38,0.18);
          border-radius: 10px; padding: 18px 20px;
        }
        .pitfall-card .pf-icon { font-size: 18px; margin-bottom: 8px; }
        .pitfall-card .pf-title {
          font-size: 13px; font-weight: 600; color: #fca5a5; margin-bottom: 6px;
        }
        .pitfall-card .pf-desc {
          font-size: 12.5px; color: var(--text-muted); line-height: 1.65;
        }
        .fix-card {
          background: rgba(34,197,94,0.06);
          border-color: rgba(34,197,94,0.18);
        }
        .fix-card .pf-title { color: #86efac; }

        .faq-list { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }
        .faq-item {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px; overflow: hidden;
          transition: border-color 0.25s;
        }
        .faq-item.open { border-color: var(--pu-line); }
        .faq-question {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; background: none; border: none; cursor: pointer;
          text-align: left; gap: 16px;
        }
        .faq-q-text {
          font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.4;
        }
        .faq-chevron {
          flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px;
          background: var(--pu-dim); border: 1px solid var(--pu-line);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: var(--pu-bright);
          transition: transform 0.3s ease, background 0.2s;
        }
        .faq-item.open .faq-chevron { transform: rotate(180deg); background: var(--pu); color: #fff; }
        .faq-answer {
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.16,1,0.3,1), padding 0.3s ease;
          padding: 0 20px;
        }
        .faq-item.open .faq-answer { max-height: 300px; padding: 0 20px 18px; }
        .faq-answer p {
          font-size: 13.5px; color: var(--text-dim); line-height: 1.8; margin: 0;
        }

        .blog-cta {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(168,85,247,0.1) 100%);
          border: 1px solid var(--pu-line);
          border-radius: 14px; padding: 36px 40px;
          margin: 48px 0 0; text-align: center;
        }
        .blog-cta::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--pu), var(--pu-bright), transparent);
        }
        .blog-cta-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(124,58,237,0.2);
          border: 1px solid var(--pu-line); border-radius: 100px;
          padding: 4px 12px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--pu-bright); margin-bottom: 14px;
        }
        .blog-cta-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(20px, 3vw, 28px); font-weight: 700;
          color: var(--text); margin-bottom: 10px; line-height: 1.3;
        }
        .blog-cta-sub {
          font-size: 14px; color: var(--text-dim); margin-bottom: 24px; line-height: 1.7;
        }
        .blog-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--pu), var(--pu-bright));
          border: none; border-radius: 8px; padding: 13px 28px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .blog-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.45);
        }
        .blog-cta-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.55s ease;
        }
        .blog-cta-btn:hover::before { transform: translateX(100%); }

        .share-bar {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap; padding: 24px 0; border-top: 1px solid var(--border);
          margin-top: 40px;
        }
        .share-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--text-muted); margin-right: 4px;
        }
        .share-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 7px; padding: 8px 14px;
          font-size: 12px; font-weight: 500; color: var(--text-dim);
          cursor: pointer; text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .share-btn:hover {
          border-color: var(--pu-bright); color: #fff;
          background: var(--pu-dim);
        }
        .share-copy { margin-left: auto; }
        .share-copy.copied { color: var(--green); border-color: rgba(34,197,94,0.4); }

        .blog-sidebar {
          position: sticky; top: calc(var(--nav-h) + 28px);
          align-self: start;
        }
        .toc-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 22px 20px;
          backdrop-filter: blur(12px);
          margin-bottom: 20px;
        }
        .toc-title {
          font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--pu-bright);
          margin-bottom: 14px; padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }
        .toc-list { list-style: none; padding: 0; margin: 0; }
        .toc-item {
          font-size: 12.5px; color: var(--text-muted); padding: 5px 0;
          cursor: pointer; transition: color 0.2s, padding-left 0.2s;
          border-left: 2px solid transparent;
          padding-left: 10px; margin-left: -10px;
        }
        .toc-item:hover { color: var(--text-dim); }
        .toc-item.active {
          color: var(--pu-bright);
          border-left-color: var(--pu-bright);
          padding-left: 14px;
          font-weight: 500;
        }

        .toc-progress {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
        }
        .toc-circle-wrap { position: relative; width: 36px; height: 36px; }
        .toc-circle-svg { transform: rotate(-90deg); }
        .toc-circle-bg { fill: none; stroke: rgba(124,58,237,0.15); stroke-width: 3; }
        .toc-circle-fill {
          fill: none; stroke: var(--pu-bright); stroke-width: 3;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }
        .toc-pct {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 700; color: var(--pu-bright);
        }
        .toc-progress-label {
          font-size: 11px; font-weight: 500; color: var(--text-muted);
        }

        .sidebar-cta {
          background: linear-gradient(135deg, rgba(124,58,237,0.14), rgba(168,85,247,0.08));
          border: 1px solid var(--pu-line);
          border-radius: 12px; padding: 20px 18px;
          position: relative; overflow: hidden;
        }
        .sidebar-cta::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--pu-bright), transparent);
        }
        .sidebar-cta-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 700; color: var(--text);
          margin-bottom: 8px; line-height: 1.3;
        }
        .sidebar-cta-sub {
          font-size: 12px; color: var(--text-muted); line-height: 1.65; margin-bottom: 16px;
        }
        .sidebar-cta-btn {
          width: 100%; background: linear-gradient(135deg, var(--pu), var(--pu-bright));
          border: none; border-radius: 7px; padding: 10px 16px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #fff; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .sidebar-cta-btn:hover {
          transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }

        .related-section {
          max-width: 1120px; margin: 0 auto; padding: 0 24px 80px;
        }
        .related-header {
          display: flex; align-items: baseline; gap: 12px;
          margin-bottom: 28px;
        }
        .related-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700; color: var(--text);
        }
        .related-subtitle { font-size: 13px; color: var(--text-muted); }
        .related-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
        }
        .related-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 24px;
          cursor: pointer; text-decoration: none; display: block;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .related-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--pu), var(--pu-bright), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .related-card:hover {
          border-color: var(--pu-line);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }
        .related-card:hover::after { opacity: 1; }
        .related-card-tag {
          display: inline-block; font-size: 9px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--pu-bright); margin-bottom: 10px;
          background: var(--pu-dim); border: 1px solid var(--pu-line);
          border-radius: 4px; padding: 3px 8px;
        }
        .related-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 700; color: var(--text);
          margin-bottom: 8px; line-height: 1.35;
        }
        .related-card-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.65; }
        .related-card-footer {
          display: flex; align-items: center; gap: 8px;
          margin-top: 16px; padding-top: 12px;
          border-top: 1px solid var(--border);
          font-size: 11px; color: var(--text-muted);
        }
        .related-card-arrow { margin-left: auto; color: var(--pu-bright); font-size: 14px; }

        .toc-mobile-btn {
          display: none; position: fixed; bottom: 24px; right: 24px; z-index: 180;
          background: linear-gradient(135deg, var(--pu), var(--pu-bright));
          border: none; border-radius: 50%; width: 52px; height: 52px;
          font-size: 18px; color: #fff; cursor: pointer;
          box-shadow: 0 8px 24px rgba(124,58,237,0.5);
          align-items: center; justify-content: center;
        }
        .toc-mobile-overlay {
          display: none; position: fixed; inset: 0; z-index: 175;
          background: rgba(2,0,10,0.9); backdrop-filter: blur(12px);
          align-items: flex-end; justify-content: center; padding: 20px;
        }
        .toc-mobile-overlay.open { display: flex; }
        .toc-mobile-sheet {
          background: #0d0020; border: 1px solid var(--pu-line);
          border-radius: 16px; padding: 28px 24px; width: 100%; max-width: 420px;
        }

        @media (max-width: 960px) {
          .blog-layout { grid-template-columns: 1fr; }
          .blog-sidebar { display: none; }
          .toc-mobile-btn { display: flex; }
          .blog-article { padding: 32px 28px; }
          .pitfall-grid { grid-template-columns: 1fr; }
          .related-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .blog-hero { padding: 48px 16px 0; }
          .blog-layout { padding: 0 16px 60px; }
          .blog-article { padding: 24px 18px; border-radius: 0 0 12px 12px; }
          .blog-hero-title { font-size: clamp(24px, 7vw, 36px); }
          .blog-hero-image { border-radius: 12px 12px 0 0; }
          .related-section { padding: 0 16px 60px; }
          .stat-row { flex-direction: column; }
          .stat-chip { flex-direction: row; text-align: left; min-width: unset; }
          .blog-meta { gap: 12px; }
          .blog-tags { margin-left: 0; }
          .blog-cta { padding: 28px 20px; }
          .back-home-btn {
            top: 12px !important;
            left: 12px !important;
            padding: 6px 14px !important;
            font-size: 11px !important;
          }
          .back-home-btn span {
            font-size: 14px !important;
          }
        }
      `}</style>

      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={goHome}>
        <span>←</span> Back to Home
      </button>

      <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(readProgress)}>
        <div className="progress-fill" style={{ width: `${readProgress}%` }} />
      </div>

      <main className="blog-page" itemScope itemType="https://schema.org/BlogPosting">
        <header className="blog-hero">
          <div className="blog-hero-orb1" aria-hidden="true" />
          <div className="blog-hero-orb2" aria-hidden="true" />

          <div className="blog-hero-inner">
            <nav className="blog-breadcrumb" aria-label="Breadcrumb">
              <a onClick={goHome}>Home</a>
              <span className="blog-breadcrumb-sep">›</span>
              <a onClick={() => navigate('/blog')}>Blog</a>
              <span className="blog-breadcrumb-sep">›</span>
              <span className="blog-breadcrumb-cur">AI for Business</span>
            </nav>

            <div className="blog-cat-pill" role="note">
              <span className="blog-cat-dot" aria-hidden="true" />
              AI & Business Growth
            </div>

            <h1 className="blog-hero-title" itemProp="headline">
              How to Use AI to Grow<br />
              Your Business in India{" "}
              <span className="hl">(2026 Guide)</span>
            </h1>

            <p className="blog-hero-sub" itemProp="description">
              A no-fluff, step-by-step guide for Indian SMEs — from shop owners
              in Pune to exporters in Surat. 7 proven strategies, real tools,
              and honest ROI numbers. AI adopters see <strong>37% average revenue growth</strong>.
            </p>

            <div className="blog-meta">
              <div className="blog-meta-item">
                <span className="blog-meta-icon">✍</span>
                <span>By</span>
                <span className="blog-meta-val" itemProp="author">Infinaut Team</span>
              </div>
              <div className="blog-meta-item">
                <span className="blog-meta-icon">📅</span>
                <time dateTime={SEO.publishDate} itemProp="datePublished">
                  <span className="blog-meta-val">April 28, 2026</span>
                </time>
              </div>
              <div className="blog-meta-item">
                <span className="blog-meta-icon">⏱</span>
                <span className="blog-meta-val">9 min read</span>
              </div>
              <div className="blog-meta-item">
                <span className="blog-meta-icon">📊</span>
                <span className="blog-meta-val">2,500 words</span>
              </div>
              <div className="blog-tags">
                <span className="blog-tag">AI Tools</span>
                <span className="blog-tag">Indian SME</span>
                <span className="blog-tag">2026</span>
              </div>
            </div>

            <figure className="blog-hero-image" itemProp="image">
              <img 
                src={aiHeroImg} 
                alt="Indian business owner using AI tools on a laptop"
                loading="eager"
              />
            </figure>
          </div>
        </header>

        <div className="blog-layout" ref={articleRef}>
          <article className="blog-article blog-body" itemProp="articleBody">
            <span id="why-ai-now" className="section-anchor" />
            <h2>Why AI Now for Indian Businesses?</h2>

            <div className="stat-row" role="region" aria-label="Key statistics">
              <div className="stat-chip">
                <span className="stat-chip-val">37%</span>
                <span className="stat-chip-label">Revenue growth (AI adopters)</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-val">90%</span>
                <span className="stat-chip-label">Cost drop since 2021</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-val">70%</span>
                <span className="stat-chip-label">MSMEs using AI basics</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-val">₹0</span>
                <span className="stat-chip-label">Start for free today</span>
              </div>
            </div>

            <p>
              Five years ago, AI tools cost lakhs and required a dedicated tech team.
              Today, you can access powerful AI for as low as <strong>₹0 to ₹2,000 per month</strong>.
              This has levelled the playing field in a way that's genuinely historic for
              Indian MSMEs.
            </p>
            <p>
              More importantly, <em>your competitors are already using it</em>. The businesses
              that figure this out in the next 12 months will have a significant edge over
              those who wait.
            </p>

            <div className="highlight">
              <strong>Quick answer:</strong> 70% of MSMEs use AI basics, but only 20% scale it —
              that gap is your edge. Start with one problem, get results, then expand.
            </div>

            <div className="section-divider" />

            <span id="strategy-1" className="section-anchor" />
            <h2>1. Create Content at Scale — Without Hiring a Full Team</h2>

            <p>
              Content is the currency of the internet. Every business needs posts, captions,
              emails, and website copy — but hiring a content team is expensive. AI writing
              tools can generate high-quality first drafts in <strong>minutes, not hours</strong>.
            </p>

            <figure className="blog-image-slot" aria-label="AI content creation">
              <img 
                src={aiContentImg} 
                alt="AI content creation tool interface in Hindi and English"
                loading="lazy"
              />
            </figure>
            <p className="blog-img-caption">
              AI generating Instagram captions for a Mumbai restaurant's promotional campaign
            </p>

            <ul className="step-list">
              <li className="step-item">
                <div className="step-num">1</div>
                <div className="step-content">
                  <div className="step-title">Describe your business in one sentence</div>
                  <div className="step-desc">
                    "I run a saree boutique in Jaipur targeting brides aged 22–35."
                    The more specific, the better the output.
                  </div>
                </div>
              </li>
              <li className="step-item">
                <div className="step-num">2</div>
                <div className="step-content">
                  <div className="step-title">Give a specific task with context</div>
                  <div className="step-desc">
                    "Write 5 Instagram captions for Diwali sale. Tone: warm, festive,
                    Hindi-English mix. Product: silk lehengas, ₹8,000–₹25,000."
                  </div>
                </div>
              </li>
              <li className="step-item">
                <div className="step-num">3</div>
                <div className="step-content">
                  <div className="step-title">Edit in your brand's voice — 10 minutes max</div>
                  <div className="step-desc">
                    AI gives you 80% done. You add the human touch: local references,
                    your offer specifics, your personality.
                  </div>
                </div>
              </li>
            </ul>

            <p>
              <strong>Top tools:</strong> ChatGPT (free), Jasper.ai (₹1,000/mo),
              Claude (₹1,600/mo). <span className="roi-badge">⬆ ROI: 3x leads via SEO content</span>
            </p>
            <p><strong>Time saved:</strong> 3–5 hours per week on content alone.</p>

            <div className="section-divider" />

            <span id="strategy-2" className="section-anchor" />
            <h2>2. Build a 24/7 Customer Support System — Without Extra Staff</h2>

            <p>
              One of the biggest pain points for Indian businesses is customer follow-up.
              Calls go unanswered. WhatsApp messages pile up. Sales get lost at 11 PM
              when no one is online.
            </p>
            <p>
              AI-powered chatbots — set up on your website or WhatsApp Business — can
              handle common questions <strong>automatically</strong>. "What are your timings?"
              "Do you deliver to Nagpur?" "What's the price of X?" — all answered instantly,
              even at 2 AM.
            </p>

            <figure className="blog-image-slot" aria-label="WhatsApp chatbot">
              <img 
                src={whatsappBotImg} 
                alt="WhatsApp Business API chatbot answering customer queries in India"
                loading="lazy"
              />
            </figure>
            <p className="blog-img-caption">
              A WhatsApp chatbot handling product queries for a Surat textile exporter — automatically, 24/7
            </p>

            <div className="highlight">
              <strong>Result:</strong> Businesses using WhatsApp chatbots report
              <strong> 25% uplift in sales conversions</strong> within 60 days —
              simply because no lead is dropped. Setup via Dialogflow or Wati.io.
            </div>

            <div className="section-divider" />

            <span id="strategy-3" className="section-anchor" />
            <h2>3. Understand Your Customers with AI Analytics</h2>

            <p>
              Data used to be for big corporates with data science teams. Now, free tools
              tell you exactly who is visiting your website, what they're searching for, and
              where they drop off before buying.
            </p>

            <h3>Three questions AI analytics answers automatically:</h3>
            <ul className="step-list">
              <li className="step-item">
                <div className="step-num">A</div>
                <div className="step-content">
                  <div className="step-title">Which page has the highest exit rate?</div>
                  <div className="step-desc">
                    If 60% of visitors leave your pricing page, something's wrong —
                    price presentation, lack of trust signals, or slow load time.
                  </div>
                </div>
              </li>
              <li className="step-item">
                <div className="step-num">B</div>
                <div className="step-content">
                  <div className="step-title">What search terms bring people to you?</div>
                  <div className="step-desc">
                    If you sell furniture but people arrive searching "office chair repair India",
                    that's content you should be creating.
                  </div>
                </div>
              </li>
              <li className="step-item">
                <div className="step-num">C</div>
                <div className="step-content">
                  <div className="step-title">Which products do people view but not buy?</div>
                  <div className="step-desc">
                    High views, low purchase = pricing, description, or photo problem. Fix it.
                  </div>
                </div>
              </li>
            </ul>
            <p>
              <strong>Tools:</strong> Google Analytics 4 (free), Hotjar (free tier),
              HubSpot (₹0–₹3,000/mo). <span className="roi-badge">⬆ ROI: 40% conversion boost</span>
            </p>

            <div className="section-divider" />

            <span id="strategy-4" className="section-anchor" />
            <h2>4. Automate Your Marketing — Emails, Posts, Ads</h2>

            <p>
              Running a business means you rarely have time to manually send emails or
              post on social media consistently. AI tools can schedule content, send
              automated follow-up emails to leads, and optimise your ad spend in real time.
            </p>
            <p>
              <strong>Meta Advantage+</strong> (formerly Facebook's AI ad optimizer) has
              shown <em>5x improvement in ad efficiency</em> for Indian e-commerce brands
              by automatically shifting budget to top-performing creatives.
            </p>

            <figure className="blog-image-slot" aria-label="Marketing automation">
              <img 
                src={marketingDashboardImg} 
                alt="Mailchimp AI email automation dashboard for Indian startup"
                loading="lazy"
              />
            </figure>
            <p className="blog-img-caption">
              Mailchimp's AI automatically sends follow-up emails to leads who didn't purchase
            </p>

            <div className="section-divider" />

            <span id="strategy-5" className="section-anchor" />
            <h2>5. Create Professional Designs — No Designer Needed</h2>

            <p>
              Need a festive sale banner? A new product poster? A logo for a new vertical?
              AI design tools can generate <strong>professional-quality visuals in minutes</strong>.
            </p>
            <p>
              For Indian businesses that can't afford a full-time graphic designer (₹25,000–
              ₹50,000/mo), this is a genuine game changer. Canva's Magic Studio handles
              the output. You handle the strategy.
            </p>
            <div className="highlight">
              <strong>Comparison:</strong> Freelance designer for 10 Diwali banners → ₹5,000–₹10,000.
              Canva AI → ₹500/mo, unlimited banners, same-day delivery.
            </div>

            <div className="section-divider" />

            <span id="strategy-6" className="section-anchor" />
            <h2>6. Use AI to Dominate Search Rankings</h2>

            <p>
              SEO isn't just for big agencies anymore. AI-powered tools like Semrush AI
              and Ahrefs can identify exactly which keywords your ideal customers are
              searching — and how to rank for them.
            </p>
            <p>
              Target phrases like <em>"AI tools India"</em>, <em>"best digital agency Mumbai"</em>,
              or <em>"WhatsApp marketing for shops"</em>. With consistent AI-assisted blogging,
              most Indian businesses reach Page 1 results within <strong>3–4 months</strong>.
            </p>

            <figure className="blog-image-slot" aria-label="SEO dashboard">
              <img 
                src={seoRankingsImg} 
                alt="Google Search Console showing traffic growth for Indian business website"
                loading="lazy"
              />
            </figure>
            <p className="blog-img-caption">
              Google Search Console showing 300% organic traffic growth in 90 days
            </p>

            <div className="section-divider" />

            <span id="strategy-7" className="section-anchor" />
            <h2>7. Optimise for Voice & AI Search — The 2026 Opportunity</h2>

            <p>
              Voice search in India is rising <strong>50% year-on-year</strong>, especially
              in Hindi, Tamil, and Bengali. People say "best saree shop near me" into Google
              Assistant — not "saree shop Mumbai."
            </p>
            <p>
              This means your website needs to answer questions naturally, the way people
              speak. Add an FAQ section to every page. Use schema markup. Structure
              your content around "How do I…" and "What is the best…" queries.
            </p>

            <div className="highlight">
              <strong>2026 reality:</strong> Google AI Overviews, ChatGPT Search, and Perplexity
              are pulling answers directly from websites that are structured for Q&A.
              If your content isn't formatted this way, you're invisible to AI search.
            </div>

            <div className="section-divider" />

            <span id="tool-table" className="section-anchor" />
            <h2>AI Tool Comparison for Indian Businesses</h2>
            <p>All prices in INR. Free tiers available for most tools — start free, upgrade when ready.</p>

            <div className="tool-table-wrap" role="region" aria-label="AI tool comparison table">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th scope="col">Tool</th>
                    <th scope="col">Cost (₹/mo)</th>
                    <th scope="col">Best For</th>
                    <th scope="col">India ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOLS.map((t) => (
                    <tr key={t.name}>
                      <td><span className="tool-name">{t.name}</span></td>
                      <td><span className="tool-cost">{t.cost}</span></td>
                      <td>{t.best}</td>
                      <td>
                        <span className="roi-badge">⬆ {t.roi}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="section-divider" />

            <span id="pitfalls" className="section-anchor" />
            <h2>3 Mistakes Indian Businesses Make with AI</h2>
            <p>
              Most businesses try AI once, don't see overnight results, and give up.
              Here's what actually goes wrong — and how to avoid it.
            </p>

            <div className="pitfall-grid">
              <div className="pitfall-card">
                <div className="pf-icon">⚠️</div>
                <div className="pf-title">Treating AI as a magic button</div>
                <div className="pf-desc">
                  AI is a system, not a shortcut. It needs setup, training with your
                  business context, and refinement over time.
                </div>
              </div>
              <div className="pitfall-card fix-card">
                <div className="pf-icon">✅</div>
                <div className="pf-title">The fix: Solve one problem first</div>
                <div className="pf-desc">
                  Start with content or customer support. Get one workflow working
                  before expanding to the next.
                </div>
              </div>
              <div className="pitfall-card">
                <div className="pf-icon">⚠️</div>
                <div className="pf-title">Ignoring local context</div>
                <div className="pf-desc">
                  Generic AI output won't convert Indian audiences. Add local
                  references, Hindi phrases, and region-specific pricing.
                </div>
              </div>
              <div className="pitfall-card fix-card">
                <div className="pf-icon">✅</div>
                <div className="pf-title">The fix: Always human-edit 30%</div>
                <div className="pf-desc">
                  AI provides the structure. You add the local flavour — the
                  Diwali reference, the city name, your brand's voice.
                </div>
              </div>
            </div>

            <div className="section-divider" />

            <span id="faq" className="section-anchor" />
            <h2>Frequently Asked Questions</h2>
            <p className="blog-body">Quick answers for Indian business owners just getting started.</p>

            <div className="faq-list" itemScope itemType="https://schema.org/FAQPage">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className={`faq-item ${openFaq === i ? "open" : ""}`}
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="faq-q-text" itemProp="name">{faq.q}</span>
                    <span className="faq-chevron" aria-hidden="true">▾</span>
                  </button>
                  <div
                    className="faq-answer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="blog-cta" role="complementary" aria-label="Contact Infinaut">
              <div className="blog-cta-badge">
                <span>🚀</span> Free Consultation
              </div>
              <h3 className="blog-cta-title">
                Ready to Implement AI in Your Business?
              </h3>
              <p className="blog-cta-sub">
                Infinaut builds custom AI-powered digital systems for Indian businesses.
                Website, chatbot, content, SEO — fully done-for-you. No tech knowledge needed.
              </p>
              <button className="blog-cta-btn" onClick={handleContactClick}>
                Talk to Infinaut → Free Call
              </button>
            </div>

            <div className="share-bar" role="region" aria-label="Share this article">
              <span className="share-label">Share</span>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SEO.title)}&url=${encodeURIComponent(SEO.canonical)}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn"
                aria-label="Share on X (Twitter)"
              >
                𝕏 Twitter
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SEO.canonical)}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn"
                aria-label="Share on LinkedIn"
              >
                in LinkedIn
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(SEO.title + " " + SEO.canonical)}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn"
                aria-label="Share on WhatsApp"
              >
                💬 WhatsApp
              </a>

              <button
                className={`share-btn share-copy ${copied ? "copied" : ""}`}
                onClick={copyLink}
                aria-label="Copy article link"
              >
                {copied ? "✓ Copied!" : "🔗 Copy Link"}
              </button>
            </div>
          </article>

          <aside className="blog-sidebar" aria-label="Table of contents">
            <div className="toc-card">
              <div className="toc-progress">
                <div className="toc-circle-wrap" aria-hidden="true">
                  <svg className="toc-circle-svg" width="36" height="36" viewBox="0 0 36 36">
                    <circle className="toc-circle-bg" cx="18" cy="18" r="15.5" />
                    <circle
                      className="toc-circle-fill" cx="18" cy="18" r="15.5"
                      strokeDasharray="97.4"
                      strokeDashoffset={97.4 - (97.4 * readProgress) / 100}
                    />
                  </svg>
                  <div className="toc-pct">{Math.round(readProgress)}%</div>
                </div>
                <span className="toc-progress-label">Reading progress</span>
              </div>

              <div className="toc-title">Table of Contents</div>
              <ul className="toc-list" role="navigation" aria-label="Article sections">
                {TOC.map(({ id, label }) => (
                  <li
                    key={id}
                    className={`toc-item ${activeSection === id ? "active" : ""}`}
                    onClick={() => scrollTo(id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && scrollTo(id)}
                    aria-current={activeSection === id ? "true" : undefined}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-cta">
              <div className="sidebar-cta-title">Need Help with AI for Your Business?</div>
              <p className="sidebar-cta-sub">
                Infinaut sets up your full AI digital system — content, chatbot, SEO, ads.
                Book a free 30-min call.
              </p>
              <button className="sidebar-cta-btn" onClick={handleContactClick}>Book Free Call →</button>
            </div>
          </aside>
        </div>

        <section className="related-section" aria-label="Related articles">
          <div className="related-header">
            <h2 className="related-title">Continue Reading</h2>
            <span className="related-subtitle">More guides for Indian businesses</span>
          </div>

          <div className="related-grid">
            {RELATED.map((art) => (
              <a
                key={art.href}
                href={art.href}
                className="related-card"
                aria-label={art.title}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(art.href);
                }}
              >
                <span className="related-card-tag">{art.tag}</span>
                <h3 className="related-card-title">{art.title}</h3>
                <p className="related-card-desc">{art.desc}</p>
                <div className="related-card-footer">
                  <span>⏱ {art.time}</span>
                  <span>Infinaut Team</span>
                  <span className="related-card-arrow">→</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <button
        className="toc-mobile-btn"
        onClick={() => setTocOpen(!tocOpen)}
        aria-label="Open table of contents"
      >
        ☰
      </button>

      <div
        className={`toc-mobile-overlay ${tocOpen ? "open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setTocOpen(false)}
      >
        <div className="toc-mobile-sheet">
          <div className="toc-title" style={{ marginBottom: 16, fontSize: 11 }}>
            Table of Contents
          </div>
          <ul className="toc-list">
            {TOC.map(({ id, label }) => (
              <li
                key={id}
                className={`toc-item ${activeSection === id ? "active" : ""}`}
                onClick={() => scrollTo(id)}
                style={{ fontSize: 14, padding: "9px 0" }}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}