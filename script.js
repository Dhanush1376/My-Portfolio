/* ========================================
   DHANUSH ATMAKURI — CINEMATIC PORTFOLIO JS
   GSAP + ScrollTrigger Animations
   ======================================== */

// Initialize Smooth Scrolling (Lenis)
window.lenis = new Lenis({
  lerp: 0.08, // Replaced duration/easing with lerp for more fluid continuous smoothing
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

// Use GSAP quickSetters for extreme performance
const setDotX = gsap.quickSetter(cursorDot, "x", "px");
const setDotY = gsap.quickSetter(cursorDot, "y", "px");
const setOutlineX = gsap.quickSetter(cursorOutline, "x", "px");
const setOutlineY = gsap.quickSetter(cursorOutline, "y", "px");

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let outline = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let isHovering = false;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  // Instantly update dot using quickSetter
  setDotX(mouse.x);
  setDotY(mouse.y);
});

// Use GSAP ticker for the outline smooth follow
gsap.ticker.add(() => {
  // Adjust lerp factor based on hover state (slower follow when hovered)
  const dt = 1.0 - Math.pow(1.0 - (isHovering ? 0.08 : 0.15), gsap.ticker.deltaRatio());
  
  outline.x += (mouse.x - outline.x) * dt;
  outline.y += (mouse.y - outline.y) * dt;
  
  setOutlineX(outline.x);
  setOutlineY(outline.y);
});

// Cursor hover effect on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .project-card, .glass-card, .bento-card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    isHovering = true;
    cursorDot.classList.add('hover');
    cursorOutline.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    isHovering = false;
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
        ScrollTrigger.refresh(); // Crucial for accurate pinning
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
    // CTA Group
    .from('.hero-cta-group', {
      y: 20,
      opacity: 0,
      duration: 0.6,
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
const stackSections = gsap.utils.toArray('.hero, .section');
stackSections.forEach((sec, i) => {
  // Don't pin the last section
  if (i === stackSections.length - 1) return;

  // Pin the section as the next one scrolls over it
  ScrollTrigger.create({
    trigger: sec,
    start: () => sec.offsetHeight <= window.innerHeight ? "top top" : "bottom bottom",
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
    end: "max",
    id: `pin-${sec.id}`, // Add an ID for easier reference
    onUpdate: (self) => {
      const nextSection = stackSections[i + 1];
      if (nextSection) {
        const nextTop = nextSection.getBoundingClientRect().top;
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
  start: 'top -100', // Trigger slightly later for cleaner transition
  onUpdate: (self) => {
    if (self.direction === 1 || window.scrollY > 100) {
      navbar.classList.add('scrolled');
    }
    if (window.scrollY <= 100) {
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
// Watermark Animations - Fast to slow center-out reveal
gsap.utils.toArray('.section-watermark').forEach(watermark => {
  gsap.fromTo(watermark, 
    {
      scale: 0.8,
      opacity: 0,
      clipPath: "inset(0 50% 0 50%)", // Starts fully clipped from the left and right (at the center)
    },
    {
      scale: 1,
      opacity: 0.19, // Use the correct opacity from CSS
      clipPath: "inset(0 0% 0 0%)", // Reveals fully to the edges
      duration: 1.8,
      ease: "power4.out", // "power4.out" starts very fast and smoothly slows down to a stop at the end
      scrollTrigger: {
        trigger: watermark,
        start: "top 85%", // Starts animation when watermark is 85% down the viewport
        once: true // Ensures it only runs once and does not disappear when scrolling up
      }
    }
  );
});

// About section Scroll Reveal Animation
function initAboutScrollReveal() {
  const aboutText = document.querySelector('.about-text-col');
  if (!aboutText) return;

  // Split text into characters while preserving HTML structure
  function recursiveSplit(element) {
    const nodes = Array.from(element.childNodes);
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        const text = node.textContent;
        const fragment = document.createDocumentFragment();

        for (let char of text) {
          const span = document.createElement('span');
          span.className = 'char-reveal';
          span.textContent = char;
          // Initial low opacity for letters to be revealed
          span.style.opacity = '0.1';
          span.style.transition = 'opacity 0.2s ease-out';
          fragment.appendChild(span);
        }

        element.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        recursiveSplit(node);
      }
    });
  }

  const paragraphs = aboutText.querySelectorAll('p');
  paragraphs.forEach(p => recursiveSplit(p));

  // Animation logic
  gsap.to('.char-reveal', {
    opacity: 1,
    stagger: 0.005,
    duration: 0.1,
    ease: 'none',
    scrollTrigger: {
      trigger: aboutText,
      start: 'top 85%',
      once: true
    }
  });

  // Fade out other elements in about-text-col normally
  gsap.from('.about-stats, .about-focus', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about-stats',
      start: 'top 90%',
    }
  });
}

// Call the reveal init
initAboutScrollReveal();

// About stats counter animation — enhanced with spring bounce
if (document.querySelector('.about-stats')) {
  gsap.from('.stat-item', {
    y: 50,
    opacity: 0,
    scale: 0.9,
    stagger: 0.12,
    duration: 0.8,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.about-stats',
      start: 'top 85%',
      once: true,
    }
  });
}

// Education cards — cascade from alternating sides
gsap.utils.toArray('.edu-card').forEach((card, i) => {
  const fromLeft = i % 2 === 0;
  gsap.from(card, {
    x: fromLeft ? -80 : 80,
    y: 40,
    opacity: 0,
    scale: 0.92,
    rotation: fromLeft ? -3 : 3,
    duration: 1,
    delay: i * 0.15,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.edu-grid',
      start: 'top 80%',
      once: true,
    }
  });
});

// Skills section — Bento cards cascade with directional reveals
const bentoCards = gsap.utils.toArray('.bento-card');
if (bentoCards.length > 0) {
  bentoCards.forEach((card, i) => {
    const directions = [
      { x: -100, y: 30, rotation: -4 },  // Featured card from left
      { x: 100, y: 20, rotation: 3 },    // From right
      { x: -60, y: 50, rotation: -2 },   // From left-bottom
      { x: 60, y: 40, rotation: 2 },     // From right-bottom
      { x: 0, y: 80, rotation: 0 },      // From bottom
    ];
    const dir = directions[i % directions.length];

    gsap.from(card, {
      x: dir.x,
      y: dir.y,
      opacity: 0,
      scale: 0.85,
      rotation: dir.rotation,
      duration: 1,
      delay: i * 0.12,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.bento-skills-grid',
        start: 'top 80%',
        once: true,
      }
    });
  });
}

// Fallback for .skill-category if bento cards don't exist
if (bentoCards.length === 0) {
  gsap.utils.toArray('.skill-category').forEach((cat, i) => {
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
}

// ===== FIXED PROJECTS SECTION - ONLY NUMBERS STICKY =====
const projectCards = gsap.utils.toArray('.project-card');
const numbersStack = document.querySelector('.projects-numbers');
const numberItems = document.querySelectorAll('.number-item');
const projectsSection = document.querySelector('.projects');
const stickyNumbersWrapper = document.querySelector('.sticky-indicator-wrapper');

// Initial setup - hide number items initially (will be shown by animation)
gsap.set(numberItems, { opacity: 0 });

// Reveal animations for project cards — dramatic scale + slide
projectCards.forEach((card, i) => {
  gsap.from(card, {
    y: 100,
    opacity: 0,
    scale: 0.85,
    duration: 1,
    delay: i * 0.15,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 90%',
      once: true,
    }
  });
});

// Animate number items appearing
gsap.to(numberItems, {
  opacity: 0.1,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.projects',
    start: 'top 80%',
  }
});

// Make active number more visible
function setActiveNumber(index) {
  numberItems.forEach((item, i) => {
    if (i === index) {
      gsap.to(item, {
        opacity: 0.5,
        duration: 0.3,
        overwrite: true
      });
    } else {
      gsap.to(item, {
        opacity: 0.1,
        duration: 0.3,
        overwrite: true
      });
    }
  });

  if (numbersStack) {
    gsap.to(numbersStack, {
      y: -index * 8 + 'rem',
      duration: 0.6,
      ease: 'power2.out',
      overwrite: true
    });
  }
}

// MatchMedia for responsive behavior
const mm = gsap.matchMedia();

mm.add("(min-width: 1024px)", () => {
  // Kill any existing pins to avoid conflicts
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id === 'numbers-pin') {
      st.kill();
    }
  });

  // (Pinning is now handled by CSS position: sticky for better reliability)

  // Update numbers based on which card is in view
  projectCards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveNumber(index),
      onEnterBack: () => setActiveNumber(index),
    });
  });

  // Set initial active number
  setTimeout(() => {
    setActiveNumber(0);
  }, 500);
});

mm.add("(max-width: 1023px)", () => {
  // Mobile: horizontal scroll sync
  const projectsRight = document.querySelector('.projects-right');

  if (projectsRight) {
    projectsRight.addEventListener('scroll', () => {
      const scrollLeft = projectsRight.scrollLeft;
      const cardWidth = projectsRight.offsetWidth;
      const activeIndex = Math.round(scrollLeft / cardWidth);

      const mobileCounter = document.querySelector('.project-mobile-counter .current');
      if (mobileCounter) {
        mobileCounter.textContent = (activeIndex + 1).toString().padStart(2, '0');
      }
      setActiveNumber(activeIndex);
    });
  }
});

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

// Timeline items — enhanced with scale + stagger
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
  gsap.from(item, {
    x: i % 2 === 0 ? -80 : 80,
    y: 30,
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 88%',
      once: true,
    }
  });
});

// ─── New 3D Certifications Carousel ──────────────────
const certsSlider = document.getElementById('certsSlider');
const certCards = gsap.utils.toArray('.cert-card-new');
const certDotsContainer = document.getElementById('certsDots');
let certCurrentIndex = 0;
let certAutoScrollTimer;

if (certsSlider && certCards.length > 0) {
  // Certificates entry animation — animate the wrapper instead of cards to avoid state conflicts
  gsap.from('.certs-slider-wrapper', {
    y: 50,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.certs-container',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        // Ensure slider state is updated when it becomes visible
        updateCertSlider();
      }
    }
  });

  // Create dots
  certCards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToCert(i));
    certDotsContainer.appendChild(dot);
  });

  const certDots = document.querySelectorAll('.slider-dots .dot');

  function updateCertSlider() {
    certCards.forEach((card, i) => {
      let state = 'hidden';
      const diff = (i - certCurrentIndex + certCards.length) % certCards.length;

      if (diff === 0) state = 'center';
      else if (diff === 1) state = 'right-1';
      else if (diff === certCards.length - 1) state = 'left-1';
      else if (diff === 2) state = 'right-2';
      else if (diff === certCards.length - 2) state = 'left-2';

      card.setAttribute('data-state', state);

      // Update active class for center card
      if (state === 'center') card.classList.add('active');
      else card.classList.remove('active');
    });

    // Update dots
    certDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === certCurrentIndex);
    });
  }

  function goToCert(index) {
    certCurrentIndex = index;
    updateCertSlider();
    resetCertAutoScroll();
  }

  function nextCert() {
    certCurrentIndex = (certCurrentIndex + 1) % certCards.length;
    updateCertSlider();
  }

  function startCertAutoScroll() {
    certAutoScrollTimer = setInterval(nextCert, 4000);
  }

  function resetCertAutoScroll() {
    clearInterval(certAutoScrollTimer);
    startCertAutoScroll();
  }

  // Click on card to center it
  certCards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (certCurrentIndex !== i) {
        goToCert(i);
      }
    });
  });

  // Pause on hover
  certsSlider.addEventListener('mouseenter', () => clearInterval(certAutoScrollTimer));
  certsSlider.addEventListener('mouseleave', () => startCertAutoScroll());

  // Mouse and Touch Dragging
  let startX = 0;
  let isDragging = false;

  const handleDragStart = (e) => {
    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    clearInterval(certAutoScrollTimer);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextCert();
      else prevCert();
    }
    startCertAutoScroll();
  };

  certsSlider.addEventListener('mousedown', handleDragStart);
  window.addEventListener('mouseup', handleDragEnd);
  certsSlider.addEventListener('touchstart', handleDragStart, { passive: true });
  certsSlider.addEventListener('touchend', handleDragEnd, { passive: true });

  // Mouse Wheel Scroll support - Horizontal Only
  let wheelTimeout;
  certsSlider.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;

    // Only capture horizontal scrolling with significant intent
    if (Math.abs(e.deltaX) > 25 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();

      if (e.deltaX > 0) nextCert();
      else prevCert();

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 600);

      resetCertAutoScroll();
    }
  }, { passive: false });

  function prevCert() {
    certCurrentIndex = (certCurrentIndex - 1 + certCards.length) % certCards.length;
    updateCertSlider();
  }

  // Global scroll listener to pause auto-scroll
  if (window.lenis) {
    window.lenis.on('scroll', () => {
      resetCertAutoScroll();
    });
  } else {
    window.addEventListener('scroll', () => {
      resetCertAutoScroll();
    }, { passive: true });
  }

  // Initial call
  updateCertSlider();
  startCertAutoScroll();
  
  // Ensure ScrollTrigger is aware of the new layout
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
}

// ─── Certificate Modal ────────────────────────────────
const certModal = document.getElementById('certModal');
const closeCertModal = document.getElementById('closeCertModal');
const certModalOverlay = document.querySelector('.cert-modal-overlay');

if (certModal) {
  // Open modal when clicking the view icon or a center card
  document.querySelectorAll('.cert-view-icon').forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(i);
    });
  });

  // Also allow clicking the image or title of the center card
  certCards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (card.getAttribute('data-state') === 'center') {
        // Only open if the user didn't click the link or icon specifically
        if (!e.target.closest('.cert-link-btn') && !e.target.closest('.cert-view-icon')) {
          openModal(i);
        }
      }
    });
  });

  function openModal(index) {
    if (!certModal) return;
    const card = certCards[index];
    if (!card) return;

    const title = card.querySelector('.cert-title-text').textContent;
    const issuer = card.querySelector('.cert-issuer-text').textContent;
    const link = card.querySelector('.cert-link-btn').href;
    const imgElement = card.querySelector('.cert-img');
    const imgSrc = imgElement ? imgElement.src : '';
    
    // Extract description from the card if it exists
    const descEl = card.querySelector('.cert-desc');
    const desc = descEl ? descEl.textContent.trim() : '';

    const modalBody = certModal.querySelector('.cert-modal-body');
    const modalContent = certModal.querySelector('.cert-modal-content');

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="modal-header-simple" style="text-align: left; width: 100%; margin-bottom: 25px;">
          <h2 style="margin: 0 0 5px 0; font-size: 1.6rem; font-weight: 800; color: var(--text);">${title}</h2>
          <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem; font-weight: 500;">${issuer}</p>
        </div>
        
        <div class="modal-cert-display" style="width: 100%; display: flex; flex-direction: column; gap: 20px;">
          ${imgSrc ? `
          <div class="modal-img-container" style="width: 100%; max-height: 60vh; border-radius: 16px; overflow: hidden; border: 1px solid var(--surface-border); background: #000; box-shadow: 0 15px 40px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <img src="${imgSrc}" style="max-width: 100%; height: auto; max-height: 60vh; display: block; object-fit: contain;" alt="${title}">
          </div>
          ` : ''}

          ${desc ? `
          <div class="modal-cert-description" style="width: 100%; background: var(--surface); padding: 20px; border-radius: 12px; border: 1px solid var(--surface-border); line-height: 1.6; color: var(--text-secondary); font-size: 0.9rem;">
            ${desc}
          </div>
          ` : ''}
          
          <div style="width: 100%; display: flex; justify-content: flex-start; margin-top: 5px;">
            ${link && link !== '#' && !link.includes(window.location.pathname) ? `
            <a href="${link}" target="_blank" class="cert-link-btn" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 700; background: var(--text); color: var(--bg); border-radius: 12px; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none; display: inline-block;">Verify Certificate ↗</a>
            ` : `
            <p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; border-left: 2px solid var(--surface-border); padding-left: 15px; margin: 0;">Official verification link not available for this entry.</p>
            `}
          </div>
        </div>
      `;
    }

    // Modal Visibility with GSAP
    gsap.set(certModal, { display: 'flex', opacity: 1 });
    certModal.classList.add('active'); // Still add for backdrop-filter CSS

    // Animate Overlay and Content
    gsap.fromTo(certModalOverlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(modalContent,
      { opacity: 0, scale: 0.85, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power4.out" }
    );

    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
  }

  function closeModal() {
    if (!certModal) return;
    const modalContent = certModal.querySelector('.cert-modal-content');

    gsap.to(certModalOverlay, { opacity: 0, duration: 0.3 });
    gsap.to(modalContent, {
      opacity: 0, scale: 0.9, y: 20, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        certModal.classList.remove('active');
        certModal.style.display = 'none';
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
      }
    });
  }

  closeCertModal.addEventListener('click', closeModal);
  certModalOverlay.addEventListener('click', closeModal);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Contact Watermark Animation
if (document.querySelector('.contact-watermark')) {
  gsap.to('.contact-watermark', {
    clipPath: 'inset(0 0% 0 0%)',
    opacity: 0.12,
    duration: 2.5,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 80%',
      once: true,
    }
  });
}

// Contact section — cinematic reveals
const contactLeft = document.querySelector('.contact-left');
if (contactLeft) {
  gsap.from(contactLeft, {
    x: -80,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 75%',
      once: true,
    }
  });
}

const contactFormEl = document.querySelector('.contact-form');
if (contactFormEl) {
  gsap.from('.contact-form > *', {
    y: 50,
    opacity: 0,
    scale: 0.95,
    stagger: 0.1,
    duration: 0.8,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 82%',
      once: true,
    }
  });
}

// Section labels & titles — dramatic reveal
const sectionLabels = gsap.utils.toArray('.section-label');
if (sectionLabels.length > 0) {
  sectionLabels.forEach(label => {
    gsap.from(label, {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 88%',
        once: true,
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

// ─── Navigation State Transitions ──────────────────
function startNavigation() {
  document.body.classList.add('is-navigating');
}

function endNavigation() {
  setTimeout(() => {
    document.body.classList.remove('is-navigating');
  }, 200);
}

// ─── Smooth Navigation with Pinned Sections Support ───────────
let isNavigating = false; // Prevent multiple navigation attempts

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');

    if (targetId === '#' || targetId === '' || isNavigating) return;

    if (this.id === 'backToTop') {
      e.preventDefault();
      smoothScrollTo(0);
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();
      isNavigating = true;
      startNavigation();

      // Close mobile menu if open
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.getElementById('hamburger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Small delay for menu close animation
      setTimeout(() => {
        navigateToSection(targetElement);
      }, 50);
    }
  });
});

function navigateToSection(targetElement) {
  const navbarHeight = 80;
  const targetId = targetElement.id;

  // Temporarily disable all ScrollTriggers to prevent interference
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.pin) { // Only disable pins, keep others active
      st.disable();
    }
  });

  // Get the accurate position
  let targetPosition;

  if (targetId === 'hero') {
    targetPosition = 0;
  } else {
    // Use a more reliable method for pinned sections
    const rect = targetElement.getBoundingClientRect();
    const currentScroll = window.scrollY;
    targetPosition = currentScroll + rect.top - navbarHeight;

    // Ensure we don't go negative
    targetPosition = Math.max(0, targetPosition);
  }

  console.log(`Navigating to ${targetId} at position: ${targetPosition}`);

  // Smooth scroll with Lenis
  if (window.lenis) {
    window.lenis.scrollTo(targetPosition, {
      duration: 1.8,
      easing: (t) => {
        // Custom easing for smoother feel
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      },
      onComplete: () => {
        // Re-enable pins and refresh
        setTimeout(() => {
          ScrollTrigger.getAll().forEach(st => {
            if (st.vars.pin) {
              st.enable();
            }
          });
          ScrollTrigger.refresh();
          isNavigating = false;
          endNavigation();

          // Update URL hash without jumping
          history.pushState(null, null, `#${targetId}`);
        }, 100);
      }
    });
  } else {
    // Fallback to native smooth scroll
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    setTimeout(() => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.pin) {
          st.enable();
        }
      });
      ScrollTrigger.refresh();
      isNavigating = false;
      endNavigation();
      history.pushState(null, null, `#${targetId}`);
    }, 1000);
  }
}

function smoothScrollTo(position) {
  startNavigation();
  if (window.lenis) {
    window.lenis.scrollTo(position, {
      duration: 1.5,
      easing: (t) => 1 - Math.pow(2, -10 * t),
      onComplete: () => {
        ScrollTrigger.refresh();
        endNavigation();
      }
    });
  } else {
    window.scrollTo({ top: position, behavior: 'smooth' });
    setTimeout(endNavigation, 1000);
  }
}

// Back to Top button
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo(0);
  });
}

// Refresh ScrollTrigger on resize to handle mobile orientation changes
// Refresh ScrollTrigger on resize to handle mobile orientation changes
window.addEventListener('resize', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

// ─── Background Star Parallax ───────────────────────
gsap.utils.toArray('.stars-bg').forEach((bg) => {
  gsap.to(bg, {
    y: -150, // Move up as we scroll down
    ease: 'none',
    scrollTrigger: {
      trigger: bg.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
});

// ─── Section Header Animations (Watermark + Title) ──────────────────
gsap.utils.toArray('.section-header').forEach(header => {
  const watermark = header.querySelector('.section-watermark');
  const title = header.querySelector('.section-title');
  
  // Set initial state
  if (watermark) watermark.classList.add('animate-ready');
  if (title) title.classList.add('animate-ready');
  
  ScrollTrigger.create({
    trigger: header,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (watermark) {
        gsap.to(watermark, {
          clipPath: 'inset(0 0% 0 0%)',
          opacity: 0.19,
          scale: 1,
          duration: 1.5,
          ease: 'power4.out'
        });
      }
      if (title) title.classList.add('animate-in');
    }
  });
});
