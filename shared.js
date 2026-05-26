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

// Subscription form handling
async function handleSubscribe(e) {
  e.preventDefault();
  const form = e.target;
  const emailInput = document.getElementById("subscribeEmail");
  const msg = document.getElementById("subscribeMessage");
  const btn = form.querySelector("button[type='submit']");

  if (!emailInput || !msg) return;

  const email = emailInput.value;
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
    const res = await fetch("https://api.bapu.app/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        attribs: { lang }
      })
    });

    if (res.ok) {
      msg.textContent = m.success;
      msg.className = "subscribe-message success";
      form.reset();
    } else {
      msg.textContent = m.error;
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

function initSubscribeForm() {
  const form = document.getElementById("subscribeForm");
  if (form) {
    form.addEventListener("submit", handleSubscribe);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLangSwitcher();
  initSubscribeForm();
});
