/**
 * ATUSHI PORTFOLIO - JAVASCRIPT MASTER APPLICATION LOGIC
 * Dynamic typing, ambient canvas particles, interactive filters, modal case studies, and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initDynamicTyping();
    initNavbarScrollspy();
    initMobileNav();
    initScrollReveal();
    initStatsCounter();
    initAboutTabs();
    initSkillFilters();
    initProjectFilters();
    initProjectModal();
    initContactInteractions();
    initCursorGlow();
    initCopyrightYear();
});

/* --------------------------------------------------------------------------
   1. Dynamic Ambient Particle Canvas
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor(width * 0.04), 50);

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(129, 140, 248, 0.4)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Subtle mouse repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    this.x -= directionX * force * 2;
                    this.y -= directionY * force * 2;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    const opacity = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.15})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   2. Dynamic Role Typing
   -------------------------------------------------------------------------- */
function initDynamicTyping() {
    const targetElement = document.getElementById('dynamic-text');
    if (!targetElement) return;

    const phrases = [
        "Full-Stack Web Architect",
        "Creative Frontend Craftsman",
        "High-Performance System Builder",
        "Clean Code & UI Specialist"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            targetElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            targetElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before typing new phrase
        }

        setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
}

/* --------------------------------------------------------------------------
   3. Navbar Scrollspy & Sticky Header
   -------------------------------------------------------------------------- */
function initNavbarScrollspy() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    function onScroll() {
        const scrollY = window.pageYOffset;

        // Sticky Header appearance
        if (scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Highlight Active Link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealItems = document.querySelectorAll('.reveal-item');
    if (!revealItems.length) return;

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealItems.forEach((item, index) => {
        // Add subtle staggered delay for adjacent items
        const delay = (index % 4) * 0.08;
        item.style.transitionDelay = `${delay}s`;
        revealObserver.observe(item);
    });
}

/* --------------------------------------------------------------------------
   6. Number Counter Animation
   -------------------------------------------------------------------------- */
function initStatsCounter() {
    const statCards = document.querySelectorAll('.stat-num');
    if (!statCards.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statCards.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    let count = 0;
                    const duration = 1400; // ms
                    const increment = Math.ceil(target / (duration / 25));

                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = count;
                        }
                    }, 25);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
}

/* --------------------------------------------------------------------------
   7. About Tabs Navigation
   -------------------------------------------------------------------------- */
function initAboutTabs() {
    const tabButtons = document.querySelectorAll('.about-tabs .tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panels .tab-panel');
    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPanelId = btn.getAttribute('aria-controls');

            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                panel.hidden = true;
            });

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.hidden = false;
            }
        });
    });
}

/* --------------------------------------------------------------------------
   8. Skill Filtering
   -------------------------------------------------------------------------- */
function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.skill-filters .filter-btn');
    const skillCards = document.querySelectorAll('#skills-grid .skill-card');
    if (!filterBtns.length || !skillCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   9. Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.project-filters .proj-filter-btn');
    const projectCards = document.querySelectorAll('#projects-grid .project-card');
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   10. Interactive Project Case Study Modal
   -------------------------------------------------------------------------- */
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.getElementById('modal-close');
    const triggerBtns = document.querySelectorAll('.view-details-btn');

    if (!modal || !modalContent || !closeBtn) return;

    const projectData = {
        nexus: {
            title: "NexusOS — Distributed Real-Time Workspace",
            tag: "FULL STACK ARCHITECTURE // 2026",
            description: "NexusOS was conceived to eliminate friction in remote technical teams. It delivers an ultra-fast collaborative platform where state transitions propagate globally in under 40 milliseconds.",
            problem: "Traditional web collaboration tools suffer from high payload bloat, heavy client libraries, and complex operational overhead.",
            solution: "Designed a lightweight custom WebSockets protocol paired with atomic state diffing, modular DOM updates, and custom CSS variables.",
            stack: ["JavaScript (ESNext)", "Node.js Engine", "WebSockets Protocol", "CSS Grid Layout", "IndexedDB Offline Cache"],
            stats: [
                { label: "Sync Latency", value: "< 40ms" },
                { label: "Bundle Size", value: "32 KB" },
                { label: "Concurrent Users", value: "5000+" }
            ]
        },
        pulsecraft: {
            title: "PulseCraft — Generative Vector & Motion Engine",
            tag: "CREATIVE COMPUTING // 2026",
            description: "An in-browser procedural vector generator designed for UI/UX designers and creative developers seeking unique generative visuals and micro-interactions.",
            problem: "Generating algorithmic geometric graphics usually requires heavy desktop tools or bulky external graphics libraries.",
            solution: "Engineered a native HTML5 2D Canvas and SVG parametric math generator running at 60 FPS, with one-click pure CSS keyframe and SVG exporting.",
            stack: ["HTML5 Canvas API", "Pure Vanilla JS", "SVG Vector Math", "CSS Houdini", "WebGL Shaders"],
            stats: [
                { label: "Frame Rate", value: "60 FPS" },
                { label: "Export Formats", value: "CSS / SVG" },
                { label: "Memory Footprint", value: "18 MB" }
            ]
        },
        aether: {
            title: "AetherFlow — High-Frequency Financial Dashboard",
            tag: "FINTECH UI & DATA VISUALIZATION // 2025",
            description: "A financial data visualization terminal built for instantaneous market index rendering and transaction monitoring without render lag.",
            problem: "High data ingest rates typically trigger severe layout thrashing and dropped frames in consumer browsers.",
            solution: "Built a customized SVG graph renderer using requestAnimationFrame batching, zero virtual DOM overhead, and container query responsive layouts.",
            stack: ["Custom SVG Engine", "Vanilla JavaScript", "CSS Flexbox & Grid", "REST API Polling", "Web Workers"],
            stats: [
                { label: "Lighthouse Score", value: "100/100" },
                { label: "Render Time", value: "16ms" },
                { label: "Data Ingest", value: "2.5k events/s" }
            ]
        }
    };

    function openModal(key) {
        const data = projectData[key];
        if (!data) return;

        modalContent.innerHTML = `
            <div class="modal-header-tag">${data.tag}</div>
            <h3 class="modal-header-title">${data.title}</h3>
            <p class="body-text">${data.description}</p>
            
            <div class="modal-section-block">
                <h4 class="modal-section-title">The Challenge</h4>
                <p class="body-text">${data.problem}</p>
            </div>

            <div class="modal-section-block">
                <h4 class="modal-section-title">Architectural Solution</h4>
                <p class="body-text">${data.solution}</p>
            </div>

            <div class="modal-section-block">
                <h4 class="modal-section-title">Technical Stack</h4>
                <div class="project-tech-tags" style="margin-top: 10px;">
                    ${data.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>

            <div class="hero-stats" style="margin-top: 28px; width: 100%; padding: 18px 24px;">
                ${data.stats.map(s => `
                    <div class="stat-card">
                        <span class="stat-num" style="font-size: 1.5rem;">${s.value}</span>
                        <span class="stat-label">${s.label}</span>
                    </div>
                `).join('')}
            </div>
        `;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    triggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectKey = btn.getAttribute('data-project');
            openModal(projectKey);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* --------------------------------------------------------------------------
   11. Contact Form & Clipboard Copy
   -------------------------------------------------------------------------- */
function initContactInteractions() {
    // Copy Email to clipboard
    const copyBtn = document.getElementById('copy-email-btn');
    const emailAddress = document.getElementById('email-address');

    if (copyBtn && emailAddress) {
        copyBtn.addEventListener('click', async () => {
            const email = emailAddress.textContent.trim();
            try {
                await navigator.clipboard.writeText(email);
                const copyText = copyBtn.querySelector('.copy-text');
                const originalText = copyText.textContent;
                copyText.textContent = "Copied!";
                copyBtn.style.borderColor = "var(--success)";
                copyBtn.style.color = "var(--success)";

                setTimeout(() => {
                    copyText.textContent = originalText;
                    copyBtn.style.borderColor = "";
                    copyBtn.style.color = "";
                }, 2200);
            } catch (err) {
                console.error("Clipboard access failed", err);
            }
        });
    }

    // Contact form validation & dispatch simulation
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = document.getElementById('submit-btn');

        let isValid = true;

        // Simple validation checks
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            const group = input.closest('.form-group');
            if (!input.value.trim()) {
                group.classList.add('has-error');
                isValid = false;
            } else {
                group.classList.remove('has-error');
            }
        });

        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
            emailInput.closest('.form-group').classList.add('has-error');
            isValid = false;
        }

        if (!isValid) {
            feedback.className = 'form-feedback error';
            feedback.textContent = 'Please complete all required fields with valid input.';
            return;
        }

        // Simulating dispatch
        submitBtn.disabled = true;
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Transmitting Message...</span>`;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            form.reset();
            feedback.className = 'form-feedback success';
            feedback.textContent = 'Thank you! Your dispatch has been transmitted. I will respond promptly.';

            setTimeout(() => {
                feedback.className = 'form-feedback';
                feedback.textContent = '';
            }, 6000);
        }, 1200);
    });
}

/* --------------------------------------------------------------------------
   12. Cursor Glow Spotlight
   -------------------------------------------------------------------------- */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow || window.innerWidth < 768) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderGlow() {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        cursorGlow.style.left = `${currentX}px`;
        cursorGlow.style.top = `${currentY}px`;
        requestAnimationFrame(renderGlow);
    }

    renderGlow();
}

/* --------------------------------------------------------------------------
   13. Dynamic Copyright Year
   -------------------------------------------------------------------------- */
function initCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
