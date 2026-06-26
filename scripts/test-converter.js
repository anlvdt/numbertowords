#!/usr/bin/env node
/**
 * test-converter.js — Smoke tests for rule-based converter engine
 * Run: node scripts/test-converter.js
 */
'use strict';

const C = require('../web-addin/src/core/converter.js');

const CASES = [
  { fn: 'vndVi', input: 1234567, expect: 'Một triệu hai trăm ba mươi tư nghìn' },
  { fn: 'vndEn', input: 1000000, expect: 'One million Vietnamese dong.' },
  { fn: 'usdVi', input: 1234.56, expect: 'đô la Mỹ và năm mươi sáu xu.' },
  { fn: 'usdEn', input: 1234.56, expect: 'dollars and fifty-six cents.' },
  { fn: 'vndVi', input: -500000, expect: 'Âm năm trăm nghìn đồng.' },
  { fn: 'soVi', input: 101, expect: 'Một trăm lẻ một' },
  { fn: 'soVi', input: 0, expect: 'Không' },
  { fn: 'soEn', input: 21, expect: 'Twenty-one' },
  { fn: 'vndVi', input: 'abc', expect: '#ERROR' },
];

let passed = 0;
let failed = 0;

for (const { fn, input, expect } of CASES) {
  const result = C[fn](input);
  const ok = result.includes(expect);
  if (ok) {
    passed++;
    console.log(`  PASS  ${fn}(${input})`);
  } else {
    failed++;
    console.error(`  FAIL  ${fn}(${input})`);
    console.error(`        expected substring: "${expect}"`);
    console.error(`        got: "${result}"`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
