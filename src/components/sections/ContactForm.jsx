import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotchedCard from '../common/NotchedCard';
import KineticStage from '../common/KineticStage';
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
  RotateCcw,
  User,
  Mail,
  Phone,
  MessageSquare,
  ShoppingBag,
  Zap,
  BarChart3,
  Layout
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
      <span className="typewriter-cursor" aria-hidden="true" />
    </h3>
  );
}

const SERVICES = [
  { id: 'general', label: 'General Conversation', icon: MessageSquare },
  { id: 'ai-rag', label: 'AI & RAG', icon: Cpu },
  { id: 'custom-software', label: 'Custom Software', icon: Layers },
  { id: 'web-apps', label: 'Websites', icon: Globe },
  { id: 'mobile-apps', label: 'Mobile Apps', icon: Smartphone },
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
  { id: 'automation', label: 'AI Automation', icon: Zap },
  { id: 'portfolio', label: 'Portfolio', icon: User },
  { id: 'landing-pages', label: 'Landing Pages', icon: Layout },
  { id: 'dashboards', label: 'Dashboards', icon: BarChart3 }
];

const SERVICES_STAGE_PHRASES = [
  { words: ['AI &', 'RAG'], color: '#E04420' },
  { words: ['Web &', 'apps'], color: '#6D5AE6' },
  { words: ['E-Com', 'stores'], color: '#D97706' },
  { words: ['Smart', 'automation'], color: '#2563EB' },
  { words: ['Landing', 'pages'], color: '#DB2777' },
  { words: ['Live', 'dashboards'], color: '#059669' }
];

const trackAnalytics = (eventName, data = {}) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, data);
    } else if (typeof window !== 'undefined' && typeof window.va === 'function') {
      window.va('event', { name: eventName, data });
    }
  } catch {
    // Graceful no-op if analytics unavailable
  }
};

/**
 * HubDiscoveryCard
 * Mirrors WhyCreatives' NotchedProjectCard:
 * - 3D tilt perspective entrance with projectImageReveal
 * - Responsive tag hover elevation
 * - Tactile micro-press feedback
 * - Fluid smooth navigation
 */
function HubDiscoveryCard({
  tags,
  meta,
  drawerLabel,
  phrases,
  headline,
  cardIndex = 0,
  onCardClick,
  ariaLabel,
}) {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`why-service-card-group ${inView ? 'in-view' : ''}`}
      style={{
        transitionDelay: `${cardIndex * 0.14}s`,
      }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick();
        }
      }}
    >
      <div className="why-hub-card-inner">
        <NotchedCard
          bezelWidth={7}
          bezelColor="#111111"
          className="why-service-notched-wrapper"
          surfaceClassName="why-service-surface-light"
          tags={
            <div className="why-tags-row">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="why-tag-pill why-tag-pill-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          }
          meta={
            <div className="why-meta-row">
              <span className="why-meta-year">2026</span>
              <span className="why-meta-sep">•</span>
              <span className="why-meta-cat">{meta}</span>
            </div>
          }
          overlay={
            <div className="why-card-hover-drawer">
              <span>{drawerLabel}</span>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
          }
        >
          <KineticStage
            tone="light"
            intervalMs={2200}
            seed={cardIndex}
            phrases={phrases}
          />
        </NotchedCard>
      </div>

      <div className="why-service-below-info">
        <h4 className="why-service-headline">
          {headline}
        </h4>
      </div>
    </div>
  );
}

export default function ContactForm() {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState(['General Conversation']);
  const [step, setStep] = useState(1); // 1: Services, 2: Details, 3: Brief (mobile wizard)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    botcheck: false
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const mountTimeRef = useRef(Date.now());
  const hasStartedRef = useRef(false);

  useEffect(() => {
    trackAnalytics('contact_form_viewed');
  }, []);

  const toggleService = (label) => {
    setSelectedServices(prev =>
      prev.includes(label)
        ? prev.length > 1 ? prev.filter(s => s !== label) : prev
        : [...prev, label]
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        if (value.trim().length > 100) return 'Name must be under 100 characters.';
        return null;
      case 'email':
        if (!value || !value.trim()) return 'Please enter your email address.';
        {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        }
        if (value.trim().length > 150) return 'Email must be under 150 characters.';
        return null;
      case 'phone':
        if (value && value.trim()) {
          if (value.trim().length < 7) return 'Please enter a valid phone number (at least 7 digits).';
          if (value.trim().length > 30) return 'Phone number must be under 30 characters.';
        }
        return null;
      case 'message':
        if (!value || !value.trim()) return 'Please describe your project brief or message.';
        if (value.trim().length < 10) return 'Please share at least 10 characters about your project.';
        if (value.trim().length > 5000) return 'Message must be under 5000 characters.';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackAnalytics('contact_form_started');
    }

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleNextStep = (targetStep) => {
    if (targetStep === 2) {
      if (selectedServices.length === 0) {
        setFieldErrors({ services: 'Please select at least one service.' });
        return;
      }
    }
    if (targetStep === 3) {
      const nameErr = validateField('name', formData.name);
      if (nameErr) {
        setFieldErrors({ name: nameErr });
        document.getElementById('form-name')?.focus();
        return;
      }
      const emailErr = validateField('email', formData.email);
      if (emailErr) {
        setFieldErrors({ email: emailErr });
        document.getElementById('form-email')?.focus();
        return;
      }
      const phoneErr = validateField('phone', formData.phone);
      if (phoneErr) {
        setFieldErrors({ phone: phoneErr });
        document.getElementById('form-phone')?.focus();
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

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (status === 'sending') return;

    // Honeypot spam check
    if (formData.botcheck) {
      setStatus('sent');
      return;
    }

    // Rate guard: automated bot submit under 1s from page load
    if (Date.now() - mountTimeRef.current < 1000) {
      console.warn('Bot guard triggered.');
      return;
    }

    if (selectedServices.length === 0) {
      setStep(1);
      setFieldErrors({ services: 'Please select at least one service.' });
      return;
    }

    const nameErr = validateField('name', formData.name);
    if (nameErr) {
      setStep(2);
      setFieldErrors({ name: nameErr });
      setTimeout(() => document.getElementById('form-name')?.focus(), 60);
      return;
    }

    const emailErr = validateField('email', formData.email);
    if (emailErr) {
      setStep(2);
      setFieldErrors({ email: emailErr });
      setTimeout(() => document.getElementById('form-email')?.focus(), 60);
      return;
    }

    const phoneErr = validateField('phone', formData.phone);
    if (phoneErr) {
      setStep(2);
      setFieldErrors({ phone: phoneErr });
      setTimeout(() => document.getElementById('form-phone')?.focus(), 60);
      return;
    }

    const messageErr = validateField('message', formData.message);
    if (messageErr) {
      setStep(3);
      setFieldErrors({ message: messageErr });
      setTimeout(() => document.getElementById('form-message')?.focus(), 60);
      return;
    }

    setFieldErrors({});
    setErrorMessage('');
    setStatus('sending');
    trackAnalytics('contact_form_submitted', { services: selectedServices.join(', ') });

    const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    const formspreeId = import.meta.env.VITE_FORMSPREE_FORM_ID;

    try {
      let response;
      let result;

      if (formspreeId) {
        // Formspree static submission
        response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || 'Not specified',
            services: selectedServices.join(', '),
            message: formData.message.trim(),
            _replyto: formData.email.trim(),
            _subject: `New Project Inquiry — ${formData.name.trim()}`
          })
        });
        result = await response.json().catch(() => ({}));
        if (response.ok) {
          setStatus('sent');
          trackAnalytics('contact_form_success');
          return;
        }
      } else {
        // Web3Forms static submission (default)
        const payload = {
          access_key: web3formsKey || 'YOUR_ACCESS_KEY_HERE',
          subject: `New Project Inquiry — ${formData.name.trim()}`,
          from_name: 'Dhanush Portfolio Inquiries',
          replyto: formData.email.trim(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || 'Not specified',
          services: selectedServices.join(', '),
          message: formData.message.trim(),
          botcheck: formData.botcheck ? 'true' : ''
        };

        response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        result = await response.json().catch(() => ({}));
        if (response.ok && result.success) {
          setStatus('sent');
          trackAnalytics('contact_form_success');
          return;
        }
      }

      setStatus('error');
      trackAnalytics('contact_form_error', { reason: result?.message || result?.error || 'Submission failed' });
      setErrorMessage('Something went wrong while delivering your message. Please try again in a moment or reach out directly.');
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      trackAnalytics('contact_form_error', { reason: 'Network error' });
      setErrorMessage('Network error while transmitting. Please check your internet connection and try again.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setStep(1);
    setFormData({ name: '', email: '', phone: '', message: '', botcheck: false });
    setSelectedServices(['General Conversation']);
    setFieldErrors({});
    setErrorMessage('');
    mountTimeRef.current = Date.now();
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
                      {formData.email && (
                        <div className="success-meta-row">
                          <span className="meta-kicker">EMAIL</span>
                          <span className="meta-pill">{formData.email}</span>
                        </div>
                      )}

                      {formData.phone && (
                        <div className="success-meta-row">
                          <span className="meta-kicker">PHONE</span>
                          <span className="meta-pill">{formData.phone}</span>
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
                  
                  {/* Invisible Honeypot Spam Trap */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    checked={formData.botcheck}
                    onChange={(e) => setFormData(prev => ({ ...prev, botcheck: e.target.checked }))}
                  />

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

                    {fieldErrors.services && (
                      <div className="studio-bubble-tooltip" style={{ position: 'static', marginTop: '1rem' }} role="alert">
                        <span className="bubble-badge">!</span>
                        <span className="bubble-text">{fieldErrors.services}</span>
                      </div>
                    )}

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
                      {/* Name Field */}
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
                            placeholder="e.g. Rahul Sharma"
                            maxLength={100}
                          />
                          {formData.name.trim() && !fieldErrors.name && (
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

                      {/* Email Field */}
                      <div className="field-group">
                        <label htmlFor="form-email" className="field-label">
                          <span>Email</span> <span className="req-star">*</span>
                        </label>
                        <div className="field-input-wrap">
                          <div className="input-icon-slot" aria-hidden="true">
                            <Mail size={18} />
                          </div>
                          <input
                            type="email"
                            id="form-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`studio-card-input ${fieldErrors.email ? 'has-field-error' : ''} ${formData.email.trim() ? 'is-filled' : ''}`}
                            autoComplete="email"
                            placeholder="e.g. rahul@example.com"
                            maxLength={150}
                          />
                          {formData.email.trim() && !fieldErrors.email && (
                            <div className="input-valid-indicator" aria-hidden="true">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                          {fieldErrors.email && (
                            <div className="studio-bubble-tooltip" role="alert">
                              <span className="bubble-pointer" />
                              <span className="bubble-badge">!</span>
                              <span className="bubble-text">{fieldErrors.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div className="field-group">
                        <label htmlFor="form-phone" className="field-label">
                          <span>Phone / WhatsApp</span> <span className="optional-badge">(Optional)</span>
                        </label>
                        <div className="field-input-wrap">
                          <div className="input-icon-slot" aria-hidden="true">
                            <Phone size={18} />
                          </div>
                          <input
                            type="tel"
                            id="form-phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`studio-card-input ${fieldErrors.phone ? 'has-field-error' : ''} ${formData.phone.trim() ? 'is-filled' : ''}`}
                            autoComplete="tel"
                            placeholder="e.g. +1 (555) 000-0000"
                            maxLength={30}
                          />
                          {formData.phone.trim() && !fieldErrors.phone && (
                            <div className="input-valid-indicator" aria-hidden="true">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                          {fieldErrors.phone && (
                            <div className="studio-bubble-tooltip" role="alert">
                              <span className="bubble-pointer" />
                              <span className="bubble-badge">!</span>
                              <span className="bubble-text">{fieldErrors.phone}</span>
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
                            placeholder="Tell me about your goals, timeline, and key requirements..."
                            className={`studio-card-textarea ${fieldErrors.message ? 'has-field-error' : ''} ${formData.message.trim() ? 'is-filled' : ''}`}
                            maxLength={5000}
                          />
                          {formData.message.trim() && !fieldErrors.message && (
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

                    {/* Submission Error Notice */}
                    {status === 'error' && errorMessage && (
                      <div className="studio-error-banner" role="alert">
                        <div className="studio-error-icon" aria-hidden="true">
                          <AlertCircle size={18} />
                        </div>
                        <div className="studio-error-body">
                          <strong className="studio-error-title">Transmission Issue</strong>
                          <p className="studio-error-desc">{errorMessage}</p>
                          <button
                            type="button"
                            className="studio-error-retry-btn"
                            onClick={handleSubmit}
                          >
                            <RotateCcw size={13} />
                            <span>Retry Submission</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mobile Step 3 Navigation */}
                    <div className="mobile-step-nav has-back">
                      <button
                        type="button"
                        className="studio-back-btn"
                        onClick={handlePrevStep}
                        disabled={status === 'sending'}
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

        {/* Alternative Discovery Hub */}
        <div className="studio-alt-hub">
          <div className="why-services-notched-grid">
            {/* Card 1: Selected Works -> Smooth transition to /#work */}
            <HubDiscoveryCard
              cardIndex={0}
              tags={['Proof of Work', 'Live Apps']}
              meta="PROOF OF WORK"
              drawerLabel="projects"
              phrases={[
                { words: ['Proof of', 'work'], color: '#6D5AE6' },
                { words: ['Real client', 'projects'], color: '#8B5CF6' },
                { words: ['Live web', 'apps'], color: '#3B82F6' },
                { words: ['Built to', 'deliver'], color: '#14B8A6' }
              ]}
              headline="Check real proof of work & live projects"
              ariaLabel="Selected works - View projects and case studies on home page"
              onCardClick={() => {
                setTimeout(() => {
                  navigate('/#work');
                }, 70);
              }}
            />

            {/* Center: Editorial Heading between cards */}
            <div className="alt-hub-center">
              <span className="alt-hub-badge">Explore More</span>
              <h3 className="alt-hub-title">Still<br />not<br />sure?</h3>
              <p className="alt-hub-desc">Check live client projects or explore our specialized engineering services.</p>
            </div>

            {/* Card 2: Specialized Services -> Smooth transition to /services */}
            <HubDiscoveryCard
              cardIndex={1}
              tags={['Services', 'Capabilities']}
              meta="SPECIALIZED SERVICES"
              drawerLabel="services"
              phrases={SERVICES_STAGE_PHRASES}
              headline="Explore all 6 specialized engineering services & capabilities"
              ariaLabel="Explore all specialized engineering services and capabilities"
              onCardClick={() => {
                setTimeout(() => {
                  navigate('/services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 70);
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
