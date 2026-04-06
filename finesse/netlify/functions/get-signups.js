// netlify/functions/get-signups.js
// Returns all signups. editTokens are NEVER sent to the client —
// they are server-side secrets used only to authorize parent edits.

const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  try {
    const store  = getStore('signups');
    const listed = await store.list();
    const result = {};

    await Promise.all(
      listed.blobs.map(async ({ key }) => {
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
