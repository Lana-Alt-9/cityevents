// توليد بطاقات الفعاليات من eventsData لصفحة events.html
(function() {
  'use strict';

  // خرائط للتصنيفات والمدن
  function mapCategoryToSlug(cat) {
    if (!cat) return '';
    if (/(معارض|تجارة|استثمار)/.test(cat)) return 'business';
    if (/(ثقافة|مهرجان|تراث|فن)/.test(cat)) return 'culture';
    if (/(تقنية|تكنولوجيا|ابتكار)/.test(cat)) return 'technology';
    if (/(رياضة)/.test(cat)) return 'sports';
    if (/(طعام|مأكولات|غذاء)/.test(cat)) return 'food';
    return 'culture';
  }

  function mapCityFromLocation(loc) {
    if (!loc) return '';
    if (/دمشق/.test(loc)) return 'damascus';
    if (/حلب/.test(loc)) return 'aleppo';
    if (/حماة/.test(loc)) return 'hama';
    if (/إدلب|ادلب/.test(loc)) return 'idlib';
    if (/حمص/.test(loc)) return 'homs';
    if (/اللاذقية/.test(loc)) return 'lattakia';
    if (/طرطوس/.test(loc)) return 'tartus';
    if (/دير\s*الزور/.test(loc)) return 'deir-ez-zor';
    if (/الرقة/.test(loc)) return 'raqqa';
    if (/الحسكة/.test(loc)) return 'hasaka';
    if (/السويداء/.test(loc)) return 'sweida';
    if (/درعا/.test(loc)) return 'daraa';
    return '';
  }

  function mapPriceToSlug(price) {
    if (!price) return '';
    return /مجاني|free/i.test(price) ? 'free' : 'paid';
  }

  function parseDateParts(dateStr) {
    if (!dateStr) return { day: '', month: '' };
    let m = String(dateStr).match(/(\d{1,2})\s+([\p{L}A-Za-z]+)/u);
    if (m) return { day: m[1], month: m[2] };
    m = String(dateStr).match(/([A-Za-z\p{L}]+)\s+(\d{1,2})/u);
    if (m) return { day: m[2], month: m[1] };
    return { day: '', month: '' };
  }

  function renderEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container || typeof eventsData === 'undefined') return;

    // امسح المحتوى القديم
    container.innerHTML = '';

    // رتب حسب ID تصاعديًا لضمان نفس ترتيب الصفحة الرئيسية
    const ids = Object.keys(eventsData)
      .map(Number)
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    let delay = 0;
    ids.forEach((id) => {
      const evRaw = eventsData[id];
      if (!evRaw) return;
      const ev = window.getLocalizedEvent ? window.getLocalizedEvent(evRaw) : evRaw;
      const catSlug = mapCategoryToSlug(ev.category || '');
      const citySlug = mapCityFromLocation(ev.location || '');
      const priceSlug = mapPriceToSlug(ev.price || '');
      const { day, month } = parseDateParts(ev.date || '');

      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 event-item';
      if (catSlug) col.dataset.category = catSlug;
      if (citySlug) col.dataset.city = citySlug;
      if (priceSlug) col.dataset.price = priceSlug;
      col.setAttribute('data-aos', 'fade-up');
      if (delay) col.setAttribute('data-aos-delay', String(delay));
      delay = (delay + 100) % 600;

      const lang = (window.i18n && window.i18n.currentLanguage) || document.documentElement.getAttribute('lang') || localStorage.getItem('language') || 'en';
      const isEn = lang === 'en';
      const viewDetails = isEn ? 'View Details' : 'عرض التفاصيل';

      col.innerHTML = `
        <div class="event-card">
          <div class="event-image">
            <img src="${ev.image}" alt="${ev.title}" class="img-fluid">
            <div class="event-date">
              <span class="day">${day || ''}</span>
              <span class="month">${month || ''}</span>
            </div>
            <div class="event-actions">
              <button class="action-btn favorite-btn" title="Add to Favorites">
                <i class="far fa-heart"></i>
              </button>
              <button class="action-btn share-btn" title="Share Event">
                <i class="fas fa-share-alt"></i>
              </button>
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
              <a href="event-details.html?id=${id}" class="btn btn-primary btn-sm">${viewDetails}</a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(col);
    });

    // تحديث العداد
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
      const total = container.querySelectorAll('.event-item').length;
      const lang = (window.i18n && window.i18n.currentLanguage) || document.documentElement.getAttribute('lang') || localStorage.getItem('language') || 'en';
      if (lang === 'en') {
        resultsCount.textContent = `Showing ${total} of ${total} Events`;
      } else {
        resultsCount.textContent = `عرض ${total} من ${total} فعاليات`;
      }
    }

    // تفعيل AOS من جديد بعد الحقن
    if (window.AOS && typeof window.AOS.refresh === 'function') {
      window.AOS.refresh();
    }

    // تحفيز نظام الفلترة الحالي لإعادة الحساب
    try {
      const categoryFilter = document.getElementById('categoryFilter');
      categoryFilter && categoryFilter.dispatchEvent(new Event('change'));
      const cityFilter = document.getElementById('cityFilter');
      cityFilter && cityFilter.dispatchEvent(new Event('change'));
      const priceFilter = document.getElementById('priceFilter');
      priceFilter && priceFilter.dispatchEvent(new Event('change'));
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderEvents);
  } else {
    renderEvents();
  }

  // إعادة الرسم عند تغيير اللغة
  window.addEventListener('i18n-translations-applied', () => {
    setTimeout(() => {
      renderEvents();
    }, 100);
  });

  // إعادة الرسم عند تغيير اللغة من localStorage (تبديل في تبويب آخر)
  window.addEventListener('storage', (e) => {
    if (e.key === 'language') {
      setTimeout(renderEvents, 100);
    }
  });

  // ربط سريع مع عناصر تبديل اللغة في القائمة المنسدلة
  document.addEventListener('click', (e) => {
    const langItem = e.target.closest('.lang-option');
    if (langItem) {
      setTimeout(renderEvents, 150);
    }
  });
})();
