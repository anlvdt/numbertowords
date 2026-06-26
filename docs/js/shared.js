/**
 * shared.js — DocSoThanhChu Web v2.2
 * Shared utilities, parsers, font fix, salary engine
 */
'use strict';

const DocSoShared = {
  MAX_NUMBER: 999_999_999_999,

  /** Parse VN (1.234.567,89), US (1,234,567.89), or plain numbers */
  parseLocaleNumber(raw) {
    if (raw == null) return NaN;
    let s = String(raw).trim().replace(/\s/g, '');
    if (!s) return NaN;
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
      return parseFloat(s.replace(/\./g, '').replace(',', '.'));
    }
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) {
      return parseFloat(s.replace(/,/g, ''));
    }
    s = s.replace(/,/g, '');
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  },

  formatNumber(n) {
    if (!Number.isFinite(n)) return '';
    return n.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  },

  removeDiacritics(str, upper = true) {
    let s = String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/\s+/g, ' ')
      .trim();
    return upper ? s.toUpperCase() : s;
  },

  /** VNI-Windows + TCVN3 (ABC) → Unicode — sorted longest-first */
  convertVNItoUnicode(str) {
    if (!str) return '';

    const pairs = [
      // VNI Windows (multi-char, lowercase + uppercase)
      ['aù','á'],['aø','à'],['aû','ả'],['aõ','ã'],['aï','ạ'],
      ['aâ','ấ'],['aá','ầ'],['aà','ẩ'],['aå','ẫ'],['aã','ậ'],
      ['aê','ắ'],['aé','ằ'],['aè','ẳ'],['aú','ẵ'],['aö','ặ'],
      ['eù','é'],['eø','è'],['eû','ẻ'],['eõ','ẽ'],['eï','ẹ'],
      ['eâ','ế'],['eá','ề'],['eà','ể'],['eå','ễ'],['eã','ệ'],
      ['iù','í'],['iø','ì'],['iû','ỉ'],['iõ','ĩ'],['iï','ị'],
      ['où','ó'],['oø','ò'],['oû','ỏ'],['oõ','õ'],['oï','ọ'],
      ['oâ','ố'],['oá','ồ'],['oà','ổ'],['oå','ỗ'],['oã','ộ'],
      ['oê','ớ'],['oé','ờ'],['oè','ở'],['oú','ỡ'],['oö','ợ'],
      ['uù','ú'],['uø','ù'],['uû','ủ'],['uõ','ũ'],['uï','ụ'],
      ['u+','ư'],['u+ù','ứ'],['u+ø','ừ'],['u+û','ử'],['u+õ','ữ'],['u+ï','ự'],
      ['yù','ý'],['yø','ỳ'],['yû','ỷ'],['yõ','ỹ'],['yï','ỵ'],
      ['d9','đ'],
      ['AÙ','Á'],['AØ','À'],['AÛ','Ả'],['AÕ','Ã'],['AÏ','Ạ'],
      ['AÂ','Ấ'],['AÁ','Ầ'],['AÀ','Ẩ'],['AÅ','Ẫ'],['AÃ','Ậ'],
      ['AÊ','Ắ'],['AÉ','Ằ'],['AÈ','Ẳ'],['AÚ','Ẵ'],['AÖ','Ặ'],
      ['EÙ','É'],['EØ','È'],['EÛ','Ẻ'],['EÕ','Ẽ'],['EÏ','Ẹ'],
      ['EÂ','Ế'],['EÁ','Ề'],['EÀ','Ể'],['EÅ','Ễ'],['EÃ','Ệ'],
      ['IÙ','Í'],['IØ','Ì'],['IÛ','Ỉ'],['IÕ','Ĩ'],['IÏ','Ị'],
      ['OÙ','Ó'],['OØ','Ò'],['OÛ','Ỏ'],['OÕ','Õ'],['OÏ','Ọ'],
      ['OÂ','Ố'],['OÁ','Ồ'],['OÀ','Ổ'],['OÅ','Ỗ'],['OÃ','Ộ'],
      ['OÊ','Ớ'],['OÉ','Ờ'],['OÈ','Ở'],['OÚ','Ỡ'],['OÖ','Ợ'],
      ['UÙ','Ú'],['UØ','Ù'],['UÛ','Ủ'],['UÕ','Ũ'],['UÏ','Ụ'],
      ['U+','Ư'],['U+Ù','Ứ'],['U+Ø','Ừ'],['U+Û','Ử'],['U+Õ','Ữ'],['U+Ï','Ự'],
      ['YÙ','Ý'],['YØ','Ỳ'],['YÛ','Ỷ'],['YÕ','Ỹ'],['YÏ','Ỵ'],
      ['D9','Đ'],
      // TCVN3 / ABC (single-char, deduplicated)
      ['µ','à'],['¸','á'],['¶','ả'],['·','ã'],['¹','ạ'],
      ['©','â'],['Ê','ấ'],['Ç','ầ'],['È','ẩ'],['É','ẫ'],['Ë','ậ'],
      ['«','ă'],['¾','ắ'],['»','ằ'],['¼','ẳ'],['½','ẵ'],['Æ','ặ'],
      ['Ð','é'],['Ì','è'],['Î','ẻ'],['Ï','ẽ'],['Ñ','ẹ'],
      ['ª','ê'],['Õ','ế'],['Ò','ề'],['Ó','ể'],['Ô','ễ'],['Ö','ệ'],
      ['Ý','í'],['×','ì'],['Ø','ỉ'],['Ü','ĩ'],['Þ','ị'],
      ['ã','ó'],['ß','ò'],['á','ỏ'],['â','õ'],['ä','ọ'],
      ['è','ố'],['å','ồ'],['æ','ổ'],['ç','ỗ'],['é','ộ'],
      ['¬','ơ'],['í','ớ'],['ê','ờ'],['ë','ở'],['ì','ỡ'],['î','ợ'],
      ['ï','ù'],['ñ','ủ'],['ò','ũ'],['ô','ụ'],
      ['­','ư'],['ø','ứ'],['õ','ừ'],['ö','ử'],['÷','ữ'],['ù','ự'],
      ['ý','ý'],['ú','ỳ'],['û','ỷ'],['ü','ỹ'],['þ','ỵ'],
      ['®','đ'],
    ];

    // Deduplicate: keep first (VNI multi-char wins over TCVN3 single)
    const seen = new Set();
    const unique = [];
    for (const [from, to] of pairs) {
      if (!seen.has(from)) { seen.add(from); unique.push([from, to]); }
    }
    unique.sort((a, b) => b[0].length - a[0].length);

    let res = str;
    for (const [from, to] of unique) {
      const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      res = res.replace(re, to);
    }
    return res;
  },

  // ─── Salary (ND 293/2025 — LTTV 2026, LCS 2.340.000) ───
  SALARY_CONFIG: {
    luongCoSo: 2_340_000,
    luongToiThieuVung: { 1: 5_310_000, 2: 4_730_000, 3: 4_140_000, 4: 3_700_000 },
    giamTruBanThan: 11_000_000,
    giamTruNPT: 4_400_000,
    bhxhRate: { bhxh: 0.08, bhyt: 0.015, bhtn: 0.01 },
    bhxhCap: 20,
    bhtnCap: 20,
  },

  calcProgressiveTax(tt) {
    if (tt <= 0) return 0;
    const brackets = [
      [5_000_000, 0.05, 0],
      [10_000_000, 0.10, 250_000],
      [18_000_000, 0.15, 750_000],
      [32_000_000, 0.20, 1_650_000],
      [52_000_000, 0.25, 3_250_000],
      [80_000_000, 0.30, 5_850_000],
      [Infinity, 0.35, 9_850_000],
    ];
    for (const [limit, rate, deduct] of brackets) {
      if (tt <= limit) return Math.max(0, tt * rate - deduct);
    }
    return 0;
  },

  computeGrossToNet(gross, region, deps) {
    const cfg = DocSoShared.SALARY_CONFIG;
    const maxBHXH = cfg.luongCoSo * cfg.bhxhCap;
    const lttv = cfg.luongToiThieuVung[region] || cfg.luongToiThieuVung[1];
    const maxBHTN = lttv * cfg.bhtnCap;

    const bbBHXH = Math.min(gross, maxBHXH);
    const bbBHTN = Math.min(gross, maxBHTN);

    const bhxh = bbBHXH * cfg.bhxhRate.bhxh;
    const bhyt = bbBHXH * cfg.bhxhRate.bhyt;
    const bhtn = bbBHTN * cfg.bhxhRate.bhtn;

    const tntt = gross - bhxh - bhyt - bhtn;
    const kt_banthan = cfg.giamTruBanThan;
    const kt_npt = deps * cfg.giamTruNPT;
    const thu_nhap_tinh_thue = Math.max(0, tntt - kt_banthan - kt_npt);
    const tax = DocSoShared.calcProgressiveTax(thu_nhap_tinh_thue);
    const net = tntt - tax;

    return { gross, bhxh, bhyt, bhtn, tntt_truoc_thue: tntt, kt_banthan, kt_npt, thu_nhap_tinh_thue, tax, net };
  },

  computeNetToGross(net, region, deps) {
    let low = net;
    let high = net * 3;
    let best = net;
    for (let i = 0; i < 64; i++) {
      const mid = (low + high) / 2;
      const res = DocSoShared.computeGrossToNet(mid, region, deps);
      best = mid;
      if (res.net < net - 0.5) low = mid;
      else if (res.net > net + 0.5) high = mid;
      else break;
    }
    return DocSoShared.computeGrossToNet(best, region, deps);
  },

  splitName(full) {
    const p = full.trim().split(/\s+/);
    if (p.length <= 1) return { last: p[0] || '', first: '' };
    const first = p.pop();
    return { last: p.join(' '), first };
  },

  genEmail(full, domain = '') {
    const str = DocSoShared.removeDiacritics(full, false).toLowerCase();
    const p = str.trim().split(/\s+/);
    if (!p.length || !p[0]) return '';
    let local;
    if (p.length === 1) local = p[0];
    else {
      const first = p.pop();
      local = `${first}.${p.map(x => x[0]).join('')}`;
    }
    return domain ? `${local}@${domain.replace(/^@/, '')}` : local;
  },

  convertWords(num, lang, cur) {
    switch (`${lang}_${cur}`) {
      case 'vi_vnd':    return Converter.vndVi(num);
      case 'en_vnd':    return Converter.vndEn(num);
      case 'vi_usd':    return Converter.usdVi(num);
      case 'en_usd':    return Converter.usdEn(num);
      case 'vi_number': return Converter.soVi(num);
      case 'en_number': return Converter.soEn(num);
      default:          return Converter.vndVi(num);
    }
  },

  labelFor(lang, cur) {
    const map = {
      vi_vnd: 'VND → Tiếng Việt', en_vnd: 'VND → English',
      vi_usd: 'USD → Tiếng Việt', en_usd: 'USD → English',
      vi_number: 'Số → Tiếng Việt', en_number: 'Số → English',
    };
    return map[`${lang}_${cur}`] || '';
  },

  escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  copyToClipboard(text, successMsg) {
    const done = () => toast(successMsg);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  },
};

function fallbackCopy(text, successMsg) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.cssText = 'position:fixed;top:-9999px';
  document.body.appendChild(el);
  el.select();
  try { document.execCommand('copy'); toast(successMsg); }
  catch { toast('Không thể sao chép — vui lòng copy thủ công'); }
  document.body.removeChild(el);
}

let _toastTimer;
function toast(msg, duration = 2600) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.classList.remove('hidden');
  _toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
}

if (typeof window !== 'undefined') {
  window.DocSoShared = DocSoShared;
  window.toast = toast;
  window.copyToClipboard = DocSoShared.copyToClipboard.bind(DocSoShared);
}
