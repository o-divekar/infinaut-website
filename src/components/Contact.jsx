import { useState, useEffect, useRef } from "react";
import SEO from "./SEO";

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

function Contact() {
  const [sectionRef, inView] = useInView();
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const sectionInnerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = sectionInnerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    
    setSending(true);
    setError(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/29268a025656597069e295d342ffce69', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
        _subject: `New Contact from ${form.name}`,
        _template: 'table',
        _captcha: false
      })
      });

      const result = await response.json();
      
      if (result.success === "true") {
        setSubmitted(true);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const infoRows = [
    { icon: "✉", label: "Email", value: "hello@infinaut.tech", action: "mailto:hello@infinaut.tech" },
    { icon: "🌐", label: "Website", value: "www.infinaut.tech", action: "https://www.infinaut.tech" },
    { icon: "📍", label: "Based In", value: "Global · Remote-First" },
  ];

  const fields = [
    { id: "name",    label: "Your Name",      type: "input",    inputType: "text",  placeholder: "Jane Smith" },
    { id: "email",   label: "Email Address",  type: "input",    inputType: "email", placeholder: "jane@company.com" },
    { id: "message", label: "Your Message",   type: "textarea", placeholder: "Tell us about your project…" },
  ];

  // Social buttons - Instagram added, Discord removed
  const socialButtons = [
    { icon: "🅾", label: "Instagram", url: "https://www.instagram.com/infinaut.tech?igsh=MXBrbmc1MmgzZWNodA=="},
    { icon: "𝕏", label: "Twitter/X", url: "https://twitter.com/infinaut" },
    { icon: "in", label: "LinkedIn", url: "https://linkedin.com/company/infinaut" },
    { icon: "▶", label: "YouTube", url: "https://youtube.com/@infinaut" },
  ];

  const handleSocialClick = (url) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        .contact-section {
          --pu:         #7c3aed;
          --pu-bright:  #a855f7;
          --pu-dim:     rgba(124,58,237,0.12);
          --pu-line:    rgba(168,85,247,0.28);
          --pu-glow:    rgba(124,58,237,0.22);
          --bg:         #06000f;
          --bg2:        #0d0020;
          --text:       #f0eeff;
          --text-muted: rgba(240,238,255,0.38);
          --text-dim:   rgba(240,238,255,0.65);
          --border:     rgba(168,85,247,0.12);
          --focus:      rgba(168,85,247,0.5);
          --error:      #ff4d4d;

          background: linear-gradient(155deg, var(--bg2) 0%, var(--bg) 60%, #0a0118 100%);
          padding: 120px 0 100px;
          position: relative; overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* ── Circuit grid ── */
        .contact-circuit-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px);
          background-size: 64px 64px; pointer-events: none;
        }

        /* ── Mouse orb ── */
        .contact-orb {
          position: absolute; width: 640px; height: 640px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.13) 0%, rgba(168,85,247,0.05) 45%, transparent 70%);
          transform: translate(-50%,-50%); pointer-events: none;
          transition: left 0.9s cubic-bezier(0.2,0,0.2,1), top 0.9s cubic-bezier(0.2,0,0.2,1);
        }

        /* Static ambient orbs */
        .contact-orb-tl {
          position: absolute; top: -100px; left: -80px;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 65%);
          pointer-events: none; animation: floatA 7s ease-in-out infinite;
        }
        .contact-orb-br {
          position: absolute; bottom: -80px; right: -60px;
          width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%);
          pointer-events: none; animation: floatB 9s ease-in-out infinite;
        }
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }

        /* ── Circuit SVG ── */
        .contact-circuit-svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none; opacity: 0.15;
        }

        /* ── Corner brackets ── */
        .contact-corner {
          position: absolute; width: 40px; height: 40px;
          pointer-events: none; opacity: 0;
          transition: opacity 0.8s ease 0.3s;
        }
        .contact-corner.visible { opacity: 1; }
        .contact-corner.tl { top: 40px; left: 40px; border-top: 1px solid var(--pu-line); border-left: 1px solid var(--pu-line); }
        .contact-corner.tr { top: 40px; right: 40px; border-top: 1px solid var(--pu-line); border-right: 1px solid var(--pu-line); }
        .contact-corner.bl { bottom: 40px; left: 40px; border-bottom: 1px solid var(--pu-line); border-left: 1px solid var(--pu-line); }
        .contact-corner.br { bottom: 40px; right: 40px; border-bottom: 1px solid var(--pu-line); border-right: 1px solid var(--pu-line); }

        /* ── Inner layout ── */
        .contact-inner {
          max-width: 1040px; margin: 0 auto;
          padding: 0 48px; position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1.15fr;
          gap: 80px; align-items: start;
        }

        /* ── Left column ── */
        .contact-left {
          opacity: 0; transform: translateX(-28px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .contact-left.visible { opacity: 1; transform: translateX(0); }

        /* Eyebrow pill */
        .contact-eyebrow {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 32px;
        }
        .contact-eyebrow-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(124,58,237,0.14);
          border: 1px solid var(--pu-line);
          border-radius: 100px; padding: 6px 14px;
        }
        .contact-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--pu-bright);
          animation: cDotPulse 2s ease-in-out infinite;
        }
        @keyframes cDotPulse {
          0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.65)}
        }
        .contact-eyebrow-text {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--pu-bright);
        }

        /* Headline */
        .contact-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(34px, 4.2vw, 54px);
          font-weight: 700; line-height: 1.1;
          color: var(--text); margin-bottom: 20px;
        }
        .contact-headline .hl {
          background: linear-gradient(135deg, #a855f7, #7c3aed, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-subtext {
          font-size: 13.5px; font-weight: 300; line-height: 1.85;
          color: var(--text-dim); margin-bottom: 44px;
        }

        /* Info rows */
        .contact-info { display: flex; flex-direction: column; }

        .contact-info-row {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 0; border-bottom: 1px solid var(--border);
          cursor: pointer; position: relative; overflow: hidden;
          transition: background 0.25s ease;
        }
        .contact-info-row::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, var(--pu), var(--pu-bright));
          transition: width 0.4s ease;
        }
        .contact-info-row:hover::after { width: 100%; }

        .contact-info-icon {
          width: 36px; height: 36px;
          border: 1px solid var(--pu-line);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
          background: var(--pu-dim);
          transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .contact-info-row:hover .contact-info-icon {
          background: rgba(124,58,237,0.22);
          border-color: var(--pu-bright);
          box-shadow: 0 0 12px rgba(124,58,237,0.3);
        }

        .contact-info-label {
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--text-muted); display: block; margin-bottom: 2px;
        }
        .contact-info-value {
          font-size: 13px; font-weight: 400; color: var(--text-dim);
          transition: color 0.25s ease;
        }
        .contact-info-row:hover .contact-info-value { color: var(--text); }

        /* Social row */
        .contact-social {
          display: flex; gap: 10px; margin-top: 28px;
          flex-wrap: wrap;
        }
        .contact-social-btn {
          width: 36px; height: 36px;
          border: 1px solid var(--border);
          border-radius: 8px; background: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; cursor: pointer; color: var(--text-muted);
          transition: border-color 0.25s, background 0.25s, color 0.25s, box-shadow 0.25s;
        }
        .contact-social-btn:hover {
          border-color: var(--pu-bright); background: var(--pu-dim);
          color: var(--pu-bright); box-shadow: 0 0 12px rgba(124,58,237,0.25);
        }

        /* ── Right — Form ── */
        .contact-right {
          opacity: 0; transform: translateX(28px);
          transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
        }
        .contact-right.visible { opacity: 1; transform: translateX(0); }

        /* Form card */
        .contact-form-card {
          background: rgba(13,0,32,0.6);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 40px 36px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.08);
          position: relative; overflow: hidden;
        }
        /* Glow top border on form card */
        .contact-form-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--pu), var(--pu-bright), transparent);
        }

        .contact-form { display: flex; flex-direction: column; gap: 22px; }

        /* Field */
        .contact-field { position: relative; }

        .contact-field-label {
          display: block; font-size: 11px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 8px;
          transition: color 0.25s ease;
        }
        .contact-field.is-focused .contact-field-label { color: var(--pu-bright); }

        .contact-input, .contact-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(124,58,237,0.06);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text); font-family: 'Inter', sans-serif;
          font-size: 13.5px; font-weight: 300;
          padding: 13px 16px; outline: none; resize: none;
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .contact-input::placeholder, .contact-textarea::placeholder {
          color: rgba(240,238,255,0.18);
        }
        .contact-input:focus, .contact-textarea:focus {
          border-color: var(--focus);
          background: rgba(124,58,237,0.1);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }

        /* Focus bar */
        .contact-field-bar {
          position: absolute; bottom: 0; left: 8px;
          height: 2px; width: 0; border-radius: 2px;
          background: linear-gradient(90deg, var(--pu), var(--pu-bright));
          transition: width 0.35s ease;
        }
        .contact-field.is-focused .contact-field-bar { width: calc(100% - 16px); }

        /* Error message */
        .contact-error {
          color: var(--error);
          font-size: 12px;
          margin-top: -10px;
          padding: 0 8px;
        }

        /* Submit */
        .contact-submit {
          position: relative; width: 100%;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, var(--pu) 0%, var(--pu-bright) 100%);
          border: none; border-radius: 8px;
          padding: 16px 28px; cursor: pointer; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 4px;
        }
        .contact-submit::before {
          content: ''; position: absolute; inset: 0; border-radius: 8px;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%);
          transform: translateX(-100%); transition: transform 0.55s ease;
        }
        .contact-submit:hover::before { transform: translateX(100%); }
        .contact-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(124,58,237,0.45);
        }
        .contact-submit:active { transform: translateY(0); }
        .contact-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Spinner */
        .contact-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: cSpin 0.7s linear infinite;
        }
        @keyframes cSpin { to { transform: rotate(360deg); } }

        /* ── Success ── */
        .contact-success {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; gap: 20px; padding: 52px 32px;
          animation: cSuccessFade 0.6s ease forwards;
        }
        @keyframes cSuccessFade {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }

        .contact-success-ring {
          width: 64px; height: 64px; border-radius: 50%;
          border: 1px solid var(--pu-line);
          background: var(--pu-dim);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; color: var(--pu-bright);
          box-shadow: 0 0 32px rgba(124,58,237,0.3);
          animation: cCheckPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        @keyframes cCheckPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .contact-success-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 26px; font-weight: 700; color: var(--text);
        }
        .contact-success-sub {
          font-size: 13px; font-weight: 300; color: var(--text-muted);
          line-height: 1.8;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .contact-inner {
            grid-template-columns: 1fr;
            gap: 48px; padding: 0 32px;
          }
          .contact-left { transform: translateX(0); }
          .contact-right { transform: translateX(0); }
          .contact-left.visible { transform: translateX(0); }
          .contact-right.visible { transform: translateX(0); }
        }

        @media (max-width: 768px) {
          .contact-section { padding: 80px 0 72px; }
          .contact-inner { padding: 0 20px; gap: 40px; }
          .contact-headline { font-size: clamp(28px, 7vw, 40px); }
          .contact-form-card { padding: 28px 20px; }
          .contact-corner.bl, .contact-corner.tr { display: none; }
        }

        @media (max-width: 480px) {
          .contact-section { padding: 64px 0 56px; }
          .contact-inner { padding: 0 16px; }
          .contact-headline { font-size: clamp(26px, 8vw, 34px); }
          .contact-form-card { padding: 24px 16px; border-radius: 12px; }
          .contact-social { flex-wrap: wrap; }
        }
      `}</style>

      <section
        id="contact"
        className="contact-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        {/* Background layers */}
        <div className="contact-circuit-grid" />
        <div className="contact-orb-tl" />
        <div className="contact-orb-br" />
        <div
          className="contact-orb"
          ref={sectionInnerRef}
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />

        {/* Circuit lines */}
        <svg className="contact-circuit-svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
          <path d="M0 150 L180 150 L180 280 L420 280" stroke="rgba(124,58,237,0.6)" strokeWidth="1" fill="none"
            strokeDasharray="500" strokeDashoffset="500">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="2s" begin="0.4s" fill="freeze"/>
          </path>
          <path d="M1200 80 L980 80 L980 200 L750 200" stroke="rgba(168,85,247,0.5)" strokeWidth="1" fill="none"
            strokeDasharray="460" strokeDashoffset="460">
            <animate attributeName="stroke-dashoffset" from="460" to="0" dur="2s" begin="0.7s" fill="freeze"/>
          </path>
          <path d="M600 700 L600 520 L820 520 L820 420" stroke="rgba(124,58,237,0.35)" strokeWidth="1" fill="none"
            strokeDasharray="380" strokeDashoffset="380">
            <animate attributeName="stroke-dashoffset" from="380" to="0" dur="1.8s" begin="1s" fill="freeze"/>
          </path>
        </svg>

        {/* Corner brackets */}
        {["tl","tr","bl","br"].map(c => (
          <div key={c} className={`contact-corner ${c} ${inView ? "visible" : ""}`} />
        ))}

        <div className="contact-inner">

          {/* ── Left ── */}
          <div className={`contact-left ${inView ? "visible" : ""}`}>
            <div className="contact-eyebrow">
              <div className="contact-eyebrow-pill">
                <div className="contact-eyebrow-dot" />
                <span className="contact-eyebrow-text">Get In Touch</span>
              </div>
            </div>

            <h2 className="contact-headline">
              Let's Build<br />
              Something<br />
              <span className="hl">That Lasts.</span>
            </h2>

            <p className="contact-subtext">
              Infinaut works with forward-thinking businesses ready to move
              beyond conventional digital presence. Tell us about your vision —
              we'll build the ecosystem around it.
            </p>

            <div className="contact-info">
              {infoRows.map((row) => (
                <div 
                  className="contact-info-row" 
                  key={row.label}
                  onClick={() => row.action && window.open(row.action, '_blank')}
                >
                  <div className="contact-info-icon">{row.icon}</div>
                  <div>
                    <span className="contact-info-label">{row.label}</span>
                    <span className="contact-info-value">{row.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Social buttons - Instagram added */}
            <div className="contact-social">
              {socialButtons.map((social) => (
                <button 
                  key={social.label} 
                  className="contact-social-btn"
                  onClick={() => handleSocialClick(social.url)}
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right — Form ── */}
          <div className={`contact-right ${inView ? "visible" : ""}`}>
            {submitted ? (
              <div className="contact-form-card">
                <div className="contact-success">
                  <div className="contact-success-ring">✓</div>
                  <div className="contact-success-title">Message Received.</div>
                  <p className="contact-success-sub">
                    We'll be in touch shortly.<br />
                    In the meantime — explore what we build.
                  </p>
                </div>
              </div>
            ) : (
              <div className="contact-form-card">
                <div className="contact-form">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`contact-field ${focused === field.id ? "is-focused" : ""}`}
                    >
                      <label className="contact-field-label">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          className="contact-textarea"
                          rows={5}
                          placeholder={field.placeholder}
                          value={form[field.id]}
                          onFocus={() => setFocused(field.id)}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                        />
                      ) : (
                        <input
                          className="contact-input"
                          type={field.inputType}
                          placeholder={field.placeholder}
                          value={form[field.id]}
                          onFocus={() => setFocused(field.id)}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                        />
                      )}
                      <div className="contact-field-bar" />
                    </div>
                  ))}

                  {error && (
                    <div className="contact-error">{error}</div>
                  )}

                  <button
                    className="contact-submit"
                    onClick={handleSubmit}
                    disabled={sending || !form.name || !form.email || !form.message}
                    aria-label="Start a conversation with our team"
                  >
                    {sending ? (
                      <><div className="contact-spinner" /> Sending…</>
                    ) : (
                      <>Send Message <span>→</span></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
      <SEO 
        title="Contact - Infinaut"
        description="Infinaut works with forward-thinking businesses ready to move beyond conventional digital presence. Tell us about your vision — we'll build the ecosystem around it."
      />
    </>
    
  );
}

export default Contact;