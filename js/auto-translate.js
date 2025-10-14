// Auto-translate helper - adds data-i18n to common elements dynamically
// This handles content that wasn't marked up with data-i18n attributes

(function() {
    'use strict';
    
    // Run when translations are applied
    window.addEventListener('i18n-translations-applied', function(e) {
        autoTranslateCommonElements();
    });
    
    // Also run on initial load with a delay
    setTimeout(autoTranslateCommonElements, 500);
    
    function autoTranslateCommonElements() {
        if (!window.i18n || !window.i18n.translations || Object.keys(window.i18n.translations).length === 0) {
            return;
        }
        
        const currentLang = window.i18n.currentLanguage;
        
        // Map of exact English text to translation keys
        const textMap = {
            // Navigation
            'Home': 'nav.home',
            'All Events': 'nav.allEvents',
            'About': 'nav.about',
            'Contact': 'nav.contact',
            'City Events': 'nav.brand',
            
            // Hero
            'Discover Amazing': 'hero.title',
            'Local Events': 'hero.titleSpan',
            'Explore Events': 'hero.exploreEvents',
            'Learn More': 'hero.learnMore',
            
            // Featured
            'Featured Events of the Week': 'featured.title',
            'View Details': 'featured.viewDetails',
            
            // Categories
            'Browse by Category': 'categories.title',
            'Music': 'categories.music',
            'Culture': 'categories.culture',
            'Sports': 'categories.sports',
            'Family': 'categories.family',
            'Food': 'categories.food',
            'Business': 'categories.business',
            'Events': 'categories.events',
            
            // Latest
            'Latest Events': 'latest.title',
            'View All Events': 'latest.viewAll',
            
            // Newsletter
            'Stay Updated': 'newsletter.title',
            'Subscribe': 'newsletter.subscribe',
            'Event Alerts': 'newsletter.features.alerts',
            'Exclusive Offers': 'newsletter.features.offers',
            'Weekly Digest': 'newsletter.features.digest',
            
            // Footer
            'Quick Links': 'footer.quickLinks',
            'Categories': 'footer.categories',
            'Contact Info': 'footer.contactInfo',
            'Privacy Policy': 'footer.privacy',
            'Terms of Service': 'footer.terms',
            'Cookie Policy': 'footer.cookies',
            
            // Events page
            'All Events': 'events.pageTitle',
            'Search events...': 'events.search',
            'All Categories': 'events.allCategories',
            'All Locations': 'events.allLocations',
            'Sort By': 'events.sortBy',
            'Free': 'events.free',
            
            // About page
            'About Us': 'about.pageTitle',
            'Our Story': 'about.ourStory',
            'Our Mission': 'about.ourMission',
            'Our Values': 'about.ourValues',
            
            // Contact page
            'Contact Us': 'contact.pageTitle',
            'Get In Touch': 'contact.getInTouch',
            'Full Name': 'contact.fullName',
            'Email Address': 'contact.email',
            'Subject': 'contact.subject',
            'Your Message': 'contact.message',
            'Send Message': 'contact.sendMessage',
            'Contact Information': 'contact.contactInfo',
            'Address': 'contact.address',
            'Phone': 'contact.phone',
            'Email': 'contact.emailLabel',
            'Follow Us': 'contact.followUs',
            
            // Wishlist
            'My Wishlist': 'wishlist.pageTitle',
            'Your wishlist is empty': 'wishlist.empty',
            'Browse Events': 'wishlist.browseEvents',
            'Remove from Wishlist': 'wishlist.removeFromWishlist',
            
            // Common
            'Loading...': 'common.loading',
            'Back to Top': 'common.backToTop',
            'Read More': 'common.readMore'
        };
        
        // Only translate if we're in Arabic mode
        if (currentLang !== 'ar') {
            return;
        }
        
        // Find and translate all text nodes
        function translateElement(element) {
            // Skip if already has data-i18n
            if (element.hasAttribute('data-i18n')) {
                return;
            }
            
            // Get text content
            const text = element.textContent.trim();
            
            // Check if we have a translation key for this text
            if (textMap[text]) {
                const translation = window.i18n.t(textMap[text]);
                if (translation && translation !== textMap[text]) {
                    element.textContent = translation;
                    // Mark as translated to avoid re-translation
                    element.setAttribute('data-auto-translated', 'true');
                }
            }
        }
        
        // Target specific elements that commonly contain translatable text
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'a', 'button',
            '.nav-link', '.btn', '.page-title', '.page-subtitle',
            '.section-title', '.section-subtitle', '.footer-title',
            '.breadcrumb-item'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // Only process leaf text nodes (no child elements)
                if (element.children.length === 0 || 
                    (element.children.length === 1 && element.children[0].tagName === 'I')) {
                    translateElement(element);
                }
            });
        });
        
        // Handle placeholders
        const placeholderMap = {
            'Enter your email address': 'newsletter.placeholder',
            'Search events...': 'events.search',
            'Full Name': 'contact.fullName',
            'Email Address': 'contact.email',
            'Subject': 'contact.subject',
            'Your Message': 'contact.message'
        };
        
        document.querySelectorAll('[placeholder]').forEach(input => {
            const placeholder = input.getAttribute('placeholder');
            if (placeholderMap[placeholder]) {
                const translation = window.i18n.t(placeholderMap[placeholder]);
                if (translation && translation !== placeholderMap[placeholder]) {
                    input.setAttribute('placeholder', translation);
                }
            }
        });
    }
    
})();
