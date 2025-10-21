// دالة مساعدة للحصول على البيانات بناءً على اللغة الحالية
(function() {
    'use strict';

    // الحصول على اللغة الحالية
    function getCurrentLang() {
        const byI18n = (window.i18n && window.i18n.currentLanguage) ? window.i18n.currentLanguage : '';
        const byHtml = document.documentElement.getAttribute('lang') || '';
        const byStorage = localStorage.getItem('language') || '';
        return byI18n || byHtml || byStorage || 'en';
    }

    // الحصول على القيمة الصحيحة بناءً على اللغة
    function getLocalizedField(event, fieldName) {
        if (!event) return '';
        
        const lang = getCurrentLang();
        const enField = fieldName + 'En';
        
        // إذا كانت الإنجليزية وتوجد النسخة الإنجليزية
        if (lang === 'en' && event[enField]) {
            return event[enField];
        }
        
        // إرجاع النسخة العربية (الافتراضية)
        return event[fieldName] || '';
    }

    // إنشاء كائن محلّي من الفعالية
    function getLocalizedEvent(event) {
        if (!event) return null;
        
        return {
            title: getLocalizedField(event, 'title'),
            category: getLocalizedField(event, 'category'),
            date: getLocalizedField(event, 'date'),
            location: getLocalizedField(event, 'location'),
            duration: getLocalizedField(event, 'duration'),
            price: getLocalizedField(event, 'price'),
            description: getLocalizedField(event, 'description'),
            fullDescription: getLocalizedField(event, 'fullDescription'),
            highlights: getLocalizedField(event, 'highlights'),
            organizer: getLocalizedField(event, 'organizer'),
            tags: getLocalizedField(event, 'tags'),
            // الحقول التي لا تتغير
            image: event.image,
            contact: event.contact,
            website: event.website
        };
    }

    // جعل الدوال متاحة عالمياً
    window.getLocalizedField = getLocalizedField;
    window.getLocalizedEvent = getLocalizedEvent;
    window.getCurrentLang = getCurrentLang;
})();
