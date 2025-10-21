// تحميل تفاصيل الفعالية ديناميكياً
(function() {
    'use strict';

    // الحصول على ID الفعالية من URL
    function getEventId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '1';
    }

    // تحميل تفاصيل الفعالية
    function loadEventDetails() {
        const eventId = getEventId();
        const eventRaw = eventsData[eventId];

        if (!eventRaw) {
            console.error('Event not found');
            return;
        }

        // الحصول على البيانات الملائمة للغة
        const event = window.getLocalizedEvent ? window.getLocalizedEvent(eventRaw) : eventRaw;

        // تحديث العنوان
        document.title = `${event.title} - دليل الفعاليات`;

        // تحديث صورة Hero
        const heroImage = document.querySelector('.event-hero-image img');
        if (heroImage) {
            heroImage.src = event.image;
            heroImage.alt = event.title;
        }

        // تحديث Breadcrumb
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbActive) {
            breadcrumbActive.textContent = event.title;
        }

        // تحديث عنوان الصفحة
        const pageTitle = document.querySelector('.event-hero-title');
        if (pageTitle) {
            pageTitle.textContent = event.title;
        }

        // تحديث التصنيف
        const categoryBadge = document.querySelector('.event-category');
        if (categoryBadge) {
            categoryBadge.textContent = event.category;
        }

        // تحديث الوصف القصير
        const shortDesc = document.querySelector('.event-hero-subtitle');
        if (shortDesc) {
            shortDesc.textContent = event.description;
        }

        // تحديث المعلومات السريعة
        updateQuickInfo(event);

        // تحديث الوصف الكامل
        const fullDesc = document.querySelector('.event-full-description, .event-details-content');
        if (fullDesc) {
            fullDesc.innerHTML = event.fullDescription;
        }

        // تحديث النقاط البارزة
        updateHighlights(event.highlights);

        // تحديث معلومات المنظم
        updateOrganizerInfo(event);

        // تحديث الوسوم
        updateTags(event.tags);

        // تحديث صورة البطاقة الاجتماعية
        updateSocialCard(event);
    }

    // تحديث المعلومات السريعة
    function updateQuickInfo(event) {
        const quickInfoContainer = document.querySelector('.event-quick-info');
        if (!quickInfoContainer) return;

        const lang = (window.i18n && window.i18n.currentLanguage) || document.documentElement.getAttribute('lang') || localStorage.getItem('language') || 'en';
        const isEn = lang === 'en';
        const L = {
            date: isEn ? 'Date' : 'التاريخ',
            duration: isEn ? 'Duration' : 'المدة',
            location: isEn ? 'Location' : 'الموقع',
            price: isEn ? 'Price' : 'السعر'
        };

        quickInfoContainer.innerHTML = `
            <div class="quick-info-item">
                <i class="fas fa-calendar-alt"></i>
                <div>
                    <strong>${event.date}</strong>
                    <span>${L.date}</span>
                </div>
            </div>
            <div class="quick-info-item">
                <i class="fas fa-clock"></i>
                <div>
                    <strong>${event.duration}</strong>
                    <span>${L.duration}</span>
                </div>
            </div>
            <div class="quick-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>${event.location}</strong>
                    <span>${L.location}</span>
                </div>
            </div>
            <div class="quick-info-item">
                <i class="fas fa-ticket-alt"></i>
                <div>
                    <strong>${event.price}</strong>
                    <span>${L.price}</span>
                </div>
            </div>
        `;
    }

    // تحديث النقاط البارزة
    function updateHighlights(highlights) {
        const highlightsList = document.querySelector('.highlights-list, .event-highlights ul');
        if (highlightsList && highlights) {
            highlightsList.innerHTML = '';
            highlights.forEach(highlight => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${highlight}`;
                highlightsList.appendChild(li);
            });
        }
    }

    // تحديث معلومات المنظم
    function updateOrganizerInfo(event) {
        const organizerName = document.querySelector('.organizer-name');
        if (organizerName && event.organizer) {
            organizerName.textContent = event.organizer;
        }

        const organizerContact = document.querySelector('.organizer-contact');
        if (organizerContact && event.contact) {
            organizerContact.textContent = event.contact;
            organizerContact.href = `tel:${event.contact}`;
        }

        const organizerWebsite = document.querySelector('.organizer-website');
        if (organizerWebsite && event.website) {
            organizerWebsite.textContent = event.website;
            organizerWebsite.href = event.website;
        }
    }

    // تحديث الوسوم
    function updateTags(tags) {
        const tagsContainer = document.querySelector('.event-tags');
        if (tagsContainer && tags) {
            tagsContainer.innerHTML = '';
            tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'badge bg-secondary me-2 mb-2';
                span.textContent = tag;
                tagsContainer.appendChild(span);
            });
        }
    }

    // تحديث البطاقة الاجتماعية للمشاركة
    function updateSocialCard(event) {
        // تحديث meta tags لوسائل التواصل
        updateMetaTag('og:title', event.title);
        updateMetaTag('og:description', event.description);
        updateMetaTag('og:image', event.image);
        updateMetaTag('twitter:title', event.title);
        updateMetaTag('twitter:description', event.description);
        updateMetaTag('twitter:image', event.image);
    }

    // تحديث meta tag
    function updateMetaTag(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            if (property.startsWith('og:')) {
                meta.setAttribute('property', property);
            } else {
                meta.setAttribute('name', property);
            }
            document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
    }

    function getLang() {
        return (window.i18n && window.i18n.currentLanguage) || document.documentElement.getAttribute('lang') || localStorage.getItem('language') || 'en';
    }

    function localizeDetailTitles() {
        const isEn = getLang() === 'en';

        const aboutTitle = Array.from(document.querySelectorAll('.detail-title')).find(t => {
            const p = t.parentElement;
            return p && (p.querySelector('.event-full-description'));
        });
        if (aboutTitle) aboutTitle.textContent = isEn ? 'About the Event' : 'عن الفعالية';

        const highlightsTitle = Array.from(document.querySelectorAll('.detail-title')).find(t => {
            const p = t.parentElement;
            return p && (p.querySelector('.event-highlights'));
        });
        if (highlightsTitle) highlightsTitle.textContent = isEn ? 'Highlights' : 'النقاط البارزة';

        const organizerCardTitle = Array.from(document.querySelectorAll('.detail-title')).find(t => {
            const p = t.parentElement;
            return p && (p.querySelector('.organizer-info'));
        });
        if (organizerCardTitle) organizerCardTitle.textContent = isEn ? 'Organizer Information' : 'معلومات المنظم';

        const tagsTitle = Array.from(document.querySelectorAll('.detail-title')).find(t => {
            const p = t.parentElement;
            return p && (p.querySelector('.event-tags'));
        });
        if (tagsTitle) tagsTitle.textContent = isEn ? 'Tags' : 'الوسوم';
    }

    function localizeBreadcrumbAndHeroActions() {
        const isEn = getLang() === 'en';

        // Breadcrumb labels (first two are static in HTML)
        try {
            const items = document.querySelectorAll('.breadcrumb .breadcrumb-item');
            if (items[0]) {
                const a = items[0].querySelector('a');
                if (a) a.textContent = isEn ? 'Home' : 'الرئيسية';
            }
            if (items[1]) {
                const a = items[1].querySelector('a');
                if (a) a.textContent = isEn ? 'All Events' : 'الفعاليات';
            }
            // The active item is the event title and is already localized from data
        } catch (_) {}

        // Hero action buttons (wishlist/share)
        try {
            const favBtn = document.querySelector('.event-actions button:not(.share-facebook):not(.share-whatsapp) span');
            const fbBtn = document.querySelector('.event-actions .share-facebook span');
            const waBtn = document.querySelector('.event-actions .share-whatsapp span');
            if (favBtn) favBtn.textContent = isEn ? 'Add to Wishlist' : 'إضافة للمفضلة';
            if (fbBtn) fbBtn.textContent = isEn ? 'Share' : 'مشاركة';
            if (waBtn) waBtn.textContent = isEn ? 'WhatsApp' : 'واتساب';
        } catch (_) {}
    }

    // إزالة الأقسام القديمة/غير المتعلقة من الصفحة
    function cleanLegacySections() {
        try {
            // إزالة الفوتر وزر الرجوع للأعلى
            document.querySelectorAll('.footer-section').forEach(el => el.remove());
            const backToTop = document.getElementById('backToTop');
            if (backToTop) backToTop.remove();

            // إزالة أقسام ثابتة غير مطلوبة
            // تذاكر ومعلومات قديمة
            document.querySelectorAll('.sidebar-card').forEach(el => el.remove());
            // فنانين وجدول وموقع قديم
            document.querySelectorAll('.artist-card').forEach(el => el.remove());
            const scheduleCard = document.querySelector('[data-i18n="eventDetails.eventSchedule"]');
            if (scheduleCard) scheduleCard.closest('.detail-card')?.remove();
            const locationCard = document.querySelector('[data-i18n="eventDetails.locationSection"]');
            if (locationCard) locationCard.closest('.detail-card')?.remove();
            // فعاليات مشابهة
            const relatedCard = document.querySelector('[data-i18n="eventDetails.relatedEvents"]');
            if (relatedCard) relatedCard.closest('.sidebar-card')?.remove();
            // نافذة التذاكر
            const ticketModal = document.getElementById('ticketModal');
            if (ticketModal) ticketModal.remove();
        } catch (e) {
            console.warn('Cleanup warning:', e);
        }
    }

    // زر المفضلة: إضافة/إزالة
    function initWishlistButton() {
        const btn = document.querySelector('.event-actions button[onclick*="toggleWishlist"]');
        if (!btn || !window.isInWishlist) return;

        const eventId = getEventId();
        const inList = window.isInWishlist(eventId);
        const icon = btn.querySelector('i');

        if (inList) {
            btn.classList.add('active');
            btn.classList.remove('btn-outline-light');
            btn.classList.add('btn-warning');
            if (icon) icon.className = 'fas fa-heart me-2';
        } else {
            btn.classList.remove('active');
            btn.classList.add('btn-outline-light');
            btn.classList.remove('btn-warning');
            if (icon) icon.className = 'far fa-heart me-2';
        }
    }

    function toggleWishlist() {
        const btn = document.querySelector('.event-actions button[onclick*="toggleWishlist"]');
        if (!btn || !window.addToWishlist || !window.removeFromWishlist) return;

        const eventId = getEventId();
        const event = eventsData[eventId];
        const inList = window.isInWishlist ? window.isInWishlist(eventId) : false;

        const eventPayload = {
            id: eventId,
            title: event.title,
            date: event.date,
            location: event.location,
            price: event.price,
            image: event.image,
            category: event.category
        };

        if (inList) {
            window.removeFromWishlist(eventId);
        } else {
            window.addToWishlist(eventPayload);
        }

        initWishlistButton();
    }

    // جعلها متاحة عالمياً للزر inline
    window.toggleWishlist = toggleWishlist;

    // أزرار المشاركة
    function setupSocialSharing() {
        const eventId = getEventId();
        const event = eventsData[eventId];
        const currentUrl = window.location.href;

        // Facebook
        const facebookBtn = document.querySelector('.share-facebook');
        if (facebookBtn) {
            facebookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
                window.open(url, '_blank', 'width=600,height=400');
            });
        }

        // Twitter
        const twitterBtn = document.querySelector('.share-twitter');
        if (twitterBtn) {
            twitterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const text = `${event.title} - ${event.description}`;
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
                window.open(url, '_blank', 'width=600,height=400');
            });
        }

        // WhatsApp
        const whatsappBtn = document.querySelector('.share-whatsapp');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const text = `${event.title} - ${event.description}\n${currentUrl}`;
                const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            });
        }

        // نسخ الرابط
        const copyLinkBtn = document.querySelector('.copy-link');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(currentUrl).then(() => {
                    alert('تم نسخ الرابط!');
                });
            });
        }
    }

    // التهيئة عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            cleanLegacySections();
            loadEventDetails();
            localizeDetailTitles();
            localizeBreadcrumbAndHeroActions();
            initWishlistButton();
            setupSocialSharing();
        });
    } else {
        cleanLegacySections();
        loadEventDetails();
        localizeDetailTitles();
        localizeBreadcrumbAndHeroActions();
        initWishlistButton();
        setupSocialSharing();
    }

    // إعادة التحميل عند تغيير اللغة
    window.addEventListener('i18n-translations-applied', () => {
        setTimeout(() => {
            loadEventDetails();
            localizeDetailTitles();
            localizeBreadcrumbAndHeroActions();
        }, 100);
    });
})();
