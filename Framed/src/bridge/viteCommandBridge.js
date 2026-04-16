// Vite plugin that adds API routes for the Claude Code <-> Framed command bridge.
// Runs server-side (Node.js) inside the Vite dev server.

import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';
import { handleCommand } from './commandHandlers.js';

const FRAMED_DIR = resolve(process.cwd(), '.framed');
const COMMANDS_DIR = join(FRAMED_DIR, 'commands');
const RESPONSES_DIR = join(FRAMED_DIR, 'responses');
const STATE_DIR = join(FRAMED_DIR, 'state');

function ensureDirs() {
  for (const dir of [FRAMED_DIR, COMMANDS_DIR, RESPONSES_DIR, STATE_DIR]) {
    mkdirSync(dir, { recursive: true });
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

export default function commandBridge() {
  return {
    name: 'framed-command-bridge',

    configureServer(server) {
      ensureDirs();

      // GET /api/state — Return current state from .framed/state/
      server.middlewares.use('/api/state', (req, res, next) => {
        if (req.method !== 'GET') return next();
        const state = {};
        for (const file of ['blocks.json', 'flow.json', 'app_index.json', 'relationships.json']) {
          const p = join(STATE_DIR, file);
          if (existsSync(p)) {
            try { state[file.replace('.json', '')] = JSON.parse(readFileSync(p, 'utf-8')); } catch {}
          }
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(state));
      });

      // POST /api/state/sync — Client pushes state for export
      server.middlewares.use('/api/state/sync', (req, res, next) => {
        if (req.method !== 'POST') return next();
        parseBody(req).then((data) => {
          if (data.blocks) writeFileSync(join(STATE_DIR, 'blocks.json'), JSON.stringify(data.blocks, null, 2));
          if (data.flow) writeFileSync(join(STATE_DIR, 'flow.json'), JSON.stringify(data.flow, null, 2));
          if (data.appIndex) writeFileSync(join(STATE_DIR, 'app_index.json'), JSON.stringify(data.appIndex, null, 2));
          if (data.relationships) writeFileSync(join(STATE_DIR, 'relationships.json'), JSON.stringify(data.relationships, null, 2));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok' }));
        }).catch((err) => {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        });
      });

      // POST /api/command — Accept a command from Claude Code
      server.middlewares.use('/api/command', (req, res, next) => {
        if (req.method !== 'POST') return next();
        parseBody(req).then((command) => {
          const id = `${Date.now()}_${command.type || 'unknown'}`;
          const cmd = { id, timestamp: Date.now(), ...command };

          // Try to handle server-side first (read-only commands)
          const result = handleCommand(cmd, STATE_DIR);

          if (result.status === 'completed' || result.status === 'error') {
            // Handled server-side, write response directly
            const response = { id, ...result, timestamp: Date.now() };
            writeFileSync(join(RESPONSES_DIR, `${id}.json`), JSON.stringify(response, null, 2));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          } else {
            // Queue for client-side execution
            writeFileSync(join(COMMANDS_DIR, `${id}.json`), JSON.stringify(cmd, null, 2));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ id, status: 'queued' }));
          }
        }).catch((err) => {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        });
      });

      // GET /api/commands/pending — List unprocessed commands
      server.middlewares.use('/api/commands/pending', (req, res, next) => {
        if (req.method !== 'GET') return next();
        try {
          const files = readdirSync(COMMANDS_DIR).filter((f) => f.endsWith('.json'));
          const commands = files.map((f) => {
            try { return JSON.parse(readFileSync(join(COMMANDS_DIR, f), 'utf-8')); } catch { return null; }
          }).filter(Boolean);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(commands));
        } catch {
          res.setHeader('Content-Type', 'application/json');
          res.end('[]');
        }
      });

      // POST /api/commands/:id/complete — Mark command as processed
      server.middlewares.use((req, res, next) => {
        const match = req.url.match(/^\/api\/commands\/(.+)\/complete$/);
        if (!match || req.method !== 'POST') return next();
        const id = decodeURIComponent(match[1]);

        parseBody(req).then((result) => {
          // Write response
          const response = { id, status: 'completed', timestamp: Date.now(), result };
          writeFileSync(join(RESPONSES_DIR, `${id}.json`), JSON.stringify(response, null, 2));

          // Remove from pending
          const cmdFile = join(COMMANDS_DIR, `${id}.json`);
          if (existsSync(cmdFile)) {
            try { unlinkSync(cmdFile); } catch {}
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok' }));
        }).catch((err) => {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        });
      });

      console.log('\n  Command Bridge active:');
      console.log('    GET  /api/state');
      console.log('    POST /api/state/sync');
      console.log('    POST /api/command');
      console.log('    GET  /api/commands/pending');
      console.log('');
    },
  };
}
