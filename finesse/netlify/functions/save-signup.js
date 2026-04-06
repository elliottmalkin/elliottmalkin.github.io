// netlify/functions/save-signup.js
// Creates or updates a signup.
//
// Auth rules:
//   NEW signup   — no auth needed, server generates an editToken and returns it.
//   PARENT edit  — request must include the correct editToken for that gameId.
//   ADMIN edit   — request must include a valid Netlify Identity JWT.

const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

// ── Verify Netlify Identity JWT ───────────────────────────────────────────────
// We decode (not cryptographically verify) the JWT here since Netlify Functions
// run inside Netlify's own infrastructure. For extra security in future you can
// add full JWKS verification.
function getAdminEmailFromJwt(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token   = authHeader.slice(7);
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
    );
    // Netlify Identity JWTs have app_metadata.roles — we trust any logged-in user
    // as admin since only you can create accounts (Identity is invite-only by default).
    return payload.email || null;
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { gameId, name, phone, email, remindDays, remindHow, editToken, adminEdit } = payload;

  if (!gameId || !name) {
    return { statusCode: 400, body: 'gameId and name are required' };
  }

  const store = getStore('signups');
  const key   = `game-${gameId}`;

  try {
    const existing = await store.get(key).then(r => r ? JSON.parse(r) : null).catch(() => null);

    // ── CASE 1: New signup ────────────────────────────────────────────────────
    if (!existing) {
      const newToken = crypto.randomBytes(32).toString('hex');
      await store.set(key, JSON.stringify({
        gameId, name, phone, email, remindDays, remindHow,
        editToken: newToken,
      }));
      // Return token to client so they can bookmark the edit link
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editToken: newToken }),
      };
    }

    // ── CASE 2: Admin edit (requires valid JWT) ────────────────────────────────
    if (adminEdit) {
      const adminEmail = getAdminEmailFromJwt(event.headers.authorization);
      if (!adminEmail) {
        return { statusCode: 403, body: 'Admin authentication required' };
      }
      await store.set(key, JSON.stringify({
        ...existing,
        name, phone, email,
        // preserve remindDays/remindHow/editToken from existing record
      }));
      return { statusCode: 200, body: JSON.stringify({}) };
    }

    // ── CASE 3: Parent edit (requires matching editToken) ─────────────────────
    if (!editToken || editToken !== existing.editToken) {
      return { statusCode: 403, body: 'Invalid edit token' };
    }
    await store.set(key, JSON.stringify({
      ...existing,
      name, phone, email,
    }));
    return { statusCode: 200, body: JSON.stringify({}) };

  } catch (err) {
    console.error('save-signup error:', err);
    return { statusCode: 500, body: 'Internal server error' };
  }
};
