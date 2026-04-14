/**
 * server.js — DocSoThanhChu AI Dev Server
 * Serves the add-in over HTTPS on localhost:3000
 * Required for Office.js (Excel requires HTTPS for add-ins)
 *
 * Usage: node server.js
 */
'use strict';

const express  = require('express');
const https    = require('https');
const path     = require('path');
const devCerts = require('office-addin-dev-certs');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname);

async function main() {
  let server;

  try {
    const certs = await devCerts.getHttpsServerOptions();
    const app   = express();

    // Serve static files from web-addin root
    app.use(express.static(ROOT));

    // CORS for Office.js
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    server = https.createServer({ ca: certs.ca, pfx: certs.pfx }, app);
    server.listen(PORT, () => {
      console.log('\n╔══════════════════════════════════════════╗');
      console.log('║   DocSoThanhChu AI — Dev Server Ready    ║');
      console.log('╠══════════════════════════════════════════╣');
      console.log(`║  URL:  https://localhost:${PORT}             ║`);
      console.log('║  Next: sideload manifest.xml into Excel  ║');
      console.log('╚══════════════════════════════════════════╝\n');
    });
  } catch (e) {
    // Fallback: HTTP (won't work with Office, but useful for UI preview)
    console.warn('[WARN] Could not create HTTPS server:', e.message);
    console.warn('[WARN] Falling back to HTTP (not suitable for Office.js)');
    const app = express();
    app.use(express.static(ROOT));
    server = app.listen(PORT, () => {
      console.log(`DocSo running at http://localhost:${PORT} (HTTP only — not suitable for Office.js)`);
    });
  }
}

main();
