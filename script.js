/* ============================================================
   ESTUDIO FREG — Interacciones
   ============================================================ */

(function () {
  'use strict';

  // ---------- DOM references ----------
  const header = document.getElementById('siteHeader');
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.getElementById('navMobile');
  const mobileLinks = navMobile ? navMobile.querySelectorAll('a') : [];
  const contactForm = document.getElementById('contactForm');
  const whatsappFloat = document.getElementById('whatsappFloat');

  // ---------- Header scroll state ----------
  let lastScroll = 0;
  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- Mobile nav toggle ----------
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Smooth scroll for anchor links ----------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 72;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  // ---------- Hero: prefers-reduced-motion ----------
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll(
    '.hl-line, .hero-rule, .hero-bottom, .hero-coords, .hero-index, .hero-tagline, .scroll-hint'
  ).forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.animation = 'none';
  });
}

  // ---------- Intersection Observer for sections ----------
  const revealTargets = [
    '.section-header',
    '.problem-card',
    '.service-card',
    '.why-card',
    '.process-step',
    '.about-head',
    '.about-body',
    '.about-quote',
    '.contact-whatsapp',
    '.contact-form',
  ];

  const observed = document.querySelectorAll(revealTargets.join(','));
  observed.forEach((el) => el.classList.add('fade-in-section'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observed.forEach((el) => observer.observe(el));
  } else {
    observed.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- WhatsApp floating tooltip ----------
  if (whatsappFloat) {
    // Show tooltip after 8 seconds of no interaction
    let tooltipShown = false;

    const showTooltip = () => {
      if (tooltipShown) return;
      whatsappFloat.classList.add('show-tooltip');
      tooltipShown = true;
      setTimeout(() => {
        whatsappFloat.classList.remove('show-tooltip');
      }, 4500);
    };

    setTimeout(showTooltip, 8000);

    // Track WhatsApp clicks (for analytics later)
    const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
    whatsappLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'whatsapp_click' });
        }
      });
    });
  }

  // ---------- Contact form ----------
  if (contactForm) {
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const showFieldError = (input) => {
      input.style.borderBottomColor = '#E86666';
    };

    const clearFieldError = (input) => {
      input.style.borderBottomColor = '';
    };

    [nameInput, emailInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => clearFieldError(input));
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let valid = true;

      if (!nameInput.value.trim()) {
        showFieldError(nameInput);
        valid = false;
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        showFieldError(emailInput);
        valid = false;
      }

      if (!messageInput.value.trim()) {
        showFieldError(messageInput);
        valid = false;
      }

      if (!valid) {
        // Focus first invalid field
        const firstInvalid = contactForm.querySelector('input[style*="E86666"], textarea[style*="E86666"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const formData = new FormData(contactForm);

try {
  const res = await fetch('https://formsubmit.co/ajax/crfregis@hotmail.com.ar', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData,
  });

  if (res.ok) {
    contactForm.classList.add('submitted');
    setTimeout(() => {
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  } else {
    alert('Hubo un error al enviar. Por favor escribinos por WhatsApp.');
  }
} catch {
  alert('Hubo un error al enviar. Por favor escribinos por WhatsApp.');
}

      // Scroll to success message
      setTimeout(() => {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });
  }

  // ---------- Section active link highlight ----------
  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-desktop a, .nav-mobile a');

    const setActive = (id) => {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--ink)';
        } else {
          link.style.color = '';
        }
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ---------- Keyboard accessibility: close mobile nav on Escape ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile && navMobile.classList.contains('open')) {
      navMobile.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });
})();
