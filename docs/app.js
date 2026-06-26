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
  // ─── Đăng ký PWA Service Worker (Trụ Cột Offline) ───
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
      .catch(err => console.log('[PWA] Registration failed:', err));
  }

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

  // ─── Dashboard Navigation ───
  document.querySelectorAll('.tool-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.dataset.target;
      document.querySelectorAll('.tool-view').forEach(view => {
        if (view.id === targetId) {
          view.classList.remove('hidden');
          view.classList.add('active');
        } else {
          view.classList.add('hidden');
          view.classList.remove('active');
        }
      });
      // Reset scroll to top of tool
      document.getElementById('cong-cu').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ─── VAT Controller ───
  let vatRate = 8;
  document.querySelectorAll('[data-vat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-vat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vatRate = Number(btn.dataset.vat);
      calcVat('pre'); // Recalc based on current pre value
    });
  });
  
  const vatPre = document.getElementById('vat-pre');
  const vatTax = document.getElementById('vat-tax');
  const vatPost = document.getElementById('vat-post');
  
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

  // ─── Diacritics Controller ───
  const diaInput = document.getElementById('nodiacritics-input');
  const diaResult = document.getElementById('nodiacritics-result');
  diaInput.addEventListener('input', () => {
    let str = diaInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    // Normalize spaces and uppercase commonly for banking
    str = str.toUpperCase().replace(/\s+/g, ' ');
    diaResult.textContent = str;
  });
  
  document.getElementById('btn-copy-nodiacritics').addEventListener('click', () => {
    copyToClipboard(diaResult.textContent, 'Đã copy nội dung không dấu!');
  });

  // ─── VNI Font Fix Controller ───
  document.getElementById('btn-fix-font').addEventListener('click', () => {
    const input = document.getElementById('font-input').value;
    const res = convertVNItoUnicode(input);
    document.getElementById('font-result').value = res;
    document.getElementById('font-result-wrap').classList.remove('hidden');
  });
  document.getElementById('btn-copy-font').addEventListener('click', () => {
    copyToClipboard(document.getElementById('font-result').value, 'Đã copy Unicode!');
  });

  // ─── Salary Controller ───
  let salMode = 'gross2net'; // or 'net2gross'
  document.getElementById('btn-to-net').addEventListener('click', (e) => {
    salMode = 'gross2net';
    e.target.classList.add('active');
    document.getElementById('btn-to-gross').classList.remove('active');
    document.getElementById('out-gross').parentElement.style.background = '#e6fcf5'; // Hightlight Gross Input
    document.getElementById('out-net').parentElement.style.background = 'transparent';
  });
  document.getElementById('btn-to-gross').addEventListener('click', (e) => {
    salMode = 'net2gross';
    e.target.classList.add('active');
    document.getElementById('btn-to-net').classList.remove('active');
    document.getElementById('out-net').parentElement.style.background = '#e6fcf5'; // Hightlight Net Input
    document.getElementById('out-gross').parentElement.style.background = 'transparent';
  });

  const btnCalcSal = document.getElementById('btn-calc-salary');
  btnCalcSal.addEventListener('click', () => {
    const inputVal = Number(document.getElementById('salary-input').value) || 0;
    const region = Number(document.getElementById('salary-region').value);
    const deps = Number(document.getElementById('salary-dependents').value) || 0;
    if (!inputVal) { toast('Vui lòng nhập thu nhập!'); return; }

    btnCalcSal.classList.add('is-loading');
    setTimeout(() => {
      let res;
      if (salMode === 'gross2net') {
        res = computeGrossToNet(inputVal, region, deps);
      } else {
        res = computeNetToGross(inputVal, region, deps);
      }
      displaySalary(res);
      btnCalcSal.classList.remove('is-loading');
      document.getElementById('salary-result-wrap').classList.remove('hidden');
    }, 300);
  });

  // ─── HR Name Controller ───
  document.getElementById('btn-split-name').addEventListener('click', () => processHRNames('split'));
  document.getElementById('btn-gen-email').addEventListener('click', () => processHRNames('email'));

  function processHRNames(mode) {
    const lines = document.getElementById('hrname-input').value.split('\n').filter(l => l.trim().length > 0);
    if (!lines.length) { toast('Vui lòng nhập tên nhân sự!'); return; }

    document.getElementById('hrname-mode-label').textContent = mode === 'split' ? 'Ho Dem [tab] Ten' : 'Email Generation';
    const resWrap = document.getElementById('hrname-result');
    resWrap.innerHTML = '';
    
    let copyData = [];

    lines.forEach((l, i) => {
      const {last, first} = splitName(l);
      let outputText = '';
      if (mode === 'split') {
        // Prepare for copy-pasting to 2 separate Excel columns
        copyData.push(`${last}\t${first}`);
        outputText = `<span style="color:#787672">${escHtml(last)}</span> &nbsp; <strong style="color:#1a1a1a">${escHtml(first)}</strong>`;
      } else {
        const emailStr = genEmail(l);
        copyData.push(emailStr);
        outputText = `<strong style="color:#1971c2">${escHtml(emailStr)}</strong>`;
      }

      const item = document.createElement('div');
      item.className = 'batch-item';
      item.style.animationDelay = `${(i%20)*20}ms`;
      item.innerHTML = `<div style="flex:1;">${outputText}</div>`;
      resWrap.appendChild(item);
    });

    document.getElementById('hrname-result-wrap').classList.remove('hidden');
    document.getElementById('btn-copy-hrname').onclick = () => {
      copyToClipboard(copyData.join('\n'), 'Đã copy vào Clipboard (sẵn sàng dán thẳng vào Excel)!');
    };
  }

  // ─── VietQR Controller ───
  const btnGenQR = document.getElementById('btn-gen-qr');
  const qrDesc = document.getElementById('qr-desc');
  
  // Auto uppercase & remove diacritics for description while typing
  qrDesc.addEventListener('input', () => {
    let str = qrDesc.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    qrDesc.value = str.toUpperCase();
  });

  btnGenQR.addEventListener('click', () => {
    const bank = document.getElementById('qr-bank').value.trim();
    const acc = document.getElementById('qr-acc').value.trim();
    const amt = document.getElementById('qr-amt').value.trim() || 0;
    const desc = document.getElementById('qr-desc').value.trim();

    if (!bank || !acc) { toast('Vui lòng nhập Ngân hàng và Số thẻ/TK!'); return; }
    
    // Quick template mapping for Napas via img.vietqr.io
    const url = `https://img.vietqr.io/image/${bank}-${acc}-compact2.png?amount=${amt}&addInfo=${encodeURIComponent(desc)}&accountName=`;
    
    document.getElementById('qr-image').src = url;
    document.getElementById('qr-result-wrap').classList.remove('hidden');
    document.getElementById('view-vietqr').scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  // ─── XML E-Invoice Parser ───
  const dropzone = document.getElementById('xml-dropzone');
  const fileInput = document.getElementById('xml-file');

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--green)'; dropzone.style.background = '#e6fcf5'; });
  dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--border)'; dropzone.style.background = 'var(--bg-hover)'; });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border)'; dropzone.style.background = 'var(--bg-hover)';
    if (e.dataTransfer.files.length) processXML(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) processXML(e.target.files[0]);
  });

  function processXML(file) {
    if (!file.name.toLowerCase().endsWith('.xml')) { toast('Vui lòng chọn file .xml!'); return; }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      const getTag = (parent, tag) => {
        const p = parent || xmlDoc;
        const el = p.getElementsByTagName(tag)[0];
        return el ? el.textContent.trim() : '';
      };
      const fmtCurrency = (val) => val && !isNaN(val) ? Number(val).toLocaleString('vi-VN') : '-';

      // Header info
      const mau = getTag(null, 'KHMSHDon') || getTag(null, 'KHMauHD') || '-';
      const kyhieu = getTag(null, 'KHHDon') || '-';
      const sohd = getTag(null, 'SHDon') || '-';
      const dateStr = getTag(null, 'NLap');
      
      document.getElementById('xml-khdt').textContent = `Mẫu số: ${mau} - Ký hiệu: ${kyhieu} - Số HĐ: ${sohd}`;
      document.getElementById('xml-date').textContent = `Lập ngày: ${dateStr}`;

      // Seller / Buyer
      const nBan = xmlDoc.getElementsByTagName('NBan')[0];
      const nMua = xmlDoc.getElementsByTagName('NMua')[0];
      
      document.getElementById('xml-sell-name').textContent = getTag(nBan, 'Ten') || '-';
      document.getElementById('xml-sell-mst').textContent = getTag(nBan, 'MST') || '-';
      document.getElementById('xml-buy-name').textContent = getTag(nMua, 'Ten') || getTag(nMua, 'HVTN') || 'Khách lẻ / Không ghi';
      document.getElementById('xml-buy-mst').textContent = getTag(nMua, 'MST') || '-';

      // Items
      const tbody = document.getElementById('xml-items-body');
      tbody.innerHTML = '';
      const items = Array.from(xmlDoc.getElementsByTagName('HHDVu'));
      if (items.length > 0) {
        items.forEach(it => {
          const name = getTag(it, 'THHDVu');
          const total = getTag(it, 'ThTien');
          if (name) {
            tbody.innerHTML += `<tr>
              <td style="padding:6px; border:1px solid #eee; text-align:left;">${escHtml(name)}</td>
              <td style="padding:6px; border:1px solid #eee;">${fmtCurrency(total)}</td>
            </tr>`;
          }
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="2" style="padding:6px; text-align:center; color:#999;">Không tìm thấy bảng nội dung/dịch vụ</td></tr>`;
      }

      // Totals
      document.getElementById('xml-sum-net').textContent = fmtCurrency(getTag(null, 'TgTCThue'));
      document.getElementById('xml-sum-vat').textContent = fmtCurrency(getTag(null, 'TgTThue'));
      document.getElementById('xml-sum-total').textContent = fmtCurrency(getTag(null, 'TgTTTBSo'));

      document.getElementById('xml-result-wrap').classList.remove('hidden');
      document.getElementById('view-xml').scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    reader.onerror = () => toast('Không thể đọc file!');
    reader.readAsText(file);
  }

  // ─── Phase 4: Batch File Processing (Global Dropzones) ───
  document.querySelectorAll('.batch-dropzone').forEach(dz => {
    const fileInput = dz.querySelector('input[type="file"]');
    const tool = dz.getAttribute('data-tool');
    
    dz.addEventListener('click', () => fileInput.click());
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.style.borderColor = 'var(--green)'; dz.style.background = '#e6fcf5'; });
    dz.addEventListener('dragleave', (e) => { e.preventDefault(); dz.style.borderColor = 'var(--border)'; dz.style.background = 'var(--bg-hover)'; });
    
    const handleFiles = (files) => {
      dz.style.borderColor = 'var(--border)'; dz.style.background = 'var(--bg-hover)';
      if (!files.length) return;
      
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
      
      Array.from(files).forEach(file => {
        if (!file.name.toLowerCase().endsWith('.txt') && !file.name.toLowerCase().endsWith('.csv')) {
          toast(`Loi: Chi ho tro .txt hoac .csv (File: ${file.name})`);
          return;
        }
        
        if (file.size > MAX_FILE_SIZE) {
          toast(`Loi: File qua lon (toi da 5MB). File: ${file.name}`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          let content = e.target.result;
          let resultText = "";
          let ext = file.name.split('.').pop();
          let newName = "";

          if (tool === 'font') {
            resultText = convertVNItoUnicode(content);
            newName = file.name.replace(`.${ext}`, `-[Unicode].${ext}`);
          }
          else if (tool === 'nodiacritics') {
            resultText = content.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
            newName = file.name.replace(`.${ext}`, `-[NoMark].${ext}`);
          }
          else if (tool === 'hrname') {
            let lines = content.split('\n');
            resultText = lines.map(line => {
              if(!line.trim()) return "";
              let r = splitName(line.trim());
              if(ext === 'csv') return `"${r.last}","${r.first}","${genEmail(line)}"`;
              return `${r.last}\t${r.first}\t${genEmail(line)}`;
            }).join('\n');
            newName = file.name.replace(`.${ext}`, `-[Columns].${ext}`);
          }
          else if (tool === 'docso') {
            let lines = content.split('\n');
            let lang = selectedLang || 'vi';
            let cur = selectedCur || 'vnd';
            
            resultText = lines.map(line => {
              if(!line.trim()) return "";
              // Extract the first number found (basic fallback mapping)
              let numMatch = line.match(/-?\d+(\.\d+)?/);
              let val = numMatch ? parseFloat(numMatch[0]) : NaN;
              let text = (!isNaN(val)) ? convertLocal(val, lang, cur) : "";
              if(ext === 'csv') return `${line.trim()},"${text}"`;
              return `${line.trim()}\t${text}`;
            }).join('\n');
            newName = file.name.replace(`.${ext}`, `-[DocSo].${ext}`);
          }

          const blob = new Blob([resultText], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = newName;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 500);
        };
        reader.readAsText(file);
      });
      toast(`Đã xử lý và tải về ${files.length} file dữ liệu.`);
    };

    dz.addEventListener('drop', (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); });
    fileInput.addEventListener('change', (e) => { handleFiles(e.target.files); fileInput.value = ''; });
  });

  // ─── Phase 7: Deep Audit 1-Click Handlers ───
  // 1. VAT Auto Copy
  document.getElementById('btn-copy-vat-tax')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('vat-tax').value, 'Đã sao chép Tiền Thuế VAT');
  });
  document.getElementById('btn-copy-vat-post')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('vat-post').value, 'Đã sao chép Tiền Sau Thuế');
  });

  // 2. XML Smart Copy
  document.getElementById('btn-copy-xml')?.addEventListener('click', () => {
    const khdt = document.getElementById('xml-khdt').textContent;
    const date = document.getElementById('xml-date').textContent;
    const sellName = document.getElementById('xml-sell-name').textContent;
    const sellMst = document.getElementById('xml-sell-mst').textContent;
    const buyName = document.getElementById('xml-buy-name').textContent;
    const buyMst = document.getElementById('xml-buy-mst').textContent;
    const total = document.getElementById('xml-sum-total').textContent;
    
    const clipStr = `${khdt}\n${date}\n-----------------------\n[BÁN]: ${sellName}\n[MST]: ${sellMst}\n[MUA]: ${buyName}\n[MST]: ${buyMst}\n-----------------------\nTổng thanh toán: ${total}`;
    copyToClipboard(clipStr, 'Đã sao chép nhanh tóm tắt Hóa Đơn');
  });

  // 3. VietQR Advanced Actions
  document.getElementById('btn-copy-qr')?.addEventListener('click', () => {
    const imgUrl = document.getElementById('qr-image').src;
    if (!imgUrl || !imgUrl.startsWith('http')) { toast('Chưa có mã QR để sao chép!'); return; }
    
    fetch(imgUrl).then(res => res.blob()).then(blob => {
      try {
        navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]).then(() => {
          toast('Đã nạp Hình Ảnh QR vào bộ nhớ đệm (Clipboard)');
        });
      } catch (err) {
        toast('Trình duyệt chặn quyền truy cập Ảnh — Vui lòng nhấn "Tải Xuống"');
      }
    });
  });
  
  document.getElementById('btn-download-qr')?.addEventListener('click', () => {
    const imgUrl = document.getElementById('qr-image').src;
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `VietQR_${Date.now()}.png`;
    a.click();
    toast('Đang tải hình ảnh xuống thiết bị...');
  });

});

// ─── Salary Logic ───
// Nguồn: Nghị định 293/2025/ND-CP (lương tối thiểu vùng từ 01/01/2026)
// Lương cơ sở: 2.340.000đ (Nghị định 73/2024, hiệu lực 01/07/2024)
// Dự kiến tăng lên 2.530.000đ từ 01/07/2026
const SALARY_CONFIG = {
  luongCoSo: 2340000,
  luongToiThieuVung: { 1: 5310000, 2: 4730000, 3: 4140000, 4: 3700000 },
  giamTruBanThan: 11000000,
  giamTruNPT: 4400000,
};

function computeGrossToNet(gross, region, deps) {
  const lcs = SALARY_CONFIG.luongCoSo;
  const maxBHXH = lcs * 20;
  
  const lttv = SALARY_CONFIG.luongToiThieuVung[region] || SALARY_CONFIG.luongToiThieuVung[1];
  const maxBHTN = lttv * 20;

  let bbBHXH = Math.min(gross, maxBHXH);
  let bbBHTN = Math.min(gross, maxBHTN);

  let bhxh = bbBHXH * 0.08;
  let bhyt = bbBHXH * 0.015;
  let bhtn = bbBHTN * 0.01;

  let tntt_truoc_thue = gross - bhxh - bhyt - bhtn;

  let kt_banthan = SALARY_CONFIG.giamTruBanThan;
  let kt_npt = deps * SALARY_CONFIG.giamTruNPT;
  
  let thu_nhap_tinh_thue = Math.max(0, tntt_truoc_thue - kt_banthan - kt_npt);

  let tax = 0;
  let tt = thu_nhap_tinh_thue;
  if(tt <= 5000000) tax = tt * 0.05;
  else if(tt <= 10000000) tax = tt * 0.1 - 250000;
  else if(tt <= 18000000) tax = tt * 0.15 - 750000;
  else if(tt <= 32000000) tax = tt * 0.2 - 1650000;
  else if(tt <= 52000000) tax = tt * 0.25 - 3250000;
  else if(tt <= 80000000) tax = tt * 0.3 - 5850000;
  else tax = tt * 0.35 - 9850000;

  let net = tntt_truoc_thue - tax;

  return {
    gross, bhxh, bhyt, bhtn, tntt_truoc_thue, kt_banthan, kt_npt, thu_nhap_tinh_thue, tax, net
  };
}

function computeNetToGross(net, region, deps) {
  // Pure binary search to find Gross for 100% accuracy without complex reverse tax brackets
  let low = net;
  let high = net * 3; // Gross can't realistically be > 3*Net within standard brackets
  let best = 0;
  
  for(let i=0; i<60; i++) {
    let mid = (low + high) / 2;
    let res = computeGrossToNet(mid, region, deps);
    best = mid;
    if(res.net < net - 0.01) low = mid;
    else if(res.net > net + 0.01) high = mid;
    else break;
  }
  return computeGrossToNet(best, region, deps);
}

function displaySalary(r) {
  const f = (val) => Math.round(val).toLocaleString('vi-VN');
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

// ─── HR Functions ───
function splitName(full) {
  const p = full.trim().split(/\s+/);
  if(p.length <= 1) return {last: p[0] || '', first: ''};
  const f = p.pop();
  return {last: p.join(' '), first: f};
}
function genEmail(full) {
  const str = full.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const p = str.trim().split(/\s+/);
  if(!p.length || !p[0]) return '';
  if(p.length === 1) return p[0];
  const f = p.pop();
  const i = p.map(x => x[0]).join('');
  return `${f}.${i}`;
}

// ─── Convert ─────────────────────────────────────────────────────────────────
function doConvert() {
  const raw = document.getElementById('number-input').value.trim();
  if (!raw) { toast('Chưa có dữ liệu — Vui lòng nhập số cần đọc'); return; }

  const num = Number(raw);
  if (isNaN(num)) { toast('Lỗi Định Dạng — Vui lòng chỉ nhập số hợp lệ'); return; }

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

  if (!lines.length) { toast('Dữ liệu rỗng — Vui lòng dán danh sách số vào khung'); return; }
  if (lines.length > 100) { toast('Cảnh báo quá tải — Tối đa 100 dòng mỗi lượt xử lý'); return; }

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

  // Sao chép hàng loạt
  if (outputs.length) {
    copyAllWrap.classList.remove('hidden');
    document.getElementById('btn-copy-all').onclick = () => {
      copyToClipboard(outputs.join('\n'), `Đã sao chép thành công ${outputs.length} dòng dữ liệu`);
    };
  }

  toast(`Hoàn tất chuyển đổi ${lines.length} dữ liệu`);
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
    toast('Trình duyệt chặn quyền truy cập — Vui lòng sao chép thủ công');
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

// ─── Font Mapping Data (VNI Windows & TCVN3 -> Unicode) ────────────
function convertVNItoUnicode(str) {
  if (!str) return '';
  
  const vniKeys = ["aù","aø","aû","aõ","aï","aâ","aá","aà","aå","aã","aä","aê","aé","aè","aú","aö","aë","eù","eø","eû","eõ","eï","eâ","eá","eà","eå","eã","eä","iù","iø","iû","iõ","iï","où","oø","oû","oõ","oï","oâ","oá","oà","oå","oã","oä","oê","oé","oè","oú","oö","oë","uù","uø","uû","uõ","uï","ư","uø","uû","uo","uõ","uï","yù","yø","yû","yõ","yï","d9","AÙ","AØ","AÛ","AÕ","AÏ","AÂ","AÁ","AÀ","AÅ","AÃ","AÄ","AÊ","AÉ","AÈ","AÚ","AÖ","AË","EÙ","EØ","EÛ","EÕ","EÏ","EÂ","EÁ","EÀ","EÅ","EÃ","EÄ","IÙ","IØ","IÛ","IÕ","IÏ","OÙ","OØ","OÛ","OÕ","OÏ","OÂ","OÁ","OÀ","OÅ","OÃ","OÄ","OÊ","OÉ","OÈ","OÚ","OÖ","OË","UÙ","UØ","UÛ","UÕ","UÏ","Ư","UØ","UÛ","UO","UÕ","UÏ","YÙ","YØ","YÛ","YÕ","YÏ","D9"];
  const uniVals = ["á","à","ả","ã","ạ","â","ấ","ầ","ẩ","ẫ","ậ","ă","ắ","ằ","ẳ","ẵ","ặ","é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ","í","ì","ỉ","ĩ","ị","ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ","ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự","ý","ỳ","ỷ","ỹ","ỵ","đ","Á","À","Ả","Ã","Ạ","Â","Ấ","Ầ","Ẩ","Ẫ","Ậ","Ă","Ắ","Ằ","Ẳ","Ẵ","Ặ","É","È","Ẻ","Ẽ","Ẹ","Ê","Ế","Ề","Ể","Ễ","Ệ","Í","Ì","Ỉ","Ĩ","Ị","Ó","Ò","Ỏ","Õ","Ọ","Ô","Ố","Ồ","Ổ","Ỗ","Ộ","Ơ","Ớ","Ờ","Ở","Ỡ","Ợ","Ú","Ù","Ủ","Ũ","Ụ","Ư","Ứ","Ừ","Ử","Ữ","Ự","Ý","Ỳ","Ỷ","Ỹ","Ỵ","Đ"];
  
  // Tương tự cho TCVN3 (Khắc phục lỗi nuốt chữ bằng cách Sort độ dài giảm dần)
  const tcvn3Keys = ["¸","µ","¶","·","¹","©","Ê","Ç","È","É","Ë","«","¾","»","¼","½","Æ","Ð","Ì","Î","Ï","Ñ","ª","Õ","Ò","Ó","Ô","Ö","Ý","×","Ø","Ü","Þ","ß","ã","ß","á","â","ä","«","è","å","æ","ç","é","¬","í","ê","ë","ì","î","ó","ï","ñ","ò","ô","­","ø","õ","ö","÷","ù","ý","ú","û","ü","þ","®"];
  const tcvn3Vals = ["á","à","ả","ã","ạ","â","ấ","ầ","ẩ","ẫ","ậ","ă","ắ","ằ","ẳ","ẵ","ặ","é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ","í","ì","ỉ","ĩ","ị","ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ","ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự","ý","ỳ","ỷ","ỹ","ỵ","đ"];
  
  // Tổng hợp vào Pair Map và Sort chuỗi dài đè trước chuỗi ngắn
  let pairs = [];
  for(let i=0; i<vniKeys.length; i++) pairs.push([vniKeys[i], uniVals[i]]);
  for(let i=0; i<tcvn3Keys.length; i++) pairs.push([tcvn3Keys[i], tcvn3Vals[i]]);
  
  pairs.sort((a,b) => b[0].length - a[0].length);
  
  let res = str;
  for(let i=0; i<pairs.length; i++) {
    const reg = new RegExp(pairs[i][0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), 'g');
    res = res.replace(reg, pairs[i][1]);
  }
  
  return res;
}
