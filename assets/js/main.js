/* ========================================
   A DESIGN STUDIO - Main JavaScript
   Premium 3D Effects & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.add('loaded');
      }, 800);
    });
    // Fallback
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.add('loaded');
    }, 3000);
  } else {
    document.body.classList.add('loaded');
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Mobile menu toggle ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll reveal animations ---
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .reveal-up');

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // --- 3D Tilt effect on cards ---
  const tiltCards = document.querySelectorAll('.tilt-3d');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Shine effect
      const shine = card.querySelector('.card-shine');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      const shine = card.querySelector('.card-shine');
      if (shine) {
        shine.style.background = 'transparent';
      }
    });
  });

  // --- Parallax on scroll ---
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${-offset * 0.15}px, 0)`;
      });
    });
  }

  // --- Hero parallax background ---
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0) scale(1.1)`;
      }
    });
  }

  // --- Magnetic buttons ---
  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });

  // --- Text split reveal ---
  document.querySelectorAll('.text-reveal').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    const wrapper = document.createElement('span');
    wrapper.className = 'text-reveal-inner';
    wrapper.textContent = text;
    el.appendChild(wrapper);
  });

  // --- Image reveal on scroll ---
  const imageReveals = document.querySelectorAll('.img-reveal');
  if (imageReveals.length > 0) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          imgObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    imageReveals.forEach(el => imgObserver.observe(el));
  }

  // --- Floating elements ---
  document.querySelectorAll('.float-element').forEach((el, i) => {
    const duration = 3 + (i * 0.5);
    const delay = i * 0.3;
    el.style.animation = `floatAnimation ${duration}s ${delay}s ease-in-out infinite`;
  });

  // --- Portfolio filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach((item, i) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1) translateY(0)';
          }, i * 80);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9) translateY(20px)';
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    });
  });

  // --- Lightbox ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (src && lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightbox && lightboxClose) {
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // --- Contact form ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = '#25d366';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    });
  }

  // --- Counter animation ---
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const duration = 2000;
          const step = target / (duration / 16);

          const update = () => {
            current += step;
            if (current >= target) {
              el.textContent = target + suffix;
            } else {
              el.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(update);
            }
          };
          update();
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Custom cursor ---
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (cursor && cursorDot && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
      cursorDot.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
    });

    document.querySelectorAll('a, button, .project-card, .portfolio-item, .service-card, .tilt-3d').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      });
    });
  }

});
