/**
 * =============================================
 * GERADOR LINK WHATSAPP — Main Application JS
 * =============================================
 * Features:
 *  - Phone number validation (Brazil + international)
 *  - Real-time link preview
 *  - Link generation (wa.me format)
 *  - QR Code generation (qrcode.js)
 *  - Copy to clipboard with visual feedback
 *  - QR Code download (PNG)
 *  - Recent links (localStorage, last 5)
 *  - Character counter
 *  - Toast notifications
 *  - Back-to-top button
 *  - Mobile menu
 * =============================================
 */

'use strict';
/* ===== CONSTANTS ===== */
const STORAGE_KEY  = 'wa_recent_links';
const MAX_HISTORY  = 5;
const QR_SIZE      = 200;

/* ===== STATE ===== */
let currentLink    = '';
let qrInstance     = null;

/* ===== DOM REFERENCES ===== */
const phoneInput    = document.getElementById('phoneInput');
const countryCode   = document.getElementById('countryCode');
const messageInput  = document.getElementById('messageInput');
const charCount     = document.getElementById('charCount');
const phoneError    = document.getElementById('phoneError');
const linkPreview   = document.getElementById('linkPreview');
const previewWrapper= document.getElementById('previewWrapper');
const resultCard    = document.getElementById('resultCard');
const generatedLink = document.getElementById('generatedLink');
const openWhatsApp  = document.getElementById('openWhatsApp');
const qrContainer   = document.getElementById('qrcode');
const recentSection = document.getElementById('recentSection');
const recentList    = document.getElementById('recentList');
const toast         = document.getElementById('toast');
const toastMsg      = document.getElementById('toastMsg');
const toastIcon     = document.getElementById('toastIcon');
const backToTop     = document.getElementById('backToTop');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu    = document.getElementById('mobileMenu');

/* ==============================================
   INITIALIZATION
   ============================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Load recent links on startup
  renderRecentLinks();

  // Phone input: real-time preview
  phoneInput.addEventListener('input', onPhoneInput);
  messageInput.addEventListener('input', onMessageInput);
  countryCode.addEventListener('change', updatePreview);

  // Scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile menu
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });

  // Phone formatting on blur
  phoneInput.addEventListener('blur', formatPhoneDisplay);
  phoneInput.addEventListener('focus', () => {
    phoneInput.classList.remove('input-error');
    phoneError.classList.add('hidden');
  });
});

/* ==============================================
   PHONE INPUT HANDLER
   ============================================== */
function onPhoneInput() {
  // Strip all non-digits
  let raw = phoneInput.value.replace(/\D/g, '');
  phoneInput.value = raw;
  updatePreview();
  validatePhone(raw, false);
}

function onMessageInput() {
  const len = messageInput.value.length;
  charCount.textContent = `${len}/500`;
  if (len > 450) {
    charCount.classList.add('text-orange-400');
    charCount.classList.remove('text-gray-400');
  } else {
    charCount.classList.remove('text-orange-400');
    charCount.classList.add('text-gray-400');
  }
  updatePreview();
}

/* ==============================================
   REAL-TIME PREVIEW
   ============================================== */
function updatePreview() {
  const phone   = phoneInput.value.replace(/\D/g, '');
  const country = countryCode.value;
  const message = messageInput.value.trim();

  if (phone.length < 6) {
    previewWrapper.classList.add('hidden');
    return;
  }

  const fullPhone = `${country}${phone}`;
  let url = `https://wa.me/${fullPhone}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }

  // Truncate for preview display
  const display = url.length > 60 ? url.substring(0, 60) + '…' : url;
  linkPreview.textContent = display;
  previewWrapper.classList.remove('hidden');
}

/* ==============================================
   PHONE VALIDATION
   ============================================== */
function validatePhone(phone, showError = true) {
  const digits = phone.replace(/\D/g, '');
  const country = countryCode.value;

  // Minimum lengths per country (digits without country code)
  const minLengths = {
    '55':  10,   // Brazil: 10-11 digits (DDD + number)
    '1':    10,  // USA/Canada
    '351':  9,   // Portugal
    '34':   9,   // Spain
    '44':   10,  // UK
    '49':   10,  // Germany
    '33':   9,   // France
  };

  const min = minLengths[country] || 7;
  const max = 15; // E.164 max

  const isValid = digits.length >= min && digits.length <= max;

  if (!isValid && showError && digits.length > 0) {
    phoneInput.classList.add('input-error');
    phoneInput.classList.remove('input-success');
    phoneError.classList.remove('hidden');
    phoneError.querySelector('span').textContent = 
      country === '55'
        ? `Número inválido. Use DDD + número (10-11 dígitos). Ex: 11999998888`
        : `Número inválido. Verifique os dígitos informados.`;
  } else if (isValid) {
    phoneInput.classList.remove('input-error');
    phoneInput.classList.add('input-success');
    phoneError.classList.add('hidden');
  }

  return isValid;
}

/* ==============================================
   PHONE DISPLAY FORMAT (on blur)
   ============================================== */
function formatPhoneDisplay() {
  const raw = phoneInput.value.replace(/\D/g, '');
  const country = countryCode.value;

  if (country === '55' && raw.length >= 10) {
    // Brazilian format: (11) 99999-9999 or (11) 9999-9999
    if (raw.length === 11) {
      phoneInput.value = `(${raw.slice(0,2)}) ${raw.slice(2,7)}-${raw.slice(7)}`;
    } else if (raw.length === 10) {
      phoneInput.value = `(${raw.slice(0,2)}) ${raw.slice(2,6)}-${raw.slice(6)}`;
    }
  }
}

/* ==============================================
   MAIN: GENERATE LINK
   ============================================== */
function generateLink() {
  const rawPhone = phoneInput.value.replace(/\D/g, '');
  const country  = countryCode.value;
  const message  = messageInput.value.trim();

  // Validate
  if (!rawPhone) {
    phoneInput.classList.add('input-error');
    phoneError.classList.remove('hidden');
    phoneError.querySelector('span').textContent = 'Por favor, insira o número do WhatsApp.';
    phoneInput.focus();
    shakeElement(phoneInput);
    return;
  }

  if (!validatePhone(rawPhone, true)) {
    phoneInput.focus();
    shakeElement(phoneInput);
    return;
  }

  // Build URL
  const fullPhone = `${country}${rawPhone}`;
  let url = `https://wa.me/${fullPhone}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }

  currentLink = url;

  // Update result card
  generatedLink.textContent = url;
  openWhatsApp.href = url;

  // Show result card
  resultCard.classList.remove('hidden');

  // Generate QR Code
  generateQRCode(url);

  // Save to history
  saveToHistory({
    phone:    `+${country} ${rawPhone}`,
    url:      url,
    message:  message,
    date:     Date.now(),
  });

  // Render history
  renderRecentLinks();

  // Animate button
  const btn = document.getElementById('generateBtn');
  btn.innerHTML = `<i class="fas fa-check"></i> Link Gerado!`;
  btn.classList.replace('bg-wgreen', 'bg-green-600');
  setTimeout(() => {
    btn.innerHTML = `<i class="fas fa-bolt group-hover:animate-pulse"></i> Gerar Link Agora`;
    btn.classList.replace('bg-green-600', 'bg-wgreen');
  }, 2500);

  // Smooth scroll to result
  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  // Show toast
  showToast('✅ Link gerado com sucesso!', 'success');
}

/* ==============================================
   QR CODE GENERATOR
   ============================================== */
function generateQRCode(url) {
  // Clear previous
  qrContainer.innerHTML = '';
  qrInstance = null;

  try {
    qrInstance = new QRCode(qrContainer, {
      text:           url,
      width:          QR_SIZE,
      height:         QR_SIZE,
      colorDark:      '#075E54',
      colorLight:     '#ffffff',
      correctLevel:   QRCode.CorrectLevel.H,
    });
  } catch (e) {
    qrContainer.innerHTML = `<p class="text-xs text-gray-400 p-4 text-center">QR Code não disponível</p>`;
    console.error('QR Code error:', e);
  }
}

/* ==============================================
   DOWNLOAD QR CODE
   ============================================== */
function downloadQR() {
  if (!currentLink) {
    showToast('Gere um link primeiro!', 'error');
    return;
  }

  // Get canvas or img from qrcode container
  const canvas = qrContainer.querySelector('canvas');
  const img    = qrContainer.querySelector('img');

  if (canvas) {
    const link = document.createElement('a');
    link.download = `qrcode-whatsapp-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('QR Code baixado!', 'success');
  } else if (img) {
    // Fallback for browsers that render <img>
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width  = QR_SIZE;
    tempCanvas.height = QR_SIZE;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const link = document.createElement('a');
    link.download = `qrcode-whatsapp-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
    showToast('QR Code baixado!', 'success');
  } else {
    showToast('Não foi possível baixar o QR Code.', 'error');
  }
}

/* ==============================================
   COPY TO CLIPBOARD
   ============================================== */
async function copyLink(url) {
  const textToCopy = url || currentLink;

  if (!textToCopy) {
    showToast('Gere um link primeiro!', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    onCopySuccess();
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      onCopySuccess();
    } catch (e) {
      showToast('Não foi possível copiar. Selecione manualmente.', 'error');
    }
    document.body.removeChild(textarea);
  }
}

function onCopySuccess() {
  const copyIcon = document.getElementById('copyIcon');
  const tooltip  = document.getElementById('copiedTooltip');

  // Icon feedback
  copyIcon.className = 'fas fa-check text-lg copy-success';
  setTimeout(() => {
    copyIcon.className = 'fas fa-copy text-lg';
  }, 2000);

  // Tooltip
  tooltip.classList.add('opacity-100');
  tooltip.style.opacity = '1';
  setTimeout(() => {
    tooltip.style.opacity = '0';
  }, 2000);

  showToast('Link copiado para a área de transferência!', 'success');
}

/* ==============================================
   LOCAL STORAGE — HISTORY
   ============================================== */
function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToHistory(entry) {
  let history = getHistory();

  // Avoid duplicates (same URL)
  history = history.filter(item => item.url !== entry.url);

  // Add to beginning
  history.unshift(entry);

  // Keep only last MAX_HISTORY
  history = history.slice(0, MAX_HISTORY);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function clearHistory() {
  if (!confirm('Tem certeza que deseja limpar o histórico de links?')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderRecentLinks();
  showToast('Histórico apagado.', 'info');
}

/* ==============================================
   RENDER RECENT LINKS
   ============================================== */
function renderRecentLinks() {
  const history = getHistory();

  if (history.length === 0) {
    recentSection.classList.add('hidden');
    return;
  }

  recentSection.classList.remove('hidden');
  recentList.innerHTML = '';

  history.forEach((item, index) => {
    const timeAgo  = formatTimeAgo(item.date);
    const shortUrl = item.url.length > 45 ? item.url.substring(0, 45) + '…' : item.url;

    const div = document.createElement('div');
    div.className = 'recent-item';
    div.style.animationDelay = `${index * 0.05}s`;

    div.innerHTML = `
      <div class="recent-item-icon">
        <i class="fab fa-whatsapp text-white text-base"></i>
      </div>
      <div class="recent-item-info">
        <div class="recent-item-number">${escapeHtml(item.phone)}</div>
        <div class="recent-item-url">${escapeHtml(shortUrl)}</div>
      </div>
      <span class="recent-item-time">${timeAgo}</span>
      <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
         class="w-7 h-7 bg-wgray hover:bg-wdark rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
         title="Abrir no WhatsApp" aria-label="Abrir no WhatsApp">
        <i class="fas fa-external-link-alt text-white text-xs"></i>
      </a>
      <button 
        class="recent-copy-btn" 
        onclick="copyLink('${escapeHtml(item.url)}')" 
        title="Copiar link"
        aria-label="Copiar link">
        <i class="fas fa-copy text-xs"></i>
      </button>
    `;

    recentList.appendChild(div);
  });
}

/* ==============================================
   TOAST NOTIFICATION
   ============================================== */
let toastTimeout = null;

function showToast(message, type = 'success') {
  const icons = {
    success: 'fas fa-check-circle text-green-400',
    error:   'fas fa-times-circle text-red-400',
    info:    'fas fa-info-circle text-blue-400',
    warn:    'fas fa-exclamation-circle text-yellow-400',
  };

  toastMsg.textContent = message;
  toastIcon.className  = icons[type] || icons.success;

  toast.classList.add('show');
  toast.style.opacity = '1';

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.classList.remove('show'), 300);
  }, 3000);
}

/* ==============================================
   BACK TO TOP
   ============================================== */
function handleScroll() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==============================================
   MOBILE MENU
   ============================================== */
function toggleMobileMenu() {
  mobileMenu.classList.toggle('hidden');
}

/* ==============================================
   SHAKE ANIMATION (validation)
   ============================================== */
function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

/* ==============================================
   UTILITY: TIME AGO
   ============================================== */
function formatTimeAgo(timestamp) {
  const now  = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60)         return 'Agora';
  if (diff < 3600)       return `${Math.floor(diff / 60)}m atrás`;
  if (diff < 86400)      return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 2592000)    return `${Math.floor(diff / 86400)}d atrás`;
  return new Date(timestamp).toLocaleDateString('pt-BR');
}

/* ==============================================
   UTILITY: ESCAPE HTML
   ============================================== */
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* ==============================================
   CSS SHAKE KEYFRAMES (injected dynamically)
   ============================================== */
(function injectShakeCSS() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ==============================================
   KEYBOARD: Enter key triggers generate
   ============================================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement === phoneInput) {
    generateLink();
  }
});
