// Main Application Logic: Typewriter, Navbar, Tabs, Modals, Forms & Guestbook
(function () {
  'use strict';

  // ==========================================
  // 1. HERO SUBTITLE TYPEWRITER EFFECT
  // ==========================================
  const typewriterElement = document.getElementById('hero-typewriter-text');
  const WORDS = [
    'Mahasiswa Politeknik IDN',
    'Teknologi Rekayasa Perangkat Lunak',
    'Frontend Developer & Programmer',
    'Creative UI/UX Designer'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPE_SPEED = 85;
  const ERASE_SPEED = 45;
  const PAUSE_TIME = 2200;

  function typeLoop() {
    if (!typewriterElement) return;

    const currentWord = WORDS[wordIndex];

    if (isDeleting) {
      charIndex--;
      typewriterElement.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      typewriterElement.textContent = currentWord.substring(0, charIndex);
    }

    let nextDelay = isDeleting ? ERASE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      nextDelay = PAUSE_TIME;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % WORDS.length;
      nextDelay = 400;
    }

    setTimeout(typeLoop, nextDelay);
  }

  setTimeout(typeLoop, 1200);

  // ==========================================
  // 2. NAVBAR SCROLL GLASS STATE & ACTIVE LINKS
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navMobileToggle = document.getElementById('nav-mobile-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Mobile Drawer Menu Open/Close Controls
  function openMobileNav() {
    if (!navMobileToggle || !mobileNavDrawer) return;
    navMobileToggle.classList.add('active');
    navMobileToggle.setAttribute('aria-expanded', 'true');
    navMobileToggle.setAttribute('aria-label', 'Tutup Menu Navigasi');
    mobileNavDrawer.classList.add('active');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.add('active');
      mobileNavBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('mobile-nav-open');
  }

  function closeMobileNav() {
    if (!navMobileToggle || !mobileNavDrawer) return;
    navMobileToggle.classList.remove('active');
    navMobileToggle.setAttribute('aria-expanded', 'false');
    navMobileToggle.setAttribute('aria-label', 'Buka Menu Navigasi');
    mobileNavDrawer.classList.remove('active');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.remove('active');
      mobileNavBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('mobile-nav-open');
  }

  if (navMobileToggle && mobileNavDrawer) {
    navMobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (mobileNavBackdrop) {
      mobileNavBackdrop.addEventListener('click', closeMobileNav);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(3, 0, 20, 0.9)';
      navbar.style.boxShadow = '0 12px 35px -5px rgba(0, 0, 0, 0.8), 0 0 15px rgba(99, 102, 241, 0.2)';
    } else {
      navbar.style.background = 'rgba(3, 0, 20, 0.7)';
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.7)';
    }
  });

  // ==========================================
  // 3. SMOOTH SCROLLING WITH EXACT CLEARANCE
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();

          // Auto-close mobile drawer on link navigation
          closeMobileNav();

          const isIpadPro13 = window.innerWidth >= 1025 && window.innerWidth <= 1100;

          // If clicking Portfolio link, ensure the Projects tab is active & align perfectly
          if (href === '#Portofolio') {
            const projectsTabBtn = document.querySelector('.portfolio-tab-btn[data-tab="projects"]');
            if (projectsTabBtn && !projectsTabBtn.classList.contains('active')) {
              projectsTabBtn.click();
            }

            requestAnimationFrame(() => {
              const navEl = document.querySelector('.navbar');
              if (isIpadPro13) {
                const headerEl = targetElement.querySelector('.portfolio-header') || targetElement;
                const activePanel = targetElement.querySelector('.portfolio-tab-panel.active') || targetElement;
                const contentTop = headerEl.getBoundingClientRect().top + window.pageYOffset;
                const contentBottom = activePanel.getBoundingClientRect().bottom + window.pageYOffset;
                const contentHeight = contentBottom - contentTop;
                const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 84;
                const availHeight = window.innerHeight - navBottom;
                const centeredOffset = Math.max(24, (availHeight - contentHeight) / 2);
                const targetY = contentTop - navBottom - centeredOffset;

                window.scrollTo({
                  top: Math.max(0, targetY),
                  behavior: 'smooth'
                });
                return;
              }

              const isMobile = window.innerWidth <= 768;
              const navBottom = navEl ? (navEl.getBoundingClientRect().height + (isMobile ? 12 : 18)) : 76;
              const badge = targetElement.querySelector('.section-badge') || targetElement;
              const breathingGap = isMobile ? 12 : 16;
              const targetY = badge.getBoundingClientRect().top + window.pageYOffset - (navBottom + breathingGap);

              window.scrollTo({
                top: Math.max(0, targetY),
                behavior: 'smooth'
              });
            });
          } else if (href === '#Contact') {
            const directMsgTabBtn = document.querySelector('.contact-tab-btn[data-tab="direct-message"]');
            if (directMsgTabBtn && !directMsgTabBtn.classList.contains('active')) {
              directMsgTabBtn.click();
            }

            if (isIpadPro13) {
              requestAnimationFrame(() => {
                const navEl = document.querySelector('.navbar');
                const headerEl = targetElement.querySelector('.contact-header') || targetElement;
                const activePanel = targetElement.querySelector('.contact-tab-panel.active') || targetElement;
                const contentTop = headerEl.getBoundingClientRect().top + window.pageYOffset;
                const contentBottom = activePanel.getBoundingClientRect().bottom + window.pageYOffset;
                const contentHeight = contentBottom - contentTop;
                const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 84;
                const availHeight = window.innerHeight - navBottom;
                const centeredOffset = Math.max(24, (availHeight - contentHeight) / 2);
                const targetY = contentTop - navBottom - centeredOffset;

                window.scrollTo({
                  top: Math.max(0, targetY),
                  behavior: 'smooth'
                });
              });
            } else {
              const badge = targetElement.querySelector('.section-badge') || targetElement;
              const targetY = badge.getBoundingClientRect().top + window.pageYOffset - 82;

              window.scrollTo({
                top: targetY,
                behavior: 'smooth'
              });
            }
          } else {
            const isMobile = window.innerWidth <= 768;
            const navOffset = isIpadPro13 ? 0 : (isMobile ? 84 : 70); // Safe clearance for fixed navbar on other sections
            const targetY = targetElement.getBoundingClientRect().top + window.pageYOffset - navOffset;

            window.scrollTo({
              top: Math.max(0, targetY),
              behavior: 'smooth'
            });
          }

          // Immediate active link switch (both desktop & mobile nav)
          navLinks.forEach((link) => link.classList.remove('active'));
          mobileNavLinks.forEach((link) => link.classList.remove('active'));

          if (this.classList.contains('nav-link') || this.classList.contains('mobile-nav-link')) {
            this.classList.add('active');
          }
          const correspondingDesktop = document.querySelector(`.nav-link[href="${href}"]`);
          if (correspondingDesktop) correspondingDesktop.classList.add('active');
          const correspondingMobile = document.querySelector(`.mobile-nav-link[href="${href}"]`);
          if (correspondingMobile) correspondingMobile.classList.add('active');
        }
      }
    });
  });

  // ==========================================
  // 4. SCROLLSPY TO TRACK ACTIVE SECTION
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const isIpadPro13 = window.innerWidth >= 1025 && window.innerWidth <= 1100;
    const scrollPos = window.pageYOffset + (isIpadPro13 ? window.innerHeight * 0.35 : 140);

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileNavLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // ==========================================
  // 5. PORTFOLIO SHOWCASE: TAB SWITCHER
  // ==========================================
  const tabButtons = document.querySelectorAll('.portfolio-tab-btn');
  const tabPanels = document.querySelectorAll('.portfolio-tab-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility with animation
      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
      });

      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // Stat cards click navigation (Total Projects & Certificates)
  const statCardProjects = document.getElementById('stat-card-projects');
  const statCardCerts = document.getElementById('stat-card-certs');

  function openPortfolioTabAndScroll(tabName) {
    const tabBtn = document.querySelector(`.portfolio-tab-btn[data-tab="${tabName}"]`);
    if (tabBtn) {
      tabBtn.click();
    }
    const portfolioSection = document.getElementById('Portofolio');
    if (portfolioSection) {
      requestAnimationFrame(() => {
        const navEl = document.querySelector('.navbar');
        const isMobile = window.innerWidth <= 768;
        const navBottom = navEl ? (navEl.getBoundingClientRect().height + (isMobile ? 12 : 18)) : 76;
        const badge = portfolioSection.querySelector('.section-badge') || portfolioSection;
        const breathingGap = isMobile ? 12 : 16;
        const targetY = badge.getBoundingClientRect().top + window.pageYOffset - (navBottom + breathingGap);
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });
      });
    }
  }

  if (statCardProjects) {
    statCardProjects.addEventListener('click', () => {
      openPortfolioTabAndScroll('projects');
    });
    statCardProjects.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPortfolioTabAndScroll('projects');
      }
    });
  }

  if (statCardCerts) {
    statCardCerts.addEventListener('click', () => {
      openPortfolioTabAndScroll('certificates');
    });
    statCardCerts.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPortfolioTabAndScroll('certificates');
      }
    });
  }

  // Ensure all project cards are displayed
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    card.style.display = 'flex';
  });

  // ==========================================
  // 5c. PROJECTS CAROUSEL / SLIDER CONTROLLER (CONTINUOUS AUTO-SLIDE)
  // ==========================================
  let projDragPreventClick = false;
  let certDragPreventClick = false;

  const projTrack = document.getElementById('projects-grid');
  const projPrevBtn = document.getElementById('proj-prev-btn');
  const projNextBtn = document.getElementById('proj-next-btn');
  const projCounter = document.getElementById('projects-carousel-counter');
  const projDotsContainer = document.getElementById('projects-carousel-dots');

  if (projTrack) {
    const originalCards = Array.from(projTrack.querySelectorAll('.project-card'));
    const totalOriginalCards = originalCards.length;

    // Clone cards once for infinite continuous seamless loop
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('data-cloned', 'true');
      projTrack.appendChild(clone);
    });

    let loopDistance = 0;
    function calculateLoopDistance() {
      const allCards = projTrack.querySelectorAll('.project-card');
      if (allCards.length > totalOriginalCards && originalCards[0]) {
        const firstClone = allCards[totalOriginalCards];
        loopDistance = firstClone.offsetLeft - originalCards[0].offsetLeft;
      }
      if (!loopDistance || loopDistance < 100) {
        const cardWidth = originalCards[0] ? originalCards[0].offsetWidth : 360;
        const gap = 25.6;
        loopDistance = totalOriginalCards * (cardWidth + gap);
      }
    }

    function getVisibleCardsCount() {
      const width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 992) return 2;
      return 3;
    }

    function getTotalPages() {
      const perView = getVisibleCardsCount();
      return Math.ceil(totalOriginalCards / perView);
    }

    function renderDots() {
      if (!projDotsContainer) return;
      const totalPages = getTotalPages();
      projDotsContainer.innerHTML = '';

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `carousel-page-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-page', i);
        dot.setAttribute('aria-label', `Halaman ${i + 1}`);
        dot.addEventListener('click', () => {
          const perView = getVisibleCardsCount();
          const targetIndex = i * perView;
          const targetCard = originalCards[targetIndex] || originalCards[0];
          const targetOffset = targetCard.offsetLeft - originalCards[0].offsetLeft;
          scrollPos = targetOffset;
          projTrack.scrollTo({ left: scrollPos, behavior: 'smooth' });
          pauseBriefly(1400);
        });
        projDotsContainer.appendChild(dot);
      }
    }

    let scrollPos = projTrack.scrollLeft || 0;
    let isPaused = false;
    let isHovered = false;
    let isDragging = false;
    let lastTime = performance.now();
    const SPEED_PPS = 48; // Smooth, continuous glide speed

    function updateCounterAndDots() {
      if (!loopDistance) return;
      const perView = getVisibleCardsCount();
      const currentScroll = projTrack.scrollLeft % loopDistance;
      const cardStep = (originalCards.length > 1 && originalCards[1].offsetLeft > originalCards[0].offsetLeft)
        ? (originalCards[1].offsetLeft - originalCards[0].offsetLeft)
        : (originalCards[0] ? originalCards[0].offsetWidth + 25.6 : 375);

      const firstVisibleIndex = Math.min(
        Math.floor((currentScroll + 20) / cardStep),
        totalOriginalCards - 1
      );
      const lastVisibleIndex = Math.min(firstVisibleIndex + perView, totalOriginalCards);

      if (projCounter) {
        if (perView === 1 || firstVisibleIndex + 1 >= lastVisibleIndex) {
          projCounter.textContent = `Menampilkan ${firstVisibleIndex + 1} dari ${totalOriginalCards} Proyek`;
        } else {
          projCounter.textContent = `Menampilkan ${firstVisibleIndex + 1} - ${lastVisibleIndex} dari ${totalOriginalCards} Proyek`;
        }
      }

      if (projDotsContainer) {
        const totalPages = getTotalPages();
        const currentPage = Math.min(Math.floor(firstVisibleIndex / perView), totalPages - 1);
        const dots = projDotsContainer.querySelectorAll('.carousel-page-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentPage);
        });
      }
    }

    function step(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const activeTabBtn = document.querySelector('.portfolio-tab-btn.active');
      const isProjTab = !activeTabBtn || activeTabBtn.getAttribute('data-tab') === 'projects';

      if (!isPaused && !isHovered && !isDragging && isProjTab && !document.hidden && loopDistance > 0) {
        scrollPos += SPEED_PPS * dt;
        if (scrollPos >= loopDistance) {
          scrollPos -= loopDistance;
        }
        projTrack.scrollLeft = scrollPos;
        updateCounterAndDots();
      } else {
        if (isDragging) {
          scrollPos = projTrack.scrollLeft;
          if (loopDistance && scrollPos >= loopDistance) {
            scrollPos %= loopDistance;
          }
          updateCounterAndDots();
        }
      }

      requestAnimationFrame(step);
    }

    function startProjAutoplay() {
      isPaused = false;
      lastTime = performance.now();
    }

    function stopProjAutoplay() {
      isPaused = true;
    }

    let pauseTimer = null;
    function pauseBriefly(ms = 1200) {
      isPaused = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        scrollPos = projTrack.scrollLeft % (loopDistance || 1);
        isPaused = false;
        lastTime = performance.now();
      }, ms);
    }

    window.__startProjAutoplay = startProjAutoplay;
    window.__stopProjAutoplay = stopProjAutoplay;

    // Hover to Pause / Resume
    const projContainer = projTrack.closest('.projects-carousel-wrapper') || projTrack;
    projContainer.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    projContainer.addEventListener('mouseleave', () => {
      isHovered = false;
      scrollPos = projTrack.scrollLeft % (loopDistance || 1);
      lastTime = performance.now();
    });

    // ==========================================
    // Unified Pointer & Touch Gesture Drag Controller
    // ==========================================
    let isPointerActive = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartScroll = 0;
    let hasDraggedDistance = false;
    let activePointerId = null;

    function onDragStart(clientX, clientY, pointerId) {
      if (loopDistance > 0 && projTrack.scrollLeft < 10) {
        projTrack.scrollLeft += loopDistance;
      }
      isPointerActive = true;
      hasDraggedDistance = false;
      dragStartX = clientX;
      dragStartY = clientY;
      dragStartScroll = projTrack.scrollLeft;
      activePointerId = pointerId;
      stopProjAutoplay();
    }

    function onDragMove(clientX, clientY, e) {
      if (!isPointerActive) return;
      const diffX = clientX - dragStartX;
      const diffY = clientY - dragStartY;

      if (!hasDraggedDistance) {
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          if (Math.abs(diffX) >= Math.abs(diffY)) {
            hasDraggedDistance = true;
            isDragging = true;
            projTrack.classList.add('is-dragging');
            if (activePointerId !== null && projTrack.setPointerCapture) {
              try { projTrack.setPointerCapture(activePointerId); } catch (err) {}
            }
          } else {
            // Predominantly vertical: let page scroll naturally
            isPointerActive = false;
            return;
          }
        }
      }

      if (hasDraggedDistance) {
        if (e && e.cancelable) e.preventDefault();
        let targetScroll = dragStartScroll - diffX;
        if (loopDistance > 0) {
          if (targetScroll < 0) {
            targetScroll += loopDistance;
            dragStartScroll += loopDistance;
          } else if (targetScroll >= loopDistance * 1.8) {
            targetScroll -= loopDistance;
            dragStartScroll -= loopDistance;
          }
        }
        projTrack.scrollLeft = targetScroll;
        scrollPos = projTrack.scrollLeft;
        updateCounterAndDots();
      }
    }

    function onDragEnd(clientX) {
      if (!isPointerActive && !hasDraggedDistance) return;

      if (hasDraggedDistance) {
        const diffX = clientX - dragStartX;
        const cardStep = (originalCards.length > 1 && originalCards[1].offsetLeft > originalCards[0].offsetLeft)
          ? (originalCards[1].offsetLeft - originalCards[0].offsetLeft)
          : (originalCards[0] ? originalCards[0].offsetWidth + 25.6 : 375);

        let targetIndex;
        if (diffX < -20) {
          targetIndex = Math.ceil((dragStartScroll - diffX) / cardStep);
        } else if (diffX > 20) {
          targetIndex = Math.floor((dragStartScroll - diffX) / cardStep);
        } else {
          targetIndex = Math.round((dragStartScroll - diffX) / cardStep);
        }

        let targetScroll = targetIndex * cardStep;
        if (loopDistance > 0) {
          if (targetScroll < 0) targetScroll += loopDistance;
          if (targetScroll >= loopDistance) targetScroll %= loopDistance;
        }

        scrollPos = targetScroll;
        projTrack.scrollTo({ left: targetScroll, behavior: 'smooth' });
        pauseBriefly(1600);
        updateCounterAndDots();

        projDragPreventClick = true;
        setTimeout(() => { projDragPreventClick = false; }, 250);
      } else {
        projDragPreventClick = false;
      }

      if (activePointerId !== null && projTrack.releasePointerCapture) {
        try { projTrack.releasePointerCapture(activePointerId); } catch (err) {}
      }

      projTrack.classList.remove('is-dragging');
      isPointerActive = false;
      isDragging = false;
      hasDraggedDistance = false;
      activePointerId = null;
    }

    // Pointer Events (Unified Mouse, Touch & Pen across PC, Tablet & Mobile)
    projTrack.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a, .btn-open-project, .p-link-primary, .p-link-secondary')) {
        return;
      }
      onDragStart(e.clientX, e.clientY, e.pointerId);
    });

    projTrack.addEventListener('pointermove', (e) => {
      onDragMove(e.clientX, e.clientY, e);
    });

    projTrack.addEventListener('pointerup', (e) => {
      onDragEnd(e.clientX);
    });

    projTrack.addEventListener('pointercancel', (e) => {
      onDragEnd(e.clientX);
    });

    window.addEventListener('pointerup', (e) => {
      if (isPointerActive) onDragEnd(e.clientX);
    });

    window.addEventListener('pointercancel', (e) => {
      if (isPointerActive) onDragEnd(e.clientX);
    });

    // Fallback Touch Events
    projTrack.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && !isPointerActive) {
        onDragStart(e.touches[0].clientX, e.touches[0].clientY, null);
      }
    }, { passive: false });

    projTrack.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && (!activePointerId || activePointerId === null)) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    projTrack.addEventListener('touchend', (e) => {
      if (!activePointerId) {
        const x = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : dragStartX;
        onDragEnd(x);
      }
    }, { passive: true });

    projTrack.addEventListener('touchcancel', () => {
      if (!activePointerId) onDragEnd(dragStartX);
    }, { passive: true });

    // Prevent click on child links/buttons if user was swiping/dragging
    projTrack.addEventListener('click', (e) => {
      if (projDragPreventClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Prev / Next button step
    if (projPrevBtn) {
      projPrevBtn.addEventListener('click', () => {
        const cardStep = (originalCards.length > 1 && originalCards[1].offsetLeft > originalCards[0].offsetLeft)
          ? (originalCards[1].offsetLeft - originalCards[0].offsetLeft)
          : (originalCards[0] ? originalCards[0].offsetWidth + 25.6 : 375);
        const perView = getVisibleCardsCount();
        scrollPos -= cardStep * perView;
        if (scrollPos < 0) {
          scrollPos += loopDistance;
        }
        projTrack.scrollTo({ left: scrollPos, behavior: 'smooth' });
        pauseBriefly(1400);
      });
    }

    if (projNextBtn) {
      projNextBtn.addEventListener('click', () => {
        const cardStep = (originalCards.length > 1 && originalCards[1].offsetLeft > originalCards[0].offsetLeft)
          ? (originalCards[1].offsetLeft - originalCards[0].offsetLeft)
          : (originalCards[0] ? originalCards[0].offsetWidth + 25.6 : 375);
        const perView = getVisibleCardsCount();
        scrollPos += cardStep * perView;
        if (scrollPos >= loopDistance) {
          scrollPos -= loopDistance;
        }
        projTrack.scrollTo({ left: scrollPos, behavior: 'smooth' });
        pauseBriefly(1400);
      });
    }

    window.addEventListener('resize', () => {
      calculateLoopDistance();
      renderDots();
      updateCounterAndDots();
    });

    // Initial setup
    setTimeout(() => {
      calculateLoopDistance();
      renderDots();
      updateCounterAndDots();
      lastTime = performance.now();
      requestAnimationFrame(step);
    }, 100);

    // Tab switch hook
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === 'projects') {
          setTimeout(() => {
            calculateLoopDistance();
            renderDots();
            updateCounterAndDots();
            scrollPos = projTrack.scrollLeft % (loopDistance || 1);
            startProjAutoplay();
          }, 80);
        } else {
          stopProjAutoplay();
        }
      });
    });
  }

  // ==========================================
  // 5d. CERTIFICATES CAROUSEL / SLIDER CONTROLLER (CONTINUOUS AUTO-SLIDE)
  // ==========================================
  const certTrack = document.getElementById('certs-grid');
  const certPrevBtn = document.getElementById('cert-prev-btn');
  const certNextBtn = document.getElementById('cert-next-btn');
  const certCounter = document.getElementById('certs-carousel-counter');
  const certDotsContainer = document.getElementById('certs-carousel-dots');

  if (certTrack) {
    const originalCertCards = Array.from(certTrack.querySelectorAll('.cert-card'));
    const totalOriginalCerts = originalCertCards.length;

    // Clone cards once for infinite continuous seamless loop
    originalCertCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('data-cloned', 'true');
      certTrack.appendChild(clone);
    });

    let certLoopDistance = 0;
    function calculateCertLoopDistance() {
      const allCerts = certTrack.querySelectorAll('.cert-card');
      if (allCerts.length > totalOriginalCerts && originalCertCards[0]) {
        const firstClone = allCerts[totalOriginalCerts];
        certLoopDistance = firstClone.offsetLeft - originalCertCards[0].offsetLeft;
      }
      if (!certLoopDistance || certLoopDistance < 100) {
        const cardWidth = originalCertCards[0] ? originalCertCards[0].offsetWidth : 500;
        const gap = 24;
        certLoopDistance = totalOriginalCerts * (cardWidth + gap);
      }
    }

    function getVisibleCertsCount() {
      const width = window.innerWidth;
      if (width <= 860) return 1;
      return 2;
    }

    function getTotalCertPages() {
      const perView = getVisibleCertsCount();
      return Math.ceil(totalOriginalCerts / perView);
    }

    function renderCertDots() {
      if (!certDotsContainer) return;
      const totalPages = getTotalCertPages();
      certDotsContainer.innerHTML = '';

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `carousel-page-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-page', i);
        dot.setAttribute('aria-label', `Halaman Sertifikat ${i + 1}`);
        dot.addEventListener('click', () => {
          const perView = getVisibleCertsCount();
          const targetIndex = i * perView;
          const targetCard = originalCertCards[targetIndex] || originalCertCards[0];
          const targetOffset = targetCard.offsetLeft - originalCertCards[0].offsetLeft;
          certScrollPos = targetOffset;
          certTrack.scrollTo({ left: certScrollPos, behavior: 'smooth' });
          pauseCertBriefly(1400);
        });
        certDotsContainer.appendChild(dot);
      }
    }

    let certScrollPos = certTrack.scrollLeft || 0;
    let isCertPaused = false;
    let isCertHovered = false;
    let isCertDragging = false;
    let lastCertTime = performance.now();
    const CERT_SPEED_PPS = 44; // Smooth, comfortable speed for certificates

    function updateCertCounterAndDots() {
      if (!certLoopDistance) return;
      const perView = getVisibleCertsCount();
      const currentScroll = certTrack.scrollLeft % certLoopDistance;
      const cardStep = (originalCertCards.length > 1 && originalCertCards[1].offsetLeft > originalCertCards[0].offsetLeft)
        ? (originalCertCards[1].offsetLeft - originalCertCards[0].offsetLeft)
        : (originalCertCards[0] ? originalCertCards[0].offsetWidth + 24 : 500);

      const firstVisibleIndex = Math.min(
        Math.floor((currentScroll + 20) / cardStep),
        totalOriginalCerts - 1
      );
      const lastVisibleIndex = Math.min(firstVisibleIndex + perView, totalOriginalCerts);

      if (certCounter) {
        if (perView === 1 || firstVisibleIndex + 1 >= lastVisibleIndex) {
          certCounter.textContent = `Menampilkan ${firstVisibleIndex + 1} dari ${totalOriginalCerts} Sertifikat`;
        } else {
          certCounter.textContent = `Menampilkan ${firstVisibleIndex + 1} - ${lastVisibleIndex} dari ${totalOriginalCerts} Sertifikat`;
        }
      }

      if (certDotsContainer) {
        const totalPages = getTotalCertPages();
        const currentPage = Math.min(Math.floor(firstVisibleIndex / perView), totalPages - 1);
        const dots = certDotsContainer.querySelectorAll('.carousel-page-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentPage);
        });
      }
    }

    function certStep(currentTime) {
      const dt = Math.min((currentTime - lastCertTime) / 1000, 0.1);
      lastCertTime = currentTime;

      const activeTabBtn = document.querySelector('.portfolio-tab-btn.active');
      const isCertTab = activeTabBtn && activeTabBtn.getAttribute('data-tab') === 'certificates';

      if (!isCertPaused && !isCertHovered && !isCertDragging && isCertTab && !document.hidden && certLoopDistance > 0) {
        certScrollPos += CERT_SPEED_PPS * dt;
        if (certScrollPos >= certLoopDistance) {
          certScrollPos -= certLoopDistance;
        }
        certTrack.scrollLeft = certScrollPos;
        updateCertCounterAndDots();
      } else {
        if (isCertDragging) {
          certScrollPos = certTrack.scrollLeft;
          if (certLoopDistance && certScrollPos >= certLoopDistance) {
            certScrollPos %= certLoopDistance;
          }
          updateCertCounterAndDots();
        }
      }

      requestAnimationFrame(certStep);
    }

    function startCertAutoplay() {
      isCertPaused = false;
      lastCertTime = performance.now();
    }

    function stopCertAutoplay() {
      isCertPaused = true;
    }

    let certPauseTimer = null;
    function pauseCertBriefly(ms = 1200) {
      isCertPaused = true;
      if (certPauseTimer) clearTimeout(certPauseTimer);
      certPauseTimer = setTimeout(() => {
        certScrollPos = certTrack.scrollLeft % (certLoopDistance || 1);
        isCertPaused = false;
        lastCertTime = performance.now();
      }, ms);
    }

    window.__startCertAutoplay = startCertAutoplay;
    window.__stopCertAutoplay = stopCertAutoplay;

    // Hover to Pause / Resume
    const certContainer = certTrack.closest('.certs-carousel-wrapper') || certTrack;
    certContainer.addEventListener('mouseenter', () => {
      isCertHovered = true;
    });
    certContainer.addEventListener('mouseleave', () => {
      isCertHovered = false;
      certScrollPos = certTrack.scrollLeft % (certLoopDistance || 1);
      lastCertTime = performance.now();
    });

    // ==========================================
    // Unified Pointer & Touch Gesture Drag Controller for Certificates
    // ==========================================
    let isCertPointerActive = false;
    let certDragStartX = 0;
    let certDragStartY = 0;
    let certDragStartScroll = 0;
    let hasCertDraggedDistance = false;
    let activeCertPointerId = null;

    function onCertDragStart(clientX, clientY, pointerId) {
      if (certLoopDistance > 0 && certTrack.scrollLeft < 10) {
        certTrack.scrollLeft += certLoopDistance;
      }
      isCertPointerActive = true;
      hasCertDraggedDistance = false;
      certDragStartX = clientX;
      certDragStartY = clientY;
      certDragStartScroll = certTrack.scrollLeft;
      activeCertPointerId = pointerId;
      stopCertAutoplay();
    }

    function onCertDragMove(clientX, clientY, e) {
      if (!isCertPointerActive) return;
      const diffX = clientX - certDragStartX;
      const diffY = clientY - certDragStartY;

      if (!hasCertDraggedDistance) {
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          if (Math.abs(diffX) >= Math.abs(diffY)) {
            hasCertDraggedDistance = true;
            isCertDragging = true;
            certTrack.classList.add('is-dragging');
            if (activeCertPointerId !== null && certTrack.setPointerCapture) {
              try { certTrack.setPointerCapture(activeCertPointerId); } catch (err) {}
            }
          } else {
            // Predominantly vertical: let page scroll naturally
            isCertPointerActive = false;
            return;
          }
        }
      }

      if (hasCertDraggedDistance) {
        if (e && e.cancelable) e.preventDefault();
        let targetScroll = certDragStartScroll - diffX;
        if (certLoopDistance > 0) {
          if (targetScroll < 0) {
            targetScroll += certLoopDistance;
            certDragStartScroll += certLoopDistance;
          } else if (targetScroll >= certLoopDistance * 1.8) {
            targetScroll -= certLoopDistance;
            certDragStartScroll -= certLoopDistance;
          }
        }
        certTrack.scrollLeft = targetScroll;
        certScrollPos = certTrack.scrollLeft;
        updateCertCounterAndDots();
      }
    }

    function onCertDragEnd(clientX) {
      if (!isCertPointerActive && !hasCertDraggedDistance) return;

      if (hasCertDraggedDistance) {
        const diffX = clientX - certDragStartX;
        const cardStep = (originalCertCards.length > 1 && originalCertCards[1].offsetLeft > originalCertCards[0].offsetLeft)
          ? (originalCertCards[1].offsetLeft - originalCertCards[0].offsetLeft)
          : (originalCertCards[0] ? originalCertCards[0].offsetWidth + 24 : 500);

        let targetIndex;
        if (diffX < -20) {
          targetIndex = Math.ceil((certDragStartScroll - diffX) / cardStep);
        } else if (diffX > 20) {
          targetIndex = Math.floor((certDragStartScroll - diffX) / cardStep);
        } else {
          targetIndex = Math.round((certDragStartScroll - diffX) / cardStep);
        }

        let targetScroll = targetIndex * cardStep;
        if (certLoopDistance > 0) {
          if (targetScroll < 0) targetScroll += certLoopDistance;
          if (targetScroll >= certLoopDistance) targetScroll %= certLoopDistance;
        }

        certScrollPos = targetScroll;
        certTrack.scrollTo({ left: targetScroll, behavior: 'smooth' });
        pauseCertBriefly(1600);
        updateCertCounterAndDots();

        certDragPreventClick = true;
        setTimeout(() => { certDragPreventClick = false; }, 250);
      } else {
        certDragPreventClick = false;
      }

      if (activeCertPointerId !== null && certTrack.releasePointerCapture) {
        try { certTrack.releasePointerCapture(activeCertPointerId); } catch (err) {}
      }

      certTrack.classList.remove('is-dragging');
      isCertPointerActive = false;
      isCertDragging = false;
      hasCertDraggedDistance = false;
      activeCertPointerId = null;
    }

    // Pointer Events (Unified Mouse, Touch & Pen across PC, Tablet & Mobile)
    certTrack.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a, .btn-open-cert, .cert-link')) {
        return;
      }
      onCertDragStart(e.clientX, e.clientY, e.pointerId);
    });

    certTrack.addEventListener('pointermove', (e) => {
      onCertDragMove(e.clientX, e.clientY, e);
    });

    certTrack.addEventListener('pointerup', (e) => {
      onCertDragEnd(e.clientX);
    });

    certTrack.addEventListener('pointercancel', (e) => {
      onCertDragEnd(e.clientX);
    });

    window.addEventListener('pointerup', (e) => {
      if (isCertPointerActive) onCertDragEnd(e.clientX);
    });

    window.addEventListener('pointercancel', (e) => {
      if (isCertPointerActive) onCertDragEnd(e.clientX);
    });

    // Fallback Touch Events
    certTrack.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && !isCertPointerActive) {
        onCertDragStart(e.touches[0].clientX, e.touches[0].clientY, null);
      }
    }, { passive: false });

    certTrack.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && (!activeCertPointerId || activeCertPointerId === null)) {
        onCertDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    certTrack.addEventListener('touchend', (e) => {
      if (!activeCertPointerId) {
        const x = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : certDragStartX;
        onCertDragEnd(x);
      }
    }, { passive: true });

    certTrack.addEventListener('touchcancel', () => {
      if (!activeCertPointerId) onCertDragEnd(certDragStartX);
    }, { passive: true });

    // Prevent click on child links/buttons if user was swiping/dragging
    certTrack.addEventListener('click', (e) => {
      if (certDragPreventClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Prev / Next button step
    if (certPrevBtn) {
      certPrevBtn.addEventListener('click', () => {
        const cardStep = (originalCertCards.length > 1 && originalCertCards[1].offsetLeft > originalCertCards[0].offsetLeft)
          ? (originalCertCards[1].offsetLeft - originalCertCards[0].offsetLeft)
          : (originalCertCards[0] ? originalCertCards[0].offsetWidth + 24 : 500);
        const perView = getVisibleCertsCount();
        certScrollPos -= cardStep * perView;
        if (certScrollPos < 0) {
          certScrollPos += certLoopDistance;
        }
        certTrack.scrollTo({ left: certScrollPos, behavior: 'smooth' });
        pauseCertBriefly(1400);
      });
    }

    if (certNextBtn) {
      certNextBtn.addEventListener('click', () => {
        const cardStep = (originalCertCards.length > 1 && originalCertCards[1].offsetLeft > originalCertCards[0].offsetLeft)
          ? (originalCertCards[1].offsetLeft - originalCertCards[0].offsetLeft)
          : (originalCertCards[0] ? originalCertCards[0].offsetWidth + 24 : 500);
        const perView = getVisibleCertsCount();
        certScrollPos += cardStep * perView;
        if (certScrollPos >= certLoopDistance) {
          certScrollPos -= certLoopDistance;
        }
        certTrack.scrollTo({ left: certScrollPos, behavior: 'smooth' });
        pauseCertBriefly(1400);
      });
    }

    window.addEventListener('resize', () => {
      calculateCertLoopDistance();
      renderCertDots();
      updateCertCounterAndDots();
    });

    // Initial setup
    setTimeout(() => {
      calculateCertLoopDistance();
      renderCertDots();
      updateCertCounterAndDots();
      lastCertTime = performance.now();
      requestAnimationFrame(certStep);
    }, 120);

    // Tab switch hook for certificates
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === 'certificates') {
          setTimeout(() => {
            calculateCertLoopDistance();
            renderCertDots();
            updateCertCounterAndDots();
            certScrollPos = certTrack.scrollLeft % (certLoopDistance || 1);
            startCertAutoplay();
          }, 80);
        } else {
          stopCertAutoplay();
        }
      });
    });
  }

  // ==========================================
  // 5b. CONTACT & GUESTBOOK TAB SWITCHER
  // ==========================================
  const contactTabButtons = document.querySelectorAll('.contact-tab-btn');
  const contactTabPanels = document.querySelectorAll('.contact-tab-panel');

  contactTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      contactTabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility with animation
      contactTabPanels.forEach((panel) => {
        panel.classList.remove('active');
      });

      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // ==========================================
  // 7. PROJECT DETAILS & PREVIEW MODAL
  // ==========================================
  const PROJECTS_DATA = {
    '1': {
      title: 'FinTrack',
      category: 'Financial Suite',
      image: 'assets/project1.jpg',
      desc: 'website manajemen keuangan yang bisa membantu user nya mengatur keuangan mereka dengan sebaik-baiknya',
      tech: ['HTML', 'Tailwind CSS', 'JavaScript'],
      features: [
        'Bisa mengetahui pengeluaran kemana saja',
        'Bisa mentotalkan semua saldo yang dimiliki',
        'Menganalisis total pemasukkan dan pengeluaran setiap bulannya'
      ],
      demoUrl: 'https://regal-mousse-2df058.netlify.app/',
      codeUrl: 'https://github.com/ghozi30/tugas-pa-dedi.git'
    },
    '2': {
      title: 'First Web',
      category: 'Web Course Platform',
      image: 'assets/project2.jpg',
      desc: 'ini adalah website pertama saya yang saya bikin di jurusan TRPL berupa website yang menawarkan cursus yang mengajarkan materi programmer .',
      tech: ['HTML', 'Tailwind CSS'],
      features: [
        'Menampilkan kursus yang berbayar',
        'Menampilkan profile pengajar',
        'Menampilkan kursus yang gratis juga.'
      ],
      demoUrl: 'https://classy-basbousa-74080c.netlify.app/',
      codeUrl: 'https://github.com/ghozi30/projek-jumat.git'
    },
    '3': {
      title: 'E-Report',
      category: 'Aspirasi & Pengaduan Warga',
      image: 'assets/project3.jpg',
      desc: 'website yang membantu melaporkan masalah apa saja yang terjadi di suatu desa atau lingkungan sekitar',
      tech: ['Laravel', 'Tailwind CSS', 'PHP', 'Livewire'],
      features: [
        'Mempermudah rakyat dalam melaporkan sesuatu kepada pemerintah',
        'Mempermudah pemerintah setempat dalam mengetahui permasalahan yang ada di daerahnya',
        'Mempercepat perbaikan di daerah setempat.'
      ],
      demoUrl: 'https://regal-mousse-2df058.netlify.app/',
      codeUrl: 'https://github.com/ghozi30/tugas-pa-dedi.git'
    },
    '4': {
      title: 'ToDoList',
      category: 'Productivity & Agenda Manager',
      image: 'assets/project4.jpg',
      desc: 'website ini membantu merencanakan kegiatan apa saja yang ingin dilakukan kedepannya agar tidak lupa',
      tech: ['Laravel', 'Tailwind CSS', 'PHP', 'Livewire', 'JavaScript'],
      features: [
        'Membantu usernya mengingatkan tugas apa yang ingin dilakukan',
        'Memproritaskan kegiatan kegiatan yang penting dari yang lainnya',
        'Mengetahui tugas tugas apa yang sudah dikerjakan dan yang belum.'
      ],
      demoUrl: 'https://to-do-list-ghozi.vercel.app/todos',
      codeUrl: 'https://github.com/ghozi30/To-do-List'
    },
    '5': {
      title: 'Fruitopia',
      category: 'Fresh Grocery & AI Assistant',
      image: 'assets/project5.jpg',
      desc: 'Fruitopia adalah platform e-commerce dan katalog belanja daring khusus buah segar lokal maupun impor yang menyediakan pembaruan stok secara real-time, jaminan kualitas panen harian, serta asisten belanja berbasis kecerdasan buatan (AI).',
      tech: ['Laravel', 'Tailwind CSS', 'PHP', 'Livewire', 'MySQL'],
      features: [
        'Asisten Cerdas (Tanya Buah AI)',
        'Sinkronisasi Stok Real-Time (Live Sync Stok)',
        'Layanan Pengiriman & Pembayaran Fleksibel'
      ],
      demoUrl: 'https://regal-mousse-2df058.netlify.app/',
      codeUrl: 'https://github.com/ghozi30/tugas-pa-dedi.git'
    },
    '6': {
      title: 'E-Library',
      category: 'Perpustakaan Digital & Manajemen Sekolah',
      image: 'assets/project6.jpg?v=3',
      desc: 'Website E-Library adalah aplikasi manajemen perpustakaan sekolah berbasis web modern (Single-Page Application feel) yang mendigitalisasi pencarian buku, peminjaman mandiri, pemantauan tenggat waktu, hingga pengelolaan transaksi admin secara real-time tanpa perlu memuat ulang (reload) halaman.',
      tech: ['PHP', 'Laravel 13', 'Livewire 4', 'HTML5', 'Blade Template', 'Tailwind CSS', 'MySQL'],
      features: [
        'Autentikasi & Katalog Real-Time',
        'Peminjaman & Bookmark Mandiri',
        'Riwayat Pinjam & Kalkulator Denda Otomatis',
        'Dashboard & Manajemen Admin Lengkap'
      ],
      demoUrl: 'https://e-library-ghozi.vercel.app/',
      codeUrl: 'https://github.com/ghozi30/E-Library.git'
    }
  };

  // ==========================================
  // MODAL SCROLL LOCK & EXACT PORTFOLIO RESTORE
  // ==========================================
  let savedPortfolioScrollY = null;

  function lockPageScroll() {
    // Only capture position on the very first modal open
    if (savedPortfolioScrollY === null) {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const portfolioSection = document.getElementById('Portofolio');

      if (currentScroll > 350) {
        savedPortfolioScrollY = currentScroll;
      } else if (portfolioSection) {
        const navHeight = 75;
        savedPortfolioScrollY = Math.max(0, portfolioSection.offsetTop - navHeight);
      } else {
        savedPortfolioScrollY = currentScroll;
      }
    }

    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
  }

  function unlockPageScroll() {
    const activeModals = document.querySelectorAll('.cyber-modal-overlay.active');
    if (!activeModals || activeModals.length === 0) {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');

      const targetY = savedPortfolioScrollY;
      savedPortfolioScrollY = null;

      const restoreScroll = () => {
        if (typeof targetY === 'number' && targetY > 0) {
          window.scrollTo({
            top: targetY,
            behavior: 'instant'
          });
        } else {
          const portfolioSection = document.getElementById('Portofolio');
          if (portfolioSection) {
            const navHeight = 75;
            window.scrollTo({
              top: Math.max(0, portfolioSection.offsetTop - navHeight),
              behavior: 'instant'
            });
          }
        }
      };

      // Restore position immediately upon modal close
      restoreScroll();
      requestAnimationFrame(restoreScroll);
      setTimeout(restoreScroll, 20);
      setTimeout(restoreScroll, 80);
    }
  }

  function setupModalScrollGuard(overlayEl, contentBoxEl) {
    if (!overlayEl || !contentBoxEl) return;

    // Wheel Guard: keep scroll inside the modal, never chain to background window
    overlayEl.addEventListener('wheel', (e) => {
      // If wheel event happened on the overlay backdrop outside content box:
      if (!contentBoxEl.contains(e.target)) {
        contentBoxEl.scrollTop += e.deltaY;
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // If wheel event happened inside content box:
      const isAtTop = contentBoxEl.scrollTop <= 0 && e.deltaY < 0;
      const isAtBottom =
        contentBoxEl.scrollTop + contentBoxEl.clientHeight >= contentBoxEl.scrollHeight - 1 &&
        e.deltaY > 0;

      if (isAtTop || isAtBottom) {
        e.preventDefault(); // Stop scroll chaining to background
      }
      e.stopPropagation();
    }, { passive: false });

    // Touch Guard: prevent background scroll chaining on mobile / touch emulation
    overlayEl.addEventListener('touchmove', (e) => {
      if (!contentBoxEl.contains(e.target)) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      } else {
        // Allow smooth scroll inside contentBox, but stop bubbling
        e.stopPropagation();
      }
    }, { passive: false });
  }

  // ==========================================
  // IMAGE LIGHTBOX / ZOOM SYSTEM
  // ==========================================
  const imageLightboxModal = document.getElementById('image-lightbox-modal');
  const lightboxBox = imageLightboxModal ? imageLightboxModal.querySelector('.image-lightbox-box') : null;
  const lightboxHeading = document.getElementById('lightbox-heading');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxFullImg = document.getElementById('lightbox-full-img');
  const btnCloseLightboxTop = document.getElementById('btn-close-lightbox-top');
  const btnCancelLightboxBottom = document.getElementById('btn-cancel-lightbox-bottom');

  if (imageLightboxModal && lightboxBox) {
    setupModalScrollGuard(imageLightboxModal, lightboxBox);
  }

  function openImageLightbox(imgSrc, title, tag) {
    if (!imageLightboxModal || !lightboxFullImg) return;

    lightboxFullImg.src = imgSrc;
    lightboxFullImg.alt = title || 'Pratinjau Gambar';
    if (lightboxHeading) lightboxHeading.textContent = title || 'Pratinjau Gambar';
    if (lightboxTag) lightboxTag.textContent = tag || 'Pratinjau Penuh';

    imageLightboxModal.classList.add('active');
    imageLightboxModal.setAttribute('aria-hidden', 'false');
    lockPageScroll();
  }

  function closeImageLightbox(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!imageLightboxModal) return;
    imageLightboxModal.classList.remove('active');
    imageLightboxModal.setAttribute('aria-hidden', 'true');
    unlockPageScroll();
  }

  if (btnCloseLightboxTop) {
    btnCloseLightboxTop.addEventListener('click', closeImageLightbox);
  }
  if (btnCancelLightboxBottom) {
    btnCancelLightboxBottom.addEventListener('click', closeImageLightbox);
  }
  if (imageLightboxModal) {
    imageLightboxModal.addEventListener('click', (e) => {
      if (e.target === imageLightboxModal || e.target.id === 'lightbox-stage') {
        closeImageLightbox();
      }
    });
  }

  // ==========================================
  // 7. PROJECT DETAILS MODAL & SPECIFICATIONS
  // ==========================================
  const projectModal = document.getElementById('project-modal');
  const projectModalBox = projectModal ? projectModal.querySelector('.project-modal-box') : null;
  const btnCloseProjectModal = document.getElementById('btn-close-project-modal');
  const btnCancelProjectModal = document.getElementById('btn-cancel-project-modal');
  const pModalPreviewBox = document.getElementById('p-modal-preview-box');
  const pModalCat = document.getElementById('p-modal-cat');
  const pModalTitle = document.getElementById('p-modal-title');
  const pModalImg = document.getElementById('p-modal-img');
  const pModalDesc = document.getElementById('p-modal-desc');
  const pModalTech = document.getElementById('p-modal-tech');
  const pModalFeatures = document.getElementById('p-modal-features');
  const pModalDemoBtn = document.getElementById('p-modal-demo-btn');
  const pModalCodeBtn = document.getElementById('p-modal-code-btn');

  if (projectModal && projectModalBox) {
    setupModalScrollGuard(projectModal, projectModalBox);
  }

  function openProjectModal(id) {
    const data = PROJECTS_DATA[id];
    if (!data || !projectModal) return;

    pModalCat.textContent = data.category;
    pModalTitle.textContent = data.title;
    pModalImg.src = data.image;
    pModalImg.alt = data.title;
    pModalImg.style.cursor = 'zoom-in';
    pModalImg.title = 'Klik untuk memperbesar screenshot gambar';

    // In-page zoom modal with Cancel button instead of opening blank tab
    const handleZoom = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openImageLightbox(data.image, data.title, data.category);
    };
    pModalImg.onclick = handleZoom;
    if (pModalPreviewBox) pModalPreviewBox.onclick = handleZoom;

    pModalDesc.textContent = data.desc;

    // Tech pills
    pModalTech.innerHTML = data.tech
      .map((t) => `<span class="modal-tech-item">${t}</span>`)
      .join('');

    // Features
    pModalFeatures.innerHTML = data.features
      .map((f) => `<li>${f}</li>`)
      .join('');

    pModalDemoBtn.href = data.demoUrl;
    pModalCodeBtn.href = data.codeUrl;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    if (projectModalBox) projectModalBox.scrollTop = 0;
    lockPageScroll();
    if (window.__stopProjAutoplay) window.__stopProjAutoplay();
  }

  function closeProjectModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    unlockPageScroll();
    if (window.__startProjAutoplay) window.__startProjAutoplay();
  }

  function handleProjectDetailClick(e) {
    if (projDragPreventClick) return;

    // If clicking Github secondary button, allow natural navigation
    if (e.target.closest('.p-link-secondary')) return;

    const btnProject = e.target.closest('.btn-open-project');
    if (btnProject) {
      e.preventDefault();
      e.stopPropagation();
      const projId = btnProject.getAttribute('data-project');
      if (projId) openProjectModal(projId);
      return;
    }

    const card = e.target.closest('.project-card');
    if (card) {
      e.preventDefault();
      const projId = card.getAttribute('data-project-id');
      if (projId) {
        openProjectModal(projId);
      }
    }
  }

  if (projTrack) {
    projTrack.addEventListener('click', handleProjectDetailClick);
  }

  // Smooth subtle 3D tilt effect on cards (event delegation for original & cloned cards)
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.project-card, .cert-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;
    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.project-card, .cert-card');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      card.style.transform = '';
    }
  });

  if (btnCloseProjectModal) {
    btnCloseProjectModal.addEventListener('click', closeProjectModal);
  }
  if (btnCancelProjectModal) {
    btnCancelProjectModal.addEventListener('click', closeProjectModal);
  }

  // ==========================================
  // 8. CERTIFICATE LIGHTBOX & CREDENTIAL VERIFICATION
  // ==========================================
  const certModal = document.getElementById('cert-modal');
  const certModalBox = certModal ? certModal.querySelector('.cert-modal-box') : null;
  const btnCloseCertModal = document.getElementById('btn-close-cert-modal');
  const btnCancelCertModal = document.getElementById('btn-cancel-cert-modal');
  const cModalImgBox = document.getElementById('c-modal-img-box');
  const cModalImg = document.getElementById('c-modal-img');
  const cModalIssuer = document.getElementById('c-modal-issuer');
  const cModalTitle = document.getElementById('c-modal-title');
  const cModalDate = document.getElementById('c-modal-date');
  const cModalId = document.getElementById('c-modal-id');
  const cModalSkills = document.getElementById('c-modal-skills');
  const btnCopyCertId = document.getElementById('btn-copy-cert-id');
  const cModalVerifyBtn = document.getElementById('c-modal-verify-btn');

  if (certModal && certModalBox) {
    setupModalScrollGuard(certModal, certModalBox);
  }

  function openCertModal(card) {
    if (!card || !certModal) return;

    const id = card.getAttribute('data-cert-id') || 'VERIFIED-CREDENTIAL';
    const title = card.getAttribute('data-cert-title') || 'Certificate';
    const issuer = card.getAttribute('data-cert-issuer') || 'Official Issuer';
    const img = card.getAttribute('data-cert-img') || 'assets/cert1.jpg';
    const date = card.getAttribute('data-cert-date') || '2024';
    const skills = card.getAttribute('data-cert-skills') || 'Software Engineering';

    cModalImg.src = img;
    cModalImg.alt = title;
    cModalImg.style.cursor = 'zoom-in';
    cModalImg.title = 'Klik untuk memperbesar gambar sertifikat';

    // In-page zoom modal with Cancel button instead of opening blank tab
    const handleCertZoom = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openImageLightbox(img, title, 'Sertifikat Resmi');
    };
    cModalImg.onclick = handleCertZoom;
    if (cModalImgBox) cModalImgBox.onclick = handleCertZoom;

    cModalIssuer.textContent = issuer;
    cModalTitle.textContent = title;
    cModalDate.textContent = date;
    if (id.startsWith('http://') || id.startsWith('https://')) {
      cModalId.innerHTML = `<a href="${id}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline; word-break: break-all;">${id}</a>`;
      if (cModalVerifyBtn) {
        cModalVerifyBtn.href = id;
        cModalVerifyBtn.style.display = 'inline-flex';
      }
    } else {
      cModalId.textContent = id;
      if (cModalVerifyBtn) {
        cModalVerifyBtn.style.display = 'none';
      }
    }
    cModalSkills.textContent = skills;

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    if (certModalBox) certModalBox.scrollTop = 0;
    lockPageScroll();
    if (window.__stopCertAutoplay) window.__stopCertAutoplay();
  }

  function closeCertModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!certModal) return;
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    unlockPageScroll();
    if (window.__startCertAutoplay) window.__startCertAutoplay();
  }

  function handleCertDetailClick(e) {
    if (certDragPreventClick) return;

    const btnOpen = e.target.closest('.btn-open-cert');
    if (btnOpen) {
      e.preventDefault();
      e.stopPropagation();
      const card = btnOpen.closest('.cert-card');
      if (card) openCertModal(card);
      return;
    }

    const card = e.target.closest('.cert-card');
    if (card) {
      e.preventDefault();
      openCertModal(card);
      return;
    }
  }

  if (certTrack) {
    certTrack.addEventListener('click', handleCertDetailClick);
  }

  // Document level click fallback
  document.addEventListener('click', (e) => {
    handleProjectDetailClick(e);
    handleCertDetailClick(e);
  });

  if (btnCloseCertModal) {
    btnCloseCertModal.addEventListener('click', closeCertModal);
  }
  if (btnCancelCertModal) {
    btnCancelCertModal.addEventListener('click', closeCertModal);
  }

  if (btnCopyCertId) {
    btnCopyCertId.addEventListener('click', () => {
      const idText = cModalId.textContent;
      navigator.clipboard.writeText(idText).then(() => {
        showToast(`Link "${idText}" berhasil disalin ke clipboard!`);
      }).catch(() => {
        showToast(`Link: ${idText}`);
      });
    });
  }

  // Close modals on overlay backdrop click
  [projectModal, certModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          e.preventDefault();
          if (modal === projectModal) closeProjectModal(e);
          if (modal === certModal) closeCertModal(e);
        }
      });
    }
  });

  // Hierarchical Escape key handler: top-most modal closes first
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (imageLightboxModal && imageLightboxModal.classList.contains('active')) {
        closeImageLightbox(e);
        return;
      }
      if (projectModal && projectModal.classList.contains('active')) {
        closeProjectModal(e);
        return;
      }
      if (certModal && certModal.classList.contains('active')) {
        closeCertModal(e);
        return;
      }
    }
  });

  // Pause autoplay when user switches browser tab, resume when returning
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (window.__stopProjAutoplay) window.__stopProjAutoplay();
      if (window.__stopCertAutoplay) window.__stopCertAutoplay();
    } else {
      const activeTabBtn = document.querySelector('.portfolio-tab-btn.active');
      const activeTab = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'projects';
      if (activeTab === 'projects' && window.__startProjAutoplay) {
        window.__startProjAutoplay();
      } else if (activeTab === 'certificates' && window.__startCertAutoplay) {
        window.__startCertAutoplay();
      }
    }
  });

  // ==========================================
  // 9. DIRECT CONTACT FORM
  // ==========================================
  const directContactForm = document.getElementById('direct-contact-form');
  const btnSubmitContact = document.getElementById('btn-submit-contact');

  if (directContactForm) {
    directContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();

      if (!name || !email) return;

      const originalBtnText = btnSubmitContact.innerHTML;
      btnSubmitContact.disabled = true;
      btnSubmitContact.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spinSlow 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Mengirim Pesan...</span>
      `;

      setTimeout(() => {
        btnSubmitContact.disabled = false;
        btnSubmitContact.innerHTML = originalBtnText;
        directContactForm.reset();
        showToast(`Terima kasih ${name}! Pesan mengenai "${subject}" berhasil dikirim ke Septian Ghozi.`);
      }, 850);
    });
  }

  // ==========================================
  // 10. COMMUNITY GUESTBOOK / VISITOR COMMENTS
  // ==========================================
  const guestbookForm = document.getElementById('guestbook-form');
  const commentsList = document.getElementById('comments-list');
  const commentCountBadge = document.getElementById('comment-count-badge');
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingLabel = document.getElementById('rating-label');

  let currentSelectedRating = 5;

  const RATING_DESCRIPTIONS = {
    1: '1.0 / 5.0 (Perlu Peningkatan)',
    2: '2.0 / 5.0 (Cukup Bagus)',
    3: '3.0 / 5.0 (Bagus & Menarik)',
    4: '4.0 / 5.0 (Sangat Keren!)',
    5: '5.0 / 5.0 (Luar Biasa!)'
  };

  starButtons.forEach((star) => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'), 10);
      currentSelectedRating = rating;

      starButtons.forEach((s) => {
        const sRating = parseInt(s.getAttribute('data-rating'), 10);
        if (sRating <= rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      if (ratingLabel) {
        ratingLabel.textContent = RATING_DESCRIPTIONS[rating] || `${rating}.0 / 5.0`;
      }
    });
  });

  const DEFAULT_COMMENTS = [
    {
      id: 'c1',
      name: 'Rina Wijaya, S.Kom',
      role: 'Recruiter',
      rating: 5,
      message: 'Visual cyber glassmorphism dan antarmukanya sangat memukau dan responsif! Portofolio mahasiswa TRPL berkelas internasional.',
      time: '2 jam yang lalu'
    },
    {
      id: 'c2',
      name: 'Dr. Hendra Saputra',
      role: 'Lecturer',
      rating: 5,
      message: 'Implementasi clean code dan arsitektur komponen sangat rapi. Teruskan inovasi di bidang web engineering!',
      time: 'Kemarin'
    },
    {
      id: 'c3',
      name: 'Farhan Maulana',
      role: 'Developer',
      rating: 5,
      message: 'Showcase proyek dan animasinya mantap banget bang Ghozi! Sukses terus untuk tugas akhir dan karirnya.',
      time: '3 hari yang lalu'
    }
  ];

  function getStoredComments() {
    try {
      const data = localStorage.getItem('septian_portfolio_comments');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return DEFAULT_COMMENTS;
  }

  function saveStoredComments(comments) {
    try {
      localStorage.setItem('septian_portfolio_comments', JSON.stringify(comments));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function renderComments() {
    if (!commentsList) return;
    const comments = getStoredComments();

    if (commentCountBadge) {
      commentCountBadge.textContent = `${comments.length} Komentar`;
    }

    const contactTabBadge = document.getElementById('contact-tab-count-badge');
    if (contactTabBadge) {
      contactTabBadge.textContent = comments.length;
    }

    commentsList.innerHTML = comments
      .map((c) => {
        const firstLetter = c.name ? c.name.charAt(0).toUpperCase() : 'G';
        const starsText = '★'.repeat(c.rating || 5);
        return `
          <div class="comment-card" data-comment-id="${c.id}">
            <div class="comment-card-top">
              <div class="comment-author-info">
                <div class="comment-avatar">${firstLetter}</div>
                <div>
                  <span class="comment-author-name">${escapeHTML(c.name)}</span>
                  <span class="comment-author-role">${escapeHTML(c.role || 'Visitor')}</span>
                </div>
              </div>
              <div class="comment-stars">${starsText}</div>
            </div>
            <p class="comment-text">${escapeHTML(c.message)}</p>
            <div class="comment-card-footer">
              <span class="comment-timestamp">${escapeHTML(c.time || 'Baru saja')}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('visitor-name').value.trim();
      const role = document.getElementById('visitor-role').value;
      const message = document.getElementById('visitor-message').value.trim();

      if (!name || !message) return;

      const newComment = {
        id: 'c_' + Date.now(),
        name: name,
        role: role,
        rating: currentSelectedRating,
        message: message,
        time: 'Baru saja'
      };

      const existing = getStoredComments();
      existing.unshift(newComment);
      saveStoredComments(existing);

      guestbookForm.reset();
      currentSelectedRating = 5;
      starButtons.forEach((s) => s.classList.add('active'));
      if (ratingLabel) ratingLabel.textContent = RATING_DESCRIPTIONS[5];

      renderComments();
      showToast(`Terima kasih ${name}, komentar Anda telah diposting ke Buku Tamu!`);
    });
  }

  // Initial render of comments
  renderComments();

  // ==========================================
  // 11. BACK TO TOP BUTTON
  // ==========================================
  const btnBackToTop = document.getElementById('btn-back-to-top');
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 12. TOAST NOTIFICATION HELPER
  // ==========================================
  window.showToast = function (message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'cyber-toast';
    toast.innerHTML = `
      <span class="toast-icon">✓</span>
      <span class="toast-msg">${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3800);
  };

})();
