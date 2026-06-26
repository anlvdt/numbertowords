/**
 * app.js — DocSoThanhChu Web Dashboard v2.2
 */
'use strict';

const S = () => window.DocSoShared;
let selectedLang = 'vi';
let selectedCur  = 'vnd';

document.addEventListener('DOMContentLoaded', init);

function init() {
  registerSW();
  initTheme();
  initToolNav();
  initDocSo();
  initVAT();
  initDiacritics();
  initFontFix();
  initSalary();
  initHR();
  initVietQR();
  initXML();
  initDropzones();
  initCopyHandlers();
  initTryButtons();
}

// ─── PWA ─────────────────────────────────────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

// ─── Theme ───────────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('docso_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('btn-theme');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('docso_theme', next);
    btn.setAttribute('aria-label', next === 'dark' ? 'Bật sáng' : 'Bật tối');
  });
}

// ─── Tool navigation (desktop sidebar + mobile strip) ────────────────────────
function initToolNav() {
  const tabs = document.querySelectorAll('.tool-tab');
  const mobileNav = document.getElementById('tool-menu-mobile');

  if (mobileNav) {
    tabs.forEach(tab => {
      const clone = tab.cloneNode(true);
      clone.classList.remove('active');
      if (tab.classList.contains('active')) clone.classList.add('active');
      mobileNav.appendChild(clone);
    });
  }

  const allTabs = document.querySelectorAll('.tool-tab');
  allTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTool(tab.dataset.target));
  });
}

function switchTool(targetId) {
  document.querySelectorAll('.tool-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.target === targetId);
  });
  document.querySelectorAll('.tool-view').forEach(view => {
    const on = view.id === targetId;
    view.classList.toggle('hidden', !on);
    view.classList.toggle('active', on);
  });
  history.replaceState(null, '', `#${targetId.replace('view-', '')}`);
}

// ─── Đọc số ──────────────────────────────────────────────────────────────────
function initDocSo() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedLang = btn.dataset.lang;
      document.querySelectorAll('[data-lang]').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      doConvert(true);
    });
  });

  document.querySelectorAll('[data-cur]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCur = btn.dataset.cur;
      document.querySelectorAll('[data-cur]').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      doConvert(true);
    });
  });

  const input = document.getElementById('number-input');
  const debounced = S().debounce(() => doConvert(true), 350);

  input.addEventListener('input', debounced);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doConvert(false); });

  document.getElementById('btn-convert').addEventListener('click', () => doConvert(false));
  document.getElementById('btn-clear').addEventListener('click', () => {
    input.value = '';
    document.getElementById('result-wrap').classList.add('hidden');
    input.focus();
  });
  document.getElementById('btn-copy').addEventListener('click', () => {
    copyToClipboard(document.getElementById('result-text').textContent, 'Đã sao chép kết quả');
  });
  document.getElementById('btn-batch').addEventListener('click', doBatch);
}

function doConvert(silent) {
  const raw = document.getElementById('number-input').value.trim();
  const wrap = document.getElementById('result-wrap');

  if (!raw) {
    wrap.classList.add('hidden');
    return;
  }

  const num = S().parseLocaleNumber(raw);
  if (isNaN(num)) {
    if (!silent) toast('Định dạng không hợp lệ — thử 1234567 hoặc 1.234.567,89');
    wrap.classList.add('hidden');
    return;
  }

  if (Math.abs(Math.trunc(num)) > S().MAX_NUMBER) {
    if (!silent) toast(`Vượt giới hạn — tối đa ${S().formatNumber(S().MAX_NUMBER)}`);
    return;
  }

  const result = S().convertWords(num, selectedLang, selectedCur);
  document.getElementById('result-text').textContent = result;
  document.getElementById('result-meta').textContent =
    `${S().labelFor(selectedLang, selectedCur)} · ${S().formatNumber(num)}`;
  wrap.classList.remove('hidden');

  if (!silent) toast('Chuyển đổi xong');
}

function doBatch() {
  const lines = document.getElementById('batch-input').value
    .split('\n').map(l => l.trim()).filter(Boolean);

  if (!lines.length) { toast('Vui lòng nhập danh sách số'); return; }
  if (lines.length > 100) { toast('Tối đa 100 dòng mỗi lần'); return; }

  const resultsEl = document.getElementById('batch-results');
  const copyAllWrap = document.getElementById('btn-copy-all-wrap');
  resultsEl.innerHTML = '';
  copyAllWrap.classList.add('hidden');
  const outputs = [];

  lines.forEach((line, i) => {
    const n = S().parseLocaleNumber(line);
    const words = isNaN(n) ? '#KHÔNG HỢP LỆ' : S().convertWords(n, selectedLang, selectedCur);
    outputs.push(`${line}\t${words}`);

    const item = document.createElement('div');
    item.className = 'batch-item';
    item.style.animationDelay = `${Math.min(i, 20) * 20}ms`;
    item.innerHTML =
      `<div class="bnum">${S().escHtml(line)}</div><div class="bwords">${S().escHtml(words)}</div>`;
    resultsEl.appendChild(item);
  });

  copyAllWrap.classList.remove('hidden');
  document.getElementById('btn-copy-all').onclick = () => {
    copyToClipboard(outputs.join('\n'), `Đã sao chép ${outputs.length} dòng`);
  };
  toast(`Hoàn tất ${lines.length} dòng`);
}

// ─── VAT ─────────────────────────────────────────────────────────────────────
function initVAT() {
  let vatRate = 8;
  const vatPre = document.getElementById('vat-pre');
  const vatTax = document.getElementById('vat-tax');
  const vatPost = document.getElementById('vat-post');

  document.querySelectorAll('[data-vat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-vat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vatRate = Number(btn.dataset.vat);
      calcVat('pre');
    });
  });

  vatPre.addEventListener('input', () => calcVat('pre'));
  vatPost.addEventListener('input', () => calcVat('post'));

  function calcVat(source) {
    if (source === 'pre') {
      const v = Number(vatPre.value) || 0;
      const t = v * vatRate / 100;
      vatTax.value = t ? Math.round(t) : '';
      vatPost.value = v ? Math.round(v + t) : '';
    } else {
      const v = Number(vatPost.value) || 0;
      const p = v / (1 + vatRate / 100);
      vatPre.value = v ? Math.round(p) : '';
      vatTax.value = v ? Math.round(v - p) : '';
    }
  }
}

// ─── Xóa dấu ─────────────────────────────────────────────────────────────────
function initDiacritics() {
  const input = document.getElementById('nodiacritics-input');
  const result = document.getElementById('nodiacritics-result');
  input.addEventListener('input', () => {
    result.textContent = S().removeDiacritics(input.value);
  });
  document.getElementById('btn-copy-nodiacritics').addEventListener('click', () => {
    copyToClipboard(result.textContent, 'Đã sao chép nội dung không dấu');
  });
}

// ─── Font VNI ────────────────────────────────────────────────────────────────
function initFontFix() {
  const input = document.getElementById('font-input');
  const output = document.getElementById('font-result');
  const wrap = document.getElementById('font-result-wrap');

  const update = () => {
    const res = S().convertVNItoUnicode(input.value);
    output.value = res;
    wrap.classList.toggle('hidden', !input.value.trim());
  };
  input.addEventListener('input', update);
  document.getElementById('btn-fix-font').addEventListener('click', update);
  document.getElementById('btn-copy-font').addEventListener('click', () => {
    copyToClipboard(output.value, 'Đã sao chép Unicode');
  });
}

// ─── Lương ───────────────────────────────────────────────────────────────────
function initSalary() {
  let salMode = 'gross2net';
  const btnNet = document.getElementById('btn-to-net');
  const btnGross = document.getElementById('btn-to-gross');

  btnNet.addEventListener('click', () => {
    salMode = 'gross2net';
    btnNet.classList.add('active');
    btnGross.classList.remove('active');
  });
  btnGross.addEventListener('click', () => {
    salMode = 'net2gross';
    btnGross.classList.add('active');
    btnNet.classList.remove('active');
  });

  document.getElementById('btn-calc-salary').addEventListener('click', () => {
    const inputVal = Number(document.getElementById('salary-input').value) || 0;
    const region = Number(document.getElementById('salary-region').value);
    const deps = Number(document.getElementById('salary-dependents').value) || 0;
    if (!inputVal) { toast('Vui lòng nhập thu nhập'); return; }

    const res = salMode === 'gross2net'
      ? S().computeGrossToNet(inputVal, region, deps)
      : S().computeNetToGross(inputVal, region, deps);

    displaySalary(res);
    document.getElementById('salary-result-wrap').classList.remove('hidden');
  });
}

function displaySalary(r) {
  const f = v => Math.round(v).toLocaleString('vi-VN');
  document.getElementById('out-gross').textContent = f(r.gross);
  document.getElementById('out-bhxh').textContent = f(r.bhxh);
  document.getElementById('out-bhyt').textContent = f(r.bhyt);
  document.getElementById('out-bhtn').textContent = f(r.bhtn);
  document.getElementById('out-tntt').textContent = f(r.tntt_truoc_thue);
  document.getElementById('out-gt-banthan').textContent = f(r.kt_banthan);
  document.getElementById('out-gt-npt').textContent = f(r.kt_npt);
  document.getElementById('out-thu-nhap-tinh-thue').textContent = f(r.thu_nhap_tinh_thue);
  document.getElementById('out-tax').textContent = f(r.tax);
  document.getElementById('out-net').textContent = f(r.net);
}

// ─── HR ──────────────────────────────────────────────────────────────────────
function initHR() {
  document.getElementById('btn-split-name').addEventListener('click', () => processHRNames('split'));
  document.getElementById('btn-gen-email').addEventListener('click', () => processHRNames('email'));
}

function processHRNames(mode) {
  const lines = document.getElementById('hrname-input').value.split('\n').filter(l => l.trim());
  if (!lines.length) { toast('Vui lòng nhập tên nhân sự'); return; }

  const domain = document.getElementById('hr-email-domain')?.value.trim() || '';
  document.getElementById('hrname-mode-label').textContent =
    mode === 'split' ? 'Họ đệm · Tên' : `Email${domain ? ' @' + domain : ''}`;

  const resWrap = document.getElementById('hrname-result');
  resWrap.innerHTML = '';
  const copyData = [];

  lines.forEach((l, i) => {
    const { last, first } = S().splitName(l);
    let outputText, row;
    if (mode === 'split') {
      copyData.push(`${last}\t${first}`);
      outputText = `<span class="hr-last">${S().escHtml(last)}</span> <strong>${S().escHtml(first)}</strong>`;
    } else {
      const email = S().genEmail(l, domain);
      copyData.push(email);
      outputText = `<strong class="hr-email">${S().escHtml(email)}</strong>`;
    }
    const item = document.createElement('div');
    item.className = 'batch-item';
    item.style.animationDelay = `${(i % 20) * 20}ms`;
    item.innerHTML = `<div>${outputText}</div>`;
    resWrap.appendChild(item);
  });

  document.getElementById('hrname-result-wrap').classList.remove('hidden');
  document.getElementById('btn-copy-hrname').onclick = () => {
    copyToClipboard(copyData.join('\n'), 'Đã sao chép — dán thẳng vào Excel');
  };
}

// ─── VietQR ──────────────────────────────────────────────────────────────────
function initVietQR() {
  const qrDesc = document.getElementById('qr-desc');
  qrDesc.addEventListener('input', () => {
    qrDesc.value = S().removeDiacritics(qrDesc.value);
  });

  document.getElementById('btn-gen-qr').addEventListener('click', () => {
    const bank = document.getElementById('qr-bank').value.trim();
    const acc = document.getElementById('qr-acc').value.trim().replace(/\s/g, '');
    const amt = document.getElementById('qr-amt').value.trim() || 0;
    const desc = qrDesc.value.trim();
    const name = document.getElementById('qr-name')?.value.trim() || '';

    if (!bank || !acc) { toast('Vui lòng chọn ngân hàng và nhập số tài khoản'); return; }

    const url = `https://img.vietqr.io/image/${bank}-${acc}-compact2.png?amount=${amt}&addInfo=${encodeURIComponent(desc)}&accountName=${encodeURIComponent(name)}`;
    document.getElementById('qr-image').src = url;
    document.getElementById('qr-result-wrap').classList.remove('hidden');
  });
}

// ─── XML ─────────────────────────────────────────────────────────────────────
function initXML() {
  const dropzone = document.getElementById('xml-dropzone');
  const fileInput = document.getElementById('xml-file');

  dropzone.addEventListener('click', () => fileInput.click());
  bindDropzone(dropzone, files => { if (files[0]) processXML(files[0]); });
  fileInput.addEventListener('change', e => { if (e.target.files[0]) processXML(e.target.files[0]); });
}

function processXML(file) {
  if (!file.name.toLowerCase().endsWith('.xml')) { toast('Chỉ hỗ trợ file .xml'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    const xmlDoc = new DOMParser().parseFromString(e.target.result, 'text/xml');
    if (xmlDoc.querySelector('parsererror')) { toast('File XML không hợp lệ'); return; }

    const getTag = (parent, ...tags) => {
      const scope = parent || xmlDoc;
      for (const tag of tags) {
        const el = scope.getElementsByTagName(tag)[0];
        if (el?.textContent.trim()) return el.textContent.trim();
      }
      return '';
    };
    const fmt = v => v && !isNaN(v) ? Number(v).toLocaleString('vi-VN') : '-';

    document.getElementById('xml-khdt').textContent =
      `Mẫu số: ${getTag(null, 'KHMSHDon', 'KHMauHD') || '-'} · Ký hiệu: ${getTag(null, 'KHHDon') || '-'} · Số HĐ: ${getTag(null, 'SHDon') || '-'}`;
    document.getElementById('xml-date').textContent = `Lập ngày: ${getTag(null, 'NLap', 'TDLap') || '-'}`;

    const nBan = xmlDoc.getElementsByTagName('NBan')[0] || xmlDoc.getElementsByTagName('Seller')[0];
    const nMua = xmlDoc.getElementsByTagName('NMua')[0] || xmlDoc.getElementsByTagName('Buyer')[0];

    document.getElementById('xml-sell-name').textContent = getTag(nBan, 'Ten', 'Name') || '-';
    document.getElementById('xml-sell-mst').textContent = getTag(nBan, 'MST', 'TaxCode') || '-';
    document.getElementById('xml-buy-name').textContent = getTag(nMua, 'Ten', 'HVTNMHang', 'Name') || 'Khách lẻ';
    document.getElementById('xml-buy-mst').textContent = getTag(nMua, 'MST', 'TaxCode') || '-';

    const tbody = document.getElementById('xml-items-body');
    tbody.innerHTML = '';
    const items = [...xmlDoc.getElementsByTagName('HHDVu'), ...xmlDoc.getElementsByTagName('Product')];
    if (items.length) {
      items.forEach(it => {
        const name = getTag(it, 'THHDVu', 'ProdName', 'Ten');
        const total = getTag(it, 'ThTien', 'Amount');
        if (name) {
          tbody.insertAdjacentHTML('beforeend',
            `<tr><td class="xml-td-left">${S().escHtml(name)}</td><td>${fmt(total)}</td></tr>`);
        }
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="2" class="xml-empty">Không tìm thấy hàng hóa/dịch vụ</td></tr>';
    }

    document.getElementById('xml-sum-net').textContent = fmt(getTag(null, 'TgTCThue', 'TotalBeforeTax'));
    document.getElementById('xml-sum-vat').textContent = fmt(getTag(null, 'TgTThue', 'TotalTax'));
    document.getElementById('xml-sum-total').textContent = fmt(getTag(null, 'TgTTTBSo', 'TgTTTBChu', 'TotalAmount'));
    document.getElementById('xml-result-wrap').classList.remove('hidden');
  };
  reader.onerror = () => toast('Không đọc được file');
  reader.readAsText(file, 'UTF-8');
}

// ─── Batch dropzones ─────────────────────────────────────────────────────────
function initDropzones() {
  document.querySelectorAll('.batch-dropzone').forEach(dz => {
    const fileInput = dz.querySelector('input[type="file"]');
    const tool = dz.dataset.tool;
    bindDropzone(dz, files => handleBatchFiles(files, tool));
    dz.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
      handleBatchFiles(e.target.files, tool);
      fileInput.value = '';
    });
  });
}

function bindDropzone(el, onFiles) {
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('dragover'); });
  el.addEventListener('dragleave', () => el.classList.remove('dragover'));
  el.addEventListener('drop', e => {
    e.preventDefault();
    el.classList.remove('dragover');
    onFiles(e.dataTransfer.files);
  });
}

function handleBatchFiles(files, tool) {
  const MAX = 5 * 1024 * 1024;
  let pending = 0;
  let done = 0;

  Array.from(files).forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'csv'].includes(ext)) { toast(`Bỏ qua ${file.name} — chỉ .txt/.csv`); return; }
    if (file.size > MAX) { toast(`${file.name} quá 5MB`); return; }

    pending++;
    const reader = new FileReader();
    reader.onload = e => {
      let content = e.target.result;
      let resultText = '';
      let newName = file.name.replace(/\.(txt|csv)$/i, '');

      if (tool === 'font') {
        resultText = S().convertVNItoUnicode(content);
        newName += '-[Unicode].' + ext;
      } else if (tool === 'nodiacritics') {
        resultText = content.split('\n').map(l => S().removeDiacritics(l)).join('\n');
        newName += '-[NoMark].' + ext;
      } else if (tool === 'hrname') {
        const domain = document.getElementById('hr-email-domain')?.value.trim() || '';
        resultText = content.split('\n').map(line => {
          if (!line.trim()) return '';
          const r = S().splitName(line.trim());
          return ext === 'csv'
            ? `"${r.last}","${r.first}","${S().genEmail(line, domain)}"`
            : `${r.last}\t${r.first}\t${S().genEmail(line, domain)}`;
        }).join('\n');
        newName += '-[Columns].' + ext;
      } else if (tool === 'docso') {
        resultText = content.split('\n').map(line => {
          if (!line.trim()) return '';
          const n = S().parseLocaleNumber(line.match(/-?\d[\d.,]*/)?.[0] || line);
          const text = isNaN(n) ? '' : S().convertWords(n, selectedLang, selectedCur);
          return ext === 'csv' ? `"${line.trim()}","${text}"` : `${line.trim()}\t${text}`;
        }).join('\n');
        newName += '-[DocSo].' + ext;
      }

      downloadText(resultText, newName);
      done++;
      if (done === pending) toast(`Đã xử lý ${done} file`);
    };
    reader.readAsText(file, 'UTF-8');
  });
}

function downloadText(text, filename) {
  const blob = new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

// ─── Copy handlers ───────────────────────────────────────────────────────────
function initCopyHandlers() {
  document.getElementById('btn-copy-vat-tax')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('vat-tax').value, 'Đã sao chép tiền thuế VAT');
  });
  document.getElementById('btn-copy-vat-post')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('vat-post').value, 'Đã sao chép giá sau thuế');
  });
  document.getElementById('btn-copy-xml')?.addEventListener('click', () => {
    const clip = [
      document.getElementById('xml-khdt').textContent,
      document.getElementById('xml-date').textContent,
      `[BÁN] ${document.getElementById('xml-sell-name').textContent} · MST ${document.getElementById('xml-sell-mst').textContent}`,
      `[MUA] ${document.getElementById('xml-buy-name').textContent} · MST ${document.getElementById('xml-buy-mst').textContent}`,
      `Tổng: ${document.getElementById('xml-sum-total').textContent}`,
    ].join('\n');
    copyToClipboard(clip, 'Đã sao chép tóm tắt hóa đơn');
  });
  document.getElementById('btn-copy-qr')?.addEventListener('click', () => {
    const imgUrl = document.getElementById('qr-image').src;
    if (!imgUrl?.startsWith('http')) { toast('Chưa có mã QR'); return; }
    fetch(imgUrl).then(r => r.blob()).then(blob => {
      navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
        .then(() => toast('Đã sao chép ảnh QR'))
        .catch(() => toast('Trình duyệt không hỗ trợ — hãy Tải xuống'));
    });
  });
  document.getElementById('btn-download-qr')?.addEventListener('click', () => {
    const imgUrl = document.getElementById('qr-image').src;
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `VietQR_${Date.now()}.png`;
    a.click();
  });
}

function initTryButtons() {
  document.querySelectorAll('.try-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('number-input').value = btn.dataset.num;
      selectedLang = btn.dataset.lang;
      selectedCur = btn.dataset.cur;
      document.querySelectorAll('[data-lang]').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === selectedLang);
        b.setAttribute('aria-pressed', String(b.dataset.lang === selectedLang));
      });
      document.querySelectorAll('[data-cur]').forEach(b => {
        b.classList.toggle('active', b.dataset.cur === selectedCur);
        b.setAttribute('aria-pressed', String(b.dataset.cur === selectedCur));
      });
      switchTool('view-docso');
      document.getElementById('cong-cu').scrollIntoView({ behavior: 'smooth' });
      doConvert(false);
    });
  });

  // Deep-link hash → tool view
  const hash = location.hash.replace('#', '');
  const map = {
    docso: 'view-docso', font: 'view-font', vat: 'view-vat',
    nodiacritics: 'view-nodiacritics', salary: 'view-salary',
    hrname: 'view-hrname', xml: 'view-xml', vietqr: 'view-vietqr',
    'excel-addin': 'view-excel-addin', about: 'view-about',
  };
  if (map[hash]) switchTool(map[hash]);
}
