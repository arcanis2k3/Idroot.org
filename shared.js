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
