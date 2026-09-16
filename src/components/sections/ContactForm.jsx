import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight,
  Globe, 
  Cpu, 
  Smartphone, 
  Palette, 
  Layers, 
  Lightbulb, 
  Sparkles,
  Send,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Check,
  AlertCircle,
  User,
  Mail,
  MessageSquare
} from 'lucide-react';

function TypewriterTitle({ text, stepIndex, currentStep, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState('');
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // If this step already animated once, keep text full
    if (hasAnimatedRef.current) {
      setDisplayedText(text);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    if (currentStep !== stepIndex) {
      return;
    }

    let timeoutId;
    let intervalId;

    const startTyping = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      // Cursor is already animating; start typing characters after brief pause
      timeoutId = setTimeout(() => {
        let charIdx = 0;
        intervalId = setInterval(() => {
          charIdx++;
          setDisplayedText(text.slice(0, charIdx));
          if (charIdx >= text.length) {
            clearInterval(intervalId);
          }
        }, speed);
      }, 250);
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            startTyping();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);

      return () => {
        observer.disconnect();
        clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
      };
    } else {
      startTyping();
      return () => {
        clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [currentStep, stepIndex, text, speed]);

  return (
    <h3 className="pane-title" ref={containerRef}>
      <span>{hasAnimatedRef.current ? (displayedText || text) : displayedText}</span>
      <span className="typewriter-cursor">|</span>
    </h3>
  );
}

const SERVICES = [
  { id: 'web', label: 'Web Applications', icon: Globe },
  { id: 'ai', label: 'AI & Systems', icon: Cpu },
  { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
  { id: 'design', label: 'UI/UX Design', icon: Palette },
  { id: 'fullstack', label: 'Full-Stack Engineering', icon: Layers },
  { id: 'consulting', label: 'Technical Consulting', icon: Lightbulb }
];

export default function ContactForm() {
  const [selectedServices, setSelectedServices] = useState(['Web Applications']);
  const [step, setStep] = useState(1); // 1: Services, 2: Details, 3: Brief (mobile wizard)
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [fieldErrors, setFieldErrors] = useState({});

  const toggleService = (label) => {
    setSelectedServices(prev =>
      prev.includes(label)
        ? prev.length > 1 ? prev.filter(s => s !== label) : prev
        : [...prev, label]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleNextStep = (targetStep) => {
    if (targetStep === 2) {
      if (selectedServices.length === 0) {
        return;
      }
    }
    if (targetStep === 3) {
      if (!formData.name.trim()) {
        setFieldErrors({ name: 'Please fill out this field.' });
        document.getElementById('form-name')?.focus();
        return;
      }
      if (!formData.contact.trim()) {
        setFieldErrors({ contact: 'Please fill out this field.' });
        document.getElementById('form-contact')?.focus();
        return;
      }
    }
    setFieldErrors({});
    setStep(targetStep);
  };

  const handlePrevStep = () => {
    setFieldErrors({});
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStep(2);
      setFieldErrors({ name: 'Please fill out this field.' });
      setTimeout(() => document.getElementById('form-name')?.focus(), 60);
      return;
    }
    if (!formData.contact.trim()) {
      setStep(2);
      setFieldErrors({ contact: 'Please fill out this field.' });
      setTimeout(() => document.getElementById('form-contact')?.focus(), 60);
      return;
    }
    if (!formData.message.trim()) {
      setStep(3);
      setFieldErrors({ message: 'Please fill out this field.' });
      setTimeout(() => document.getElementById('form-message')?.focus(), 60);
      return;
    }

    setFieldErrors({});
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
    }, 850);
  };

  const handleReset = () => {
    setStatus('idle');
    setStep(1);
    setFormData({ name: '', contact: '', message: '' });
    setSelectedServices(['Web Applications']);
    setFieldErrors({});
  };

  return (
    <section className="studio-contact-section" id="contact-form">
      
      {/* Editorial Background Scrolling Marquee */}
      <div className="studio-bg-marquee" aria-hidden="true">
        <div className="studio-marquee-track">
          <span>LET’S BUILD SOMETHING ICONIC</span>
          <span className="marquee-star">✦</span>
          <span>AVAILABLE FOR SELECT PROJECTS</span>
          <span className="marquee-star">✦</span>
          <span>DIRECT INQUIRY</span>
          <span className="marquee-star">✦</span>
          <span>CREATIVE ENGINEERING</span>
          <span className="marquee-star">✦</span>
          <span>LET’S BUILD SOMETHING ICONIC</span>
          <span className="marquee-star">✦</span>
          <span>AVAILABLE FOR SELECT PROJECTS</span>
          <span className="marquee-star">✦</span>
          <span>DIRECT INQUIRY</span>
          <span className="marquee-star">✦</span>
          <span>CREATIVE ENGINEERING</span>
          <span className="marquee-star">✦</span>
        </div>
      </div>

      <div className="studio-contact-container">
        
        <div className="studio-contact-grid">
          
          {/* Left Column: Direct Studio Line & Trust Perks (Desktop) */}
          <div className="studio-info-col">
            <h2 className="studio-info-headline">
              LET’S BUILD<br />
              SOMETHING<br />
              <span className="accent-word">ICONIC.</span>
            </h2>



            <div className="studio-perks-list">
              <div className="perk-item">
                <div className="perk-icon"><Clock size={16} /></div>
                <div className="perk-text">
                  <strong>24h Rapid Response</strong>
                  <span>Prompt, direct answers with clear milestones.</span>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon"><ShieldCheck size={16} /></div>
                <div className="perk-text">
                  <strong>Direct Engineering</strong>
                  <span>Work directly with Dhanush — zero agency bloat.</span>
                </div>
              </div>
              <div className="perk-item">
                <div className="perk-icon"><Sparkles size={16} /></div>
                <div className="perk-text">
                  <strong>End-to-End Craft</strong>
                  <span>From pixel-perfect UI to resilient production systems.</span>
                </div>
              </div>
            </div>

            <div className="studio-availability-badge">
              <span className="status-ping" />
              <span>Available for select projects & contracts</span>
            </div>
          </div>

          {/* Right Column: Refined Studio Card */}
          <div className="studio-form-col">
            <div className="studio-form-card">
              
              {status === 'sent' ? (
                <div className="studio-step-pane is-active-step studio-success-box">
                  {/* Step Navigation Header (All steps marked completed) */}
                  <div className="mobile-step-header" aria-label="Form Completed">
                    <div className="studio-steps-nav">
                      <div className="step-nav-tab is-done">
                        <span className="step-nav-index">01</span>
                        <span className="step-nav-name">Services</span>
                      </div>

                      <span className="step-nav-sep">/</span>

                      <div className="step-nav-tab is-done">
                        <span className="step-nav-index">02</span>
                        <span className="step-nav-name">Details</span>
                      </div>

                      <span className="step-nav-sep">/</span>

                      <div className="step-nav-tab is-done">
                        <span className="step-nav-index">03</span>
                        <span className="step-nav-name">Brief</span>
                      </div>
                    </div>

                    <div className="step-progress-segments" aria-hidden="true">
                      <div className="step-seg-track is-done">
                        <div className="step-seg-fill" />
                      </div>
                      <div className="step-seg-track is-done">
                        <div className="step-seg-fill" />
                      </div>
                      <div className="step-seg-track is-done">
                        <div className="step-seg-fill" />
                      </div>
                    </div>
                  </div>

                  {/* Tick Seal & Title */}
                  <div className="success-header-block">
                    <div className="success-hero-seal" aria-hidden="true">
                      <div className="seal-outer-ring">
                        <div className="seal-inner-circle">
                          <Check size={26} strokeWidth={3} />
                        </div>
                      </div>
                    </div>

                    <div className="pane-header success-pane-header">
                      <TypewriterTitle text="Inquiry Received." stepIndex={4} currentStep={4} />
                    </div>
                  </div>

                  {/* Body & Submission Confirmation Details */}
                  <div className="success-body-stack">
                    <p className="success-lead-msg">
                      Thanks, <strong>{formData.name || 'there'}</strong>! Your project brief has been recorded.
                    </p>

                    <div className="success-meta-card">
                      {formData.contact && (
                        <div className="success-meta-row">
                          <span className="meta-kicker">CONTACT</span>
                          <span className="meta-pill">{formData.contact}</span>
                        </div>
                      )}

                      {selectedServices.length > 0 && (
                        <div className="success-meta-row">
                          <span className="meta-kicker">SERVICES</span>
                          <div className="meta-chips-wrap">
                            {selectedServices.map(service => (
                              <span key={service} className="meta-service-chip">
                                <Check size={11} strokeWidth={2.5} />
                                <span>{service}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="success-meta-row response-sla-row">
                        <span className="meta-kicker">TIMEFRAME</span>
                        <span className="meta-sla-text">
                          <Clock size={13} strokeWidth={2.2} />
                          <span>Reviewing specs & connecting within 24 hours</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Exact full-width styling matching previous steps */}
                  <div className="mobile-step-nav success-btn-nav">
                    <button 
                      type="button" 
                      className="studio-theme-btn mobile-step-btn" 
                      onClick={handleReset}
                    >
                      <span className="btn-label">Send Another Note</span>
                      <span className="btn-arrow-bubble">
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="studio-inquiry-form" noValidate>
                  
                  {/* Mobile Step Navigation Header */}
                  <div className="mobile-step-header" aria-label="Form Progress">
                    <div className="studio-steps-nav">
                      <button 
                        type="button" 
                        className={`step-nav-tab ${step === 1 ? 'is-active' : step > 1 ? 'is-done' : ''}`}
                        onClick={() => setStep(1)}
                      >
                        <span className="step-nav-index">01</span>
                        <span className="step-nav-name">Services</span>
                      </button>

                      <span className="step-nav-sep">/</span>

                      <button 
                        type="button" 
                        className={`step-nav-tab ${step === 2 ? 'is-active' : step > 2 ? 'is-done' : ''}`}
                        onClick={() => selectedServices.length > 0 && setStep(2)}
                      >
                        <span className="step-nav-index">02</span>
                        <span className="step-nav-name">Details</span>
                      </button>

                      <span className="step-nav-sep">/</span>

                      <button 
                        type="button" 
                        className={`step-nav-tab ${step === 3 ? 'is-active' : ''}`}
                        onClick={() => handleNextStep(3)}
                      >
                        <span className="step-nav-index">03</span>
                        <span className="step-nav-name">Brief</span>
                      </button>
                    </div>

                    <div className="step-progress-segments" aria-hidden="true">
                      <div className={`step-seg-track ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-done' : ''}`}>
                        <div className="step-seg-fill" />
                      </div>
                      <div className={`step-seg-track ${step >= 2 ? 'is-active' : ''} ${step > 2 ? 'is-done' : ''}`}>
                        <div className="step-seg-fill" />
                      </div>
                      <div className={`step-seg-track ${step >= 3 ? 'is-active' : ''}`}>
                        <div className="step-seg-fill" />
                      </div>
                    </div>
                  </div>

                  {/* Step 1: Services Selection */}
                  <div className={`studio-step-pane step-1-pane ${step === 1 ? 'is-active-step' : ''}`}>
                    <div className="pane-header">
                      <div className="pane-kicker">STEP 01</div>
                      <TypewriterTitle text="What are you looking to build?" stepIndex={1} currentStep={step} />
                    </div>

                    <div className="services-pills-wrap">
                      {SERVICES.map((s) => {
                        const active = selectedServices.includes(s.label);
                        const Icon = s.icon;
                        return (
                          <button
                            type="button"
                            key={s.id}
                            className={`service-pill-chip ${active ? 'is-selected' : ''}`}
                            onClick={() => toggleService(s.label)}
                            aria-pressed={active}
                          >
                            <span className="chip-icon">
                              <Icon size={14} />
                            </span>
                            <span className="chip-label">{s.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile Step 1 Navigation */}
                    <div className="mobile-step-nav">
                      <button
                        type="button"
                        className="studio-theme-btn mobile-step-btn"
                        onClick={() => handleNextStep(2)}
                      >
                        <span className="btn-label">Next: Your Details</span>
                        <span className="btn-arrow-bubble">
                          <ArrowRight size={18} strokeWidth={2.5} />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Contact Details */}
                  <div className={`studio-step-pane step-2-pane ${step === 2 ? 'is-active-step' : ''}`}>
                    <div className="pane-header">
                      <div className="pane-kicker">STEP 02</div>
                      <TypewriterTitle text="How can I reach you?" stepIndex={2} currentStep={step} />
                    </div>

                    <div className="form-fields-stack">
                      <div className="field-group">
                        <label htmlFor="form-name" className="field-label">
                          <span>Name</span> <span className="req-star">*</span>
                        </label>
                        <div className="field-input-wrap">
                          <div className="input-icon-slot" aria-hidden="true">
                            <User size={18} />
                          </div>
                          <input
                            type="text"
                            id="form-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`studio-card-input ${fieldErrors.name ? 'has-field-error' : ''} ${formData.name.trim() ? 'is-filled' : ''}`}
                            autoComplete="name"
                          />
                          {formData.name.trim() && (
                            <div className="input-valid-indicator" aria-hidden="true">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                          {fieldErrors.name && (
                            <div className="studio-bubble-tooltip" role="alert">
                              <span className="bubble-pointer" />
                              <span className="bubble-badge">!</span>
                              <span className="bubble-text">{fieldErrors.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="field-group">
                        <label htmlFor="form-contact" className="field-label">
                          <span>Phone</span> <span className="req-star">*</span>
                        </label>
                        <div className="field-input-wrap">
                          <div className="input-icon-slot" aria-hidden="true">
                            <Mail size={18} />
                          </div>
                          <input
                            type="text"
                            id="form-contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className={`studio-card-input ${fieldErrors.contact ? 'has-field-error' : ''} ${formData.contact.trim() ? 'is-filled' : ''}`}
                            autoComplete="email"
                          />
                          {formData.contact.trim() && (
                            <div className="input-valid-indicator" aria-hidden="true">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                          {fieldErrors.contact && (
                            <div className="studio-bubble-tooltip" role="alert">
                              <span className="bubble-pointer" />
                              <span className="bubble-badge">!</span>
                              <span className="bubble-text">{fieldErrors.contact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Step 2 Navigation */}
                    <div className="mobile-step-nav has-back">
                      <button
                        type="button"
                        className="studio-back-btn"
                        onClick={handlePrevStep}
                      >
                        <ArrowLeft size={16} strokeWidth={2.5} />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        className="studio-theme-btn mobile-step-btn"
                        onClick={() => handleNextStep(3)}
                      >
                        <span className="btn-label">Next: Brief</span>
                        <span className="btn-arrow-bubble">
                          <ArrowRight size={18} strokeWidth={2.5} />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Project Brief */}
                  <div className={`studio-step-pane step-3-pane ${step === 3 ? 'is-active-step' : ''}`}>
                    <div className="pane-header">
                      <div className="pane-kicker">STEP 03</div>
                      <TypewriterTitle text="Tell me about your vision" stepIndex={3} currentStep={step} />
                    </div>

                    <div className="form-fields-stack">
                      <div className="field-group">
                        <label htmlFor="form-message" className="field-label">
                          <span>Project Brief / Message</span> <span className="req-star">*</span>
                        </label>
                        <div className="field-input-wrap">
                          <div className="input-icon-slot is-textarea" aria-hidden="true">
                            <MessageSquare size={18} />
                          </div>
                          <textarea
                            id="form-message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            className={`studio-card-textarea ${fieldErrors.message ? 'has-field-error' : ''} ${formData.message.trim() ? 'is-filled' : ''}`}
                          />
                          {formData.message.trim() && (
                            <div className="input-valid-indicator is-textarea" aria-hidden="true">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                          {fieldErrors.message && (
                            <div className="studio-bubble-tooltip" role="alert">
                              <span className="bubble-pointer" />
                              <span className="bubble-badge">!</span>
                              <span className="bubble-text">{fieldErrors.message}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Step 3 Navigation */}
                    <div className="mobile-step-nav has-back">
                      <button
                        type="button"
                        className="studio-back-btn"
                        onClick={handlePrevStep}
                      >
                        <ArrowLeft size={16} strokeWidth={2.5} />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        className="studio-theme-btn mobile-step-btn"
                        disabled={status === 'sending'}
                      >
                        <span className="btn-label">{status === 'sending' ? 'Transmitting...' : 'Send Inquiry'}</span>
                        <span className="btn-arrow-bubble">
                          <Send size={16} strokeWidth={2.5} />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Submit Button */}
                  <div className="studio-desktop-footer">
                    <button
                      type="submit"
                      className="studio-theme-btn desktop-submit-btn"
                      disabled={status === 'sending'}
                    >
                      <span className="btn-label">{status === 'sending' ? 'Transmitting...' : 'Send Project Inquiry'}</span>
                      <span className="btn-arrow-bubble">
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </span>
                    </button>
                    <div className="desktop-footer-trust">
                      <span>🔒 100% Direct & Confidential</span>
                      <span>⚡ 24h Response Guaranteed</span>
                    </div>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

        {/* Alternative Guide: "Not sure what you need yet?" */}
        <div className="studio-alt-guide">
          <div className="alt-guide-divider" />
          <div className="alt-guide-content">
            <h3 className="alt-guide-heading">Not sure what you need yet?</h3>
            <p className="alt-guide-desc">
              Look through the work or the service breakdown first. Either one is a faster way to work out whether we are the right fit.
            </p>
            <div className="alt-guide-actions">
              <a href="/#work" className="alt-btn-primary" data-cursor="project">
                <span>See the work</span>
                <ArrowUpRight size={17} strokeWidth={2.4} />
              </a>
              <a href="/#capabilities" className="alt-btn-secondary">
                <span>View services</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
