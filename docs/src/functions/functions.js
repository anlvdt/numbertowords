/**
 * functions.js — DocSoThanhChu v2.0
 * Office.js Custom Functions — registered via CustomFunctions.associate()
 *
 * Namespace: DOCSO (set in manifest.xml)
 * Usage in Excel: =DOCSO.VND_VI(A1), =DOCSO.AI_SO(A1,"vi","vnd")
 */
/* global CustomFunctions, Converter, AIClient */
'use strict';

// ─── Rule-based functions ────────────────────────────────────────────────────

/**
 * Đọc số tiền VND thành chữ tiếng Việt.
 * @customfunction
 * @param {number} number Số tiền VND
 * @returns {string}
 */
function VND_VI(number) {
  return Converter.vndVi(number);
}

/**
 * Convert VND amount to English words.
 * @customfunction
 * @param {number} number VND amount
 * @returns {string}
 */
function VND_EN(number) {
  return Converter.vndEn(number);
}

/**
 * Đọc số tiền USD thành chữ tiếng Việt.
 * @customfunction
 * @param {number} number Số tiền USD (hỗ trợ 2 chữ số thập phân)
 * @returns {string}
 */
function USD_VI(number) {
  return Converter.usdVi(number);
}

/**
 * Convert USD amount to English words.
 * @customfunction
 * @param {number} number USD amount (up to 2 decimal places)
 * @returns {string}
 */
function USD_EN(number) {
  return Converter.usdEn(number);
}

/**
 * Đọc số nguyên thành chữ tiếng Việt (không có đơn vị tiền).
 * @customfunction
 * @param {number} number Số cần đọc
 * @returns {string}
 */
function SO_VI(number) {
  return Converter.soVi(number);
}

/**
 * Convert a number to English words (no currency).
 * @customfunction
 * @param {number} number Number to convert
 * @returns {string}
 */
function SO_EN(number) {
  return Converter.soEn(number);
}

/**
 * AI-powered number-to-words using Groq Llama-3.
 * Falls back to rule-based if API key is not configured.
 * Configure API key in the DocSo Task Pane (Insert → Add-ins → DocSoThanhChu).
 * @customfunction
 * @param {number} number Số cần đọc
 * @param {string} [lang] Ngôn ngữ: "vi" (mặc định) hoặc "en"
 * @param {string} [currency] Loại: "vnd" (mặc định), "usd", "number"
 * @returns {Promise<string>}
 */
async function AI_SO(number, lang, currency) {
  return await AIClient.convert(number, lang || 'vi', currency || 'vnd');
}

// ─── Register all functions ───────────────────────────────────────────────────
CustomFunctions.associate('VND_VI', VND_VI);
CustomFunctions.associate('VND_EN', VND_EN);
CustomFunctions.associate('USD_VI', USD_VI);
CustomFunctions.associate('USD_EN', USD_EN);
CustomFunctions.associate('SO_VI',  SO_VI);
CustomFunctions.associate('SO_EN',  SO_EN);
CustomFunctions.associate('AI_SO',  AI_SO);
