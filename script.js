/* ============================================================
   INSPECTRA ENGENHARIA - script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Smooth Scrolling ──────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerOffset = document.querySelector('.topbar')?.offsetHeight || 40;
            const topPos = target.getBoundingClientRect().top + window.scrollY - headerOffset - 10;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
            // Close mobile nav if open
            const nav = document.getElementById('nav');
            if (nav?.classList.contains('open')) {
                nav.classList.remove('open');
                updateHamburger(false);
            }
        });
    });

    // ── Topbar sticky — sem lógica extra necessária ──────────

    // ── Mobile Hamburger ──────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const nav       = document.getElementById('nav');
    let navOpen = false;

    function updateHamburger(open) {
        navOpen = open;
        const icon = hamburger?.querySelector('i');
        if (!icon) return;
        icon.className = open ? 'fas fa-times' : 'fas fa-bars';
    }

    hamburger?.addEventListener('click', () => {
        navOpen = !navOpen;
        nav?.classList.toggle('open', navOpen);
        updateHamburger(navOpen);
        document.body.style.overflow = navOpen ? 'hidden' : '';
    });

    // Internal close button inside mobile nav
    document.getElementById('nav-close')?.addEventListener('click', () => {
        nav?.classList.remove('open');
        updateHamburger(false);
        document.body.style.overflow = '';
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
        if (navOpen && !nav?.contains(e.target) && !hamburger?.contains(e.target)) {
            nav?.classList.remove('open');
            updateHamburger(false);
            document.body.style.overflow = '';
        }
    });

    // ── Flip Cards (mobile tap support) ───────────────────────
    document.querySelectorAll('.servico-card').forEach(card => {
        let touchMoved = false;

        card.addEventListener('touchstart', function () {
            touchMoved = false;
        }, { passive: true });

        card.addEventListener('touchmove', function () {
            touchMoved = true;
        }, { passive: true });

        card.addEventListener('touchend', function (e) {
            if (touchMoved) return; // era scroll, não toque
            e.preventDefault();
            const inner = this.querySelector('.card-inner');
            if (!inner) return;
            inner.classList.toggle('is-flipped');
        });

        card.addEventListener('click', function () {
            const inner = this.querySelector('.card-inner');
            if (!inner) return;
            inner.classList.toggle('is-flipped');
        });
        // Keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.querySelector('.card-inner')?.classList.toggle('is-flipped');
            }
        });
    });

    // ── FAQ Accordion ─────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function () {
            const item    = this.closest('.faq-item');
            const answer  = item?.querySelector('.faq-answer');
            const isOpen  = this.getAttribute('aria-expanded') === 'true';

            // Close all
            document.querySelectorAll('.faq-question').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.closest('.faq-item')?.querySelector('.faq-answer')?.classList.remove('open');
            });

            // Toggle current
            if (!isOpen) {
                this.setAttribute('aria-expanded', 'true');
                answer?.classList.add('open');
            }
        });
    });

    // ── Contact Form ──────────────────────────────────────────
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email     = form.querySelector('#email')?.value.trim();
            const telefone  = form.querySelector('#telefone')?.value.trim();

            if (!email || !telefone) {
                alert('Por favor, preencha o e-mail e o telefone.');
                return;
            }

            const nome      = form.querySelector('#nome')?.value.trim() || 'Não informado';
            const servico   = form.querySelector('#servico')?.value || 'Não especificado';
            const mensagem  = form.querySelector('#mensagem')?.value.trim() || '';

            const text = encodeURIComponent(
                `Olá! Vim pelo site da Inspectra Engenharia.\n\n` +
                `*Nome:* ${nome}\n` +
                `*E-mail:* ${email}\n` +
                `*Telefone:* ${telefone}\n` +
                `*Serviço:* ${servico}\n` +
                (mensagem ? `*Mensagem:* ${mensagem}` : '')
            );

            window.open(`https://wa.me/5547996204777?text=${text}`, '_blank');
        });
    }

    // ── WhatsApp Tooltip Auto-hide ────────────────────────────
    const tooltip = document.getElementById('wpp-tooltip');
    if (tooltip) {
        setTimeout(() => {
            tooltip.style.transition = 'opacity 0.5s';
            tooltip.style.opacity = '0';
            setTimeout(() => { tooltip.style.display = 'none'; }, 500);
        }, 6000);
    }

    // ── Scroll Reveal (lightweight) ───────────────────────────
    const revealEls = document.querySelectorAll(
        '.tech-item, .servico-card, .diferencial-item, .fluxo-step, .faq-item, .stat-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Add initial hidden class
    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
        observer.observe(el);
    });

    // When revealed
    document.addEventListener('animationstart', () => {}, false); // force CSS recalc trick
    const styleReveal = document.createElement('style');
    styleReveal.textContent = `.revealed { opacity:1 !important; transform:none !important; }`;
    document.head.appendChild(styleReveal);

    // ── Active Nav Link on Scroll ─────────────────────────────
    const sections   = document.querySelectorAll('section[id]');
    const navLinks   = document.querySelectorAll('nav ul li a');

    function setActiveNav() {
        let current = '';
        const scrollY = window.scrollY + 120;
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop) current = sec.id;
        });
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#A11E1E';
            }
        });
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();

    // ── Phone Mask ────────────────────────────────────────────
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').substring(0, 11);
            if (v.length > 10) {
                v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (v.length > 6) {
                v = v.replace(/^(\d{2})(\d{4})(\d+)$/, '($1) $2-$3');
            } else if (v.length > 2) {
                v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
            }
            this.value = v;
        });
    }


    // ── Hero Slideshow ────────────────────────────────────────
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots   = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideshowTimer = null;

    function goToSlide(index) {
        heroSlides[currentSlide].classList.remove('active');
        heroDots[currentSlide].classList.remove('active');
        currentSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
        heroDots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }

    function startSlideshow() {
        slideshowTimer = setInterval(nextSlide, 5000);
    }

    if (heroSlides.length > 1) {
        startSlideshow();
        heroDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(slideshowTimer);
                goToSlide(i);
                startSlideshow();
            });
        });
    }

});