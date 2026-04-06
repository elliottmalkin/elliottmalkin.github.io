// netlify/functions/get-signups.js
// Returns all signups. editTokens are NEVER sent to the client —
// they are server-side secrets used only to authorize parent edits.
// On first load (empty store), seeds a demo signup so the display looks correct.

const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

const DEMO_GAME_ID = 4; // John Doe appears on game 4
const DEMO_KEY     = `game-${DEMO_GAME_ID}`;
const SEEDED_FLAG  = 'demo-seeded';

exports.handler = async () => {
  try {
    const store  = getStore('signups');

    // Seed demo signup once if store has never been written to
    const alreadySeeded = await store.get(SEEDED_FLAG).catch(() => null);
    if (!alreadySeeded) {
      await store.set(DEMO_KEY, JSON.stringify({
        gameId:    DEMO_GAME_ID,
        name:      'John Doe',
        phone:     '',
        email:     '',
        remindDays:'2',
        remindHow: 'text',
        editToken: crypto.randomBytes(32).toString('hex'),
      }));
      await store.set(SEEDED_FLAG, '1');
    }

    const listed = await store.list();
    const result = {};

    await Promise.all(
      listed.blobs.map(async ({ key }) => {
        // Skip internal flags
        if (key === SEEDED_FLAG) return;
        const raw = await store.get(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const { editToken, ...safe } = parsed; // strip token before sending
            result[parsed.gameId] = safe;
          } catch { /* skip malformed */ }
        }
      })
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error('get-signups error:', err);
    return { statusCode: 500, body: 'Internal server error' };
  }
};
