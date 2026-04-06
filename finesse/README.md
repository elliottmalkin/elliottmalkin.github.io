# Finesse ⚽ — Post-Game Snack Signup

## How authentication works

### You (Admin) — GitHub via Netlify Identity
- A small **Admin** link lives in the page footer.
- Clicking it opens the Netlify Identity widget where you log in with GitHub OAuth.
- Once logged in, every claimed game card shows an **Edit / Remove** button visible only to you.
- A green admin bar appears at the bottom of the screen confirming you're in admin mode.
- Your session persists until you sign out.

### Parents — Private edit link (no account needed)
- Parents sign up normally — no login required.
- After claiming a game, they are shown a **private edit link** (e.g. `https://yoursite.netlify.app?edit=a3f9b2...`).
- They should bookmark or copy this link. Visiting it later automatically opens their edit/remove dialog.
- The secret token in the link is stored server-side only — it is **never** sent back in the public games list.
- If a parent loses their link, you can edit or remove their signup as admin.

---

## File structure

```
finesse-snacks/
├── index.html
├── netlify.toml
├── package.json
├── README.md
└── netlify/
    └── functions/
        ├── get-signups.js       ← Public: returns signups (tokens stripped)
        ├── save-signup.js       ← Auth-gated: new / parent-token / admin-JWT
        ├── delete-signup.js     ← Auth-gated: parent-token or admin-JWT
        └── send-reminders.js    ← Scheduled daily at 9 AM UTC
```

---

## Deployment steps

### 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Finesse snack signup v2"
git remote add origin https://github.com/YOUR_USERNAME/finesse-snacks.git
git branch -M main
git push -u origin main
```

### 2 — Connect to Netlify
1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import from GitHub**
2. Select your `finesse-snacks` repo
3. Build settings are auto-detected — click **Deploy site**

### 3 — Enable Netlify Identity
1. In Netlify dashboard: **Site → Identity → Enable Identity**
2. Under **Registration**: set to **Invite only** (so only you can have an admin account)
3. Under **External providers**: click **GitHub → Enable**
4. Click **Invite users** and invite your own email address
5. You'll receive an invite email — accept it to create your account

### 4 — Add your admin account via GitHub
- Visit your live site, click **Admin** in the footer
- The Netlify Identity widget opens — click **Continue with GitHub**
- Authorize and you're in

### 5 — Add environment variables (for reminders)
Netlify dashboard → **Site → Site configuration → Environment variables**

| Variable             | Where to get it |
|----------------------|-----------------|
| `TWILIO_ACCOUNT_SID` | [console.twilio.com](https://console.twilio.com) |
| `TWILIO_AUTH_TOKEN`  | Same page |
| `TWILIO_FROM_NUMBER` | Twilio → Phone Numbers (e.g. `+18455550100`) |
| `RESEND_API_KEY`     | [resend.com](https://resend.com) → API Keys |
| `RESEND_FROM_EMAIL`  | A verified sender in Resend |

After adding variables, trigger a redeploy: **Deploys → Trigger deploy**.

---

## Updating the schedule

Edit the `GAMES` array in `index.html` **and** the matching array in
`netlify/functions/send-reminders.js`, then push:

```bash
git add .
git commit -m "Update schedule"
git push
```

---

## Notes

- The daily reminder cron runs at **9:00 AM UTC** (5 AM Eastern). Change the
  `schedule` line in `netlify.toml` if you prefer a different time.
- Twilio and Resend are both free for a 12-game season at typical usage levels.
- The Netlify Identity free tier supports up to 1,000 users — more than enough.
