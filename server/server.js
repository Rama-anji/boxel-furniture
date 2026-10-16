import { env, assertConfig } from './config/env.js';
import { checkDatabase, pool } from './config/db.js';
import { verifySmtp } from './services/emailService.js';
import { createApp } from './app.js';

assertConfig();

// Wait for MySQL instead of exiting, so `npm run dev` survives MySQL starting late or restarting.
for (let attempt = 1; ; attempt += 1) {
  try {
    const version = await checkDatabase();
    console.log(`[db] Connected to ${env.db.database} on ${env.db.host}:${env.db.port} (${version})`);
    break;
  } catch (err) {
    if (err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`[db] ${err.message}`);
      console.error('[db] Check DB_NAME / DB_USER / DB_PASSWORD in server/.env and that database/schema.sql was imported.');
      process.exit(1);
    }
    if (attempt === 1) {
      console.warn(`[db] MySQL is not reachable at ${env.db.host}:${env.db.port} (${err.code || err.message}).`);
      console.warn('[db] Start MySQL in the XAMPP Control Panel — waiting and retrying every 5 seconds...');
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
}

const app = createApp();
const server = app.listen(env.port, () => {
  console.log(`[api] boxel API listening on ${env.apiUrl} (${env.nodeEnv})`);
  verifySmtp();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error(`[api] Port ${env.port} is already in use. Stop the other process or change PORT in server/.env.`);
  else console.error('[api]', err);
  process.exit(1);
});

const shutdown = () => {
  server.close(() => pool.end().finally(() => process.exit(0)));
  setTimeout(() => process.exit(0), 5000).unref();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
