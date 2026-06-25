#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const ANKICONNECT_URL = process.env.ANKICONNECT_URL || 'http://127.0.0.1:8765';
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

// AnkiConnect has no concept of "is the answer currently shown" — we're the
// only thing driving the review screen, so we track it ourselves per card.
let lastCardId = null;
let answerShown = false;

async function ankiConnect(action, params = {}) {
  const res = await fetch(ANKICONNECT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, version: 6, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function getState() {
  let card;
  try {
    card = await ankiConnect('guiCurrentCard');
  } catch (err) {
    return { reviewing: false, error: err.message };
  }
  if (!card) return { reviewing: false };

  if (card.cardId !== lastCardId) {
    lastCardId = card.cardId;
    answerShown = false;
  }

  return {
    reviewing: true,
    cardId: card.cardId,
    buttons: card.buttons || [1, 2, 3, 4],
    nextReviews: card.nextReviews || [],
    answerShown,
  };
}

function sendJSON(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function readJSONBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const fullPath = path.normalize(path.join(PUBLIC_DIR, reqPath));
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url.split('?')[0];

    if (url === '/api/state' && req.method === 'GET') {
      return sendJSON(res, 200, await getState());
    }

    if (url === '/api/show-answer' && req.method === 'POST') {
      await ankiConnect('guiShowAnswer');
      answerShown = true;
      return sendJSON(res, 200, await getState());
    }

    if (url === '/api/answer' && req.method === 'POST') {
      const body = await readJSONBody(req);
      const ease = Number(body.ease);
      if (![1, 2, 3, 4].includes(ease)) {
        return sendJSON(res, 400, { error: 'ease must be 1-4' });
      }
      await ankiConnect('guiAnswerCard', { ease });
      return sendJSON(res, 200, await getState());
    }

    if (url === '/api/undo' && req.method === 'POST') {
      await ankiConnect('guiUndo');
      return sendJSON(res, 200, await getState());
    }

    if (url === '/api/ping' && req.method === 'GET') {
      try {
        const version = await ankiConnect('version');
        return sendJSON(res, 200, { ok: true, version });
      } catch (err) {
        return sendJSON(res, 200, { ok: false, error: err.message });
      }
    }

    if (req.method === 'GET') {
      return serveStatic(req, res);
    }

    res.writeHead(404);
    res.end('Not found');
  } catch (err) {
    sendJSON(res, 500, { error: err.message });
  }
});

function getLocalIPs() {
  const ifaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) ips.push(iface.address);
    }
  }
  return ips;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('\nAnki Remote server running.\n');
  console.log(`On this computer:  http://localhost:${PORT}`);
  for (const ip of getLocalIPs()) {
    console.log(`On your phone:     http://${ip}:${PORT}`);
  }
  console.log('\nMake sure Anki is open with the AnkiConnect addon installed.\n');
});
