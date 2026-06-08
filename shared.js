// Language switcher
function initLangSwitcher() {
  const btn = document.getElementById("langBtn");
  const dropdown = document.getElementById("langDropdown");
  if (!btn || !dropdown) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    btn.classList.toggle("open");
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    btn.classList.remove("open");
    dropdown.classList.remove("open");
  });

  // Dynamically update dropdown links to preserve current page filename
  const currentPage = getCurrentPage();
  const links = dropdown.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/') && href.includes('/index.html')) {
        // Only update if it's a relative path to index.html
        const lang = href.split('/')[1];
        link.setAttribute('href', `/${lang}/${currentPage}`);
    }
  });
}

// Get current page filename to build lang switcher links
function getCurrentPage() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1] || "index.html";
}


document.addEventListener("DOMContentLoaded", () => {
  initLangSwitcher();
});

// API Configuration
const API_BASE_URL = 'https://api2.bapu.app';

// Feedback form handler
async function handleFeedbackSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById('form-status');
  const btn = form.querySelector('button[type="submit"]');
  const originalBtnText = btn.textContent;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Disable form
  btn.disabled = true;
  btn.textContent = btn.dataset.loadingText || 'Sending...';
  status.style.display = 'none';
  status.className = '';

  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      form.style.display = 'none';
      status.textContent = btn.dataset.successText || 'Thank you! Your feedback has been received.';
      status.className = 'highlight-box';
      status.style.display = 'block';
    } else {
      throw new Error('Failed to send feedback');
    }
  } catch (error) {
    console.error('Error:', error);
    status.textContent = btn.dataset.errorText || 'Something went wrong. Please try again later.';
    status.className = 'warning-box';
    status.style.display = 'block';
    btn.disabled = false;
    btn.textContent = originalBtnText;
  }
}

// Handle automatic language redirection for feedback
function handleFeedbackRedirect() {
  if (window.location.pathname === '/feedback' || window.location.pathname === '/feedback.html') {
    const supported = ["en", "de", "es", "pt", "ja"];
    const lang = (navigator.language || navigator.userLanguage || "en")
      .slice(0, 2)
      .toLowerCase();
    const target = supported.indexOf(lang) !== -1 ? lang : "en";
    window.location.replace("/" + target + "/feedback.html");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleFeedbackRedirect();
});


// Subscription form handler (ListMonk)
async function handleSubscribe(event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById('subscribe-status');
  const btn = form.querySelector('button[type="submit"]');
  const originalBtnText = btn.textContent;

  const email = form.querySelector('input[name="email"]').value;

  // Disable form
  btn.disabled = true;
  btn.textContent = '...';
  status.style.display = 'none';
  status.className = '';

  try {
    const response = await fetch('https://lm.idroot.org/api/public/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        list_uuids: ['af77393e-da0a-4e7a-8210-7037a083eaa4'],
      }),
    });

    if (response.ok) {
      form.style.display = 'none';
      status.textContent = btn.dataset.successText || '✓ Check your inbox to confirm!';
      status.className = 'highlight-box';
      status.style.display = 'block';
      status.style.color = '#00B877';
    } else {
      throw new Error('Something went wrong. Try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    status.textContent = btn.dataset.errorText || 'Something went wrong. Please try again later.';
    status.className = 'warning-box';
    status.style.display = 'block';
    status.style.color = 'red';
    btn.disabled = false;
    btn.textContent = originalBtnText;
  }
}
