#!/usr/bin/env node
'use strict';

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

// Minimal DOM shim for shared.js load in Node
global.window = global;
global.document = { getElementById: () => null };

// Load converter then shared
require('../docs/converter.js');
require('../docs/js/shared.js');

const S = global.DocSoShared;

const parseCases = [
  ['1234567', 1234567],
  ['1.234.567', 1234567],
  ['1.234.567,89', 1234567.89],
  ['1,234,567.89', 1234567.89],
  ['-500000', -500000],
  ['', NaN],
  ['abc', NaN],
];

parseCases.forEach(([input, expected]) => {
  const got = S.parseLocaleNumber(input);
  const ok = (isNaN(expected) && isNaN(got)) || got === expected;
  assert(ok, `parseLocaleNumber("${input}") = ${got}, expected ${expected}`);
  console.log(`  PASS  parse "${input}" → ${got}`);
});

console.log('\nShared tests passed');
