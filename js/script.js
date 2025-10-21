// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
const slides = document.querySelectorAll('.event-slide');
const dots = document.querySelectorAll('.dot');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Initialize all components
    initNavbar();
    initSlider();
    initBackToTop();
    initNewsletterForm();
    initSmoothScrolling();
    initParallaxEffect();
    initThemeToggle();
    initWishlist();
    initStudentsSidebar();
    
    console.log('City Events Guide initialized successfully!');
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mobile menu close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// ===== SLIDER FUNCTIONALITY =====
function initSlider() {
    if (slides.length === 0) return;
    
    applySliderDirection();

    // Observe changes to document direction (LTR/RTL)
    try {
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'dir') {
                    applySliderDirection();
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    } catch (e) {
        console.warn('MutationObserver not available, relying on i18n events');
    }

    // Auto-play slider
    setInterval(() => {
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        changeSlide(isRTL ? -1 : 1);
    }, 5000);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        sliderContainer.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }

    // Click handlers for arrows (independent of inline onclick)
    const prevButton = document.querySelector('.slider-btn.prev-btn');
    const nextButton = document.querySelector('.slider-btn.next-btn');
    if (prevButton) {
        prevButton.removeAttribute('onclick');
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
            changeSlide(isRTL ? 1 : -1);
        });
    }
    if (nextButton) {
        nextButton.removeAttribute('onclick');
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
            changeSlide(isRTL ? -1 : 1);
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left
                changeSlide(isRTL ? -1 : 1);
            } else {
                // Swipe right
                changeSlide(isRTL ? 1 : -1);
            }
        }
    }
}

function changeSlide(direction) {
    if (slides.length === 0) return;
    
    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }
    
    // Calculate new slide index
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
    
    // Add animation classes
    slides.forEach((slide, index) => {
        slide.classList.remove('prev', 'next');
        if (index < currentSlide) {
            slide.classList.add('prev');
        } else if (index > currentSlide) {
            slide.classList.add('next');
        }
    });
}

function currentSlideFunc(n) {
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }
    
    currentSlide = n - 1;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

// Make functions globally available
window.changeSlide = changeSlide;
window.currentSlide = currentSlideFunc;

// Helper: update arrow icons and button semantics for RTL/LTR
function applySliderDirection() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const prevBtn = document.querySelector('.slider-btn.prev-btn i');
    const nextBtn = document.querySelector('.slider-btn.next-btn i');

    if (prevBtn && nextBtn) {
        // In RTL, visually flip icons so Prev shows chevron-right and Next shows chevron-left
        prevBtn.classList.remove('fa-chevron-left', 'fa-chevron-right');
        nextBtn.classList.remove('fa-chevron-left', 'fa-chevron-right');
        if (isRTL) {
            prevBtn.classList.add('fa-chevron-right');
            nextBtn.classList.add('fa-chevron-left');
        } else {
            prevBtn.classList.add('fa-chevron-left');
            nextBtn.classList.add('fa-chevron-right');
        }
    }
}

// Re-apply on language change
window.addEventListener('i18n-translations-applied', () => {
    applySliderDirection();
});

// ===== CATEGORY FILTERING =====
function filterByCategory(category) {
    // Add loading animation
    showLoadingAnimation();
    
    // Simulate API call delay
    setTimeout(() => {
        // Redirect to events page with category filter
        window.location.href = `events.html?category=${category}`;
    }, 500);
}

function showLoadingAnimation() {
    // Create and show loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading events...</p>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Remove loading overlay after 2 seconds
    setTimeout(() => {
        document.body.removeChild(loadingOverlay);
    }, 2000);
}

// Make function globally available
window.filterByCategory = filterByCategory;

// ===== BACK TO TOP FUNCTIONALITY =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing! You will receive our latest updates.', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Make function globally available
window.closeNotification = closeNotification;

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip invalid or empty hrefs
            if (!href || href === '#' || href.length <= 1) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== PARALLAX EFFECT =====
function initParallaxEffect() {
    const heroSection = document.getElementById('hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.event-card, .category-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== EVENT CARD INTERACTIONS =====
function initEventCardInteractions() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Redirect to events page with search query
        window.location.href = `events.html?search=${encodeURIComponent(query)}`;
    } else {
        showNotification('Please enter a search term.', 'error');
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
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

function throttle(func, limit) {
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

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events for better performance
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations and effects are handled here
}, 16)); // ~60fps

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    // Suppress CORS and fetch errors for file:// protocol
    if (e.error && e.error.message && e.error.message.includes('fetch')) {
        return;
    }
    // Suppress querySelector errors for empty hrefs
    if (e.message && e.message.includes('not a valid selector')) {
        return;
    }
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// ===== ADDITIONAL CSS FOR NOTIFICATIONS =====
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    transform: translateX(400px);
    transition: all 0.3s ease-in-out;
    max-width: 400px;
    border-left: 4px solid var(--primary-color);
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left-color: var(--accent-green);
}

.notification-error {
    border-left-color: #ef4444;
}

.notification-content {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.notification-content i:first-child {
    font-size: 1.2rem;
    color: var(--primary-color);
}

.notification-success .notification-content i:first-child {
    color: var(--accent-green);
}

.notification-error .notification-content i:first-child {
    color: #ef4444;
}

.notification-close {
    background: none;
    border: none;
    color: var(--gray-400);
    cursor: pointer;
    padding: 0.25rem;
    margin-left: auto;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.notification-close:hover {
    background: var(--gray-100);
    color: var(--gray-600);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
}

.loading-spinner {
    text-align: center;
    color: var(--primary-color);
}

.animate-in {
    animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`;

// Inject notification styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);

// ===== DARK MODE FUNCTIONALITY =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add animation
            themeToggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('#themeToggle i');
    
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

// ===== WISHLIST FUNCTIONALITY =====
function initWishlist() {
    updateWishlistCount();
    
    // Listen for wishlist updates from other pages
    window.addEventListener('storage', function(e) {
        if (e.key === 'wishlist') {
            updateWishlistCount();
        }
    });
}

function addToWishlist(eventData) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if event already exists
    const existingIndex = wishlist.findIndex(item => item.id === eventData.id);
    
    if (existingIndex === -1) {
        wishlist.push({
            id: eventData.id,
            title: eventData.title,
            date: eventData.date,
            location: eventData.location,
            price: eventData.price,
            image: eventData.image,
            category: eventData.category,
            addedAt: new Date().toISOString()
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        
        showNotification(`"${eventData.title}" added to wishlist!`, 'success');
        return true;
    } else {
        showNotification(`"${eventData.title}" is already in your wishlist`, 'info');
        return false;
    }
}

function removeFromWishlist(eventId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const eventIndex = wishlist.findIndex(item => item.id === eventId);
    
    if (eventIndex > -1) {
        const removedEvent = wishlist[eventIndex];
        wishlist.splice(eventIndex, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        
        showNotification(`"${removedEvent.title}" removed from wishlist`, 'info');
        return true;
    }
    return false;
}

function isInWishlist(eventId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item.id === eventId);
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

function clearWishlist() {
    localStorage.removeItem('wishlist');
    updateWishlistCount();
    showNotification('Wishlist cleared', 'info');
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const countElements = document.querySelectorAll('.wishlist-count');
    
    countElements.forEach(element => {
        element.textContent = wishlist.length;
        element.style.display = wishlist.length > 0 ? 'inline' : 'none';
    });
}

// Make wishlist functions globally available
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;
window.getWishlist = getWishlist;
window.clearWishlist = clearWishlist;

// ===== STUDENTS SIDEBAR FUNCTIONALITY =====
function initStudentsSidebar() {
    const toggleBtn = document.getElementById('studentsToggleBtn');
    const sidebar = document.getElementById('studentsSidebar');
    const closeBtn = document.getElementById('sidebarClose');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!toggleBtn || !sidebar || !closeBtn || !overlay) return;
    
    // Toggle sidebar
    toggleBtn.addEventListener('click', function() {
        openStudentsSidebar();
    });
    
    // Close sidebar
    closeBtn.addEventListener('click', function() {
        closeStudentsSidebar();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function() {
        closeStudentsSidebar();
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeStudentsSidebar();
        }
    });
    
    // Add click animation to student cards
    const studentCards = document.querySelectorAll('.student-card');
    studentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.action-btn')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
    
    // Action button functionality
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const studentCard = this.closest('.student-card');
            const studentName = studentCard.querySelector('.student-name').textContent;
            const studentId = studentCard.querySelector('.student-id').textContent;
            
            showNotification(`Viewing profile for ${studentName} (${studentId})`, 'info');
        });
    });
}

function openStudentsSidebar() {
    const sidebar = document.getElementById('studentsSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Re-initialize AOS for sidebar animations
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function closeStudentsSidebar() {
    const sidebar = document.getElementById('studentsSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Make functions globally available
window.openStudentsSidebar = openStudentsSidebar;
window.closeStudentsSidebar = closeStudentsSidebar;

// ===== EXPORT FOR MODULE SYSTEMS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        changeSlide,
        filterByCategory,
        validateEmail,
        showNotification,
        addToWishlist,
        removeFromWishlist,
        applyTheme
    };
}
