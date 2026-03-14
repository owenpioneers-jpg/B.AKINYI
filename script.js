/* ============================================================
   BERYL Portfolio — script.js
   Handles: navbar scroll, mobile menu, scroll reveal, skill bars
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: scroll class ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }


  /* ── 2. MOBILE MENU toggle ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);

      // Animate hamburger → X
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }


  /* ── 3. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ── 4. SKILL BARS animation ── */
  const skillFills = document.querySelectorAll('.skill-item__fill');

  if ('IntersectionObserver' in window && skillFills.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetWidth = el.getAttribute('data-width') || 0;
          // Small delay so the reveal animation finishes first
          setTimeout(() => {
            el.style.width = targetWidth + '%';
            el.classList.add('animated');
          }, 200);
          skillObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(el => skillObserver.observe(el));
  }


  /* ── 5. ACTIVE NAV LINK based on current page ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  /* ── 6. SMOOTH scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});

/* ============================================================
   BERYL Portfolio — contact.js
   Handles: form validation, char count, submit state, success
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetBtn    = document.getElementById('resetFormBtn');
  const submitBtn   = document.getElementById('submitBtn');
  const messageArea = document.getElementById('message');
  const charCount   = document.getElementById('charCount');

  if (!form) return;

  /* ── 1. CHARACTER COUNT on textarea ── */
  const MAX_CHARS = 600;

  if (messageArea && charCount) {
    messageArea.addEventListener('input', () => {
      const len = messageArea.value.length;
      charCount.textContent = `${len} / ${MAX_CHARS}`;
      charCount.style.color = len > MAX_CHARS * 0.9
        ? 'var(--dusty-rose)'
        : 'var(--warm-gray)';

      if (len > MAX_CHARS) {
        messageArea.value = messageArea.value.substring(0, MAX_CHARS);
        charCount.textContent = `${MAX_CHARS} / ${MAX_CHARS}`;
      }
    });
  }


  /* ── 2. FIELD VALIDATION helpers ── */
  const showError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  input.classList.add('error');
    if (input)  input.classList.remove('success');
    if (error)  error.textContent = message;
  };

  const clearError = (inputId, errorId) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  input.classList.remove('error');
    if (input)  input.classList.add('success');
    if (error)  error.textContent = '';
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());


  /* ── 3. INLINE VALIDATION on blur ── */
  const fields = [
    { id: 'firstName',  errorId: 'firstNameError',  label: 'First name'  },
    { id: 'lastName',   errorId: 'lastNameError',   label: 'Last name'   },
    { id: 'email',      errorId: 'emailError',      label: 'Email'       },
    { id: 'reason',     errorId: 'reasonError',     label: 'Reason'      },
    { id: 'message',    errorId: 'messageError',    label: 'Message'     },
  ];

  fields.forEach(({ id, errorId, label }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur', () => {
      const val = el.value.trim();
      if (!val) {
        showError(id, errorId, `${label} is required.`);
      } else if (id === 'email' && !validateEmail(val)) {
        showError(id, errorId, 'Please enter a valid email address.');
      } else {
        clearError(id, errorId);
      }
    });

    // Clear error on input
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        el.classList.remove('error');
        const err = document.getElementById(errorId);
        if (err) err.textContent = '';
      }
    });
  });


  /* ── 4. FORM SUBMIT ── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    // Validate all required fields
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName  = document.getElementById('lastName')?.value.trim();
    const email     = document.getElementById('email')?.value.trim();
    const reason    = document.getElementById('reason')?.value;
    const message   = document.getElementById('message')?.value.trim();

    if (!firstName) { showError('firstName', 'firstNameError', 'First name is required.'); valid = false; }
    else clearError('firstName', 'firstNameError');

    if (!lastName) { showError('lastName', 'lastNameError', 'Last name is required.'); valid = false; }
    else clearError('lastName', 'lastNameError');

    if (!email) { showError('email', 'emailError', 'Email is required.'); valid = false; }
    else if (!validateEmail(email)) { showError('email', 'emailError', 'Please enter a valid email.'); valid = false; }
    else clearError('email', 'emailError');

    if (!reason) { showError('reason', 'reasonError', 'Please select a reason.'); valid = false; }
    else clearError('reason', 'reasonError');

    if (!message) { showError('message', 'messageError', 'A message is required.'); valid = false; }
    else clearError('message', 'messageError');

    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // ── Show loading state ──
    submitBtn.classList.add('loading');

    // ── Send to Formspree ──
    const formData = new FormData();
    formData.append('firstName',    firstName);
    formData.append('lastName',     lastName);
    formData.append('email',        email);
    formData.append('reason',       document.getElementById('reason').value);
    formData.append('organisation', document.getElementById('organisation')?.value.trim() || '');
    formData.append('message',      message);

    fetch('https://formspree.io/f/mwvrbqen', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      submitBtn.classList.remove('loading');
      if (response.ok) {
        form.style.display = 'none';
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Something went wrong. Please try again or email Beryl directly at berylakinyi2004@gmail.com');
      }
    })
    .catch(() => {
      submitBtn.classList.remove('loading');
      alert('Network error. Please check your connection and try again, or email Beryl directly at berylakinyi2004@gmail.com');
    });

  });


  /* ── 5. RESET FORM ── */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      formSuccess.classList.remove('visible');

      // Clear all validation states
      form.querySelectorAll('.form-input').forEach(el => {
        el.classList.remove('error', 'success');
      });
      form.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
      });

      if (charCount) charCount.textContent = '0 / 600';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

});

/* ============================================================
   BERYL Portfolio — blog.js
   Handles: article filtering, load more, subscribe form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. FILTER SYSTEM ── */
  const filterBtns  = document.querySelectorAll('.blog-filter-btn');
  const articles    = document.querySelectorAll('.article-card');
  const countEl     = document.getElementById('articleCount');
  const emptyState  = document.getElementById('blogEmpty');
  const clearBtn    = document.getElementById('clearFilterBtn');
  const loadMoreWrap = document.getElementById('loadMoreWrap');

  let currentFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter articles
      let visible = 0;
      articles.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = currentFilter === 'all' || cat === currentFilter;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });

      // Update count
      if (countEl) countEl.textContent = visible;

      // Show/hide empty state
      if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';

      // Hide load more when filtering
      if (loadMoreWrap) {
        loadMoreWrap.style.display = currentFilter === 'all' ? 'flex' : 'none';
      }
    });
  });

  // Clear filter button inside empty state
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const allBtn = document.querySelector('[data-filter="all"]');
      if (allBtn) allBtn.click();
    });
  }


  /* ── 2. LOAD MORE (stub) ── */
  // In a real implementation this would fetch more articles from a CMS/API.
  // For now it simply disables itself after one click to signal no more articles.
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = 'No more articles — check back soon!';
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.4';
      loadMoreBtn.style.cursor = 'default';
    });
  }


  /* ── 3. SUBSCRIBE FORM ── */
  const subscribeEmail = document.getElementById('subscribeEmail');
  const subscribeBtn   = document.getElementById('subscribeBtn');
  const subscribeNote  = document.getElementById('subscribeNote');

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  if (subscribeBtn && subscribeEmail) {
    subscribeBtn.addEventListener('click', () => {
      const val = subscribeEmail.value.trim();

      if (!val || !validateEmail(val)) {
        subscribeEmail.style.borderColor = 'var(--dusty-rose)';
        if (subscribeNote) {
          subscribeNote.textContent = 'Please enter a valid email address.';
          subscribeNote.style.color = 'var(--dusty-rose)';
          subscribeNote.style.opacity = '1';
        }
        subscribeEmail.focus();
        return;
      }

      // Success state
      subscribeBtn.textContent = '✓ Subscribed!';
      subscribeBtn.disabled = true;
      subscribeBtn.style.background = 'var(--sage)';
      subscribeEmail.disabled = true;
      subscribeEmail.style.opacity = '0.5';

      if (subscribeNote) {
        subscribeNote.textContent = `You're in! Beryl will be in touch when new articles go live.`;
        subscribeNote.classList.add('success');
        subscribeNote.style.opacity = '1';
      }
    });

    // Reset error style on input
    subscribeEmail.addEventListener('input', () => {
      subscribeEmail.style.borderColor = '';
      if (subscribeNote && !subscribeNote.classList.contains('success')) {
        subscribeNote.textContent = 'Unsubscribe any time. No spam, ever.';
        subscribeNote.style.color = '';
        subscribeNote.style.opacity = '0.5';
      }
    });
  }

});
/* ============================================================
   BERYL Portfolio — projects.js
   Handles: project category filtering
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const filterBtns   = document.querySelectorAll('.projects-filter-btn');
  const projects     = document.querySelectorAll('.project-item');
  const countEl      = document.getElementById('projectCount');
  const emptyState   = document.getElementById('projectsEmpty');
  const clearBtn     = document.getElementById('clearProjectFilterBtn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      let visible = 0;
      projects.forEach(card => {
        const cat  = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });

      // Update count
      if (countEl) countEl.textContent = visible;

      // Empty state
      if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const allBtn = document.querySelector('[data-filter="all"]');
      if (allBtn) allBtn.click();
    });
  }

});