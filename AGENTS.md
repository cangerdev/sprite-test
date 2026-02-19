# Running a Wasp App on Sprite

## Overview

This app runs as a persistent Sprite service. The Wasp dev server has two processes:
- **Client** (Vite) on port 3000 — this is the HTTP port exposed via the Sprite proxy
- **Server** (Express/Node) on port 3001 — internal only, not directly accessible from the browser

## Service Management

The app runs as a Sprite service named `wasp-app`, managed via `sprite-env`:

```bash
sprite-env services list
sprite-env services start wasp-app
sprite-env services stop wasp-app
sprite-env services restart wasp-app   # note: use stop + start if restart errors
```

Logs are at: `/.sprite/logs/services/wasp-app.log`

## Key Configuration

### vite.config.ts
Two things are required for the app to work on Sprite:

1. **`allowedHosts`** — Vite blocks requests from unknown hosts by default. Add the Sprite domain:
2. **`server.proxy`** — The browser can only reach port 3000 (Vite). API calls to `/auth`, `/operations`, etc. must be proxied through Vite to the Express server on port 3001.

```ts
server: {
  allowedHosts: ['<your-sprite-name>.sprites.app'],
  proxy: {
    '/auth': 'http://localhost:3001',
    '/operations': 'http://localhost:3001',
    '/jobs': 'http://localhost:3001',
  },
},
```

### .env.client
Tell the Wasp client to send API requests to the public Sprite URL (not `localhost:3001`, which is unreachable from the browser):

```
REACT_APP_API_URL=https://<your-sprite-name>.sprites.app
```

## Email Verification in Development

Set this in `.env.server` to skip email verification entirely in dev:

```
SKIP_EMAIL_VERIFICATION_IN_DEV=true
```

If you need to test the verification flow, the app uses `provider: Dummy` for email in `main.wasp`, which prints emails to the server log instead of sending them. To find a verification link:

```bash
grep -i "verify\|token\|email-verification" /.sprite/logs/services/wasp-app.log
```

The link will use `localhost:3000` — replace with the Sprite domain to use it from your browser:
```
https://<your-sprite-name>.sprites.app/email-verification?token=<token>
```

## Public URL

Every Sprite gets a URL at `https://<name>.sprites.app`. By default it requires authentication (private). To make the app publicly accessible:

```bash
# Check current URL and auth mode
sprite url

# Make public (no auth required)
sprite url update --auth public

# Restore private access
sprite url update --auth default
```

Note: `sprite` is an external CLI run outside the VM, not inside it.

## Checkpoints

Create checkpoints when the app is in a working state:

```bash
sprite-env checkpoints create "description of what's working"
```
