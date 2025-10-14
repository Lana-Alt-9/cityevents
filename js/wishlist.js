// ===== WISHLIST PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    initWishlistPage();
});

function initWishlistPage() {
    loadWishlistItems();
    initWishlistActions();
    updateWishlistInsights();
    loadRelatedEvents();
    
    console.log('Wishlist page initialized successfully!');
}

// ===== LOAD WISHLIST ITEMS =====
function loadWishlistItems() {
    const wishlist = getWishlist();
    const container = document.getElementById('wishlistContainer');
    const emptyState = document.getElementById('emptyWishlist');
    const insights = document.getElementById('wishlistInsights');
    const relatedSection = document.getElementById('relatedEventsSection');
    
    // Update total count
    document.getElementById('totalWishlistCount').textContent = wishlist.length;
    
    if (wishlist.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        insights.style.display = 'none';
        relatedSection.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    insights.style.display = 'block';
    relatedSection.style.display = 'block';
    
    // Sort wishlist by date added (newest first)
    wishlist.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    
    container.innerHTML = wishlist.map((event, index) => createWishlistItemHTML(event, index)).join('');
    
    // Initialize AOS for new elements
    AOS.refresh();
}

function createWishlistItemHTML(event, index) {
    const eventDate = new Date(event.date);
    const addedDate = new Date(event.addedAt);
    const isValidDate = !isNaN(eventDate.getTime());
    
    return `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="wishlist-item" data-event-id="${event.id}">
                <div class="wishlist-item-image">
                    <img src="${event.image}" alt="${event.title}" class="img-fluid">
                    ${isValidDate ? `
                        <div class="wishlist-item-date">
                            <span class="day">${eventDate.getDate()}</span>
                            <span class="month">${eventDate.toLocaleDateString('en', { month: 'short' })}</span>
                        </div>
                    ` : ''}
                    <div class="wishlist-item-actions">
                        <button class="wishlist-action-btn share-btn" onclick="shareWishlistEvent('${event.id}')" title="Share Event">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="wishlist-action-btn remove-btn" onclick="removeWishlistEvent('${event.id}')" title="Remove from Wishlist">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="wishlist-item-body">
                    <span class="wishlist-item-category">${event.category}</span>
                    <h5 class="wishlist-item-title">${event.title}</h5>
                    <div class="wishlist-item-meta">
                        <div class="wishlist-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        ${isValidDate ? `
                            <div class="wishlist-meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${eventDate.toLocaleDateString('en', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</span>
                            </div>
                        ` : ''}
                        <div class="wishlist-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>Added ${formatRelativeTime(addedDate)}</span>
                        </div>
                    </div>
                    <div class="wishlist-item-footer">
                        <span class="wishlist-item-price">${event.price}</span>
                        <a href="event-details.html?id=${event.id}" class="btn btn-primary btn-sm">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== WISHLIST ACTIONS =====
function initWishlistActions() {
    const sortBtn = document.getElementById('sortWishlist');
    const clearBtn = document.getElementById('clearWishlistBtn');
    const shareBtn = document.getElementById('shareWishlist');
    
    if (sortBtn) {
        let sortBy = 'date'; // date, title, category, price
        sortBtn.addEventListener('click', function() {
            // Cycle through sort options
            const sortOptions = [
                { key: 'date', label: 'Sort by Date', icon: 'fa-calendar-alt' },
                { key: 'title', label: 'Sort by Name', icon: 'fa-sort-alpha-down' },
                { key: 'category', label: 'Sort by Category', icon: 'fa-tags' },
                { key: 'price', label: 'Sort by Price', icon: 'fa-dollar-sign' }
            ];
            
            const currentIndex = sortOptions.findIndex(opt => opt.key === sortBy);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            sortBy = sortOptions[nextIndex].key;
            
            // Update button text and icon
            this.innerHTML = `<i class="fas ${sortOptions[nextIndex].icon} me-2"></i>${sortOptions[nextIndex].label}`;
            
            sortWishlist(sortBy);
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your entire wishlist? This action cannot be undone.')) {
                clearWishlistWithAnimation();
            }
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareEntireWishlist);
    }
}

function sortWishlist(sortBy) {
    const wishlist = getWishlist();
    
    wishlist.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'price':
                // Extract numeric value from price string
                const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, '')) || 0;
                const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, '')) || 0;
                return priceA - priceB;
            case 'date':
            default:
                return new Date(a.date) - new Date(b.date);
        }
    });
    
    // Add sorting animation
    const items = document.querySelectorAll('.wishlist-item');
    items.forEach((item, index) => {
        item.classList.add('sorting');
        setTimeout(() => {
            item.classList.remove('sorting');
        }, 300);
    });
    
    // Update localStorage with sorted order
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Reload items with new order
    setTimeout(() => {
        loadWishlistItems();
    }, 150);
}

function removeWishlistEvent(eventId) {
    const wishlistItem = document.querySelector(`[data-event-id="${eventId}"]`);
    
    if (wishlistItem) {
        wishlistItem.classList.add('removing');
        
        setTimeout(() => {
            removeFromWishlist(eventId);
            loadWishlistItems();
            updateWishlistInsights();
        }, 400);
    }
}

function shareWishlistEvent(eventId) {
    const wishlist = getWishlist();
    const event = wishlist.find(item => item.id === eventId);
    
    if (event) {
        const eventUrl = `${window.location.origin}/event-details.html?id=${eventId}`;
        
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: `Check out this amazing event: ${event.title}`,
                url: eventUrl
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(eventUrl).then(() => {
                showNotification('Event link copied to clipboard!', 'success');
            });
        }
    }
}

function clearWishlistWithAnimation() {
    const items = document.querySelectorAll('.wishlist-item');
    
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('removing');
        }, index * 100);
    });
    
    setTimeout(() => {
        clearWishlist();
        loadWishlistItems();
        updateWishlistInsights();
    }, items.length * 100 + 400);
}

function shareEntireWishlist() {
    const wishlist = getWishlist();
    
    if (wishlist.length === 0) {
        showNotification('Your wishlist is empty!', 'info');
        return;
    }
    
    const wishlistText = `Check out my event wishlist:\\n\\n${wishlist.map(event => 
        `• ${event.title} (${event.date})`
    ).join('\\n')}\\n\\nDiscover more events at: ${window.location.origin}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Event Wishlist',
            text: wishlistText,
            url: window.location.origin
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(wishlistText).then(() => {
            showNotification('Wishlist copied to clipboard!', 'success');
        });
    }
}

// ===== WISHLIST INSIGHTS =====
function updateWishlistInsights() {
    const wishlist = getWishlist();
    
    if (wishlist.length === 0) return;
    
    // Calculate upcoming events
    const today = new Date();
    const upcomingEvents = wishlist.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= new Date(today.getFullYear(), today.getMonth() + 1, 0);
    });
    
    // Find favorite category
    const categories = {};
    wishlist.forEach(event => {
        categories[event.category] = (categories[event.category] || 0) + 1;
    });
    
    const favoriteCategory = Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b, 'Music'
    );
    
    // Find most recent addition
    const sortedByAdded = [...wishlist].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    const mostRecent = sortedByAdded[0];
    const recentTime = formatRelativeTime(new Date(mostRecent.addedAt));
    
    // Update insight elements
    document.getElementById('upcomingEventsCount').textContent = upcomingEvents.length;
    document.getElementById('favoriteCategory').textContent = favoriteCategory;
    document.getElementById('recentlyAdded').textContent = recentTime;
}

// ===== RELATED EVENTS =====
function loadRelatedEvents() {
    const wishlist = getWishlist();
    const container = document.getElementById('relatedEventsContainer');
    
    if (wishlist.length === 0) return;
    
    // Get favorite categories from wishlist
    const categories = {};
    wishlist.forEach(event => {
        categories[event.category] = (categories[event.category] || 0) + 1;
    });
    
    // Mock related events based on categories
    const mockRelatedEvents = [
        {
            id: 'related-1',
            title: 'Jazz Night Under Stars',
            category: 'music',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '2024-11-01',
            location: 'Riverside Park',
            price: '$30'
        },
        {
            id: 'related-2',
            title: 'Digital Art Workshop',
            category: 'culture',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '2024-11-05',
            location: 'Creative Hub',
            price: '$45'
        },
        {
            id: 'related-3',
            title: 'Weekend Food Market',
            category: 'food',
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '2024-11-08',
            location: 'Main Square',
            price: 'Free'
        }
    ];
    
    container.innerHTML = mockRelatedEvents.map((event, index) => `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="related-event-card">
                <div class="related-event-image">
                    <img src="${event.image}" alt="${event.title}" class="img-fluid">
                </div>
                <div class="related-event-body">
                    <span class="wishlist-item-category">${event.category}</span>
                    <h5 class="related-event-title">${event.title}</h5>
                    <div class="related-event-meta">
                        <div class="wishlist-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="wishlist-meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${new Date(event.date).toLocaleDateString('en', { 
                                month: 'short', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                    </div>
                    <div class="related-event-footer">
                        <span class="related-event-price">${event.price}</span>
                        <button class="btn btn-outline-primary btn-sm" onclick="addRelatedToWishlist('${event.id}')">
                            <i class="fas fa-heart me-1"></i>Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function addRelatedToWishlist(eventId) {
    // Mock event data for related events
    const mockEvents = {
        'related-1': {
            id: 'related-1',
            title: 'Jazz Night Under Stars',
            category: 'music',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '2024-11-01',
            location: 'Riverside Park',
            price: '$30'
        },
        'related-2': {
            id: 'related-2',
            title: 'Digital Art Workshop',
            category: 'culture',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '2024-11-05',
            location: 'Creative Hub',
            price: '$45'
        },
        'related-3': {
            id: 'related-3',
            title: 'Weekend Food Market',
            category: 'food',
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '2024-11-08',
            location: 'Main Square',
            price: 'Free'
        }
    };
    
    const event = mockEvents[eventId];
    if (event) {
        addToWishlist(event);
        loadWishlistItems();
        updateWishlistInsights();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatRelativeTime(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    if (diffInHours < 1) {
        return 'Just now';
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Make functions globally available
window.removeWishlistEvent = removeWishlistEvent;
window.shareWishlistEvent = shareWishlistEvent;
window.addRelatedToWishlist = addRelatedToWishlist;

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadWishlistItems,
        sortWishlist,
        updateWishlistInsights,
        formatRelativeTime
    };
}
