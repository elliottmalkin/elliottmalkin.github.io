// netlify/functions/delete-signup.js
// Removes a signup.
//
// Auth rules:
//   PARENT delete — request must include the correct editToken for that gameId.
//   ADMIN delete  — request must include a valid Netlify Identity JWT.

const { getStore } = require('@netlify/blobs');

function getAdminEmailFromJwt(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token   = authHeader.slice(7);
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
    );
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

  const { gameId, editToken, adminEdit } = payload;
  if (!gameId) return { statusCode: 400, body: 'gameId is required' };

  const store = getStore('signups');
  const key   = `game-${gameId}`;

  try {
    // Admin path
    if (adminEdit) {
      const adminEmail = getAdminEmailFromJwt(event.headers.authorization);
      if (!adminEmail) return { statusCode: 403, body: 'Admin authentication required' };
      await store.delete(key);
      return { statusCode: 200, body: JSON.stringify({}) };
    }

    // Parent path — verify token
    const existing = await store.get(key).then(r => r ? JSON.parse(r) : null).catch(() => null);
    if (!existing)                              return { statusCode: 404, body: 'Signup not found' };
    if (!editToken || editToken !== existing.editToken) {
      return { statusCode: 403, body: 'Invalid edit token' };
    }

    await store.delete(key);
    return { statusCode: 200, body: JSON.stringify({}) };

  } catch (err) {
    console.error('delete-signup error:', err);
    return { statusCode: 500, body: 'Internal server error' };
  }
};
