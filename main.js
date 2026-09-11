document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. NAVBAR SCROLL EFFECT
  // =============================================
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    // Add/remove scrolled class
    if (window.scrollY > 100) {
      navbar?.classList.add('navbar--scrolled');
    } else {
      navbar?.classList.remove('navbar--scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 500) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  // =============================================
  // 2. MOBILE MENU TOGGLE
  // =============================================
  const mobileBtn = document.querySelector('.navbar__mobile-btn');

  mobileBtn?.addEventListener('click', () => {
    navbar?.classList.toggle('navbar--open');
    const isOpen = navbar.classList.contains('navbar--open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    mobileBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      navbar?.classList.remove('navbar--open');
      document.body.style.overflow = '';
      mobileBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // =============================================
  // 3. SMOOTH SCROLL
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = navbar?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top button
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =============================================
  // 4. SCROLL ANIMATIONS (IntersectionObserver)
  // =============================================
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // =============================================
  // 5. COUNTER ANIMATION
  // =============================================
  const counters = document.querySelectorAll('.about__stat-number');
  let hasCounted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'));
          const suffix = counter.textContent.includes('%') ? '%' : '+';
          let current = 0;
          const increment = target / 40;
          const duration = 1500; // ms
          const stepTime = duration / 40;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = Math.ceil(current) + suffix;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.querySelector('.about');
  if (aboutSection) countObserver.observe(aboutSection);

  // =============================================
  // 6. ACTIVE NAV HIGHLIGHTING
  // =============================================
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    const navbarHeight = navbar?.offsetHeight || 0;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navbarHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      const link = document.querySelector(`.navbar__link[href="#${sectionId}"]`);
      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // =============================================
  // 7. FORM HANDLING & TOAST NOTIFICATION
  // =============================================
  function showToast(message) {
    const container = document.getElementById('toastContainer') || document.body;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger show animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Attach form handlers to all forms on the page
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          isValid = false;
        } else {
          field.style.borderColor = '#ddd';
        }
      });

      if (isValid) {
        showToast('Thank you! We will get back to you within 24 hours.');
        form.reset();
      } else {
        showToast('Please fill in all required fields.');
      }
    });
  });

  // Reset field border on input
  document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '#ddd';
    });
  });

  // =============================================
  // 8. TESTIMONIAL SLIDER
  // =============================================
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonials__dot');

  if (testimonialCards.length > 0) {
    let currentSlide = 0;
    let autoSlideInterval;

    function goToSlide(index) {
      // Hide all cards
      testimonialCards.forEach(card => card.classList.remove('active'));
      testimonialDots.forEach(dot => dot.classList.remove('active'));

      // Show target card
      currentSlide = index;
      testimonialCards[currentSlide]?.classList.add('active');
      testimonialDots[currentSlide]?.classList.add('active');
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % testimonialCards.length);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Dot click handlers
    testimonialDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide(i);
        startAutoSlide();
      });
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.testimonials__slider');
    sliderContainer?.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer?.addEventListener('mouseleave', startAutoSlide);

    // Initialize
    goToSlide(0);
    startAutoSlide();
  }

  // =============================================
  // 9. IMAGE LAZY LOADING FALLBACK
  // =============================================
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // =============================================
  // 10. WHATSAPP CLICK HANDLER
  // =============================================
  document.querySelectorAll('.floating-whatsapp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '919880645474';
      const message = encodeURIComponent('Hi, I am interested in Nava Properties plots in Mysuru. Please share more details.');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    });
  });

});
