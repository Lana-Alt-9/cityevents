// ===== EVENTS PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // منع التهيئة المكررة
    if (window.__eventsPageInitialized) return;
    window.__eventsPageInitialized = true;
    initEventsPage();
});

function initEventsPage() {
    // تنظيف أي تكرارات محتملة قبل الإنشاء
    dedupeFilterUI();
    localizeBasicFilters();
    initFilters();
    initViewToggle();
    initEventActions();
    initPagination();
    parseURLParameters();
    
    console.log('Events page initialized successfully!');
}

function dedupeFilterUI() {
    const searchFilterCard = document.querySelector('.search-filter-card');
    if (!searchFilterCard) return;
    const toggles = Array.from(searchFilterCard.querySelectorAll('.filter-toggle'));
    const advs = Array.from(searchFilterCard.querySelectorAll('.advanced-filters'));
    // احذف كل عناصر الفلاتر المتقدمة وزرها
    toggles.forEach(el => el.remove());
    advs.forEach(el => el.remove());
}

// ===== BASIC FILTERS LOCALIZATION =====
function getLang() {
    return (window.i18n && window.i18n.currentLanguage) || document.documentElement.getAttribute('lang') || localStorage.getItem('language') || 'en';
}

function localizeBasicFilters() {
    const isEn = getLang() === 'en';
    const t = (en, ar) => (isEn ? en : ar);

    // Search placeholder (fallback if not handled by i18n attribute)
    const searchInput = document.getElementById('searchInput');
    if (searchInput && !searchInput.hasAttribute('data-i18n-placeholder')) {
        searchInput.placeholder = t('Search events...', 'ابحث عن فعاليات...');
    }

    // Category filter labels
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        const opts = categoryFilter.options;
        if (opts[0]) opts[0].textContent = t('All Categories', 'كل الفئات');
        if (opts[1]) opts[1].textContent = t('Culture', 'ثقافة');
        if (opts[2]) opts[2].textContent = t('Business', 'معارض');
        if (opts[3]) opts[3].textContent = t('Technology', 'تقنية');
    }

    // City filter labels
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        const opts = cityFilter.options;
        if (opts[0]) opts[0].textContent = t('All Cities', 'كل المدن');
        if (opts[1]) opts[1].textContent = t('Damascus', 'دمشق');
        if (opts[2]) opts[2].textContent = t('Aleppo', 'حلب');
        if (opts[3]) opts[3].textContent = t('Hama', 'حماة');
        if (opts[4]) opts[4].textContent = t('Idlib', 'إدلب');
        if (opts[5]) opts[5].textContent = t('Homs', 'حمص');
        if (opts[6]) opts[6].textContent = t('Latakia', 'اللاذقية');
    }

    // Price filter labels
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) {
        const opts = priceFilter.options;
        if (opts[0]) opts[0].textContent = t('All Prices', 'كل الأسعار');
        if (opts[1]) opts[1].textContent = t('Free', 'مجاني');
        if (opts[2]) opts[2].textContent = t('Paid', 'مدفوع');
    }
}

// Update filters on language change
window.addEventListener('i18n-translations-applied', () => {
    setTimeout(localizeBasicFilters, 50);
});

// ===== FILTER FUNCTIONALITY =====
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortSelect = document.getElementById('sortSelect');
    const searchBtn = document.getElementById('searchBtn');
    
    // Search functionality
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search (debounced)
        searchInput.addEventListener('input', debounce(function() {
            filterEvents();
        }, 300));
    }
    
    // Filter change events
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterEvents);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterEvents);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterEvents);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', sortEvents);
    }
    
    // Initialize advanced filters after they're created
    setTimeout(initAdvancedFilterListeners, 100);
}

function initAdvancedFilterListeners() {
    const locationFilter = document.getElementById('locationFilter');
    const durationFilter = document.getElementById('durationFilter');
    const ageFilter = document.getElementById('ageFilter');
    const accessibilityFilter = document.getElementById('accessibilityFilter');
    
    if (locationFilter) {
        locationFilter.addEventListener('change', filterEvents);
    }
    
    if (durationFilter) {
        durationFilter.addEventListener('change', filterEvents);
    }
    
    if (ageFilter) {
        ageFilter.addEventListener('change', filterEvents);
    }
    
    if (accessibilityFilter) {
        accessibilityFilter.addEventListener('change', filterEvents);
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        filterEvents();
        updateURL();
    }
}

function filterEvents() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    // Advanced filters
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    const durationFilter = document.getElementById('durationFilter')?.value || '';
    const ageFilter = document.getElementById('ageFilter')?.value || '';
    const accessibilityFilter = document.getElementById('accessibilityFilter')?.value || '';
    
    const eventItems = document.querySelectorAll('.event-item');
    let visibleCount = 0;
    
    eventItems.forEach(item => {
        const title = item.querySelector('.event-title').textContent.toLowerCase();
        const description = item.querySelector('.event-description').textContent.toLowerCase();
        const category = item.dataset.category;
        const date = item.dataset.date;
        const price = parseFloat(item.dataset.price);
        
        // Advanced filter data attributes
        const location = item.dataset.location || 'downtown';
        const duration = item.dataset.duration || 'medium';
        const ageGroup = item.dataset.ageGroup || 'adults';
        const accessibility = item.dataset.accessibility || 'wheelchair';
        
        let shouldShow = true;
        
        // Search filter
        if (searchQuery && !title.includes(searchQuery) && !description.includes(searchQuery)) {
            shouldShow = false;
        }
        
        // Category filter
        if (categoryFilter && category !== categoryFilter) {
            shouldShow = false;
        }
        
        // Date filter
        if (dateFilter && !matchesDateFilter(date, dateFilter)) {
            shouldShow = false;
        }
        
        // Price filter
        if (priceFilter && !matchesPriceFilter(price, priceFilter)) {
            shouldShow = false;
        }
        
        // Advanced filters
        if (locationFilter && location !== locationFilter) {
            shouldShow = false;
        }
        
        if (durationFilter && duration !== durationFilter) {
            shouldShow = false;
        }
        
        if (ageFilter && ageGroup !== ageFilter) {
            shouldShow = false;
        }
        
        if (accessibilityFilter && accessibility !== accessibilityFilter) {
            shouldShow = false;
        }
        
        // Apply filter with animation
        if (shouldShow) {
            item.classList.remove('filter-out', 'hidden');
            item.classList.add('filter-in');
            visibleCount++;
        } else {
            item.classList.remove('filter-in');
            item.classList.add('filter-out');
            setTimeout(() => {
                item.classList.add('hidden');
            }, 300);
        }
    });
    
    updateResultsCount(visibleCount, eventItems.length);
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount === 0);
}

function matchesDateFilter(eventDate, filter) {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    
    switch (filter) {
        case 'today':
            return eventDateObj.toDateString() === today.toDateString();
        case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return eventDateObj.toDateString() === tomorrow.toDateString();
        case 'this-week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            return eventDateObj >= today && eventDateObj <= weekFromNow;
        case 'this-month':
            return eventDateObj.getMonth() === today.getMonth() && 
                   eventDateObj.getFullYear() === today.getFullYear();
        default:
            return true;
    }
}

function matchesPriceFilter(price, filter) {
    switch (filter) {
        case 'free':
            return price === 0;
        case '0-25':
            return price >= 0 && price <= 25;
        case '25-50':
            return price > 25 && price <= 50;
        case '50-100':
            return price > 50 && price <= 100;
        case '100+':
            return price > 100;
        default:
            return true;
    }
}

function sortEvents() {
    const sortBy = document.getElementById('sortSelect').value;
    const container = document.getElementById('eventsContainer');
    const eventItems = Array.from(container.querySelectorAll('.event-item'));
    
    eventItems.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            case 'name':
                const titleA = a.querySelector('.event-title').textContent;
                const titleB = b.querySelector('.event-title').textContent;
                return titleA.localeCompare(titleB);
            case 'price':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'popularity':
                // Simulate popularity sorting (in real app, this would be based on actual data)
                return Math.random() - 0.5;
            default:
                return 0;
        }
    });
    
    // Re-append sorted items
    eventItems.forEach(item => {
        container.appendChild(item);
    });
    
    // Re-initialize AOS for sorted items
    AOS.refresh();
}

function updateResultsCount(visible, total) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        try {
            const showing = window.i18n ? window.i18n.t('events.showing') : 'Showing';
            const ofWord = window.i18n ? window.i18n.t('events.of') : 'of';
            const eventsNoun = window.i18n ? (window.i18n.t('categories.events') || 'events') : 'events';
            resultsCount.textContent = `${showing} ${visible} ${ofWord} ${total} ${eventsNoun}`;
        } catch (e) {
            resultsCount.textContent = `Showing ${visible} of ${total} events`;
        }
    }
}

function showNoResultsMessage(show) {
    let noResultsDiv = document.querySelector('.no-results');
    
    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        const title = window.i18n ? (window.i18n.t('events.noResultsTitle') || 'No Events Found') : 'No Events Found';
        const description = window.i18n ? (window.i18n.t('events.noResults') || "We couldn't find any events matching your criteria. Try adjusting your filters or search terms.") : "We couldn't find any events matching your criteria. Try adjusting your filters or search terms.";
        const clearFilters = window.i18n ? (window.i18n.t('events.clearAllFilters') || 'Clear All Filters') : 'Clear All Filters';
        noResultsDiv.innerHTML = `
            <div class="no-results-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>${title}</h3>
            <p>${description}</p>
            <button class="btn btn-primary" onclick="clearAllFilters()">
                <i class="fas fa-refresh me-2"></i>${clearFilters}
            </button>
        `;
        
        const eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.parentNode.insertBefore(noResultsDiv, eventsContainer.nextSibling);
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('sortSelect').value = 'date';
    
    // Clear advanced filters
    const locationFilter = document.getElementById('locationFilter');
    const durationFilter = document.getElementById('durationFilter');
    const ageFilter = document.getElementById('ageFilter');
    const accessibilityFilter = document.getElementById('accessibilityFilter');
    
    if (locationFilter) locationFilter.value = '';
    if (durationFilter) durationFilter.value = '';
    if (ageFilter) ageFilter.value = '';
    if (accessibilityFilter) accessibilityFilter.value = '';
    
    filterEvents();
    updateURL();
}

// Make function globally available
window.clearAllFilters = clearAllFilters;

// ===== VIEW TOGGLE FUNCTIONALITY =====
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const eventsGrid = document.getElementById('eventsGrid');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid view
            if (view === 'list') {
                eventsGrid.classList.add('list-view');
            } else {
                eventsGrid.classList.remove('list-view');
            }
            
            // Save preference
            localStorage.setItem('eventsView', view);
        });
    });
    
    // Load saved view preference
    const savedView = localStorage.getItem('eventsView');
    if (savedView) {
        const viewBtn = document.querySelector(`[data-view="${savedView}"]`);
        if (viewBtn) {
            viewBtn.click();
        }
    }
}

// ===== EVENT ACTIONS =====
function initEventActions() {
    // Favorite functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-btn')) {
            e.preventDefault();
            toggleFavorite(e.target.closest('.favorite-btn'));
        }
        
        if (e.target.closest('.share-btn')) {
            e.preventDefault();
            shareEvent(e.target.closest('.share-btn'));
        }
    });
}

function toggleFavorite(btn) {
    const icon = btn.querySelector('i');
    const eventCard = btn.closest('.event-card');
    const eventTitle = eventCard.querySelector('.event-title').textContent;
    const eventItem = eventCard.closest('.event-item');
    
    // Extract event data
    const eventData = {
        id: eventCard.querySelector('.btn-primary').href.split('id=')[1] || Math.random().toString(),
        title: eventTitle,
        date: eventItem.dataset.date,
        location: eventCard.querySelector('.meta-item span').textContent,
        price: eventCard.querySelector('.event-price').textContent,
        image: eventCard.querySelector('img').src,
        category: eventItem.dataset.category
    };
    
    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        icon.className = 'far fa-heart';
        
        // Remove from wishlist
        removeFromWishlist(eventData.id);
        removeFavorite(eventTitle);
    } else {
        btn.classList.add('active');
        icon.className = 'fas fa-heart';
        
        // Add to wishlist
        addToWishlist(eventData);
        addFavorite(eventTitle);
        
        // Add animation
        btn.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            btn.style.animation = '';
        }, 600);
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

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const wishlist = getWishlist();
    
    document.querySelectorAll('.event-card').forEach(card => {
        const title = card.querySelector('.event-title').textContent;
        const favoriteBtn = card.querySelector('.favorite-btn');
        const eventId = card.querySelector('.btn-primary')?.href.split('id=')[1];
        
        // Check both old favorites system and new wishlist system
        const isFavorited = favorites.includes(title) || (eventId && isInWishlist(eventId));
        
        if (isFavorited) {
            favoriteBtn.classList.add('active');
            favoriteBtn.querySelector('i').className = 'fas fa-heart';
        }
    });
}

function shareEvent(btn) {
    const eventCard = btn.closest('.event-card');
    const eventTitle = eventCard.querySelector('.event-title').textContent;
    const eventUrl = window.location.origin + '/event-details.html?id=' + 
                     eventCard.querySelector('.btn-primary').href.split('id=')[1];
    
    if (navigator.share) {
        navigator.share({
            title: eventTitle,
            text: `Check out this amazing event: ${eventTitle}`,
            url: eventUrl
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(eventUrl).then(() => {
            showNotification('Event link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to copy link', 'error');
        });
    }
}

// ===== PAGINATION =====
function initPagination() {
    const paginationLinks = document.querySelectorAll('.page-link');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.closest('.page-item').classList.contains('disabled')) {
                return;
            }
            
            // Update active page
            document.querySelectorAll('.page-item').forEach(item => {
                item.classList.remove('active');
            });
            
            this.closest('.page-item').classList.add('active');
            
            // Simulate page load (in real app, this would load new data)
            showLoadingState();
            
            setTimeout(() => {
                hideLoadingState();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1000);
        });
    });
}

function showLoadingState() {
    const eventsContainer = document.getElementById('eventsContainer');
    const originalContent = eventsContainer.innerHTML;
    
    // Store original content
    eventsContainer.dataset.originalContent = originalContent;
    
    // Show skeleton loading
    eventsContainer.innerHTML = generateSkeletonCards(6);
}

function hideLoadingState() {
    const eventsContainer = document.getElementById('eventsContainer');
    const originalContent = eventsContainer.dataset.originalContent;
    
    if (originalContent) {
        eventsContainer.innerHTML = originalContent;
        delete eventsContainer.dataset.originalContent;
        
        // Reinitialize components
        loadFavorites();
        AOS.refresh();
    }
}

function generateSkeletonCards(count) {
    let skeletonHTML = '';
    
    for (let i = 0; i < count; i++) {
        skeletonHTML += `
            <div class="col-lg-4 col-md-6">
                <div class="skeleton-card">
                    <div class="skeleton-image loading-skeleton"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line short loading-skeleton"></div>
                        <div class="skeleton-line medium loading-skeleton"></div>
                        <div class="skeleton-line loading-skeleton"></div>
                        <div class="skeleton-line short loading-skeleton"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    return skeletonHTML;
}

// ===== ADVANCED FILTERS =====
function initAdvancedFilters() {
    const searchFilterCard = document.querySelector('.search-filter-card');
    if (!searchFilterCard) return;

    // تنظيف أي تكرارات موجودة مسبقاً
    const existingAdv = searchFilterCard.querySelectorAll('.advanced-filters');
    existingAdv.forEach((el, idx) => { if (idx > 0) el.remove(); });
    const existingToggle = searchFilterCard.querySelectorAll('.filter-toggle');
    existingToggle.forEach((el, idx) => { if (idx > 0) el.remove(); });

    // إذا كان موجوداً مسبقاً، لا نعيد الإنشاء
    if (searchFilterCard.querySelector('.advanced-filters') && searchFilterCard.querySelector('.filter-toggle')) {
        return;
    }

    // إنشاء زر التبديل في حال عدم وجوده
    let filterToggle = searchFilterCard.querySelector('.filter-toggle');
    if (!filterToggle) {
        filterToggle = document.createElement('button');
        filterToggle.className = 'filter-toggle';
        const toggleText = window.i18n ? (window.i18n.t('events.filters.advancedToggle') || 'Advanced Filters') : 'Advanced Filters';
        filterToggle.innerHTML = `
            <span class="advanced-toggle-text">${toggleText}</span>
            <i class="fas fa-chevron-down"></i>
        `;
        searchFilterCard.appendChild(filterToggle);
    }

    // إنشاء محتوى الفلاتر المتقدمة في حال عدم وجوده
    let advancedFilters = searchFilterCard.querySelector('.advanced-filters');
    if (!advancedFilters) {
        advancedFilters = document.createElement('div');
        advancedFilters.className = 'advanced-filters';
        const t = (k, fallback) => window.i18n ? (window.i18n.t(k) || fallback) : fallback;
        advancedFilters.innerHTML = `
            <div class="row g-3">
                <div class="col-md-3">
                    <label class="form-label af-location-label">${t('events.filters.location.label','Location')}</label>
                    <select class="form-select" id="locationFilter">
                        <option value="">${t('events.allLocations','All Locations')}</option>
                        <option value="downtown">${t('events.filters.location.options.downtown','Downtown')}</option>
                        <option value="uptown">${t('events.filters.location.options.uptown','Uptown')}</option>
                        <option value="suburbs">${t('events.filters.location.options.suburbs','Suburbs')}</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label af-duration-label">${t('events.filters.duration.label','Duration')}</label>
                    <select class="form-select" id="durationFilter">
                        <option value="">${t('events.filters.duration.options.all','Any Duration')}</option>
                        <option value="short">${t('events.filters.duration.options.short','1-2 hours')}</option>
                        <option value="medium">${t('events.filters.duration.options.medium','3-5 hours')}</option>
                        <option value="long">${t('events.filters.duration.options.long','Full day')}</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label af-age-label">${t('events.filters.age.label','Age Group')}</label>
                    <select class="form-select" id="ageFilter">
                        <option value="">${t('events.filters.age.options.all','All Ages')}</option>
                        <option value="kids">${t('events.filters.age.options.kids','Kids (0-12)')}</option>
                        <option value="teens">${t('events.filters.age.options.teens','Teens (13-17)')}</option>
                        <option value="adults">${t('events.filters.age.options.adults','Adults (18+)')}</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label af-accessibility-label">${t('events.filters.accessibility.label','Accessibility')}</label>
                    <select class="form-select" id="accessibilityFilter">
                        <option value="">${t('events.filters.accessibility.options.all','No Preference')}</option>
                        <option value="wheelchair">${t('events.filters.accessibility.options.wheelchair','Wheelchair Accessible')}</option>
                        <option value="hearing">${t('events.filters.accessibility.options.hearing','Hearing Impaired Friendly')}</option>
                        <option value="visual">${t('events.filters.accessibility.options.visual','Visually Impaired Friendly')}</option>
                    </select>
                </div>
            </div>
        `;
        searchFilterCard.appendChild(advancedFilters);
    }

    // Toggle handler (ensure bound once)
    filterToggle.onclick = function() {
        advancedFilters.classList.toggle('show');
        this.classList.toggle('active');
    };

    // Listen for language changes to update advanced filter labels/options
    window.removeEventListener('i18n-translations-applied', translateAdvancedFilters);
    window.addEventListener('i18n-translations-applied', translateAdvancedFilters);
    // Initial translate pass
    translateAdvancedFilters();
}

function translateAdvancedFilters() {
    const t = (k, fallback) => window.i18n ? (window.i18n.t(k) || fallback) : fallback;
    const toggleText = document.querySelector('.filter-toggle .advanced-toggle-text');
    if (toggleText) toggleText.textContent = t('events.filters.advancedToggle','Advanced Filters');
    
    const locLabel = document.querySelector('.af-location-label');
    if (locLabel) locLabel.textContent = t('events.filters.location.label','Location');
    const locSelect = document.getElementById('locationFilter');
    if (locSelect) {
        const opts = locSelect.options;
        if (opts[0]) opts[0].textContent = t('events.allLocations','All Locations');
        if (opts[1]) opts[1].textContent = t('events.filters.location.options.downtown','Downtown');
        if (opts[2]) opts[2].textContent = t('events.filters.location.options.uptown','Uptown');
        if (opts[3]) opts[3].textContent = t('events.filters.location.options.suburbs','Suburbs');
    }

    const durLabel = document.querySelector('.af-duration-label');
    if (durLabel) durLabel.textContent = t('events.filters.duration.label','Duration');
    const durSelect = document.getElementById('durationFilter');
    if (durSelect) {
        const opts = durSelect.options;
        if (opts[0]) opts[0].textContent = t('events.filters.duration.options.all','Any Duration');
        if (opts[1]) opts[1].textContent = t('events.filters.duration.options.short','1-2 hours');
        if (opts[2]) opts[2].textContent = t('events.filters.duration.options.medium','3-5 hours');
        if (opts[3]) opts[3].textContent = t('events.filters.duration.options.long','Full day');
    }

    const ageLabel = document.querySelector('.af-age-label');
    if (ageLabel) ageLabel.textContent = t('events.filters.age.label','Age Group');
    const ageSelect = document.getElementById('ageFilter');
    if (ageSelect) {
        const opts = ageSelect.options;
        if (opts[0]) opts[0].textContent = t('events.filters.age.options.all','All Ages');
        if (opts[1]) opts[1].textContent = t('events.filters.age.options.kids','Kids (0-12)');
        if (opts[2]) opts[2].textContent = t('events.filters.age.options.teens','Teens (13-17)');
        if (opts[3]) opts[3].textContent = t('events.filters.age.options.adults','Adults (18+)');
    }

    const accLabel = document.querySelector('.af-accessibility-label');
    if (accLabel) accLabel.textContent = t('events.filters.accessibility.label','Accessibility');
    const accSelect = document.getElementById('accessibilityFilter');
    if (accSelect) {
        const opts = accSelect.options;
        if (opts[0]) opts[0].textContent = t('events.filters.accessibility.options.all','No Preference');
        if (opts[1]) opts[1].textContent = t('events.filters.accessibility.options.wheelchair','Wheelchair Accessible');
        if (opts[2]) opts[2].textContent = t('events.filters.accessibility.options.hearing','Hearing Impaired Friendly');
        if (opts[3]) opts[3].textContent = t('events.filters.accessibility.options.visual','Visually Impaired Friendly');
    }

    // Update no-results block if present
    const noResultsDiv = document.querySelector('.no-results');
    if (noResultsDiv) {
        const titleEl = noResultsDiv.querySelector('h3');
        const pEl = noResultsDiv.querySelector('p');
        const btnEl = noResultsDiv.querySelector('button');
        if (titleEl) titleEl.textContent = t('events.noResultsTitle','No Events Found');
        if (pEl) pEl.textContent = t('events.noResults',"We couldn't find any events matching your criteria. Try adjusting your filters or search terms.");
        if (btnEl) {
            const label = t('events.clearAllFilters','Clear All Filters');
            // Keep icon and update text only
            const icon = btnEl.querySelector('i');
            btnEl.innerHTML = '';
            if (icon) btnEl.appendChild(icon);
            const textNode = document.createTextNode(label);
            if (icon) icon.classList.add('me-2');
            btnEl.appendChild(textNode);
        }
    }

    // Update results count text
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const eventItems = document.querySelectorAll('.event-item');
        const visible = Array.from(eventItems).filter(el => !el.classList.contains('hidden')).length;
        updateResultsCount(visible, eventItems.length);
    }
}

// ===== URL PARAMETER HANDLING =====
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set filters based on URL parameters
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    const date = urlParams.get('date');
    const price = urlParams.get('price');
    
    if (category) {
        document.getElementById('categoryFilter').value = category;
    }
    
    if (search) {
        document.getElementById('searchInput').value = decodeURIComponent(search);
    }
    
    if (date) {
        document.getElementById('dateFilter').value = date;
    }
    
    if (price) {
        document.getElementById('priceFilter').value = price;
    }
    
    // Apply filters if any parameters were set
    if (category || search || date || price) {
        filterEvents();
    }
    
    // Load favorites
    loadFavorites();
}

function updateURL() {
    const searchQuery = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const date = document.getElementById('dateFilter').value;
    const price = document.getElementById('priceFilter').value;
    
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (category) params.set('category', category);
    if (date) params.set('date', date);
    if (price) params.set('price', price);
    
    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', newURL);
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

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterEvents,
        sortEvents,
        toggleFavorite,
        shareEvent
    };
}
