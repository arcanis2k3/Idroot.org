
const redirected = checkLaunchGate();
if (!redirected) {
  autoDetectLang();
}

// Launch Gate Guard
function checkLaunchGate() {
  const launchDate = new Date('2026-05-17T00:00:00Z').getTime();
  const now = new Date().getTime();
  const path = window.location.pathname;

  const isComingSoonPage = path.includes('coming-soon.html');
  const isLegalPage = path.includes('privacy.html') || path.includes('terms.html') || path.includes('legal.html');

  if (isLegalPage) {
    return false; // NEVER redirect from legal pages
  }

  if (now < launchDate && !isComingSoonPage) {
    // Before launch: protect normal pages
    const current = path.split('/')[1]; // 'en','de','es','pt'
    const supported = ['en', 'de', 'es', 'pt'];
    const lang = supported.includes(current) ? current : 'en';
    window.location.replace('/' + lang + '/coming-soon.html');
    return true;
  } else if (now >= launchDate && isComingSoonPage) {
    // After launch: prevent accessing coming soon page
    const current = path.split('/')[1]; // 'en','de','es','pt'
    const supported = ['en', 'de', 'es', 'pt'];
    const lang = supported.includes(current) ? current : 'en';
    window.location.replace('/' + lang + '/index.html');
    return true;
  }
  return false;
}

// Language switcher
function initLangSwitcher() {
  const btn = document.getElementById('langBtn');
  const dropdown = document.getElementById('langDropdown');
  if (!btn || !dropdown) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('open');
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => {
    btn.classList.remove('open');
    dropdown.classList.remove('open');
  });
}

// Auto-detect browser language and redirect if needed
function autoDetectLang() {
  const path = window.location.pathname;
  const current = path.split('/')[1]; // 'en','de','es','pt'
  const supported = ['en', 'de', 'es', 'pt'];

  // Only redirect if we are NOT in a supported language directory
  if (supported.includes(current)) return;

  const nav = navigator.language || navigator.userLanguage || 'en';
  const code = nav.slice(0, 2).toLowerCase();
  const lang = supported.includes(code) ? code : 'en';

  // Do not redirect to index.html if we are trying to access a specific page at the root
  let page = path.replace(/^\/?/, '');

  // If it's a legal page requested at root (unlikely but possible), keep the page name
  if (!page) {
    page = 'index.html';
  }

  window.location.replace('/' + lang + '/' + page);
}

// Get current page filename to build lang switcher links
function getCurrentPage() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1] || 'index.html';
}

// Didit modal
const DIDIT_WORKFLOW_URL = 'https://verify.didit.me/u/WORKFLOW_ID_IN_BASE_64';

function openDiditModal() {
  document.getElementById('diditOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeDiditModal() {
  document.getElementById('diditOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById('diditOverlay')) closeDiditModal();
}
function startDiditVerification() {
  closeDiditModal();
  if (typeof DiditSDK !== 'undefined' && DiditSDK.DiditSdk) {
    const sdk = DiditSDK.DiditSdk.shared;
    sdk.onComplete = (result) => { if (result.type === 'completed') showVerificationSuccess(result.session?.status); };
    sdk.onStateChange = (state, error) => { if (state === 'error') console.error('Didit error:', error); };
    sdk.startVerification({ url: DIDIT_WORKFLOW_URL });
  } else {
    window.open(DIDIT_WORKFLOW_URL, '_blank');
  }
}
function showVerificationSuccess(status) {
  alert('Verification ' + (status || 'completed') + '!');
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDiditModal(); });

document.addEventListener('DOMContentLoaded', () => {
  checkLaunchGate();
  initLangSwitcher();
});
