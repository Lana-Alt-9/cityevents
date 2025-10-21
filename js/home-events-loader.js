// Render Latest Events on index.html from eventsData with bilingual support
(function() {
  'use strict';

  function getDayMonth(dateStr) {
    if (!dateStr) return { day: '', month: '' };
    // Try patterns: "15 سبتمبر 2025" or "September 15, 2025" or "Nov 5, 2025"
    // Extract first number and first word after
    let m = String(dateStr).match(/(\d{1,2})\s+([\p{L}A-Za-z]+)/u);
    if (m) return { day: m[1], month: m[2] };
    // Try "Month DD, YYYY"
    m = String(dateStr).match(/([A-Za-z\p{L}]+)\s+(\d{1,2})/u);
    if (m) return { day: m[2], month: m[1] };
    return { day: '', month: '' };
  }

  function renderLatest() {
    const grid = document.getElementById('eventsGrid');
    if (!grid || typeof eventsData === 'undefined') return;

    // Build list of IDs (first 6)
    const ids = Object.keys(eventsData)
      .map(Number)
      .filter(Number.isFinite)
      .sort((a,b) => a - b)
      .slice(0, 6);

    const tViewDetails = (window.i18n && window.i18n.translations && window.i18n.translations.featured && window.i18n.translations.featured.viewDetails) || 'View Details';

    let html = '';
    let delay = 100;
    ids.forEach((id) => {
      const raw = eventsData[id];
      if (!raw) return;
      const ev = window.getLocalizedEvent ? window.getLocalizedEvent(raw) : raw;
      const { day, month } = getDayMonth(ev.date);

      html += `
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}" data-category="${(ev.category||'').toLowerCase()}">
          <div class="event-card">
            <div class="event-image">
              <img src="${ev.image}" alt="${ev.title}" class="img-fluid">
              <div class="event-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
              </div>
            </div>
            <div class="event-card-body">
              <span class="event-category badge bg-primary mb-2">${ev.category || ''}</span>
              <h5 class="event-title">${ev.title || ''}</h5>
              <p class="event-description">${ev.description || ''}</p>
              <div class="event-meta">
                <div class="meta-item">
                  <i class="fas fa-map-marker-alt me-1"></i>
                  <span>${ev.location || ''}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-clock me-1"></i>
                  <span>${ev.duration || ''}</span>
                </div>
              </div>
              <div class="event-footer">
                <span class="event-price">${ev.price || ''}</span>
                <a href="event-details.html?id=${id}" class="btn btn-primary btn-sm">${tViewDetails}</a>
              </div>
            </div>
          </div>
        </div>`;
      delay += 100;
    });

    grid.innerHTML = html;

    // Refresh AOS if present
    if (window.AOS && typeof window.AOS.refresh === 'function') {
      setTimeout(() => window.AOS.refresh(), 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLatest);
  } else {
    renderLatest();
  }

  // Re-render on language changes
  window.addEventListener('i18n-translations-applied', () => setTimeout(renderLatest, 100));
  window.addEventListener('storage', (e) => { if (e.key === 'language') setTimeout(renderLatest, 100); });
  document.addEventListener('click', (e) => {
    const langItem = e.target.closest('.lang-option');
    if (langItem) setTimeout(renderLatest, 150);
  });
})();
