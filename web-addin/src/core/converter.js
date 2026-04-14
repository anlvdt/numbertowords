/**
 * converter.js — DocSoThanhChu v2.0
 * Rule-based number-to-words engine (port of modDocSoThanhChu.bas)
 * Cross-platform: runs in browser (Office.js) and Node.js (testing)
 *
 * FIXES vs VBA v1.1.0:
 *  - Floating-point: uses integer arithmetic (totalCents = Math.round(n*100))
 *  - No VBA Banker's Rounding trap
 */
'use strict';

// ─── Vietnamese word map ────────────────────────────────────────────────────
const VI = {
  digits: ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'],
  muoi:  'mười',   // 10–19
  muoix: 'mươi',   // 2x–9x
  tram:  'trăm',
  nghin: 'nghìn',
  trieu: 'triệu',
  ty:    'tỷ',
  le:    'lẻ',
  lam:   'lăm',    // units=5 when tens>=1
  mot1:  'mốt',    // units=1 when tens>=2
  tu:    'tư',     // units=4 when tens>=2
  va:    'và',
  am:    'âm',
  dong:  'đồng',
  dola:  'đô la Mỹ',
  xu:    'xu',
  khong: 'không',
};

// ─── Vietnamese internals ────────────────────────────────────────────────────
function _vi2(n) {
  const d = Math.trunc(n / 10), u = n % 10;
  if (d === 0) return VI.digits[u];
  if (d === 1) {
    let r = VI.muoi;
    if (u === 5) r += ' ' + VI.lam;
    else if (u > 0) r += ' ' + VI.digits[u];
    return r;
  }
  let r = VI.digits[d] + ' ' + VI.muoix;
  if      (u === 0) { /* nothing */ }
  else if (u === 1) r += ' ' + VI.mot1;
  else if (u === 4) r += ' ' + VI.tu;
  else if (u === 5) r += ' ' + VI.lam;
  else              r += ' ' + VI.digits[u];
  return r;
}

function _vi3(n, coLe = false) {
  const h = Math.trunc(n / 100), d = Math.trunc((n % 100) / 10), u = n % 10;
  let r = '';
  if (h > 0)       r = VI.digits[h] + ' ' + VI.tram;
  else if (coLe)   r = VI.khong + ' ' + VI.tram;

  if (d === 0 && u > 0) {
    if (h > 0 || coLe) r += ' ' + VI.le + ' ' + VI.digits[u];
    else                r = VI.digits[u];
  } else if (d > 0 || u > 0) {
    if (r.length > 0) r += ' ';
    r += _vi2(d * 10 + u);
  }
  return r.trim();
}

function _viInt(num) {
  // num: integer (can be negative), max 999,999,999,999
  num = Number(num);
  if (isNaN(num) || !isFinite(num)) return '#ERROR: Not a number';
  let neg = false;
  if (num < 0) { neg = true; num = Math.abs(num); }
  num = Math.trunc(num);

  if (num === 0) {
    // FIX: capitalize 'không' for zero case
    const z = VI.khong;
    return z.charAt(0).toUpperCase() + z.slice(1);
  }
  if (num >= 1_000_000_000_000) return '#ERROR: Number too large (max 999 billion)';

  const ty     = Math.trunc(num / 1_000_000_000); num -= ty * 1_000_000_000;
  const trieu  = Math.trunc(num / 1_000_000);     num -= trieu * 1_000_000;
  const nghin  = Math.trunc(num / 1_000);
  const donvi  = Math.trunc(num - nghin * 1_000);

  let r = '';

  if (ty > 0) r = _vi3(ty, false) + ' ' + VI.ty;

  if (trieu > 0) {
    if (r) r += ' ';
    r += _vi3(trieu, ty > 0) + ' ' + VI.trieu;
  } else if (ty > 0 && (nghin > 0 || donvi > 0)) {
    r += ' ' + VI.khong + ' ' + VI.tram + ' ' + VI.trieu;
  }

  if (nghin > 0) {
    if (r) r += ' ';
    r += _vi3(nghin, ty > 0 || trieu > 0) + ' ' + VI.nghin;
  } else if ((ty > 0 || trieu > 0) && donvi > 0) {
    r += ' ' + VI.khong + ' ' + VI.tram + ' ' + VI.nghin;
  }

  if (donvi > 0) {
    if (r) r += ' ';
    r += _vi3(donvi, ty > 0 || trieu > 0 || nghin > 0);
  }

  if (neg) r = VI.am + ' ' + r;
  return r.length ? r.charAt(0).toUpperCase() + r.slice(1) : r;
}

// ─── English internals ───────────────────────────────────────────────────────
const EN_ONES = ['','one','two','three','four','five','six','seven','eight','nine',
                 'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen',
                 'seventeen','eighteen','nineteen'];
const EN_TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

function _en100(n) {
  if (n < 20) return EN_ONES[n];
  const t = EN_TENS[Math.trunc(n / 10)], u = n % 10;
  return u > 0 ? t + '-' + EN_ONES[u] : t;
}

function _en1000(n) {
  const h = Math.trunc(n / 100), rem = n % 100;
  if (h > 0) {
    let r = EN_ONES[h] + ' hundred';
    // Standard accounting English: "one hundred and thirty-four"
    if (rem > 0) r += ' and ' + _en100(rem);
    return r;
  }
  return _en100(rem);
}

function _enInt(num) {
  num = Number(num);
  if (isNaN(num) || !isFinite(num)) return '#ERROR: Not a number';
  let neg = false;
  if (num < 0) { neg = true; num = Math.abs(num); }
  num = Math.trunc(num);

  if (num === 0) return 'Zero';
  if (num >= 1_000_000_000_000) return '#ERROR: Number too large (max 999 billion)';

  const billions  = Math.trunc(num / 1_000_000_000); num -= billions * 1_000_000_000;
  const millions  = Math.trunc(num / 1_000_000);     num -= millions * 1_000_000;
  const thousands = Math.trunc(num / 1_000);
  const remainder = Math.trunc(num - thousands * 1_000);

  let r = '';
  if (billions > 0)  r = _en1000(billions) + ' billion';
  if (millions > 0)  { if (r) r += ' '; r += _en1000(millions) + ' million'; }
  if (thousands > 0) { if (r) r += ' '; r += _en1000(thousands) + ' thousand'; }
  if (remainder > 0) {
    if (r) {
      // FIX: English standard — use 'and' before remainder < 100
      // e.g. "one thousand two hundred AND thirty-four"
      // e.g. "one thousand AND fifty" (remainder < 100, no hundreds)
      if (remainder < 100) {
        r += ' and ' + _en1000(remainder);
      } else {
        r += ' ' + _en1000(remainder);
      }
    } else {
      r = _en1000(remainder);
    }
  }

  if (neg) r = 'negative ' + r;
  return r.length ? r.charAt(0).toUpperCase() + r.slice(1) : r;
}

// ─── Public API ──────────────────────────────────────────────────────────────
function _guard(v) {
  if (v === '' || v === null || v === undefined) return { empty: true };
  const n = Number(v);
  if (isNaN(n)) return { err: '#ERROR: Input is not a number' };
  return { n };
}

const Converter = {
  /** VND → Vietnamese words. Appends trailing period. */
  vndVi(number) {
    const g = _guard(number); if (g.empty) return ''; if (g.err) return g.err;
    const r = _viInt(Math.trunc(g.n));
    return (r && !r.startsWith('#')) ? r + ' ' + VI.dong + '.' : r;
  },

  /** VND → English words. */
  vndEn(number) {
    const g = _guard(number); if (g.empty) return ''; if (g.err) return g.err;
    const r = _enInt(Math.trunc(g.n));
    return (r && !r.startsWith('#')) ? r + ' Vietnamese dong.' : r;
  },

  /** USD → Vietnamese words. Fixed floating-point decimal handling. */
  usdVi(number) {
    const g = _guard(number); if (g.empty) return ''; if (g.err) return g.err;
    // FIXED: integer arithmetic avoids float precision loss
    const totalCents = Math.round(g.n * 100);
    const nguyen = Math.trunc(totalCents / 100);
    const le     = Math.abs(totalCents % 100);

    let r = _viInt(nguyen);
    if (!r || r.startsWith('#')) return r;
    r += ' ' + VI.dola;

    if (le > 0) {
      let leStr = _viInt(le);
      if (leStr && !leStr.startsWith('#')) {
        leStr = leStr.charAt(0).toLowerCase() + leStr.slice(1);
        r += ' ' + VI.va + ' ' + leStr + ' ' + VI.xu;
      }
    }
    return r + '.';
  },

  /** USD → English words. Fixed floating-point decimal handling. */
  usdEn(number) {
    const g = _guard(number); if (g.empty) return ''; if (g.err) return g.err;
    const totalCents = Math.round(g.n * 100);
    const intPart = Math.trunc(totalCents / 100);
    const cents   = Math.abs(totalCents % 100);

    const dollarUnit = intPart === 1 ? 'dollar' : 'dollars';
    const centUnit   = cents === 1  ? 'cent'   : 'cents';

    let r = _enInt(intPart);
    if (!r || r.startsWith('#')) return r;
    r += ' ' + dollarUnit;

    if (cents > 0) {
      let cStr = _enInt(cents);
      if (cStr && !cStr.startsWith('#')) {
        cStr = cStr.charAt(0).toLowerCase() + cStr.slice(1);
        r += ' and ' + cStr + ' ' + centUnit;
      }
    }
    return r + '.';
  },

  /** Number → Vietnamese (no currency). */
  soVi(number) {
    const g = _guard(number); if (g.empty) return ''; if (g.err) return g.err;
    return _viInt(g.n);
  },

  /** Number → English (no currency). */
  soEn(number) {
    const g = _guard(number); if (g.empty) return ''; if (g.err) return g.err;
    return _enInt(g.n);
  },
};

// Support both browser globals and Node.js (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Converter;
} else {
  window.Converter = Converter;
}
