/**
 * app.js — DocSoThanhChu AI Online Tool
 * Runs on the public GitHub Pages site.
 */
'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
let selectedLang = 'vi';
let selectedCur  = 'vnd';

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Language segments
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedLang = btn.dataset.lang;
      document.querySelectorAll('[data-lang]').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
    });
  });

  // Currency segments
  document.querySelectorAll('[data-cur]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCur = btn.dataset.cur;
      document.querySelectorAll('[data-cur]').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
    });
  });

  // Convert
  document.getElementById('btn-convert').addEventListener('click', doConvert);
  document.getElementById('number-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') doConvert();
  });

  // Clear
  document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('number-input').value = '';
    document.getElementById('result-wrap').classList.add('hidden');
    document.getElementById('number-input').focus();
  });

  // Copy result
  document.getElementById('btn-copy').addEventListener('click', () => {
    const text = document.getElementById('result-text').textContent;
    copyToClipboard(text, 'Đã copy kết quả!');
  });

  // Batch convert
  document.getElementById('btn-batch').addEventListener('click', doBatch);

  // Try-it example buttons
  document.querySelectorAll('.try-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.num;
      const lang = btn.dataset.lang;
      const cur  = btn.dataset.cur;

      // Set input
      document.getElementById('number-input').value = num;

      // Set lang
      selectedLang = lang;
      document.querySelectorAll('[data-lang]').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
        b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
      });

      // Set currency
      selectedCur = cur;
      document.querySelectorAll('[data-cur]').forEach(b => {
        b.classList.toggle('active', b.dataset.cur === cur);
        b.setAttribute('aria-pressed', String(b.dataset.cur === cur));
      });

      // Scroll to tool & convert
      document.getElementById('cong-cu').scrollIntoView({ behavior: 'smooth' });
      setTimeout(doConvert, 400);
    });
  });
});

// ─── Convert ─────────────────────────────────────────────────────────────────
function doConvert() {
  const raw = document.getElementById('number-input').value.trim();
  if (!raw) { toast('Vui lòng nhập số cần đọc!'); return; }

  const num = Number(raw);
  if (isNaN(num)) { toast('Không hợp lệ — chỉ nhập số!'); return; }

  const btn = document.getElementById('btn-convert');
  btn.classList.add('is-loading');

  // Simulate minimal UI delay for better UX (Pro Max skill)
  setTimeout(() => {
    const result = convertLocal(num, selectedLang, selectedCur);

    const wrap = document.getElementById('result-wrap');
    const text = document.getElementById('result-text');
    const meta = document.getElementById('result-meta');

    // Re-trigger animation
    wrap.classList.add('hidden');
    wrap.offsetHeight; // reflow
    wrap.classList.remove('hidden');

    text.textContent = result;
    meta.textContent = `[${selectedLang.toUpperCase()}] ${labelFor(selectedLang, selectedCur)}`;
    btn.classList.remove('is-loading');
  }, 250);
}

function labelFor(lang, cur) {
  const map = {
    vi_vnd: 'VND → Tiếng Việt',
    en_vnd: 'VND → English',
    vi_usd: 'USD → Tiếng Việt',
    en_usd: 'USD → English',
    vi_number: 'Số → Tiếng Việt',
    en_number: 'Số → English',
  };
  return map[`${lang}_${cur}`] || '';
}

function convertLocal(num, lang, cur) {
  switch (`${lang}_${cur}`) {
    case 'vi_vnd':    return Converter.vndVi(num);
    case 'en_vnd':    return Converter.vndEn(num);
    case 'vi_usd':    return Converter.usdVi(num);
    case 'en_usd':    return Converter.usdEn(num);
    case 'vi_number': return Converter.soVi(num);
    case 'en_number': return Converter.soEn(num);
    default:          return Converter.vndVi(num);
  }
}

// ─── Batch ────────────────────────────────────────────────────────────────────
function doBatch() {
  const lines = document.getElementById('batch-input').value
    .split('\n').map(l => l.trim()).filter(Boolean);

  if (!lines.length) { toast('Nhập số vào ô bên trên!'); return; }
  if (lines.length > 100) { toast('Tối đa 100 số mỗi lần!'); return; }

  const resultsEl = document.getElementById('batch-results');
  const copyAllWrap = document.getElementById('btn-copy-all-wrap');
  resultsEl.innerHTML = '';
  copyAllWrap.classList.add('hidden');

  const outputs = [];

  lines.forEach((line, i) => {
    const n = Number(line);
    const words = isNaN(n)
      ? '#KHÔNG HỢP LỆ'
      : convertLocal(n, selectedLang, selectedCur);

    outputs.push(`${line}\t${words}`);

    const item = document.createElement('div');
    item.className = 'batch-item';
    item.style.animationDelay = `${i * 20}ms`;
    item.innerHTML = `<div class="bnum">${escHtml(line)}</div><div class="bwords">${escHtml(words)}</div>`;
    resultsEl.appendChild(item);
  });

  // Copy all button
  if (outputs.length) {
    copyAllWrap.classList.remove('hidden');
    document.getElementById('btn-copy-all').onclick = () => {
      copyToClipboard(outputs.join('\n'), `Đã copy ${outputs.length} kết quả!`);
    };
  }

  toast(`Đã chuyển ${lines.length} số`);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function copyToClipboard(text, successMsg) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => toast(successMsg))
      .catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
  document.body.appendChild(el);
  el.focus(); el.select();
  try {
    document.execCommand('copy');
    toast(successMsg);
  } catch {
    toast('Không thể copy — hãy copy thủ công');
  }
  document.body.removeChild(el);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

let _toastTimer;
function toast(msg, duration = 2500) {
  const el = document.getElementById('toast');
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.classList.remove('hidden');
  _toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
}
