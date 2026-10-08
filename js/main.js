/* ============================================================
   AMAN ADITYA — PORTFOLIO
   Creative Interactive Cursor & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCreativeCursor();
    initNavigation();
    initHeroAnimation();
    initScrollAnimations();
    initSmoothScroll();
    initMagneticButtons();
    initParallaxGrid();
    initContactForm();
    initTextReveal();
});

/* --------------------------------------------
   CREATIVE CURSOR SYSTEM
   Premium, Interactive, Fun
   -------------------------------------------- */

function initCreativeCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const cursorLabel = document.getElementById('cursor-label');

    if (!dot || !ring) return;

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    dot.style.opacity = '1';
    ring.style.opacity = '1';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let ringX = mouseX, ringY = mouseY;
    let currentState = 'default';
    let isHovering = false;

    // Create trail particles
    const trailCount = 12;
    const trails = [];
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trails';
    trailContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(trailContainer);

    for (let i = 0; i < trailCount; i++) {
        const t = document.createElement('div');
        const size = 4 - (i * 0.25);
        t.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${i < 4 ? 'var(--color-accent)' : 'rgba(10,10,11,0.2)'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s;
        `;
        trailContainer.appendChild(t);
        trails.push({ el: t, x: mouseX, y: mouseY, size: size });
    }

    // Create ripple on click
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 0;
            height: 0;
            border: 1.5px solid var(--color-accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            animation: cursorRipple 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 900);
    });

    // Add ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cursorRipple {
            0% { width: 0; height: 0; opacity: 0.8; }
            100% { width: 60px; height: 60px; opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const states = {
        default:  { dot: '', ring: '', label: '', textColor: '' },
        link:     { dot: '', ring: 'hover-link', label: 'Open', textColor: '' },
        external: { dot: '', ring: 'hover-link', label: 'Visit', textColor: '' },
        button:   { dot: 'hover-btn', ring: 'hover-btn', label: '', textColor: '' },
        project:  { dot: '', ring: 'hover-project', label: 'View', textColor: '' },
        form:     { dot: 'hover-form', ring: 'hover-form', label: 'Type', textColor: '' },
        tag:      { dot: '', ring: 'hover-link', label: 'Skill', textColor: '' },
        hidden:   { dot: '', ring: 'hover-hidden', label: '', textColor: '' }
    };

    function setState(name) {
        if (currentState === name) return;
        currentState = name;
        dot.className = 'cursor-dot';
        ring.className = 'cursor-ring';
        if (cursorLabel) cursorLabel.className = 'cursor-label';
        const s = states[name] || states.default;
        if (s.dot) dot.classList.add(s.dot);
        if (s.ring) ring.classList.add(s.ring);
        if (s.label && cursorLabel) {
            cursorLabel.textContent = s.label;
        }
    }

    // Bind all interactive elements
    document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            setState(el.dataset.cursor || 'link');
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            setState('default');
        });
    });

    // Form inputs
    document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
        el.addEventListener('mouseenter', () => setState('form'));
        el.addEventListener('mouseleave', () => setState('default'));
    });

    // Skill tags
    document.querySelectorAll('.skill-tags span').forEach(el => {
        el.addEventListener('mouseenter', () => setState('tag'));
        el.addEventListener('mouseleave', () => setState('default'));
    });

    document.addEventListener('mouseleave', () => setState('hidden'));
    document.addEventListener('mouseenter', () => { if (!isHovering) setState('default'); });

    let time = 0;
    function animate() {
        time += 0.016;

        // Dot — snappy follow
        dotX += (mouseX - dotX) * 0.45;
        dotY += (mouseY - dotY) * 0.45;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';

        // Ring — smooth lag
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        // Trail — organic wave follow
        let prevX = dotX;
        let prevY = dotY;
        trails.forEach((trail, i) => {
            const wave = Math.sin(time * 3 + i * 0.5) * 1.5;
            const speed = 0.2 - (i * 0.012);
            trail.x += (prevX - trail.x + wave) * Math.max(speed, 0.03);
            trail.y += (prevY - trail.y + wave) * Math.max(speed, 0.03);
            trail.el.style.left = trail.x + 'px';
            trail.el.style.top = trail.y + 'px';
            trail.el.style.opacity = (1 - i / trailCount) * 0.4;
            trail.el.style.transform = `translate(-50%, -50%) scale(${1 - i / trailCount * 0.6})`;
            prevX = trail.x;
            prevY = trail.y;
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* --------------------------------------------
   MAGNETIC BUTTONS
   -------------------------------------------- */

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .project-link, .contact-link');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            btn.style.transform = 'translate(0, 0)';
            setTimeout(() => { btn.style.transition = ''; }, 600);
        });
    });
}

/* --------------------------------------------
   PARALLAX DOT GRID
   -------------------------------------------- */

function initParallaxGrid() {
    const grid = document.querySelector('.grid-bg');
    if (!grid) return;
    window.addEventListener('scroll', () => {
        grid.style.transform = `translateY(${window.pageYOffset * 0.12}px)`;
    }, { passive: true });
}

/* --------------------------------------------
   NAVIGATION
   -------------------------------------------- */

function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.pageYOffset > 60);
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* --------------------------------------------
   HERO ANIMATION
   -------------------------------------------- */

function initHeroAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-label', { opacity: 1, duration: 0.8, delay: 0.3 })
      .to('.hero-line-inner', { y: '0%', duration: 1.4, stagger: 0.12 }, '-=0.4')
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6');
}

/* --------------------------------------------
   TEXT REVEAL ON SCROLL
   -------------------------------------------- */

function initTextReveal() {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal about headline word by word
    const headline = document.querySelector('.about-headline');
    if (headline) {
        const html = headline.innerHTML;
        const words = headline.textContent.split(' ');
        const newHtml = words.map(word =>
            `<span style="display:inline-block;overflow:hidden"><span style="display:inline-block" class="reveal-word">${word}</span></span>`
        ).join(' ');

        // Only wrap non-accent words
        const parts = headline.innerHTML.split(/(<span class="text-accent">.*?<\/span>)/g);
        let finalHtml = '';
        let wordIndex = 0;

        parts.forEach(part => {
            if (part.startsWith('<span class="text-accent">')) {
                finalHtml += part;
            } else {
                const words = part.trim().split(/\s+/).filter(w => w);
                words.forEach(word => {
                    finalHtml += `<span style="display:inline-block;overflow:hidden"><span class="reveal-word" style="display:inline-block">${word}&nbsp;</span></span>`;
                    wordIndex++;
                });
            }
        });

        headline.innerHTML = finalHtml;

        gsap.from('.reveal-word', {
            scrollTrigger: { trigger: headline, start: 'top 85%' },
            opacity: 0,
            y: '100%',
            duration: 0.7,
            stagger: 0.03,
            ease: 'power3.out'
        });
    }
}

/* --------------------------------------------
   SCROLL ANIMATIONS
   -------------------------------------------- */

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 85%' },
            opacity: 0, x: -40, duration: 0.9, ease: 'power3.out'
        });
    });

    // About text
    gsap.from('.about-text-col .about-text', {
        scrollTrigger: { trigger: '.about-text-col', start: 'top 80%' },
        opacity: 0, y: 25, duration: 0.7, stagger: 0.1, ease: 'power3.out'
    });

    // Stats
    gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.stats-grid', start: 'top 90%' },
        opacity: 0, y: 20, scale: 0.96, duration: 0.6, stagger: 0.07, ease: 'back.out(1.5)'
    });

    // Timeline
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 88%' },
            opacity: 0, x: -30, duration: 0.8, delay: i * 0.08, ease: 'power3.out'
        });
    });

    // Projects
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            opacity: 0, y: 35, duration: 0.8, delay: i * 0.06, ease: 'power3.out'
        });
    });

    // Leadership
    gsap.from('.leadership-card', {
        scrollTrigger: { trigger: '.leadership-grid', start: 'top 88%' },
        opacity: 0, y: 35, duration: 0.8, ease: 'power3.out'
    });

    // Skills
    gsap.utils.toArray('.skill-category').forEach((cat, i) => {
        gsap.from(cat, {
            scrollTrigger: { trigger: '.skills-grid', start: 'top 88%' },
            opacity: 0, y: 20, duration: 0.6, delay: i * 0.06, ease: 'power3.out'
        });
    });

    // Contact
    gsap.from('.contact-headline', {
        scrollTrigger: { trigger: '.contact-content', start: 'top 85%' },
        opacity: 0, y: 35, duration: 0.9, ease: 'power3.out'
    });

    gsap.from('.contact-link', {
        scrollTrigger: { trigger: '.contact-links', start: 'top 90%' },
        opacity: 0, x: -20, duration: 0.6, stagger: 0.08, ease: 'power3.out'
    });

    gsap.from('.contact-form', {
        scrollTrigger: { trigger: '.contact-form', start: 'top 90%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
    });
}

/* --------------------------------------------
   SMOOTH SCROLL
   -------------------------------------------- */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --------------------------------------------
   CONTACT FORM
   -------------------------------------------- */

function initContactForm() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate sending
        const btn = form.querySelector('.btn-submit');
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;

        setTimeout(() => {
            form.reset();
            btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9H14M14 9L9 4M14 9L9 14" stroke="currentColor" stroke-width="1.5"/></svg>';
            btn.disabled = false;
            success.classList.add('visible');

            // Scroll to success message
            success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => {
                success.classList.remove('visible');
            }, 5000);
        }, 1200);
    });
}

/* --------------------------------------------
   ACCESSIBILITY
   -------------------------------------------- */

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animationDuration = '0.01ms';
        el.style.animationIterationCount = '1';
        el.style.transitionDuration = '0.01ms';
    });
}
