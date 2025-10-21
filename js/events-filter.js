// Events Filtering System for Syrian Events
(function() {
    'use strict';

    // Filter functionality
    const filterEvents = () => {
        const categoryFilter = document.getElementById('categoryFilter');
        const cityFilter = document.getElementById('cityFilter');
        const priceFilter = document.getElementById('priceFilter');
        const searchInput = document.getElementById('searchInput');
        const resultsCount = document.getElementById('resultsCount');
        
        if (!categoryFilter || !cityFilter) return;

        const applyFilters = () => {
            const selectedCategory = categoryFilter.value.toLowerCase();
            const selectedCity = cityFilter.value.toLowerCase();
            const selectedPrice = priceFilter.value.toLowerCase();
            const searchTerm = searchInput?.value.toLowerCase() || '';
            
            const eventItems = document.querySelectorAll('.event-item');
            let visibleCount = 0;
            
            eventItems.forEach(item => {
                const category = item.dataset.category?.toLowerCase() || '';
                const city = item.dataset.city?.toLowerCase() || '';
                const price = item.dataset.price?.toLowerCase() || '';
                const title = item.querySelector('.event-title')?.textContent.toLowerCase() || '';
                const description = item.querySelector('.event-description')?.textContent.toLowerCase() || '';
                
                // Check category filter
                const matchesCategory = !selectedCategory || category === selectedCategory;
                
                // Check city filter
                const matchesCity = !selectedCity || city === selectedCity;
                
                // Check price filter
                let matchesPrice = true;
                if (selectedPrice === 'free') {
                    matchesPrice = price === 'free' || price === 'مجاني';
                } else if (selectedPrice === 'paid') {
                    matchesPrice = price !== 'free' && price !== 'مجاني';
                }
                
                // Check search
                const matchesSearch = !searchTerm || 
                    title.includes(searchTerm) || 
                    description.includes(searchTerm);
                
                // Show/hide item
                if (matchesCategory && matchesCity && matchesPrice && matchesSearch) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update results count
            if (resultsCount) {
                const totalCount = eventItems.length;
                resultsCount.textContent = `عرض ${visibleCount} من ${totalCount} فعالية`;
            }
        };

        // Event listeners
        categoryFilter.addEventListener('change', applyFilters);
        cityFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('change', applyFilters);
        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        
        // Initial count
        applyFilters();
    };

    // View toggle (grid/list)
    const setupViewToggle = () => {
        const viewBtns = document.querySelectorAll('.view-btn');
        const eventsContainer = document.getElementById('eventsContainer');
        
        if (!eventsContainer) return;

        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                // Update active button
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update grid/list view
                if (view === 'list') {
                    eventsContainer.classList.remove('row');
                    eventsContainer.classList.add('list-view');
                } else {
                    eventsContainer.classList.add('row');
                    eventsContainer.classList.remove('list-view');
                }
            });
        });
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            filterEvents();
            setupViewToggle();
        });
    } else {
        filterEvents();
        setupViewToggle();
    }
})();
