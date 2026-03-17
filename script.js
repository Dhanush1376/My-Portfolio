/* ========================================
   DHANUSH ATMAKURI — CINEMATIC PORTFOLIO JS
   GSAP + ScrollTrigger Animations
   ======================================== */

// Initialize Smooth Scrolling (Lenis)
window.lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
});

window.lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  window.lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ─── Custom Cursor ────────────────────────────────────
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1 });
});

function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.12;
  outlineY += (mouseY - outlineY) * 0.12;
  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top = outlineY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effect on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .project-card, .glass-card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hover');
    cursorOutline.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hover');
    cursorOutline.classList.remove('hover');
  });
});

// ─── Preloader ────────────────────────────────────────
const preloader = document.getElementById('preloader');
const preloaderTL = gsap.timeline({
  onComplete: () => {
    console.log("Preloader animation complete.");
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        heroTL.play(); // Play the pre-initialized hero animation
      }
    });
  }
});

if (preloader && document.querySelector('.preloader-brand')) {
  preloaderTL
    .to('.preloader-brand', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    })
    .to('.preloader-line', {
      width: '120px',
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.2')
    .to('.preloader-sub', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3')
    .to({}, { duration: 0.6 }); // Hold for a beat
}

// ─── Hero Animation ──────────────────────────────────
// Initialize paused so initial states (opacity 0, etc.) apply immediately
const heroTL = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

// Background zoom in
if (document.getElementById('heroImg')) {
  heroTL
    .from('#heroImg', {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out'
    });
}

if (document.querySelector('.hero-title')) {
  heroTL.from('.hero-title', {
      y: 80,
      opacity: 0,
      duration: 1,
    }, '-=1.4')
    // Subtitle
    .from('.hero-subtitle', {
      y: 40,
      opacity: 0,
      duration: 0.8,
    }, '-=0.9')
    // Micro text
    .from('.hero-micro', {
      y: 20,
      opacity: 0,
      duration: 0.6,
    }, '-=0.6')
    // Tagline
    .from('.hero-tagline', {
      y: 30,
      opacity: 0,
      duration: 0.7,
    }, '-=0.4')
    // Glass card
    .from('.glass-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
    }, '-=0.5')
    // Crosshairs
    .from('.crosshair', {
      opacity: 0,
      scale: 0,
      stagger: 0.1,
      duration: 0.5,
    }, '-=0.6')
    .from('.hero-scroll-indicator', {
      opacity: 0,
      y: 20,
      duration: 0.5,
    }, '-=0.3');
}

// ─── Hero Parallax & Scroll ───────────────────────────
gsap.to('#heroImg', {
  y: 100,
  scale: 1.1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
});

// Fade out hero content on scroll down
gsap.to('.hero-content', {
  opacity: 0,
  y: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
});

// ─── Section Stacking (Overlay Scroll) ────────────────
const stackSections = gsap.utils.toArray('.section').filter(sec => !sec.classList.contains('projects'));
stackSections.forEach((sec, i) => {
  // Don't pin the last section or on mobile
  if (i === stackSections.length - 1 || window.innerWidth < 1024) return;

  // Pin the section as the next one scrolls over it
  ScrollTrigger.create({
    trigger: sec,
    start: () => sec.offsetHeight <= window.innerHeight ? "top top" : "bottom bottom",
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
    end: "max",
    onUpdate: (self) => {
      const nextSection = stackSections[i + 1];
      if (nextSection) {
        const nextTop = nextSection.getBoundingClientRect().top;
        // As the next section approaches the top, give it the rounded "card" look
        if (nextTop < window.innerHeight * 0.95) {
          nextSection.classList.add('card-focus');
        } else {
          nextSection.classList.remove('card-focus');
        }
      }
    }
  });
});


// Floating crosshair animation
gsap.utils.toArray('.crosshair').forEach((ch, i) => {
  gsap.to(ch, {
    y: `${(i % 2 === 0 ? -1 : 1) * (15 + i * 5)}`,
    x: `${(i % 2 === 0 ? 1 : -1) * (10 + i * 3)}`,
    duration: 3 + i * 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});

// ─── Navbar Scroll ───────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    if (self.direction === 1 || window.scrollY > 80) {
      navbar.classList.add('scrolled');
    }
    if (window.scrollY <= 80) {
      navbar.classList.remove('scrolled');
    }
  }
});

// Active link on scroll using ScrollTrigger
const sections = document.querySelectorAll('.section, .hero');
sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 25%',
    end: 'bottom 25%',
    onToggle: (self) => {
      if (self.isActive) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    }
  });
});

// ─── Hamburger Menu ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
  navbar.classList.toggle('menu-open');
  document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
  });
});

// ─── Theme Toggle ────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);

  // Update timeline gradient for the current theme
  updateTimelineColor();
});

function getTimelineColors() {
  const isLight = root.getAttribute('data-theme') === 'light';
  return {
    active: isLight ? '#171717' : 'white',
    inactive: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'
  };
}

function updateTimelineColor() {
  const tl = document.querySelector('.timeline-line');
  if (!tl) return;
  const colors = getTimelineColors();
  // Re-apply the current scroll progress
  const progress = tl.dataset.progress || 0;
  tl.style.background = `linear-gradient(to bottom, ${colors.active} ${progress}%, ${colors.inactive} ${progress}%)`;
}

// ─── Section Animations ─────────────────────────────
// About section

if (document.querySelector('.about-text-col')) {
  gsap.from('.about-text-col > *', {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 70%',
    }
  });
}

// About stats counter animation
if (document.querySelector('.about-stats')) {
  gsap.from('.stat-item', {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-stats',
      start: 'top 85%',
    }
  });
}

// Education cards
gsap.utils.toArray('.edu-card').forEach((card, i) => {
  gsap.from(card, {
    y: 60,
    opacity: 0,
    duration: 0.8,
    delay: i * 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.edu-grid',
      start: 'top 80%',
    }
  });
});

// Skills section — animate categories and their tags together
gsap.utils.toArray('.skill-category').forEach((cat, i) => {
  // Set initial state
  gsap.set(cat, { y: 40, opacity: 0 });

  ScrollTrigger.create({
    trigger: cat,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(cat, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    }
  });
});

// Projects section logic (Ultra Fix 3.0 with MatchMedia)
const projectCards = gsap.utils.toArray('.project-card');
const numbersStack = document.querySelector('.projects-numbers');
const numberItems = gsap.utils.toArray('.number-item');

// Reveal transitions for each card (Theme-aware entry)
projectCards.forEach((card) => {
  gsap.from(card, {
    y: 80,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
    }
  });
});

const mm = gsap.matchMedia();

mm.add("(min-width: 1024px)", () => {
  // Desktop Pinning
  ScrollTrigger.create({
    trigger: '.projects',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.projects-left',
    pinSpacing: false,
    onRefresh: (self) => {
      const pinEl = document.querySelector('.projects-left');
      if (pinEl) pinEl.style.paddingTop = '0';
    }
  });

  // Desktop Scroll Progress Sync (Vertical)
  projectCards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          if (numbersStack) {
            gsap.to(numbersStack, {
              y: -i * 8 + 'rem',
              duration: 0.8,
              ease: 'expo.out'
            });
          }
          numberItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === i);
          });
        }
      }
    });
  });
});

mm.add("(max-width: 1023px)", () => {
  // Mobile Horizontal Slider Sync (Synced with Certificates style)
  projectCards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'left center',
      end: 'right center',
      scroller: '.projects-right',
      horizontal: true,
      onToggle: (self) => {
        if (self.isActive && window.innerWidth < 1024) {
          const mobileCounter = document.querySelector('.project-mobile-counter .current');
          if (mobileCounter) {
            mobileCounter.textContent = (i + 1).toString().padStart(2, '0');
          }
          numberItems.forEach((item, idx) => {
            if (item) item.classList.toggle('active', idx === i);
          });
        }
      }
    });
  });

  // Certificates Mobile Slider Sync
  const certCards = gsap.utils.toArray('.cert-card');
  certCards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'left center',
      end: 'right center',
      scroller: '.certificates-grid',
      horizontal: true,
      onToggle: (self) => {
        if (self.isActive) {
          const certCounter = document.querySelector('.certificates-mobile-counter .current');
          if (certCounter) {
            certCounter.textContent = (i + 1).toString().padStart(2, '0');
          }
        }
      }
    });
  });
});

// Direct scroll listener for mobile horizontal sliders (fallback for quick swipes)
const projectsScroller = document.querySelector('.projects-right');
if (projectsScroller) {
  projectsScroller.addEventListener('scroll', () => {
    if (window.innerWidth < 1024) {
      const index = Math.round(projectsScroller.scrollLeft / projectsScroller.offsetWidth);
      const mobileCounter = document.querySelector('.project-mobile-counter .current');
      if (mobileCounter) {
        mobileCounter.textContent = (index + 1).toString().padStart(2, '0');
      }
      
      numberItems.forEach((item, idx) => {
        if (item) item.classList.toggle('active', idx === index);
      });
    }
  });
}

const certsScroller = document.querySelector('.certificates-grid');
if (certsScroller) {
  certsScroller.addEventListener('scroll', () => {
    if (window.innerWidth < 1024) {
      const index = Math.round(certsScroller.scrollLeft / certsScroller.offsetWidth);
      const certCounter = document.querySelector('.certificates-mobile-counter .current');
      if (certCounter) {
        certCounter.textContent = (index + 1).toString().padStart(2, '0');
      }
    }
  });
}


// Timeline section
const timelineLine = document.querySelector('.timeline-line');
const timeline = document.querySelector('.timeline');
if (timelineLine && timeline) {
  // Animate timeline line fill (theme-aware)
  gsap.to(timelineLine, {
    scrollTrigger: {
      trigger: timeline,
      start: 'top 80%',
      end: 'bottom 40%',
      scrub: 1,
      onUpdate: (self) => {
        const pct = Math.round(self.progress * 100);
        const colors = getTimelineColors();
        timelineLine.dataset.progress = pct;
        timelineLine.style.background = `linear-gradient(to bottom, ${colors.active} ${pct}%, ${colors.inactive} ${pct}%)`;
      }
    }
  });
}

gsap.utils.toArray('.timeline-item').forEach((item, i) => {
  gsap.from(item, {
    x: i % 2 === 0 ? -60 : 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 85%',
    }
  });
});

// Certificates section
const certGrid = document.querySelector('.certificates-grid');
const certCardsClass = '.cert-card';
if (certGrid && document.querySelector(certCardsClass)) {
  gsap.from(certCardsClass, {
    y: 60,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: certGrid,
      start: 'top 85%',
    }
  });
}

// Contact section
const contactInfo = document.querySelector('.contact-info');
if (contactInfo) {
  gsap.from(contactInfo, {
    x: -40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 75%',
    }
  });
}

const contactFormEl = document.querySelector('.contact-form');
if (contactFormEl) {
  gsap.from('.contact-form > *', {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 80%',
    }
  });
}

// Section labels & titles
const sectionLabels = gsap.utils.toArray('.section-label');
if (sectionLabels.length > 0) {
  sectionLabels.forEach(label => {
    gsap.from(label, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 85%',
      }
    });
  });
}

// ─── Global Reveal Animations ────────────────────────
// Animate section titles except Projects (which is now static)
const sectionTitles = gsap.utils.toArray('.section-title');
if (sectionTitles.length > 0) {
  sectionTitles.forEach(title => {
    if (title.closest('.projects')) return;
    
    gsap.from(title, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
      }
    });
  });
}

// ─── Contact Form ────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const btn = contactForm.querySelector('.btn-primary');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // TODO: Replace these with your actual Service ID and Template ID from EmailJS
  const serviceID = 'service_b2uzfoh';
  const templateID = 'template_qcu6kcn';

  emailjs.sendForm(serviceID, templateID, contactForm)
    .then(() => {
      // Success
      formSuccess.textContent = "Message sent successfully! I'll get back to you soon.";
      formSuccess.style.color = '#28ca42';
      formSuccess.style.borderColor = 'rgba(40,202,66,0.2)';
      formSuccess.style.background = 'rgba(40,202,66,0.05)';
      formSuccess.classList.add('show');
      btn.textContent = 'Sent ✓';
      
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        formSuccess.classList.remove('show');
      }, 3000);
    }, (error) => {
      // Error
      console.error('FAILED...', error);
      formSuccess.textContent = "Failed to send message. Please check console or try again.";
      formSuccess.style.color = '#ff4d4d';
      formSuccess.style.borderColor = 'rgba(255,77,77,0.2)';
      formSuccess.style.background = 'rgba(255,77,77,0.05)';
      formSuccess.classList.add('show');
      btn.textContent = 'Send Message';
      btn.disabled = false;
      
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 5000);
    });
});

// ─── Smooth Scroll for anchor links ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || this.id === 'backToTop') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      
      // Handle mobile menu if open
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.getElementById('hamburger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Small delay to let menu close if needed
      setTimeout(() => {
        window.lenis.scrollTo(targetId, { 
          offset: -80, 
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }, 50);
    }
  });
});

// Back to Top functionality
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    // Scroll to top using Lenis if available, otherwise native
    if (window.lenis) {
      window.lenis.scrollTo('#hero', { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
// Refresh ScrollTrigger on resize to handle mobile orientation changes
window.addEventListener('resize', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
