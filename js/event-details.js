// ===== EVENT DETAILS PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    initEventDetailsPage();
});

function initEventDetailsPage() {
    initEventActions();
    initTicketModal();
    initMapInteraction();
    loadEventData();
    
    console.log('Event details page initialized successfully!');
}

// ===== EVENT ACTIONS =====
function initEventActions() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    if (wishlistBtn) {
        loadWishlistState();
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareEvent);
    }
}

function toggleWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const icon = wishlistBtn.querySelector('i');
    const eventTitle = document.querySelector('.event-hero-title').textContent;
    
    // Extract event data for wishlist
    const eventData = {
        id: new URLSearchParams(window.location.search).get('id') || 'summer-festival-2024',
        title: eventTitle,
        date: '2024-10-15',
        location: 'Central Park Amphitheater',
        price: '$45 - $120',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        category: 'music'
    };
    
    if (wishlistBtn.classList.contains('active')) {
        wishlistBtn.classList.remove('active');
        wishlistBtn.classList.add('btn-outline-light');
        wishlistBtn.classList.remove('btn-warning');
        icon.className = 'far fa-heart me-2';
        wishlistBtn.innerHTML = '<i class="far fa-heart me-2"></i>' + (window.i18n ? window.i18n.t('eventDetails.addToWishlist') : 'Add to Wishlist');
        
        // Remove from wishlist
        removeFromWishlist(eventData.id);
        removeFavorite(eventTitle); // Keep old system for compatibility
    } else {
        wishlistBtn.classList.add('active');
        wishlistBtn.classList.remove('btn-outline-light');
        wishlistBtn.classList.add('btn-warning');
        icon.className = 'fas fa-heart me-2';
        wishlistBtn.innerHTML = '<i class="fas fa-heart me-2"></i>' + (window.i18n ? window.i18n.t('eventDetails.addedToWishlist') : 'Added to Wishlist');
        
        // Add to wishlist
        addToWishlist(eventData);
        addFavorite(eventTitle); // Keep old system for compatibility
        
        // Add pulse animation
        wishlistBtn.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            wishlistBtn.style.animation = '';
        }, 600);
    }
}

// Make function globally available
window.toggleWishlist = toggleWishlist;

function loadWishlistState() {
    const eventTitle = document.querySelector('.event-hero-title').textContent;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const wishlist = getWishlist();
    const wishlistBtn = document.getElementById('wishlistBtn');
    const eventId = new URLSearchParams(window.location.search).get('id') || 'summer-festival-2024';
    
    // Check both old favorites system and new wishlist system
    const isInWishlistSystem = isInWishlist(eventId);
    const isInFavorites = favorites.includes(eventTitle);
    
    if (isInWishlistSystem || isInFavorites) {
        wishlistBtn.classList.add('active');
        wishlistBtn.classList.remove('btn-outline-light');
        wishlistBtn.classList.add('btn-warning');
        wishlistBtn.innerHTML = '<i class="fas fa-heart me-2"></i>' + (window.i18n ? window.i18n.t('eventDetails.addedToWishlist') : 'Added to Wishlist');
    }
}

function addFavorite(eventTitle) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(eventTitle)) {
        favorites.push(eventTitle);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFavorite(eventTitle) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(fav => fav !== eventTitle);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function shareEvent() {
    const eventTitle = document.querySelector('.event-hero-title').textContent;
    const eventUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: eventTitle,
            text: `${window.i18n ? window.i18n.t('eventDetails.shareTextPrefix') : 'Check out this amazing event:'} ${eventTitle}`,
            url: eventUrl
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(eventUrl).then(() => {
            showNotification(window.i18n ? window.i18n.t('eventDetails.notifications.linkCopied') : 'Event link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = eventUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(window.i18n ? window.i18n.t('eventDetails.notifications.linkCopied') : 'Event link copied to clipboard!', 'success');
        });
    }
}

// ===== TICKET MODAL FUNCTIONALITY =====
function initTicketModal() {
    const ticketForm = document.getElementById('ticketForm');
    const ticketType = document.getElementById('ticketType');
    const ticketQuantity = document.getElementById('ticketQuantity');
    
    if (ticketType && ticketQuantity) {
        ticketType.addEventListener('change', updateTicketSummary);
        ticketQuantity.addEventListener('change', updateTicketSummary);
    }
    
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleTicketPurchase);
    }
}

function updateTicketSummary() {
    const ticketType = document.getElementById('ticketType');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const subtotalEl = document.getElementById('subtotal');
    const serviceFeeEl = document.getElementById('serviceFee');
    const totalEl = document.getElementById('total');
    
    if (!ticketType.value || !ticketQuantity.value) {
        subtotalEl.textContent = '$0.00';
        serviceFeeEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        return;
    }
    
    const price = parseFloat(ticketType.selectedOptions[0].dataset.price);
    const quantity = parseInt(ticketQuantity.value);
    const subtotal = price * quantity;
    const serviceFee = subtotal * 0.1; // 10% service fee
    const total = subtotal + serviceFee;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    serviceFeeEl.textContent = `$${serviceFee.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function handleTicketPurchase(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const ticketData = {
        type: formData.get('ticketType') || document.getElementById('ticketType').value,
        quantity: formData.get('ticketQuantity') || document.getElementById('ticketQuantity').value,
        firstName: formData.get('firstName') || document.getElementById('firstName').value,
        lastName: formData.get('lastName') || document.getElementById('lastName').value,
        email: formData.get('email') || document.getElementById('email').value,
        phone: formData.get('phone') || document.getElementById('phone').value
    };
    
    // Validate form
    if (!validateTicketForm(ticketData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' + (window.i18n ? window.i18n.t('eventDetails.modal.processing') : 'Processing...');
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('ticketModal'));
        modal.hide();
        
        // Show success message
        showTicketConfirmation(ticketData);
        
        // Reset form
        e.target.reset();
        updateTicketSummary();
    }, 2000);
}

function validateTicketForm(data) {
    const errors = [];
    
    if (!data.type) errors.push(window.i18n ? window.i18n.t('eventDetails.validation.selectTicketType') : 'Please select a ticket type');
    if (!data.quantity) errors.push(window.i18n ? window.i18n.t('eventDetails.validation.selectQuantity') : 'Please select quantity');
    if (!data.firstName) errors.push(window.i18n ? window.i18n.t('eventDetails.validation.enterFirstName') : 'Please enter your first name');
    if (!data.lastName) errors.push(window.i18n ? window.i18n.t('eventDetails.validation.enterLastName') : 'Please enter your last name');
    if (!data.email) errors.push(window.i18n ? window.i18n.t('eventDetails.validation.enterEmail') : 'Please enter your email');
    if (!validateEmail(data.email)) errors.push(window.i18n ? window.i18n.t('eventDetails.validation.validEmail') : 'Please enter a valid email');
    if (!data.phone) errors.push(window.i18n ? window.i18n.t('eventDetails.validation.enterPhone') : 'Please enter your phone number');
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showTicketConfirmation(ticketData) {
    const eventTitle = document.querySelector('.event-hero-title').textContent;
    const ticketTypeText = document.getElementById('ticketType').selectedOptions[0].textContent;
    
    const confirmationHTML = `
        <div class="ticket-confirmation">
            <div class="confirmation-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>${window.i18n ? window.i18n.t('eventDetails.confirmation.title') : 'Tickets Purchased Successfully!'}</h3>
            <div class="confirmation-details">
                <p><strong>${window.i18n ? window.i18n.t('eventDetails.confirmation.event') : 'Event:'}</strong> ${eventTitle}</p>
                <p><strong>${window.i18n ? window.i18n.t('eventDetails.confirmation.ticketType') : 'Ticket Type:'}</strong> ${ticketTypeText}</p>
                <p><strong>${window.i18n ? window.i18n.t('eventDetails.confirmation.quantity') : 'Quantity:'}</strong> ${ticketData.quantity}</p>
                <p><strong>${window.i18n ? window.i18n.t('eventDetails.confirmation.name') : 'Name:'}</strong> ${ticketData.firstName} ${ticketData.lastName}</p>
                <p><strong>${window.i18n ? window.i18n.t('eventDetails.confirmation.email') : 'Email:'}</strong> ${ticketData.email}</p>
            </div>
            <p class="confirmation-note">
                <i class="fas fa-info-circle me-2"></i>
                ${window.i18n ? window.i18n.t('eventDetails.confirmation.note') : 'Confirmation details have been sent to your email address.'}
            </p>
            <button class="btn btn-primary" onclick="closeConfirmation()">
                <i class="fas fa-calendar me-2"></i>${window.i18n ? window.i18n.t('eventDetails.confirmation.addToCalendar') : 'Add to Calendar'}
            </button>
        </div>
    `;
    
    showNotification(confirmationHTML, 'success', 10000);
}

function closeConfirmation() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeNotification(closeBtn);
        }
    });
}

// Make function globally available
window.closeConfirmation = closeConfirmation;

// ===== MAP INTERACTION =====
function initMapInteraction() {
    const mapPlaceholders = document.querySelectorAll('.map-placeholder');
    
    mapPlaceholders.forEach(map => {
        map.addEventListener('click', function() {
            const address = encodeURIComponent('123 Park Avenue, Downtown, City Center, CC 12345');
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            window.open(googleMapsUrl, '_blank');
        });
    });
}

// ===== LOAD EVENT DATA =====
function loadEventData() {
    // Get event ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        // In a real application, you would fetch event data from an API
        // For now, we'll simulate loading different event data based on ID
        loadEventById(eventId);
    }
}

function loadEventById(eventId) {
    // Simulate different events based on ID
    const events = {
        '1': {
            title: 'Summer Music Festival 2024',
            category: 'Music Festival',
            date: 'October 15, 2024',
            time: '7:00 PM - 11:00 PM',
            location: 'Central Park Amphitheater',
            price: '$45 - $120'
        },
        '2': {
            title: 'Modern Art Exhibition',
            category: 'Culture',
            date: 'October 12-20, 2024',
            time: '10:00 AM - 6:00 PM',
            location: 'City Art Gallery',
            price: 'Free Entry'
        },
        '3': {
            title: 'City Marathon 2024',
            category: 'Sports',
            date: 'October 22, 2024',
            time: '6:00 AM - 12:00 PM',
            location: 'City Center',
            price: '$25 - $50'
        }
        // Add more events as needed
    };
    
    const eventData = events[eventId];
    if (eventData) {
        // Update page title and meta information
        document.title = `${eventData.title} - City Events Guide`;
        
        // You could update other dynamic content here
        console.log(`Loaded event: ${eventData.title}`);
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
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
    
    // Observe timeline items for staggered animation
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Observe artist cards
    document.querySelectorAll('.artist-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===== SIMILAR EVENTS INTERACTION =====
function initSimilarEvents() {
    const similarEvents = document.querySelectorAll('.similar-event');
    
    similarEvents.forEach(event => {
        event.addEventListener('click', function() {
            const eventTitle = this.querySelector('h6').textContent;
            const msgTpl = window.i18n ? window.i18n.t('eventDetails.notifications.redirectingTo') : 'Redirecting to {title}...';
            const msg = msgTpl.replace('{title}', eventTitle);
            showNotification(msg, 'info');
            
            // Simulate navigation to event details
            setTimeout(() => {
                // In a real app, you would navigate to the actual event
                console.log(`Navigate to: ${eventTitle}`);
            }, 1000);
        });
    });
}

// ===== CONTACT ORGANIZER =====
function initOrganizerContact() {
    const contactBtn = document.querySelector('.organizer-info + .btn');
    
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            const organizerName = document.querySelector('.organizer-details h5').textContent;
            const subject = encodeURIComponent(`Inquiry about ${document.querySelector('.event-hero-title').textContent}`);
            const body = encodeURIComponent(`Hello ${organizerName},\n\nI have a question about the event...`);
            
            window.location.href = `mailto:organizer@cityevents.com?subject=${subject}&body=${body}`;
        });
    }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initSimilarEvents();
    initOrganizerContact();
});

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleEventFavorite,
        updateTicketSummary,
        validateTicketForm,
        loadEventById
    };
}
