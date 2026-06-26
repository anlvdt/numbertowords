/**
 * ai-client.js — DocSoThanhChu v2.0
 * Groq API integration (llama-3.1-8b-instant — 14,400 req/day FREE)
 * OpenAI-compatible endpoint, no credit card required.
 *
 * API key: stored in localStorage['docso_groq_key'] — never hardcoded.
 * Fallback: nếu API fail hoặc chưa có key → rule-based engine.
 */
'use strict';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = 'llama-3.1-8b-instant'; // 14,400 req/day free

// System prompt: force deterministic, standard VN accounting output
const SYSTEM_PROMPT =
  'Bạn là chuyên gia kế toán Việt Nam. Nhiệm vụ: đọc số thành chữ theo đúng chuẩn.\n' +
  'Quy tắc bắt buộc:\n' +
  '- Dùng "nghìn" (KHÔNG dùng "ngàn")\n' +
  '- Số 10–19: "mười một", "mười hai", ...\n' +
  '- Hàng chục ≥ 2: "hai mươi", "ba mươi", ...\n' +
  '- Đơn vị=1 khi chục≥2: "mốt" (hai mươi mốt)\n' +
  '- Đơn vị=4 khi chục≥2: "tư" (hai mươi tư)\n' +
  '- Đơn vị=5 khi chục≥1: "lăm" (mười lăm, hai mươi lăm)\n' +
  '- Chục=0, đơn vị>0: "lẻ" (một trăm lẻ một)\n' +
  'Chỉ trả lời kết quả, KHÔNG giải thích, KHÔNG markdown.';

const USER_TEMPLATES = {
  vi_vnd:    (n) => `Đọc số tiền VND: ${n}. Viết hoa chữ đầu, kết thúc bằng " đồng."`,
  en_vnd:    (n) => `Convert VND amount ${n} to English words. End with " Vietnamese dong." Capitalize first letter.`,
  vi_usd:    (n) => `Đọc số tiền USD: ${n}. Phần nguyên: "đô la Mỹ", phần lẻ (2 chữ số): "xu", nối bằng "và". Kết thúc bằng dấu chấm.`,
  en_usd:    (n) => `Convert USD amount ${n} to English words. Use dollar/dollars and cent/cents. Connect with "and". End with period.`,
  vi_number: (n) => `Đọc số ${n} thành chữ tiếng Việt, không có đơn vị tiền. Viết hoa chữ đầu.`,
  en_number: (n) => `Convert number ${n} to English words, no currency. Capitalize first letter.`,
};

const AIClient = {
  /** Get Groq API key from localStorage */
  getKey() {
    try { return localStorage.getItem('docso_groq_key') || ''; }
    catch { return ''; }
  },

  /** Save key */
  setKey(key) {
    try { localStorage.setItem('docso_groq_key', key.trim()); }
    catch { /* ignore in non-browser context */ }
  },

  /** Check if configured */
  isReady() {
    const k = this.getKey();
    return k.startsWith('gsk_') && k.length > 20;
  },

  /**
   * Convert number to words via Groq API.
   * Falls back to Converter (rule-based) on any error.
   *
   * @param {number} number
   * @param {'vi'|'en'} lang
   * @param {'vnd'|'usd'|'number'} currency
   * @returns {Promise<string>}
   */
  async convert(number, lang = 'vi', currency = 'vnd') {
    const apiKey = this.getKey();

    // No key → rule-based
    if (!apiKey) {
      return this._fallback(number, lang, currency) + ' [Offline]';
    }

    const templateKey = `${lang}_${currency}`;
    const templateFn  = USER_TEMPLATES[templateKey];
    if (!templateFn) {
      return this._fallback(number, lang, currency) + ' [Offline]';
    }

    const userMsg = templateFn(number);

    try {
      const resp = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user',   content: userMsg },
          ],
          temperature:  0.05,  // near-deterministic
          max_tokens:   200,
          stream:       false,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        const msg = err?.error?.message || `HTTP ${resp.status}`;
        // 429 = rate limit → fallback silently
        return this._fallback(number, lang, currency) + ` [Offline: ${msg}]`;
      }

      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (!text) return this._fallback(number, lang, currency) + ' [Offline]';

      // Strip any markdown artifacts
      return text.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim() + ' [AI]';
    } catch (e) {
      return this._fallback(number, lang, currency) + ` [Offline: ${e.message}]`;
    }
  },

  _fallback(number, lang, currency) {
    if (typeof Converter === 'undefined') return '#ERROR: Converter not loaded';
    switch (`${lang}_${currency}`) {
      case 'vi_vnd':    return Converter.vndVi(number);
      case 'en_vnd':    return Converter.vndEn(number);
      case 'vi_usd':    return Converter.usdVi(number);
      case 'en_usd':    return Converter.usdEn(number);
      case 'vi_number': return Converter.soVi(number);
      case 'en_number': return Converter.soEn(number);
      default:          return Converter.vndVi(number);
    }
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIClient;
} else {
  window.AIClient = AIClient;
}
