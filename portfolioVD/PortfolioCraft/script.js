// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const progressBars = document.querySelectorAll('.progress-bar');
const loadingScreen = document.querySelector('.loading-screen');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.style.opacity = '0';
            moonIcon.style.opacity = '1';
        } else {
            sunIcon.style.opacity = '1';
            moonIcon.style.opacity = '0';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    bindEvents() {
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.activeSection = 'about';
        this.isMobile = window.innerWidth <= 968;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleResize();
        this.setupSmoothScrolling();
    }

    bindEvents() {
        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                this.showSection(sectionId);
                
                // Close mobile menu if open
                if (this.isMobile) {
                    this.closeMobileMenu();
                }
            });
        });

        // Mobile menu toggle
        mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMobile && 
                !sidebar.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) &&
                sidebar.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Add animation class
            targetSection.classList.add('fade-in');
            setTimeout(() => {
                targetSection.classList.remove('fade-in');
            }, 600);
        }

        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.activeSection = sectionId;

        // Trigger animations for specific sections
        if (sectionId === 'about') {
            this.animateSkillBars();
        } else if (sectionId === 'projects') {
            this.animateProjectCards();
        }
    }

    toggleMobileMenu() {
        sidebar.classList.toggle('active');
        this.updateMobileMenuIcon();
    }

    closeMobileMenu() {
        sidebar.classList.remove('active');
        this.updateMobileMenuIcon();
    }

    updateMobileMenuIcon() {
        const spans = mobileMenuToggle.querySelectorAll('span');
        const isActive = sidebar.classList.contains('active');
        
        spans.forEach((span, index) => {
            if (isActive) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 968;

        // Close mobile menu when switching from mobile to desktop
        if (wasMobile && !this.isMobile) {
            this.closeMobileMenu();
        }
    }

    setupSmoothScrolling() {
        // Add smooth scrolling for any anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    animateSkillBars() {
        // Animate progress bars with a delay
        setTimeout(() => {
            progressBars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                if (width) {
                    setTimeout(() => {
                        bar.style.setProperty('--progress-width', width + '%');
                        bar.style.width = width + '%';
                    }, index * 200);
                }
            });
        }, 300);
    }

    animateProjectCards() {
        // Animate project cards with staggered delays
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Animation Management
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Special handling for skill cards
                    if (entry.target.classList.contains('skill-card')) {
                        const progressBar = entry.target.querySelector('.progress-bar');
                        if (progressBar) {
                            const width = progressBar.getAttribute('data-width');
                            setTimeout(() => {
                                progressBar.style.width = width + '%';
                            }, 500);
                        }
                    }
                }
            });
        }, this.observerOptions);

        // Observe elements with animation attributes
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });

        // Observe skill cards for progress bar animation
        document.querySelectorAll('.skill-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollAnimations() {
        // Add scroll-triggered animations for various elements
        const animatedElements = document.querySelectorAll(`
            .timeline-item,
            .certification-card,
            .project-card,
            .contact-card
        `);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
            });
        }, this.observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }
}

// Loading Management
class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        // Hide loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Remove loading screen from DOM after animation
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 500);
            }, 1000);
        });
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

// Performance Optimization
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        // Add loading="lazy" to images if not already present
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }

    setupLazyLoading() {
        // Lazy load non-critical elements
        const lazyElements = document.querySelectorAll('.skill-card, .project-card');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    lazyObserver.unobserve(entry.target);
                }
            });
        });

        lazyElements.forEach(el => lazyObserver.observe(el));
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for nav links
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % navLinks.length;
                    navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[prevIndex].focus();
                }
            });
        });
    }

    setupAriaLabels() {
        // Add aria-labels where needed
        const themeToggle = document.querySelector('.theme-toggle');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        
        // Add aria-current for active nav link
        const updateAriaCurrent = () => {
            navLinks.forEach(link => {
                link.removeAttribute('aria-current');
            });
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                activeLink.setAttribute('aria-current', 'page');
            }
        };
        
        // Update on nav change
        navLinks.forEach(link => {
            link.addEventListener('click', updateAriaCurrent);
        });
    }

    setupFocusManagement() {
        // Manage focus for mobile menu
        const focusableElements = sidebar.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        
        mobileMenuToggle.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                // Focus first focusable element in sidebar
                setTimeout(() => {
                    if (focusableElements.length > 0) {
                        focusableElements[0].focus();
                    }
                }, 100);
            }
        });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const animationManager = new AnimationManager();
    const loadingManager = new LoadingManager();
    const performanceManager = new PerformanceManager();
    const accessibilityManager = new AccessibilityManager();

    // Add ripple effects to buttons
    const buttons = document.querySelectorAll('button, .nav-link, .contact-link, .social-link');
    buttons.forEach(button => {
        Utils.addRippleEffect(button);
    });

    // Add smooth hover effects to cards
    const cards = document.querySelectorAll('.skill-card, .project-card, .contact-card, .certification-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Log successful initialization
    console.log('🎉 Portfolio website initialized successfully!');
    console.log('Theme:', themeManager.currentTheme);
    console.log('Active section:', navigationManager.activeSection);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page is visible
        document.body.style.animationPlayState = 'running';
    }
});

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(59, 130, 246, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
