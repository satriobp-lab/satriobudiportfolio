/* ==========================================================
   SATRIO BUDI PAMUNGKAS — PORTFOLIO
   Interactive behavior (typing, mobile nav, reveal, form)
   ========================================================== */
(function () {
  'use strict';

  /* ===== Mobile Nav ===== */
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');

  const openMenu = () => {
    if (!navMenu) return;
    navMenu.classList.add('show-menu');
    document.body.classList.add('no-scroll');
  };
  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('show-menu');
    document.body.classList.remove('no-scroll');
  };

  if (navToggle) navToggle.addEventListener('click', openMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!navMenu) return;
    if (navMenu.classList.contains('show-menu') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* ===== Header shadow on scroll ===== */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ===== Active link on scroll ===== */
  const sections = document.querySelectorAll('section[id]');
  const setActiveLink = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav__link').forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active-link');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ===== Scroll to top button ===== */
  const scrollTopBtn = document.getElementById('scroll-top');
  const toggleScrollTop = () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
  };
  if (scrollTopBtn) {
    window.addEventListener('scroll', toggleScrollTop, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Reveal on scroll ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ===== Typing effect in Hero ===== */
  const roleEl = document.getElementById('role-typed');
  if (roleEl) {
    const words = ['mobile apps', 'clean UIs', 'Android things', 'Flutter widgets', 'real products'];
    let wi = 0, ci = 0, deleting = false;
    const typeLoop = () => {
      const w = words[wi];
      if (!deleting) {
        ci++;
        roleEl.textContent = w.slice(0, ci);
        if (ci === w.length) {
          deleting = true;
          setTimeout(typeLoop, 1800);
          return;
        }
      } else {
        ci--;
        roleEl.textContent = w.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 80);
    };
    setTimeout(typeLoop, 600);
  }

  /* ===== Contact form ===== */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Hmm, that email looks off. Try again.', 'error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        showStatus('✓ Thanks! Your message landed. I\'ll get back to you soon.', 'success');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }, 1200);
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'contact__form-status ' + type;
    if (type === 'success') {
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'contact__form-status';
      }, 6000);
    }
  }

  /* ===== Footer year ===== */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Tilt effect on cards ===== */
  const isFinePointer = window.matchMedia('(pointer:fine)').matches;
  if (isFinePointer) {
    const tilts = document.querySelectorAll('.project-row, .cert__featured-card, .about__main, .contact__form-wrap');
    tilts.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translate(${x * -2}px, ${y * -2}px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ===== Lightbox Gallery ===== */
  var lightboxData = [];
  var lightboxIndex = 0;

  window.openLightbox = function (projectId, index) {
    // Cari article project-row yang mengandung projectId di atribut onclick gambar
    var articles = document.querySelectorAll('.project-row');
    var targetArticle = null;
    for (var a = 0; a < articles.length; a++) {
      var imgsInArticle = articles[a].querySelectorAll('.project__shot-stack img');
      for (var b = 0; b < imgsInArticle.length; b++) {
        var onclickAttr = imgsInArticle[b].getAttribute('onclick');
        if (onclickAttr && onclickAttr.indexOf(projectId) > -1) {
          targetArticle = articles[a];
          break;
        }
      }
      if (targetArticle) break;
    }
    if (!targetArticle) return;
    var allImgs = targetArticle.querySelectorAll('.project__shot-stack img');
    lightboxData = [];
    for (var i = 0; i < allImgs.length; i++) {
      lightboxData.push({ src: allImgs[i].src, alt: allImgs[i].alt });
    }
    lightboxIndex = index;
    showLightboxImage();
  };

  function showLightboxImage() {
    var lb = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    var counter = document.getElementById('lightbox-counter');
    var prev = document.getElementById('lightbox-prev');
    var next = document.getElementById('lightbox-next');
    if (!lb || !img) return;
    var data = lightboxData[lightboxIndex];
    if (!data) return;
    img.src = data.src;
    img.alt = data.alt || '';
    if (counter) counter.textContent = (lightboxIndex + 1) + ' / ' + lightboxData.length;
    if (prev) prev.style.display = lightboxData.length > 1 ? 'flex' : 'none';
    if (next) next.style.display = lightboxData.length > 1 ? 'flex' : 'none';
    lb.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  window.closeLightbox = function (e) {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    // Tutup jika klik background (lightbox itu sendiri) atau tombol close
    if (e.target === lb || e.target.classList.contains('lightbox__close')) {
      lb.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('click', function (e) {
    if (e.target.id === 'lightbox-prev') {
      lightboxIndex--;
      if (lightboxIndex < 0) lightboxIndex = lightboxData.length - 1;
      showLightboxImage();
      e.stopPropagation();
    }
    if (e.target.id === 'lightbox-next') {
      lightboxIndex++;
      if (lightboxIndex >= lightboxData.length) lightboxIndex = 0;
      showLightboxImage();
      e.stopPropagation();
    }
  });

  document.addEventListener('keydown', function (e) {
    var lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('show')) return;
    if (e.key === 'Escape') {
      lb.classList.remove('show');
      document.body.style.overflow = '';
    }
    if (e.key === 'ArrowLeft') {
      lightboxIndex--;
      if (lightboxIndex < 0) lightboxIndex = lightboxData.length - 1;
      showLightboxImage();
    }
    if (e.key === 'ArrowRight') {
      lightboxIndex++;
      if (lightboxIndex >= lightboxData.length) lightboxIndex = 0;
      showLightboxImage();
    }
  });

  /* ===== Initial ===== */
  toggleScrollTop();
})();
