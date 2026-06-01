// Configuration
const API_BASE_URL = 'https://api2.bapu.app';

// Language Switcher Logic
function initLangSwitcher() {
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');

  if (!langBtn || !langDropdown) return;

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    langDropdown.classList.remove('show');
  });
}

// Redirect logic for root pages
function handleFeedbackRedirect() {
    const path = window.location.pathname;
    if (path === '/feedback' || path === '/feedback.html' || path === '/hilfe-und-kontakt' || path === '/hilfe-und-kontakt.html') {
        const supported = ['en', 'de', 'es', 'pt', 'ja'];
        const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
        const targetLang = supported.indexOf(browserLang) !== -1 ? browserLang : 'en';

        if (path.includes('hilfe-und-kontakt') && targetLang === 'de') {
             window.location.replace('/de/hilfe-und-kontakt.html');
        } else {
             window.location.replace(`/${targetLang}/feedback.html`);
        }
    }
}

// Feedback Form Submission
async function handleFeedbackSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('form-status');

    if (!submitBtn || !statusDiv) return;

    const originalBtnText = submitBtn.innerHTML;
    const loadingText = submitBtn.getAttribute('data-loading-text') || 'Sending...';
    const successText = submitBtn.getAttribute('data-success-text') || 'Thank you! Your feedback has been received.';
    const errorText = submitBtn.getAttribute('data-error-text') || 'Something went wrong. Please try again later.';

    // Disable form
    submitBtn.disabled = true;
    submitBtn.innerHTML = loadingText;
    statusDiv.style.display = 'none';

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        category: formData.get('category'),
        message: formData.get('message'),
        lang: document.documentElement.lang || 'en',
        source: 'feedback_form'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            form.reset();
            statusDiv.innerHTML = `<p style="color: #059669; font-weight: 500;">${successText}</p>`;
            statusDiv.style.display = 'block';
            submitBtn.innerHTML = originalBtnText;
        } else {
            throw new Error('API Error');
        }
    } catch (error) {
        statusDiv.innerHTML = `<p style="color: #dc2626; font-weight: 500;">${errorText}</p>`;
        statusDiv.style.display = 'block';
        submitBtn.innerHTML = originalBtnText;
    } finally {
        submitBtn.disabled = false;
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initLangSwitcher();
  handleFeedbackRedirect();
});
