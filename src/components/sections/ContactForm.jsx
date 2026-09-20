import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AlternativeDiscoveryHub from './AlternativeDiscoveryHub';
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
  XCircle,
  AlertCircle,
  RotateCcw,
  User,
  Mail,
  Phone,
  MessageSquare,
  ShoppingBag,
  Zap,
  BarChart3,
  Layout,
  ChevronDown,
  Search
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

// Crisp Vector/PNG Flag renderer (Displays real national flags on Windows and all devices)
function CountryFlag({ code, name, className = "country-flag-img" }) {
  const [hasError, setHasError] = useState(false);
  const lower = (code || '').toLowerCase();

  if (hasError || !code) {
    return <span className="country-flag-fallback">{code}</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${lower}.png`}
      srcSet={`https://flagcdn.com/w80/${lower}.png 2x`}
      width="22"
      height="15"
      alt={`${name || code} flag`}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

// Worldwide Countries with Flags, Dial Codes, Target Local Digits Count, and Placeholder Formats (India default)
const COUNTRIES = [
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬', minDigits: 8, maxDigits: 8, placeholder: '9876 5432' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪', minDigits: 10, maxDigits: 11, placeholder: '98765 43210' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦', minDigits: 8, maxDigits: 8, placeholder: '9876 5432' },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼', minDigits: 8, maxDigits: 8, placeholder: '9876 5432' },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲', minDigits: 8, maxDigits: 8, placeholder: '9876 5432' },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭', minDigits: 8, maxDigits: 8, placeholder: '9876 5432' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴', minDigits: 8, maxDigits: 8, placeholder: '9876 5432' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰', minDigits: 8, maxDigits: 8, placeholder: '9876 5432' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮', minDigits: 9, maxDigits: 10, placeholder: '98765 4321' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿', minDigits: 9, maxDigits: 10, placeholder: '98765 4321' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾', minDigits: 9, maxDigits: 10, placeholder: '98765 4321' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩', minDigits: 10, maxDigits: 12, placeholder: '98765 43210' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭', minDigits: 9, maxDigits: 10, placeholder: '98765 4321' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳', minDigits: 9, maxDigits: 10, placeholder: '98765 4321' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷', minDigits: 11, maxDigits: 11, placeholder: '98765 43210' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷', minDigits: 9, maxDigits: 10, placeholder: '98765 4321' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹', minDigits: 9, maxDigits: 9, placeholder: '98765 4321' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷', minDigits: 10, maxDigits: 10, placeholder: '98765 43210' }
];

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
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default: India (+91)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [dropdownPlacement, setDropdownPlacement] = useState('bottom'); // 'bottom' or 'top'
  const [maxDropdownHeight, setMaxDropdownHeight] = useState(280);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef(null);

  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const mountTimeRef = useRef(Date.now());
  const hasStartedRef = useRef(false);

  useEffect(() => {
    trackAnalytics('contact_form_viewed');
  }, []);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setCountryDropdownOpen(false);
      }
    };
    if (countryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [countryDropdownOpen]);

  // Dynamically calculate page height & visibility: opens upward or downward with safe margin
  useEffect(() => {
    if (!countryDropdownOpen || !countryDropdownRef.current) return;

    const updatePlacement = () => {
      if (!countryDropdownRef.current) return;
      const rect = countryDropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;
      const idealHeight = 280;

      // Prefer downward if there's at least 190px below (clean fit for search + countries)
      // Only flip upward when space below is truly constrained
      if (spaceBelow < 190 && spaceAbove > spaceBelow) {
        setDropdownPlacement('top');
        setMaxDropdownHeight(Math.max(140, Math.min(idealHeight, spaceAbove - 20)));
      } else {
        setDropdownPlacement('bottom');
        setMaxDropdownHeight(Math.max(140, Math.min(idealHeight, spaceBelow)));
      }
    };

    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);

    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.removeEventListener('scroll', updatePlacement, true);
    };
  }, [countryDropdownOpen]);

  const toggleService = (label) => {
    setSelectedServices(prev =>
      prev.includes(label)
        ? prev.length > 1 ? prev.filter(s => s !== label) : prev
        : [...prev, label]
    );
  };

  const isPhoneFormatAchieved = (val, country = selectedCountry) => {
    if (!val) return false;
    const digits = val.replace(/\D/g, '');
    if (!digits) return false;
    if (country.minDigits === country.maxDigits) {
      return digits.length === country.minDigits;
    }
    return digits.length >= country.minDigits && digits.length <= country.maxDigits;
  };

  const validateField = (name, value, country = selectedCountry) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        if (!/[\p{L}]/u.test(value.trim())) return 'Name must contain letters.';
        if (value.trim().length > 100) return 'Name must be under 100 characters.';
        return null;
      case 'phone': {
        if (!value || !value.trim()) return 'Please enter your Phone or WhatsApp number.';
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Please enter valid numbers.';
        if (country.minDigits === country.maxDigits) {
          if (digits.length !== country.minDigits) {
            return `${country.name} numbers require ${country.minDigits} digits (entered ${digits.length}).`;
          }
        } else {
          if (digits.length < country.minDigits) {
            return `${country.name} numbers require at least ${country.minDigits} digits (entered ${digits.length}).`;
          }
          if (digits.length > country.maxDigits) {
            return `${country.name} numbers cannot exceed ${country.maxDigits} digits.`;
          }
        }
        return null;
      }
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

  const handlePhoneChange = (e) => {
    let val = e.target.value;

    // Auto-detect country if user typed or pasted an international number starting with + or 00
    const trimmed = val.trim();
    if (trimmed.startsWith('+') || trimmed.startsWith('00')) {
      const normalized = trimmed.startsWith('00') ? '+' + trimmed.slice(2) : trimmed;
      // Sort countries by dial code length descending so longer dial codes match first (+971 before +9)
      const matched = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length).find(c => normalized.startsWith(c.dial));
      if (matched) {
        setSelectedCountry(matched);
        val = normalized.slice(matched.dial.length).trim();
      }
    } else if (val.trim().startsWith(selectedCountry.dial)) {
      val = val.trim().slice(selectedCountry.dial.length).trim();
    } else {
      const dialDigits = selectedCountry.dial.replace(/\D/g, '');
      const rawDigits = val.replace(/\D/g, '');
      if (rawDigits.startsWith(dialDigits) && rawDigits.length === selectedCountry.minDigits + dialDigits.length) {
        val = rawDigits.slice(dialDigits.length);
      }
    }

    // Only allow numbers, spaces, dashes
    const cleanPhone = val.replace(/[^\d\s-]/g, '');

    setFormData(prev => ({ ...prev, phone: cleanPhone }));

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackAnalytics('contact_form_started');
    }

    if (fieldErrors.phone) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }

    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setCountryDropdownOpen(false);
    setCountrySearch('');
    if (fieldErrors.phone) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
    setTimeout(() => {
      document.getElementById('form-phone')?.focus();
    }, 50);
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.dial.includes(countrySearch) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Strict format validation flags — tick marks only display when format is fully achieved!
  const isNameAchieved = Boolean(
    formData.name.trim() && 
    formData.name.trim().length >= 2 && 
    !validateField('name', formData.name)
  );

  const isPhoneAchieved = Boolean(
    formData.phone.trim() && 
    isPhoneFormatAchieved(formData.phone, selectedCountry) && 
    !validateField('phone', formData.phone, selectedCountry)
  );

  const isMessageAchieved = Boolean(
    formData.message.trim() && 
    formData.message.trim().length >= 10 && 
    !validateField('message', formData.message)
  );

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
      const phoneErr = validateField('phone', formData.phone, selectedCountry);
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

    const phoneErr = validateField('phone', formData.phone, selectedCountry);
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

    const fullPhone = `${selectedCountry.dial} ${formData.phone.trim()}`;
    const countryInfo = `${selectedCountry.name} (${selectedCountry.dial})`;
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
            country: countryInfo,
            country_name: selectedCountry.name,
            nationality: selectedCountry.name,
            country_code: selectedCountry.code,
            dial_code: selectedCountry.dial,
            phone: fullPhone,
            phone_number: fullPhone,
            services: selectedServices.join(', '),
            message: formData.message.trim(),
            _replyto: 'no-reply@dhanush.dev',
            _subject: `New Project Inquiry — ${formData.name.trim()} [Country: ${selectedCountry.name}] (${fullPhone})`
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
          subject: `New Project Inquiry — ${formData.name.trim()} [Country: ${selectedCountry.name}] (${fullPhone})`,
          from_name: 'Dhanush Portfolio Inquiries',
          name: formData.name.trim(),
          country: countryInfo,
          country_name: selectedCountry.name,
          nationality: selectedCountry.name,
          country_code: selectedCountry.code,
          dial_code: selectedCountry.dial,
          email: 'no-reply@dhanush.dev', // Fallback for Web3Forms API schema
          phone: fullPhone,
          phone_number: fullPhone,
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
      setErrorMessage('Network error while sending. Please check your internet connection and try again.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setStep(1);
    setFormData({ name: '', email: '', phone: '', message: '', botcheck: false });
    setSelectedCountry(COUNTRIES[0]);
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

                  {/* Tick Seal & Title with Satisfying Dynamic Micro-Animations */}
                  <div className="success-header-block">
                    <div className="success-hero-seal" aria-hidden="true">
                      {/* Radial Celebration Sparkle Dots */}
                      <div className="seal-sparkles-burst">
                        <span className="sparkle-dot sp-1" />
                        <span className="sparkle-dot sp-2" />
                        <span className="sparkle-dot sp-3" />
                        <span className="sparkle-dot sp-4" />
                        <span className="sparkle-dot sp-5" />
                        <span className="sparkle-dot sp-6" />
                      </div>

                      {/* Concentric Expanding Ripple Waves */}
                      <div className="seal-ripple seal-ripple-1" />
                      <div className="seal-ripple seal-ripple-2" />

                      {/* Outer Glassmorphic Spring Ring */}
                      <div className="seal-outer-ring">
                        <div className="seal-inner-circle">
                          {/* Animated SVG Checkmark that draws its stroke */}
                          <svg
                            className="satisfying-check-svg"
                            viewBox="0 0 24 24"
                            width="26"
                            height="26"
                          >
                            <path
                              className="satisfying-check-tick"
                              fill="none"
                              stroke="#FFFFFF"
                              strokeWidth="3.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4.5 4.5L19 7"
                            />
                          </svg>
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
                          <span className="meta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                            <CountryFlag code={selectedCountry.code} name={selectedCountry.name} />
                            <span>{selectedCountry.dial} {formData.phone}</span>
                          </span>
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
                            maxLength={100}
                          />
                          {/* Live format validation indicator: Green check if format achieved, Red X if typed but format not supporting */}
                          {(formData.name.trim().length > 0 || fieldErrors.name) && (
                            <div 
                              className={`input-status-indicator ${isNameAchieved && !fieldErrors.name ? 'is-valid' : 'is-invalid'}`} 
                              aria-hidden="true"
                            >
                              {isNameAchieved && !fieldErrors.name ? (
                                <CheckCircle2 size={16} strokeWidth={2.4} />
                              ) : (
                                <XCircle size={16} strokeWidth={2.4} />
                              )}
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

                      {/* Phone / WhatsApp Field (Primary Contact Method with Country/Nationality Selector) */}
                      <div className="field-group">
                        <label htmlFor="form-phone" className="field-label">
                          <span>Phone / WhatsApp</span> <span className="req-star">*</span>
                        </label>
                        <div 
                          className={`field-input-wrap phone-composite-wrap ${countryDropdownOpen ? 'is-dropdown-open' : ''} ${fieldErrors.phone ? 'has-field-error' : ''} ${formData.phone.trim() ? 'is-filled' : ''}`}
                          ref={countryDropdownRef}
                        >
                          {/* Country / Nationality Picker Trigger Button */}
                          <button
                            type="button"
                            className="country-picker-trigger"
                            onClick={() => setCountryDropdownOpen(prev => !prev)}
                            aria-expanded={countryDropdownOpen}
                            aria-label={`Nationality/Country: ${selectedCountry.name} (${selectedCountry.dial}). Click to switch.`}
                          >
                            <span className="country-flag-icon">
                              <CountryFlag code={selectedCountry.code} name={selectedCountry.name} />
                            </span>
                            <span className="country-dial-text">{selectedCountry.dial}</span>
                            <ChevronDown 
                              size={14} 
                              className={`country-chevron-icon ${countryDropdownOpen ? 'is-rotated' : ''}`} 
                            />
                          </button>

                          <div className="country-dial-separator" aria-hidden="true" />

                          {/* Phone number input with light format placeholder */}
                          <input
                            type="tel"
                            id="form-phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder={selectedCountry.placeholder}
                            className="studio-card-input phone-number-field"
                            autoComplete="tel"
                            maxLength={25}
                          />

                          {/* Live format validation indicator: Green check if country format achieved, Red X if typed but format not supporting */}
                          {(formData.phone.trim().length > 0 || fieldErrors.phone) && (
                            <div 
                              className={`input-status-indicator ${isPhoneAchieved && !fieldErrors.phone ? 'is-valid' : 'is-invalid'}`} 
                              aria-hidden="true"
                            >
                              {isPhoneAchieved && !fieldErrors.phone ? (
                                <CheckCircle2 size={16} strokeWidth={2.4} />
                              ) : (
                                <XCircle size={16} strokeWidth={2.4} />
                              )}
                            </div>
                          )}

                          {/* Custom validation speech bubble tooltip */}
                          {fieldErrors.phone && (
                            <div className="studio-bubble-tooltip" role="alert">
                              <span className="bubble-pointer" />
                              <span className="bubble-badge">!</span>
                              <span className="bubble-text">{fieldErrors.phone}</span>
                            </div>
                          )}

                          {/* Country Search & Selection Popover (Smart Placement Up/Down) */}
                          {countryDropdownOpen && (
                            <div 
                              className={`country-dropdown-popover is-placement-${dropdownPlacement}`} 
                              style={{ maxHeight: `${maxDropdownHeight}px` }}
                              role="dialog" 
                              aria-label="Select Country"
                            >
                              <div className="country-search-header">
                                <Search size={14} className="country-search-icon" aria-hidden="true" />
                                <input
                                  type="text"
                                  className="country-search-input"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  placeholder="Search country or code..."
                                  autoFocus
                                />
                              </div>
                              <div className="country-list-scroll">
                                {filteredCountries.length === 0 ? (
                                  <div className="country-no-results">No countries found</div>
                                ) : (
                                  filteredCountries.map((c) => {
                                    const isSelected = c.code === selectedCountry.code;
                                    return (
                                      <button
                                        type="button"
                                        key={c.code}
                                        className={`country-option-row ${isSelected ? 'is-active' : ''}`}
                                        onClick={() => handleSelectCountry(c)}
                                      >
                                        <span className="option-flag">
                                          <CountryFlag code={c.code} name={c.name} />
                                        </span>
                                        <span className="option-name">{c.name}</span>
                                        <span className="option-dial">{c.dial}</span>
                                        {isSelected && (
                                          <Check size={13} className="option-check" strokeWidth={3} />
                                        )}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
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
                            maxLength={5000}
                          />
                          {/* Live format validation indicator: Green check if format achieved, Red X if typed but format not supporting */}
                          {(formData.message.trim().length > 0 || fieldErrors.message) && (
                            <div 
                              className={`input-status-indicator is-textarea ${isMessageAchieved && !fieldErrors.message ? 'is-valid' : 'is-invalid'}`} 
                              aria-hidden="true"
                            >
                              {isMessageAchieved && !fieldErrors.message ? (
                                <CheckCircle2 size={16} strokeWidth={2.4} />
                              ) : (
                                <XCircle size={16} strokeWidth={2.4} />
                              )}
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
                        <span className="btn-label">{status === 'sending' ? 'Sending...' : 'Send'}</span>
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
                      <span className="btn-label">{status === 'sending' ? 'Sending...' : 'Send'}</span>
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
        <AlternativeDiscoveryHub />

      </div>
    </section>
  );
}
