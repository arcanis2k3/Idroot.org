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

// Didit modal
const DIDIT_WORKFLOW_URL = "https://verify.didit.me/u/WORKFLOW_ID_IN_BASE_64";

function openDiditModal() {
  document.getElementById("diditOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeDiditModal() {
  document.getElementById("diditOverlay").classList.remove("active");
  document.body.style.overflow = "";
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById("diditOverlay")) closeDiditModal();
}
function startDiditVerification() {
  closeDiditModal();
  if (typeof DiditSDK !== "undefined" && DiditSDK.DiditSdk) {
    const sdk = DiditSDK.DiditSdk.shared;
    sdk.onComplete = (result) => {
      if (result.type === "completed")
        showVerificationSuccess(result.session?.status);
    };
    sdk.onStateChange = (state, error) => {
      if (state === "error") console.error("Didit error:", error);
    };
    sdk.startVerification({ url: DIDIT_WORKFLOW_URL });
  } else {
    window.open(DIDIT_WORKFLOW_URL, "_blank");
  }
}
function showVerificationSuccess(status) {
  alert("Verification " + (status || "completed") + "!");
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDiditModal();
});

const API_BASE_URL = "https://api2.idroot.org";

// Subscription form handling
async function handleSubscribe(e) {
  e.preventDefault();
  const form = e.target;
  const nameInput = document.getElementById("subscribeName");
  const emailInput = document.getElementById("subscribeEmail");
  const msg = document.getElementById("subscribeMessage");
  const btn = form.querySelector("button[type='submit']");

  if (!emailInput || !msg) return;

  const email = emailInput.value;
  const name = nameInput ? nameInput.value : undefined;
  const lang = window.location.pathname.split("/")[1] || "en";

  const messages = {
    en: {
      loading: "Subscribing...",
      success: "Check your inbox to confirm!",
      error: "Something went wrong, please try again."
    },
    de: {
      loading: "Abonnieren...",
      success: "Überprüfen Sie Ihren Posteingang zur Bestätigung!",
      error: "Etwas ist schief gelaufen, bitte versuchen Sie es erneut."
    },
    es: {
      loading: "Suscribiendo...",
      success: "¡Revisa tu bandeja de entrada para confirmar!",
      error: "Algo salió mal, por favor inténtalo de nuevo."
    },
    pt: {
      loading: "Inscrevendo...",
      success: "Verifique sua caixa de entrada para confirmar!",
      error: "Algo deu errado, tente novamente."
    }
  };

  const m = messages[lang] || messages.en;

  msg.textContent = m.loading;
  msg.className = "subscribe-message";
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        lang,
        source: "landing_page"
      })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      msg.textContent = data.message || m.success;
      msg.className = "subscribe-message success";
      form.reset();
    } else {
      msg.textContent = data.error || data.message || m.error;
      msg.className = "subscribe-message error";
    }
  } catch (err) {
    console.error("Subscribe error:", err);
    msg.textContent = m.error;
    msg.className = "subscribe-message error";
  } finally {
    btn.disabled = false;
  }
}

// Feedback form handling
async function handleFeedback(e) {
  e.preventDefault();
  const form = e.target;
  const nameInput = document.getElementById("feedbackName");
  const emailInput = document.getElementById("feedbackEmail");
  const categoryInput = document.getElementById("feedbackCategory");
  const messageInput = document.getElementById("feedbackMessage");
  const statusMsg = document.getElementById("feedbackStatus");
  const btn = form.querySelector("button[type='submit']");

  if (!messageInput || !statusMsg) return;

  const lang = window.location.pathname.split("/")[1] || "en";

  const messages = {
    en: {
      loading: "Sending...",
      success: "Thank you for your feedback!",
      error: "Something went wrong, please try again."
    },
    de: {
      loading: "Senden...",
      success: "Vielen Dank für Ihr Feedback!",
      error: "Etwas ist schief gelaufen, bitte versuchen Sie es erneut."
    },
    es: {
      loading: "Enviando...",
      success: "¡Gracias por tus comentarios!",
      error: "Algo salió mal, por favor inténtalo de nuevo."
    },
    pt: {
      loading: "Enviando...",
      success: "Obrigado pelo seu feedback!",
      error: "Algo deu errado, tente novamente."
    }
  };

  const m = messages[lang] || messages.en;

  statusMsg.textContent = m.loading;
  statusMsg.className = "feedback-status";
  btn.disabled = true;

  const payload = {
    message: messageInput.value,
    name: nameInput ? nameInput.value : undefined,
    email: emailInput ? emailInput.value : undefined,
    category: categoryInput ? categoryInput.value : undefined
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      statusMsg.textContent = data.message || m.success;
      statusMsg.className = "feedback-status success";
      form.reset();
    } else {
      statusMsg.textContent = data.error || data.message || m.error;
      statusMsg.className = "feedback-status error";
    }
  } catch (err) {
    console.error("Feedback error:", err);
    statusMsg.textContent = m.error;
    statusMsg.className = "feedback-status error";
  } finally {
    btn.disabled = false;
  }
}

function initForms() {
  const subscribeForm = document.getElementById("subscribeForm");
  if (subscribeForm) {
    subscribeForm.addEventListener("submit", handleSubscribe);
  }
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedback);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLangSwitcher();
  initForms();
});
