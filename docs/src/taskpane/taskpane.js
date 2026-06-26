/**
 * taskpane.js — DocSoThanhChu v2.0
 * Task Pane controller.
 * Runs in the Shared Runtime context (same JS environment as Custom Functions).
 */
/* global Office, Converter, AIClient */
'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
let selectedLang = 'vi';
let selectedCur  = 'vnd';
let aiMode       = false;

// ─── Init ────────────────────────────────────────────────────────────────────
Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    init();
  }
});

function init() {
  // Language
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedLang = btn.dataset.lang;
      document.querySelectorAll('[data-lang]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Currency
  document.querySelectorAll('[data-cur]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCur = btn.dataset.cur;
      document.querySelectorAll('[data-cur]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // AI Toggle
  const toggle = document.getElementById('ai-toggle');
  const toggleRow = document.querySelector('.ai-toggle-row');
  const convertBtn = document.getElementById('btn-convert');
  toggle.addEventListener('change', () => {
    aiMode = toggle.checked;
    toggleRow.classList.toggle('active', aiMode);
    convertBtn.classList.toggle('ai-active', aiMode);
    if (aiMode && !AIClient.isReady()) {
      toast('Chưa có API key — mở cài đặt để nhập', 4000);
    }
  });

  // Clear
  document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('input-number').value = '';
    document.getElementById('result-card').classList.add('hidden');
    document.getElementById('input-number').focus();
  });

  // Convert
  document.getElementById('btn-convert').addEventListener('click', doConvert);
  document.getElementById('input-number').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doConvert();
  });

  // Copy
  document.getElementById('btn-copy').addEventListener('click', () => {
    const text = document.getElementById('result-text').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast('Da copy!'));
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast('Da copy!');
    }
  });

  // Insert into selected cell
  document.getElementById('btn-insert').addEventListener('click', async () => {
    const text = document.getElementById('result-text').textContent;
    try {
      await Excel.run(async (ctx) => {
        const range = ctx.workbook.getSelectedRange();
        range.values = [[text]];
        await ctx.sync();
      });
      toast('Da chen vao o!');
    } catch (e) {
      toast('Lỗi: ' + e.message, 3000);
    }
  });

  // Batch
  document.getElementById('btn-batch').addEventListener('click', doBatch);

  // Settings
  document.getElementById('btn-settings').addEventListener('click', openSettings);
  document.getElementById('btn-close-settings').addEventListener('click', closeSettings);
  document.getElementById('settings-overlay').addEventListener('click', closeSettings);

  // API Key
  document.getElementById('btn-save-key').addEventListener('click', saveKey);
  document.getElementById('btn-clear-key').addEventListener('click', clearKey);
  document.getElementById('btn-toggle-key').addEventListener('click', () => {
    const input = document.getElementById('api-key-input');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // Pre-fill key if set
  const existingKey = AIClient.getKey();
  if (existingKey) {
    document.getElementById('api-key-input').value = existingKey;
    setKeyStatus(true, 'Key da duoc luu');
  }
}

// ─── Convert ─────────────────────────────────────────────────────────────────
async function doConvert() {
  const raw = document.getElementById('input-number').value.trim();
  if (raw === '') { toast('Nhập số trước!'); return; }

  const num = Number(raw);
  if (isNaN(num)) { toast('Không hợp lệ — chỉ nhập số!'); return; }

  const btn     = document.getElementById('btn-convert');
  const btnText = document.getElementById('btn-convert-text');
  const spinner = document.getElementById('btn-convert-spinner');

  btn.disabled = true;
  btnText.textContent = aiMode ? 'AI đang xử lý...' : 'Đang chuyển...';
  spinner.classList.remove('hidden');

  let result = '';
  let source = '';

  try {
    if (aiMode) {
      result = await AIClient.convert(num, selectedLang, selectedCur);
      source = result.endsWith('[AI]') ? 'Nguồn: Groq AI (llama-3.1-8b-instant)' : 'Nguồn: Rule-based (AI fallback)';
    } else {
      result = convertLocal(num, selectedLang, selectedCur);
      source = 'Nguồn: Rule-based engine';
    }
  } catch (e) {
    result = '#ERROR: ' + e.message;
    source = '';
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Chuyển đổi';
    spinner.classList.add('hidden');
  }

  const card = document.getElementById('result-card');
  const text = document.getElementById('result-text');
  card.classList.remove('hidden');
  // Trigger re-animation
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';

  text.textContent = result;
  document.getElementById('result-source').textContent = source;
}

function convertLocal(num, lang, cur) {
  const key = `${lang}_${cur}`;
  switch (key) {
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
async function doBatch() {
  const lines = document.getElementById('batch-input').value
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) { toast('Nhập số vào batch!'); return; }
  if (lines.length > 50) { toast('Tối đa 50 số mỗi lần!'); return; }

  const results = document.getElementById('batch-results');
  results.innerHTML = '';

  const btn = document.getElementById('btn-batch');
  btn.disabled = true;
  btn.textContent = 'Đang xử lý...';

  for (const line of lines) {
    const n = Number(line);
    let words = isNaN(n)
      ? '#ERROR: Không phải số'
      : (aiMode
          ? await AIClient.convert(n, selectedLang, selectedCur)
          : convertLocal(n, selectedLang, selectedCur));

    const item = document.createElement('div');
    item.className = 'batch-item';
    item.innerHTML = `<div class="num">${line}</div><div class="words">${escHtml(words)}</div>`;
    results.appendChild(item);
  }

  btn.disabled = false;
  btn.textContent = 'Batch Convert';
  toast(`Xong ${lines.length} số`);
}

// ─── Settings ────────────────────────────────────────────────────────────────
function openSettings() {
  document.getElementById('settings-overlay').classList.remove('hidden');
  document.getElementById('settings-drawer').classList.remove('hidden');
  // trigger open animation
  requestAnimationFrame(() => {
    document.getElementById('settings-drawer').classList.add('open');
  });
}

function closeSettings() {
  const drawer = document.getElementById('settings-drawer');
  drawer.classList.remove('open');
  setTimeout(() => {
    drawer.classList.add('hidden');
    document.getElementById('settings-overlay').classList.add('hidden');
  }, 300);
}

function saveKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key) { toast('Nhập API key trước!'); return; }
  if (!key.startsWith('gsk_') || key.length < 20) {
    setKeyStatus(false, 'Key Groq phải bắt đầu bằng gsk_...');
    return;
  }
  AIClient.setKey(key);
  setKeyStatus(true, 'Groq API key đã lưu — AI Mode sẵn sàng!');
  toast('Groq API key đã được lưu!');
}

function clearKey() {
  AIClient.setKey('');
  document.getElementById('api-key-input').value = '';
  setKeyStatus(false, 'Key đã bị xóa');
  toast('Key đã xóa');
}

function setKeyStatus(ok, msg) {
  const el = document.getElementById('api-key-status');
  el.textContent = msg;
  el.className = 'key-status ' + (ok ? 'ok' : 'err');
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function toast(msg, duration = 2200) {
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.textContent = msg;
  el.classList.remove('hidden');
  toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
}

// ─── Util ────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
