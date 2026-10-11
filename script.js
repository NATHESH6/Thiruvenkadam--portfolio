/* ==========================================================================
   THIRUVENKADAM MARASAMY — PORTFOLIO JAVASCRIPT
   Dark/Light Theme Toggle, Typing, Skills/Project Filters, Command Palette,
   Resume Download (PDF via Print), Scroll Animations, Contact Form & more
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       0. DOM SELECTORS
    ------------------------------------------------------------------ */
    const html = document.documentElement;
    const body = document.body;
    const header = document.getElementById('header');

    // Theme
    const themeToggle = document.getElementById('theme-toggle');

    // Mobile nav
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    // Modals
    const resumeModal = document.getElementById('resume-modal');
    const closeResumeModal = document.getElementById('close-resume-modal');
    const projectModal = document.getElementById('project-modal');
    const closeProjectModal = document.getElementById('close-project-modal');

    // Command Palette
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdSearchBtn = document.getElementById('cmd-search-btn');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');
    const cmdCloseBtn = document.getElementById('cmd-close-btn');

    // Back to top
    const backToTopBtn = document.getElementById('back-to-top');

    // Typed text
    const typedTextEl = document.getElementById('typed-text');

    // Toast
    const toastContainer = document.getElementById('toast-container');

    /* ------------------------------------------------------------------
       1. DARK / LIGHT THEME TOGGLE (Persisted via localStorage)
    ------------------------------------------------------------------ */
    function getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0a0b10' : '#f8fafc');
        }
    }

    // Initialise theme from storage or default to dark
    (function initTheme() {
        const stored = getStoredTheme();
        if (stored === 'light' || stored === 'dark') {
            setTheme(stored);
        } else {
            // Respect OS preference, default dark
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    })();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            showToast(next === 'dark' ? '🌙 Dark mode activated' : '☀️ Light mode activated');
        });
    }

    /* ------------------------------------------------------------------
       2. MOBILE HAMBURGER NAVIGATION
    ------------------------------------------------------------------ */
    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mobileDrawer.classList.toggle('open');
        });

        // Close drawer on link click
        mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                mobileDrawer.classList.remove('open');
            });
        });
    }

    /* ------------------------------------------------------------------
       3. HEADER SCROLL EFFECT & ACTIVE NAV SECTION TRACKING
    ------------------------------------------------------------------ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

    function onScroll() {
        const scrollY = window.scrollY;

        // Header compact state
        if (header) {
            header.classList.toggle('scrolled', scrollY > 60);
        }

        // Back to top visibility
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > 500);
        }

        // Active section tracker for nav links
        let currentSection = '';
        sections.forEach(section => {
            const offsetTop = section.offsetTop - 140;
            if (scrollY >= offsetTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial call

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------------------------------
       4. TYPING ANIMATION — Hero Subtitle
    ------------------------------------------------------------------ */
    const typedPhrases = [
        'React Native & Cross-Platform Architecture',
        'Real-Time MQTT Sports-Tech Systems',
        'Enterprise QSR & Food Ordering Apps',
        'AWS Rekognition Video KYC Pipelines',
        'IoT Smart Device & Hardware Control',
        'TypeScript, Redux & TanStack Query',
        'Next.js Server-Side Rendered Portals',
        'App Store & Play Store Deployments',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 65;

    function typeEffect() {
        if (!typedTextEl) return;

        const currentPhrase = typedPhrases[phraseIndex];

        if (isDeleting) {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 65;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // pause at full phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typedPhrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    /* ------------------------------------------------------------------
       5. SKILLS FILTER TABS
    ------------------------------------------------------------------ */
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            skillCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.35s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ------------------------------------------------------------------
       6. PROJECT FILTER TABS
    ------------------------------------------------------------------ */
    const projectFilterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projectFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-project-filter');

            projectCards.forEach(card => {
                const cats = card.getAttribute('data-category') || '';
                if (filter === 'all' || cats.includes(filter)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.35s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ------------------------------------------------------------------
       7. RESUME MODAL — Open / Close / Download PDF
    ------------------------------------------------------------------ */
    // Open resume modal
    document.querySelectorAll('.resume-trigger-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (resumeModal) {
                resumeModal.classList.add('active');
                resumeModal.setAttribute('aria-hidden', 'false');
                body.style.overflow = 'hidden';
            }
            // Close mobile drawer if open
            if (mobileToggle) mobileToggle.classList.remove('open');
            if (mobileDrawer) mobileDrawer.classList.remove('open');
        });
    });

    // Close resume modal
    function closeResume() {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            resumeModal.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
        }
    }

    if (closeResumeModal) closeResumeModal.addEventListener('click', closeResume);

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResume();
        });
    }

    // Download resume as PDF (via browser Print → Save as PDF)
    const printResumeBtn = document.getElementById('print-resume-btn');
    if (printResumeBtn) {
        // Remove inline onclick to handle it here
        printResumeBtn.removeAttribute('onclick');
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }

    /* ------------------------------------------------------------------
       8. PROJECT DETAIL MODAL
    ------------------------------------------------------------------ */
    const projectDetailData = {
        fan4ever: {
            icon: '<i class="fa-solid fa-trophy text-yellow"></i>',
            title: 'Fan4ever Sports Companion Platform',
            domain: 'Sports-Tech / Real-Time Ecosystem',
            content: `
                <h4 style="margin-bottom:12px;color:var(--primary)">Multi-App Ecosystem Architecture</h4>
                <p style="margin-bottom:16px;color:var(--text-secondary)">Fan4ever is a comprehensive 6-application sports companion ecosystem built for the Badminton community, delivering sub-second MQTT-based live score synchronization across Umpire, Fan, Admin, and Livestream clients.</p>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-bottom:20px">
                    <div style="padding:14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;border-left:3px solid #00f0ff">
                        <strong>Fan4ever App</strong><br><span style="color:var(--text-muted);font-size:0.85rem">React Native, TypeScript, Redux, MQTT, Firebase, Razorpay, Geolocation</span>
                    </div>
                    <div style="padding:14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;border-left:3px solid #a855f7">
                        <strong>Club Admin App</strong><br><span style="color:var(--text-muted);font-size:0.85rem">React Native, MVVM Architecture, TanStack Query</span>
                    </div>
                    <div style="padding:14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;border-left:3px solid #3b82f6">
                        <strong>Umpire Scorer App</strong><br><span style="color:var(--text-muted);font-size:0.85rem">Flutter, Dart, Hive-box offline storage</span>
                    </div>
                    <div style="padding:14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;border-left:3px solid #10b981">
                        <strong>Back-Office Admin</strong><br><span style="color:var(--text-muted);font-size:0.85rem">React.js, Redux, Node.js</span>
                    </div>
                    <div style="padding:14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;border-left:3px solid #f43f5e">
                        <strong>Ad Overlay Livestream</strong><br><span style="color:var(--text-muted);font-size:0.85rem">Vue.js, Strapi CMS</span>
                    </div>
                    <div style="padding:14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;border-left:3px solid #f59e0b">
                        <strong>Fan4ever Portal</strong><br><span style="color:var(--text-muted);font-size:0.85rem">React + Next.js, Strapi CMS</span>
                    </div>
                </div>
                <h4 style="margin-bottom:8px">Key Engineering Achievements</h4>
                <ul style="padding-left:20px;list-style:disc;color:var(--text-secondary)">
                    <li>Sub-second MQTT pub/sub live match score synchronization across multiple clients</li>
                    <li>Published on both Apple App Store and Google Play Store</li>
                    <li>In-app payments via Razorpay for tournament registrations</li>
                    <li>Multi-language localization support</li>
                </ul>`
        },
        kfc: {
            icon: '<i class="fa-solid fa-utensils text-red"></i>',
            title: 'KFC India Restaurant Ordering App',
            domain: 'Enterprise QSR / Food-Tech',
            content: `
                <h4 style="margin-bottom:12px;color:var(--primary)">Customer Ordering Flow Architecture</h4>
                <p style="margin-bottom:16px;color:var(--text-secondary)">Enterprise-scale QR-code deep-link table ordering system for millions of KFC India patrons with real-time food preparation tracking.</p>
                <h4 style="margin-bottom:8px">Key Features Delivered</h4>
                <ul style="padding-left:20px;list-style:disc;color:var(--text-secondary)">
                    <li>QR-code-based deep-link table ordering flow reducing in-restaurant wait times</li>
                    <li>Dynamic free-delivery promotional banner system</li>
                    <li>Take-away food preparation tracking screens</li>
                    <li>Automated push notification flows when food is ready for pickup</li>
                    <li>High-performance menu caching for budget Android & iOS devices</li>
                </ul>`
        },
        royal: {
            icon: '<i class="fa-solid fa-ship text-blue"></i>',
            title: 'Royal Caribbean Room Service App',
            domain: 'Tourism & Hospitality',
            content: `
                <h4 style="margin-bottom:12px;color:var(--primary)">Onboard Guest Room-Service System</h4>
                <p style="margin-bottom:16px;color:var(--text-secondary)">Premium room-service ordering app for onboard cruise ship guests, designed for high reliability over satellite network infrastructure.</p>
                <h4 style="margin-bottom:8px">Engineering Highlights</h4>
                <ul style="padding-left:20px;list-style:disc;color:var(--text-secondary)">
                    <li>React & Next.js SSR architecture for fast initial page loads</li>
                    <li>Real-time order status update pipeline</li>
                    <li>Deep linking for seamless guest navigation</li>
                    <li>Enterprise-grade UX & accessibility standards</li>
                    <li>99.9% uptime in live cruise-ship environment</li>
                </ul>`
        },
        kyc: {
            icon: '<i class="fa-solid fa-id-card text-purple"></i>',
            title: 'Video-Based KYC Verification',
            domain: 'AI / FinTech Security',
            content: `
                <h4 style="margin-bottom:12px;color:var(--primary)">AI-Powered Identity Verification Pipeline</h4>
                <p style="margin-bottom:16px;color:var(--text-secondary)">Automated video KYC identity verification with AWS Rekognition facial comparison and OCR document parsing.</p>
                <h4 style="margin-bottom:8px">Pipeline Flow</h4>
                <ol style="padding-left:20px;list-style:decimal;color:var(--text-secondary);margin-bottom:12px">
                    <li>Strapi CMS delivers dynamic KYC step schema to React Native app</li>
                    <li>Video Stream captures liveness test, key frames upload to AWS S3</li>
                    <li>AWS Rekognition performs 99.4% confidence face-match & OCR extraction</li>
                </ol>
                <p style="color:var(--text-secondary)">Reduced manual verification effort by <strong style="color:var(--text-primary)">60%</strong> and improved fraud detection accuracy.</p>`
        },
        aerem: {
            icon: '<i class="fa-solid fa-wifi text-cyan"></i>',
            title: 'Aerem Smart Device Control App',
            domain: 'IoT & Hardware Telemetry',
            content: `
                <h4 style="margin-bottom:12px;color:var(--primary)">IoT Hardware Management Architecture</h4>
                <p style="margin-bottom:16px;color:var(--text-secondary)">Mobile app for hardware device management with automated Wi-Fi provisioning and remote commands.</p>
                <h4 style="margin-bottom:8px">Key Capabilities</h4>
                <ul style="padding-left:20px;list-style:disc;color:var(--text-secondary)">
                    <li>Automated Wi-Fi provisioning & network setup flows</li>
                    <li>Remote hardware control: ON / OFF / UV disinfection</li>
                    <li>Real-time device telemetry dashboard</li>
                    <li>Bilingual localization (English & Hindi)</li>
                    <li>In-app user manual and guides</li>
                </ul>`
        },
        irukkaa: {
            icon: '<i class="fa-solid fa-users text-emerald"></i>',
            title: 'Irukkaa Job Search Platform',
            domain: 'Marketplace & Jobs',
            content: `
                <h4 style="margin-bottom:12px;color:var(--primary)">Blue-Collar Job Marketplace Architecture</h4>
                <p style="margin-bottom:16px;color:var(--text-secondary)">Comprehensive platform connecting blue-collar workers and resource owners across agriculture, construction, and manufacturing.</p>
                <h4 style="margin-bottom:8px">System Components</h4>
                <ul style="padding-left:20px;list-style:disc;color:var(--text-secondary)">
                    <li>React Native mobile app with dual user roles (Worker / Employer)</li>
                    <li>Location-filtered job search and real-time push alerts</li>
                    <li>Firebase Authentication & Cloud Messaging integration</li>
                    <li>React.js + Redux + Node.js Back-Office Admin dashboard</li>
                    <li>Local product promotion features</li>
                </ul>`
        }
    };

    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            const data = projectDetailData[key];
            if (!data || !projectModal) return;

            document.getElementById('modal-p-icon').innerHTML = data.icon;
            document.getElementById('modal-p-title').textContent = data.title;
            document.getElementById('modal-p-domain').textContent = data.domain;
            document.getElementById('modal-p-content').innerHTML = data.content;

            projectModal.classList.add('active');
            projectModal.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
        });
    });

    function closeProjectModalFn() {
        if (projectModal) {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
        }
    }

    if (closeProjectModal) closeProjectModal.addEventListener('click', closeProjectModalFn);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModalFn();
        });
    }

    /* ------------------------------------------------------------------
       9. COMMAND PALETTE (Ctrl + K)
    ------------------------------------------------------------------ */
    const cmdSearchData = [
        { title: 'About Me', desc: 'Bio & Engineering Profile', icon: 'fa-regular fa-user', href: '#about' },
        { title: 'Technical Skills', desc: 'Full skills matrix', icon: 'fa-solid fa-code', href: '#skills' },
        { title: 'Work Experience', desc: 'Career timeline', icon: 'fa-solid fa-briefcase', href: '#experience' },
        { title: 'Featured Projects', desc: 'Portfolio showcase', icon: 'fa-solid fa-layer-group', href: '#projects' },
        { title: 'System Architecture', desc: 'MQTT, KYC, Offline patterns', icon: 'fa-solid fa-network-wired', href: '#architecture' },
        { title: 'Education', desc: 'MCA from Kongu Engineering College', icon: 'fa-solid fa-graduation-cap', href: '#education' },
        { title: 'Contact', desc: 'Email, Phone, LinkedIn', icon: 'fa-regular fa-envelope', href: '#contact' },
        { title: 'Resume', desc: 'View & Download Resume', icon: 'fa-solid fa-file-pdf', action: 'resume' },
        { title: 'Toggle Theme', desc: 'Switch Dark / Light mode', icon: 'fa-solid fa-circle-half-stroke', action: 'theme' },
        { title: 'React Native', desc: 'Expert • 7 Years', icon: 'fa-brands fa-react', href: '#skills' },
        { title: 'MQTT Real-Time', desc: 'Pub/Sub messaging expertise', icon: 'fa-solid fa-bolt', href: '#skills' },
        { title: 'Fan4ever Platform', desc: 'Sports-Tech Ecosystem', icon: 'fa-solid fa-trophy', href: '#projects' },
        { title: 'KFC India App', desc: 'QSR Restaurant Ordering', icon: 'fa-solid fa-utensils', href: '#projects' },
        { title: 'Email', desc: 'thiruvenkadam.marasamy@gmail.com', icon: 'fa-solid fa-envelope', href: 'mailto:thiruvenkadam.marasamy@gmail.com' },
        { title: 'Phone', desc: '+91 99760 56903', icon: 'fa-solid fa-phone', href: 'tel:+919976056903' },
    ];

    let cmdSelectedIndex = 0;

    function openCmdPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.add('active');
        cmdPalette.setAttribute('aria-hidden', 'false');
        if (cmdInput) {
            cmdInput.value = '';
            cmdInput.focus();
        }
        renderCmdResults('');
    }

    function closeCmdPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.remove('active');
        cmdPalette.setAttribute('aria-hidden', 'true');
    }

    function renderCmdResults(query) {
        if (!cmdResults) return;
        const q = query.toLowerCase();
        const filtered = cmdSearchData.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q)
        );

        cmdSelectedIndex = 0;

        cmdResults.innerHTML = filtered.length
            ? filtered.map((item, i) => `
                <div class="cmd-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
                    <div class="cmd-item-icon"><i class="${item.icon}"></i></div>
                    <div class="cmd-item-text">
                        <div class="cmd-item-title">${item.title}</div>
                        <div class="cmd-item-desc">${item.desc}</div>
                    </div>
                </div>
            `).join('')
            : '<div style="padding:20px;text-align:center;color:var(--text-muted)">No results found</div>';

        // Click handlers
        cmdResults.querySelectorAll('.cmd-item').forEach((el, i) => {
            el.addEventListener('click', () => executeCmdItem(filtered[i]));
            el.addEventListener('mouseenter', () => {
                cmdResults.querySelectorAll('.cmd-item').forEach(e => e.classList.remove('selected'));
                el.classList.add('selected');
                cmdSelectedIndex = i;
            });
        });
    }

    function executeCmdItem(item) {
        closeCmdPalette();
        if (item.action === 'resume') {
            if (resumeModal) {
                resumeModal.classList.add('active');
                resumeModal.setAttribute('aria-hidden', 'false');
                body.style.overflow = 'hidden';
            }
        } else if (item.action === 'theme') {
            const current = html.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
            showToast(current === 'dark' ? '☀️ Light mode activated' : '🌙 Dark mode activated');
        } else if (item.href) {
            if (item.href.startsWith('#')) {
                const target = document.querySelector(item.href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = item.href;
            }
        }
    }

    if (cmdSearchBtn) cmdSearchBtn.addEventListener('click', openCmdPalette);
    if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closeCmdPalette);

    if (cmdPalette) {
        cmdPalette.addEventListener('click', (e) => {
            if (e.target === cmdPalette) closeCmdPalette();
        });
    }

    if (cmdInput) {
        cmdInput.addEventListener('input', () => renderCmdResults(cmdInput.value));

        cmdInput.addEventListener('keydown', (e) => {
            const items = cmdResults ? cmdResults.querySelectorAll('.cmd-item') : [];
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (cmdSelectedIndex < items.length - 1) cmdSelectedIndex++;
                items.forEach((el, i) => el.classList.toggle('selected', i === cmdSelectedIndex));
                items[cmdSelectedIndex]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (cmdSelectedIndex > 0) cmdSelectedIndex--;
                items.forEach((el, i) => el.classList.toggle('selected', i === cmdSelectedIndex));
                items[cmdSelectedIndex]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const q = cmdInput.value.toLowerCase();
                const filtered = cmdSearchData.filter(item =>
                    item.title.toLowerCase().includes(q) ||
                    item.desc.toLowerCase().includes(q)
                );
                if (filtered[cmdSelectedIndex]) executeCmdItem(filtered[cmdSelectedIndex]);
            }
        });
    }

    // Keyboard shortcut: Ctrl+K / Cmd+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openCmdPalette();
        }
        if (e.key === 'Escape') {
            closeCmdPalette();
            closeResume();
            closeProjectModalFn();
        }
    });

    /* ------------------------------------------------------------------
       10. COPY TO CLIPBOARD (Contact Detail Cards)
    ------------------------------------------------------------------ */
    document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                showToast('📋 Copied to clipboard!');
            }).catch(() => {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                showToast('📋 Copied to clipboard!');
            });
        });
    });

    /* ------------------------------------------------------------------
       11. TOAST NOTIFICATION SYSTEM
    ------------------------------------------------------------------ */
    function showToast(message, duration = 3000) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = '0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /* ------------------------------------------------------------------
       12. CONTACT FORM (Simple front-end validation + mailto fallback)
    ------------------------------------------------------------------ */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('user-name')?.value?.trim();
            const email = document.getElementById('user-email')?.value?.trim();
            const subject = document.getElementById('user-subject')?.value?.trim();
            const message = document.getElementById('user-message')?.value?.trim();

            if (!name || !email || !subject || !message) {
                if (formFeedback) {
                    formFeedback.className = 'form-feedback error';
                    formFeedback.textContent = 'Please fill in all required fields.';
                }
                return;
            }

            // Build mailto link as reliable fallback (no backend required)
            const mailtoBody = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:thiruvenkadam.marasamy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

            window.open(mailtoLink, '_blank');

            if (formFeedback) {
                formFeedback.className = 'form-feedback success';
                formFeedback.textContent = '✅ Your email client has been opened with the message. Thank you!';
            }

            showToast('✅ Email client opened successfully!');
            contactForm.reset();
        });
    }

    /* ------------------------------------------------------------------
       13. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
    ------------------------------------------------------------------ */
    const animateElements = document.querySelectorAll(
        '.animate-fade-in, .skill-card, .metric-card, .timeline-item, .project-card, .arch-card, .pillar-card, .contact-detail-card'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        animationObserver.observe(el);
    });

    /* ------------------------------------------------------------------
       14. ANIMATED COUNTERS (Metrics Section)
    ------------------------------------------------------------------ */
    const counterElements = document.querySelectorAll('[data-counter]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-counter'), 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    function animateCounter(el, target) {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 30);
    }

    counterElements.forEach(el => counterObserver.observe(el));

    /* ------------------------------------------------------------------
       15. BACKGROUND PARTICLE CANVAS
    ------------------------------------------------------------------ */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticles() {
            particles = [];
            const count = Math.min(60, Math.floor(window.innerWidth / 20));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    alpha: Math.random() * 0.5 + 0.1,
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = html.getAttribute('data-theme') === 'dark';

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = isDark
                    ? `rgba(0, 240, 255, ${p.alpha})`
                    : `rgba(2, 132, 199, ${p.alpha * 0.6})`;
                ctx.fill();
            });

            // Draw faint connection lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = isDark
                            ? `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`
                            : `rgba(2, 132, 199, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationFrame = requestAnimationFrame(drawParticles);
        }

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }

    /* ------------------------------------------------------------------
       16. FOOTER YEAR AUTO-UPDATE
    ------------------------------------------------------------------ */
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ------------------------------------------------------------------
       17. CSS KEYFRAME INJECTION (for fadeInUp animation)
    ------------------------------------------------------------------ */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .site-header.scrolled {
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border-bottom-color: var(--border-accent);
        }
    `;
    document.head.appendChild(style);

})();
