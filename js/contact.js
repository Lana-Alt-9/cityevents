// ===== CONTACT PAGE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

function initContactPage() {
    initContactForm();
    initFormValidation();
    initCharacterCounter();
    initSubjectDependentFields();
    
    console.log('Contact page initialized successfully!');
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        privacy: formData.get('privacy') === 'on'
    };
    
    // Validate entire form
    if (!validateContactForm(contactData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const resetBtn = e.target.querySelector('button[type="reset"]');
    const originalSubmitText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending Message...';
    submitBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset buttons
        submitBtn.innerHTML = originalSubmitText;
        submitBtn.disabled = false;
        resetBtn.disabled = false;
        
        // Show success message
        showContactSuccess(contactData);
        
        // Reset form
        e.target.reset();
        clearAllErrors();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

function validateContactForm(data) {
    let isValid = true;
    const errors = [];
    
    // Required field validation
    if (!data.firstName?.trim()) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }
    
    if (!data.lastName?.trim()) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }
    
    if (!data.email?.trim()) {
        showFieldError('email', 'Email address is required');
        isValid = false;
    } else if (!validateEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!data.subject) {
        showFieldError('subject', 'Please select a subject');
        isValid = false;
    }
    
    if (!data.message?.trim()) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (data.message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    if (!data.privacy) {
        showFieldError('privacy', 'You must agree to the privacy policy');
        isValid = false;
    }
    
    // Phone validation (optional but if provided, must be valid)
    if (data.phone?.trim() && !validatePhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(field.id);
    
    switch (field.id) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                showFieldError(field.id, `${field.labels[0].textContent.replace(' *', '')} is required`);
                return false;
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError('email', 'Email address is required');
                return false;
            } else if (!validateEmail(value)) {
                showFieldError('email', 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'phone':
            if (value && !validatePhone(value)) {
                showFieldError('phone', 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'subject':
            if (!value) {
                showFieldError('subject', 'Please select a subject');
                return false;
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError('message', 'Message is required');
                return false;
            } else if (value.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters long');
                return false;
            }
            break;
            
        case 'privacy':
            if (!field.checked) {
                showFieldError('privacy', 'You must agree to the privacy policy');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    
    field.classList.add('is-invalid');
    if (feedback) {
        feedback.textContent = message;
    }
}

function clearFieldError(fieldId) {
    const field = typeof fieldId === 'string' ? document.getElementById(fieldId) : fieldId;
    if (field) {
        field.classList.remove('is-invalid');
    }
}

function clearAllErrors() {
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
        field.classList.remove('is-invalid');
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// ===== FORM ENHANCEMENTS =====
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Hook into submit for HTML5 constraint validation + custom messages
    form.addEventListener('submit', function (e) {
        // Let our own handler handle validity styling/messages
        const isFormValid = form.checkValidity();
        if (!isFormValid) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });

    // Mirror invalid-feedback with i18n keys already in the markup
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach((el) => {
        el.addEventListener('invalid', () => {
            // Add Bootstrap invalid class for styling
            el.classList.add('is-invalid');
        });
        el.addEventListener('input', () => {
            if (el.checkValidity()) {
                el.classList.remove('is-invalid');
            }
        });
    });
}
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: var(--gray-500);
            margin-top: 0.25rem;
        `;
        
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = messageField.value.length;
            const minLength = 10;
            const maxLength = 1000;
            
            counter.textContent = `${length}/${maxLength} characters`;
            
            if (length < minLength) {
                counter.style.color = 'var(--accent-pink)';
                counter.textContent += ` (minimum ${minLength})`;
            } else if (length > maxLength * 0.9) {
                counter.style.color = 'var(--secondary-color)';
            } else {
                counter.style.color = 'var(--accent-green)';
            }
            
            if (length > maxLength) {
                counter.style.color = 'var(--accent-pink)';
                messageField.value = messageField.value.substring(0, maxLength);
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial call
    }
}

function initSubjectDependentFields() {
    const subjectField = document.getElementById('subject');
    
    if (subjectField) {
        subjectField.addEventListener('change', function() {
            const selectedValue = this.value;
            updateFormBasedOnSubject(selectedValue);
        });
    }
}

function updateFormBasedOnSubject(subject) {
    const messageField = document.getElementById('message');
    
    if (!messageField) return;
    
    const placeholders = {
        'general': 'Tell us more about your inquiry...',
        'event-listing': 'Please provide details about your event including date, location, expected attendance, and any special requirements...',
        'partnership': 'Describe your partnership proposal and how we can work together...',
        'technical': 'Please describe the technical issue you\'re experiencing in detail...',
        'feedback': 'We value your feedback! Please share your thoughts and suggestions...',
        'press': 'Please provide details about your media inquiry, publication, and deadline...',
        'other': 'Please describe your inquiry in detail...'
    };
    
    messageField.placeholder = placeholders[subject] || placeholders['general'];
    
    // Add subject-specific validation or fields if needed
    if (subject === 'event-listing') {
        addEventListingFields();
    } else {
        removeEventListingFields();
    }
}

function addEventListingFields() {
    const messageRow = document.getElementById('message').closest('.col-12');
    
    if (!document.getElementById('eventListingFields')) {
        const eventFields = document.createElement('div');
        eventFields.id = 'eventListingFields';
        eventFields.className = 'col-12';
        eventFields.innerHTML = `
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label for="eventDate" class="form-label">Event Date</label>
                    <input type="date" class="form-control" id="eventDate" name="eventDate">
                </div>
                <div class="col-md-6">
                    <label for="eventLocation" class="form-label">Event Location</label>
                    <input type="text" class="form-control" id="eventLocation" name="eventLocation" placeholder="Venue name or address">
                </div>
                <div class="col-md-6">
                    <label for="expectedAttendance" class="form-label">Expected Attendance</label>
                    <select class="form-select" id="expectedAttendance" name="expectedAttendance">
                        <option value="">Select attendance range</option>
                        <option value="0-50">0-50 people</option>
                        <option value="51-100">51-100 people</option>
                        <option value="101-500">101-500 people</option>
                        <option value="501-1000">501-1000 people</option>
                        <option value="1000+">1000+ people</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="eventCategory" class="form-label">Event Category</label>
                    <select class="form-select" id="eventCategory" name="eventCategory">
                        <option value="">Select category</option>
                        <option value="music">Music</option>
                        <option value="culture">Culture</option>
                        <option value="sports">Sports</option>
                        <option value="family">Family</option>
                        <option value="food">Food</option>
                        <option value="business">Business</option>
                        <option value="technology">Technology</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
        `;
        
        messageRow.parentNode.insertBefore(eventFields, messageRow);
        
        // Add fade-in animation
        eventFields.style.opacity = '0';
        eventFields.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            eventFields.style.transition = 'all 0.3s ease-in-out';
            eventFields.style.opacity = '1';
            eventFields.style.transform = 'translateY(0)';
        }, 100);
    }
}

function removeEventListingFields() {
    const eventFields = document.getElementById('eventListingFields');
    if (eventFields) {
        eventFields.style.transition = 'all 0.3s ease-in-out';
        eventFields.style.opacity = '0';
        eventFields.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            eventFields.remove();
        }, 300);
    }
}

// ===== SUCCESS HANDLING =====
function showContactSuccess(contactData) {
    const successMessage = `
        <div class="contact-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Message Sent Successfully!</h3>
            <div class="success-details">
                <p>Thank you, <strong>${contactData.firstName}</strong>! We've received your message about <strong>${getSubjectText(contactData.subject)}</strong>.</p>
                <p>We'll get back to you at <strong>${contactData.email}</strong> within 24 hours.</p>
                ${contactData.newsletter ? '<p><i class="fas fa-envelope me-2"></i>You\'ve been subscribed to our newsletter.</p>' : ''}
            </div>
            <div class="success-actions">
                <a href="events.html" class="btn btn-primary me-3">
                    <i class="fas fa-calendar me-2"></i>Browse Events
                </a>
                <a href="index.html" class="btn btn-outline-primary">
                    <i class="fas fa-home me-2"></i>Back to Home
                </a>
            </div>
        </div>
    `;
    
    showNotification(successMessage, 'success', 8000);
    
    // Track form submission (for analytics)
    trackContactSubmission(contactData);
}

function getSubjectText(subjectValue) {
    const subjects = {
        'general': 'General Inquiry',
        'event-listing': 'Event Listing',
        'partnership': 'Partnership Opportunity',
        'technical': 'Technical Support',
        'feedback': 'Feedback & Suggestions',
        'press': 'Press & Media',
        'other': 'Other'
    };
    
    return subjects[subjectValue] || 'Your Inquiry';
}

function trackContactSubmission(data) {
    // In a real application, you would send this data to your analytics service
    console.log('Contact form submitted:', {
        subject: data.subject,
        newsletter: data.newsletter,
        timestamp: new Date().toISOString()
    });
}

// ===== FORM RESET ENHANCEMENT =====
function initFormReset() {
    const resetBtn = document.querySelector('button[type="reset"]');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
                const form = document.getElementById('contactForm');
                form.reset();
                clearAllErrors();
                removeEventListingFields();
                
                // Reset character counter
                const counter = document.querySelector('.character-counter');
                if (counter) {
                    counter.textContent = '0/1000 characters (minimum 10)';
                    counter.style.color = 'var(--gray-500)';
                }
                
                showNotification('Form has been reset', 'info');
            }
        });
    }
}

// ===== AUTO-SAVE FUNCTIONALITY =====
function initAutoSave() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Load saved data
    loadSavedFormData();
    
    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 1000));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        setTimeout(() => {
            clearSavedFormData();
        }, 3000); // Clear after successful submission
    });
}

function saveFormData() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('contactFormData', JSON.stringify(data));
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('contactFormData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = data[key] === 'on';
                    } else {
                        field.value = data[key];
                    }
                }
            });
            
            // Update subject-dependent fields
            if (data.subject) {
                updateFormBasedOnSubject(data.subject);
            }
            
            showNotification('Previous form data restored', 'info', 3000);
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }
}

function clearSavedFormData() {
    localStorage.removeItem('contactFormData');
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

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', function() {
    initFormReset();
    initAutoSave();
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateContactForm,
        validateEmail,
        validatePhone,
        handleContactSubmission
    };
}
