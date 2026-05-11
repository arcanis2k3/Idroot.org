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
  initLangSwitcher();
});