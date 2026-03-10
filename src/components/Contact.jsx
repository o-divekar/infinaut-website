import { useState, useEffect, useRef } from "react";

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

function Contact() {
  const [sectionRef, inView] = useInView();
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionInnerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = sectionInnerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSubmitted(true); }, 1800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --gold: #c8a96e;
          --gold-dim: rgba(200,169,110,0.12);
          --gold-line: rgba(200,169,110,0.3);
          --bg: #080808;
          --bg2: #0d0d10;
          --text: #f0ede8;
          --text-muted: rgba(240,237,232,0.4);
          --text-dim: rgba(240,237,232,0.65);
          --border: rgba(255,255,255,0.07);
          --border-focus: rgba(200,169,110,0.5);
        }

        /* ── Section wrapper ── */
        .contact-section {
          background: linear-gradient(160deg, var(--bg2) 0%, var(--bg) 100%);
          padding: 120px 0 100px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Mono', monospace;
        }

        /* Grid texture */
        .contact-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(200,169,110,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,169,110,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* Dynamic radial orb that follows mouse */
        .contact-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 68%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: left 0.8s cubic-bezier(0.2,0,0.2,1), top 0.8s cubic-bezier(0.2,0,0.2,1);
        }

        /* Corner decorations */
        .contact-corner {
          position: absolute;
          width: 48px;
          height: 48px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.8s ease 0.2s;
        }
        .contact-corner.visible { opacity: 1; }
        .contact-corner.tl { top: 48px; left: 48px; border-top: 1px solid var(--gold-line); border-left: 1px solid var(--gold-line); }
        .contact-corner.br { bottom: 48px; right: 48px; border-bottom: 1px solid var(--gold-line); border-right: 1px solid var(--gold-line); }

        /* ── Inner layout ── */
        .contact-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 48px;
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 80px;
          align-items: start;
        }

        /* ── Left column ── */
        .contact-left {
          opacity: 0;
          transform: translateX(-28px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .contact-left.visible { opacity: 1; transform: translateX(0); }

        .contact-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
        }
        .contact-eyebrow-line { width: 36px; height: 1px; background: var(--gold); }
        .contact-eyebrow-text {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold);
        }

        .contact-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 4.5vw, 58px);
          font-weight: 700;
          line-height: 1.08;
          color: var(--text);
          margin-bottom: 24px;
        }
        .contact-headline em { font-style: italic; color: var(--gold); }

        .contact-subtext {
          font-size: 12px; font-weight: 300;
          line-height: 1.85; color: var(--text-dim);
          margin-bottom: 48px;
        }

        /* Contact info rows */
        .contact-info { display: flex; flex-direction: column; gap: 0; }

        .contact-info-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .contact-info-row::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: var(--gold);
          transition: width 0.4s ease;
        }
        .contact-info-row:hover::after { width: 100%; }

        .contact-info-icon {
          width: 32px; height: 32px;
          border: 1px solid var(--gold-line);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: var(--gold);
          flex-shrink: 0;
          transition: background 0.25s ease;
        }
        .contact-info-row:hover .contact-info-icon { background: var(--gold-dim); }

        .contact-info-label {
          font-size: 9px; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--text-muted);
          display: block; margin-bottom: 2px;
        }
        .contact-info-value {
          font-size: 12.5px; font-weight: 400; color: var(--text-dim);
          transition: color 0.25s ease;
        }
        .contact-info-row:hover .contact-info-value { color: var(--text); }

        /* ── Right column — Form ── */
        .contact-right {
          opacity: 0;
          transform: translateX(28px);
          transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
        }
        .contact-right.visible { opacity: 1; transform: translateX(0); }

        .contact-form { display: flex; flex-direction: column; gap: 20px; }

        /* Field wrapper */
        .contact-field { position: relative; }

        .contact-field-label {
          display: block;
          font-size: 9px; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--text-muted);
          margin-bottom: 8px;
          transition: color 0.25s ease;
        }
        .contact-field.is-focused .contact-field-label { color: var(--gold); }

        .contact-input, .contact-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 300;
          padding: 14px 16px;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
          resize: none;
        }

        .contact-input::placeholder, .contact-textarea::placeholder {
          color: rgba(240,237,232,0.2);
        }

        .contact-input:focus, .contact-textarea:focus {
          border-color: var(--border-focus);
          background: rgba(200,169,110,0.04);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.06);
        }

        /* Animated bottom bar on focus */
        .contact-field-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0;
          background: var(--gold);
          transition: width 0.35s ease;
        }
        .contact-field.is-focused .contact-field-bar { width: 100%; }

        /* Submit button */
        .contact-submit {
          position: relative;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #000;
          background: var(--gold);
          border: none;
          padding: 16px 28px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          margin-top: 4px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }

        .contact-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(200,169,110,0.3);
        }
        .contact-submit:active { transform: translateY(0); }
        .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Shimmer sweep */
        .contact-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }
        .contact-submit:hover::before { transform: translateX(100%); }

        /* Spinner */
        .contact-spinner {
          width: 14px; height: 14px;
          border: 1.5px solid rgba(0,0,0,0.25);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Success state ── */
        .contact-success {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; gap: 20px;
          padding: 48px 32px;
          border: 1px solid var(--border);
          background: rgba(200,169,110,0.03);
          animation: successFade 0.6s ease forwards;
        }
        @keyframes successFade {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .contact-success-mark {
          width: 52px; height: 52px;
          border: 1px solid var(--gold);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: var(--gold);
          animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        @keyframes checkPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .contact-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 600; color: var(--text);
        }
        .contact-success-sub {
          font-size: 11px; font-weight: 300; color: var(--text-muted);
          line-height: 1.8; letter-spacing: 0.05em;
        }
      `}</style>

      <section
        id="contact"
        className="contact-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        <div className="contact-grid-bg" />
        <div
          className="contact-orb"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div className={`contact-corner tl ${inView ? "visible" : ""}`} />
        <div className={`contact-corner br ${inView ? "visible" : ""}`} />

        <div className="contact-inner" ref={sectionInnerRef}>

          {/* ── Left ── */}
          <div className={`contact-left ${inView ? "visible" : ""}`}>
            <div className="contact-eyebrow">
              <div className="contact-eyebrow-line" />
              <span className="contact-eyebrow-text">Get In Touch</span>
            </div>

            <h2 className="contact-headline">
              Let's Build<br />
              Something<br />
              <em>That Lasts.</em>
            </h2>

            <p className="contact-subtext">
              Infinaut works with forward-thinking businesses ready to move
              beyond conventional digital presence. Tell us about your vision.
            </p>

            <div className="contact-info">
              {[
                { icon: "✉", label: "Email", value: "hello@infinaut.com" },
                { icon: "◎", label: "Website", value: "www.infinaut.com" },
                { icon: "◈", label: "Based In", value: "Global · Remote-First" },
              ].map((row) => (
                <div className="contact-info-row" key={row.label}>
                  <div className="contact-info-icon">{row.icon}</div>
                  <div>
                    <span className="contact-info-label">{row.label}</span>
                    <span className="contact-info-value">{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — Form ── */}
          <div className={`contact-right ${inView ? "visible" : ""}`}>
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-mark">✓</div>
                <div className="contact-success-title">Message Received.</div>
                <p className="contact-success-sub">
                  We'll be in touch shortly.<br />
                  In the meantime — explore what we build.
                </p>
              </div>
            ) : (
              <div className="contact-form">
                {[
                  { id: "name", label: "Your Name", type: "input", inputType: "text", placeholder: "Jane Smith" },
                  { id: "email", label: "Email Address", type: "input", inputType: "email", placeholder: "jane@company.com" },
                  { id: "message", label: "Your Message", type: "textarea", placeholder: "Tell us about your project…" },
                ].map((field) => (
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

                <button
                  className="contact-submit"
                  onClick={handleSubmit}
                  disabled={sending}
                >
                  {sending ? (
                    <><div className="contact-spinner" /> Sending…</>
                  ) : (
                    <>Send Message <span>→</span></>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}

export default Contact;