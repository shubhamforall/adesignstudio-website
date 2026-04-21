/* ========================================
   A DESIGN STUDIO - Main JavaScript
   Premium 3D Effects & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Render gallery from GALLERY_DATA (must run before other features attach) ---
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (portfolioGrid && typeof GALLERY_DATA !== 'undefined') {
    const escape = (s) => String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    portfolioGrid.innerHTML = GALLERY_DATA.map((item, i) => {
      const delay = (i % 3) + 1;
      const src = 'assets/images/' + item.file;
      return `
        <div class="portfolio-item fade-in delay-${delay}" data-category="${escape(item.category)}" data-lightbox>
          <img src="${encodeURI(src)}" alt="${escape(item.label)}" loading="lazy">
          <div class="portfolio-info">
            <span class="project-category">A Design Studio</span>
            <span class="project-title">${escape(item.label)}</span>
          </div>
        </div>`;
    }).join('');
  }

  // --- Split text into words for line-by-line reveal ---
  document.querySelectorAll('[data-split]').forEach((el, lineIdx) => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words.map((word, wordIdx) => {
      const delay = (lineIdx * 120) + (wordIdx * 45);
      return `<span class="split-word" style="--d: ${delay}ms">${word}</span>`;
    }).join(' ');
  });

  // Trigger split reveals on hero shortly after load (so words drop into place)
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.hero-v2 .hero-title').forEach(el => {
        el.classList.add('revealed');
        el.querySelectorAll('.split-line').forEach(l => l.classList.add('revealed'));
      });
      document.querySelectorAll('.hero-v2 .reveal-text').forEach(el => {
        el.classList.add('visible');
      });
    }, 300);
  });

  // Also make all .split-line wrappers trigger when they scroll into view
  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.split-line').forEach(el => splitObserver.observe(el));

  // --- Cursor tag (elegant "View" label on image hover) ---
  const cursorTag = document.getElementById('cursorTag');
  if (cursorTag && window.matchMedia('(hover: hover)').matches) {
    let tagX = 0, tagY = 0, currentX = 0, currentY = 0;
    let activeEl = null;

    document.addEventListener('mousemove', (e) => {
      tagX = e.clientX;
      tagY = e.clientY;
    });

    // Smooth follow with easing
    const animate = () => {
      currentX += (tagX - currentX) * 0.2;
      currentY += (tagY - currentY) * 0.2;
      cursorTag.style.left = currentX + 'px';
      cursorTag.style.top = currentY + 'px';
      requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('[data-cursor-tag]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        activeEl = el;
        cursorTag.textContent = el.dataset.cursorTag;
        cursorTag.classList.add('visible');
      });
      el.addEventListener('mouseleave', () => {
        if (activeEl === el) {
          activeEl = null;
          cursorTag.classList.remove('visible');
        }
      });
    });
  }

  // --- Magnetic elements ---
  const magneticEls = document.querySelectorAll('.magnetic, .btn-magnetic');
  if (window.matchMedia('(hover: hover)').matches) {
    magneticEls.forEach(el => {
      const strength = parseFloat(el.dataset.magnetic) || 0.25;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });
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

  // --- Hero parallax background (desktop only) ---
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && window.innerWidth > 768) {
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

  const applyFilter = (filter) => {
    let visibleIndex = 0;
    portfolioItems.forEach((item) => {
      const matches = filter === 'all' || item.dataset.category === filter;
      if (matches) {
        item.style.display = '';
        // Small stagger based on position within visible items (not global index)
        const delay = Math.min(visibleIndex * 20, 300);
        requestAnimationFrame(() => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1) translateY(0)';
          }, delay);
        });
        visibleIndex++;
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        item.style.display = 'none';
      }
    });
  };

  // Apply initial filter based on active button
  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    const activeBtn = document.querySelector('.filter-btn.active');
    const initialFilter = activeBtn ? activeBtn.dataset.filter : 'all';
    applyFilter(initialFilter);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
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

  // --- Contact form (FormSubmit AJAX) ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalText = btn.textContent;
      const originalBg = btn.style.background;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        // FormSubmit AJAX endpoint - convert regular action to AJAX endpoint
        const action = contactForm.getAttribute('action').replace(
          'formsubmit.co/',
          'formsubmit.co/ajax/'
        );

        const formData = new FormData(contactForm);
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btn.textContent = 'Message Sent!';
          btn.style.background = '#25d366';
          contactForm.reset();
        } else {
          btn.textContent = 'Error — Try Again';
          btn.style.background = '#d84848';
        }
      } catch (err) {
        btn.textContent = 'Network Error';
        btn.style.background = '#d84848';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = originalBg;
        btn.disabled = false;
      }, 3500);
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

});
