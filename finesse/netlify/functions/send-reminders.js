// netlify/functions/send-reminders.js
// Runs every morning at 9 AM UTC (set in netlify.toml).
// Reads the game schedule from games.json so it stays in sync automatically.
//
// Required environment variables (Netlify dashboard → Site → Environment variables):
//   TWILIO_ACCOUNT_SID   — from console.twilio.com
//   TWILIO_AUTH_TOKEN    — from console.twilio.com
//   TWILIO_FROM_NUMBER   — your Twilio number, e.g. +18455550100
//   RESEND_API_KEY       — from resend.com
//   RESEND_FROM_EMAIL    — verified sender, e.g. reminders@yourdomain.com

const { getStore } = require('@netlify/blobs');
const fs           = require('fs');
const path         = require('path');

// ── Load games from the single source of truth ────────────────────────────────
function loadGames() {
  // __dirname is netlify/functions/ — go up two levels to repo root
  const gamesPath = path.join(__dirname, '..', '..', 'games.json');
  return JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysUntil(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const game  = new Date(isoDate + 'T00:00:00');
  return Math.round((game - today) / 86_400_000);
}

async function sendText(to, body) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  const url  = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const res  = await fetch(url, {
    method:  'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({ To: to, From: TWILIO_FROM_NUMBER, Body: body }),
  });
  if (!res.ok) throw new Error(`Twilio: ${await res.text()}`);
}

async function sendEmail(to, subject, text) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend: ${await res.text()}`);
}

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = async () => {
  let games;
  try {
    games = loadGames();
  } catch (e) {
    console.error('Could not load games.json:', e.message);
    return { statusCode: 500, body: 'Could not load games.json' };
  }

  const store  = getStore('signups');
  const errors = [];

  for (const game of games) {
    // Skip games without a real isoDate yet
    if (!game.isoDate || game.isoDate === 'TBD') continue;

    const days = daysUntil(game.isoDate);
    if (days < 1) continue;

    let raw;
    try { raw = await store.get(`game-${game.id}`); } catch { continue; }
    if (!raw) continue;

    let signup;
    try { signup = JSON.parse(raw); } catch { continue; }

    if (String(days) !== String(signup.remindDays)) continue;

    const msg = `Hi ${signup.name}! Reminder: you signed up to bring the post-game snack for Finesse vs ${game.opponent} on ${game.isoDate}. Go Finesse! ⚽`;

    if ((signup.remindHow === 'text' || signup.remindHow === 'both') && signup.phone) {
      try   { await sendText(signup.phone, msg); }
      catch (e) { errors.push(`Text failed game ${game.id}: ${e.message}`); }
    }
    if ((signup.remindHow === 'email' || signup.remindHow === 'both') && signup.email) {
      try   { await sendEmail(signup.email, `Snack reminder: Finesse vs ${game.opponent} on ${game.isoDate}`, msg); }
      catch (e) { errors.push(`Email failed game ${game.id}: ${e.message}`); }
    }
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    return { statusCode: 500, body: errors.join('\n') };
  }
  return { statusCode: 200, body: 'Reminders processed.' };
};
