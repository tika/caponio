#!/usr/bin/env node

/**
 * Spotify Token Helper Script
 *
 * This script helps you get a Spotify access token using the Authorization Code Flow.
 *
 * Steps:
 * 1. Set up a Spotify app at https://developer.spotify.com/dashboard
 * 2. Add a redirect URI: http://localhost:3000/callback (or your preferred port)
 * 3. Run this script with your CLIENT_ID and CLIENT_SECRET
 *
 * Usage:
 *   CLIENT_ID=your_client_id CLIENT_SECRET=your_client_secret node scripts/get-spotify-token.js
 *
 * Or create a .env.local file with:
 *   VITE_SPOTIFY_CLIENT_ID=your_client_id
 *   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
 */

import { createServer } from 'http';
import { URL } from 'url';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local if it exists
let envVars = {};
try {
  const envFile = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8');
  envVars = Object.fromEntries(
    envFile.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => {
        const [key, ...valueParts] = line.split('=');
        return [key.trim(), valueParts.join('=').trim()];
      })
  );
} catch {
  // .env.local doesn't exist, that's okay
}

const CLIENT_ID = process.env.CLIENT_ID || process.env.VITE_SPOTIFY_CLIENT_ID || envVars.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET || process.env.VITE_SPOTIFY_CLIENT_SECRET || envVars.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/callback';
const PORT = 3001;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ Error: CLIENT_ID and CLIENT_SECRET are required!\n');
  console.log('Usage:');
  console.log('  CLIENT_ID=your_id CLIENT_SECRET=your_secret node scripts/get-spotify-token.js\n');
  console.log('Or create a .env.local file with:');
  console.log('  VITE_SPOTIFY_CLIENT_ID=your_client_id');
  console.log('  VITE_SPOTIFY_CLIENT_SECRET=your_client_secret\n');
  process.exit(1);
}

// Scopes needed for reading currently playing track
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
].join(' ');

const AUTH_URL = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  response_type: 'code',
  client_id: CLIENT_ID,
  scope: SCOPES,
  redirect_uri: REDIRECT_URI,
  show_dialog: 'false',
}).toString()}`;

console.log('\n🎵 Spotify Token Helper\n');
console.log('1. Opening browser for authorization...');
console.log('2. After authorizing, you\'ll be redirected back here.');
console.log('3. Your tokens will be displayed below.\n');

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body style="font-family: monospace; padding: 20px;">
            <h1>❌ Authorization Error</h1>
            <p>Error: ${error}</p>
            <p>Please try again.</p>
          </body>
        </html>
      `);
      server.close();
      return;
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<html><body>No authorization code received.</body></html>');
      server.close();
      return;
    }

    try {
      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const tokens = await tokenResponse.json();

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body style="font-family: monospace; padding: 20px; background: #1a1a1a; color: #fff;">
            <h1>✅ Success!</h1>
            <p>Your tokens have been generated. Check the terminal for details.</p>
            <p style="margin-top: 20px; color: #888;">You can close this window.</p>
          </body>
        </html>
      `);

      console.log('\n✅ Tokens received!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n📋 Add these to your .env.local file:\n');
      console.log(`VITE_SPOTIFY_ACCESS_TOKEN=${tokens.access_token}`);
      if (tokens.refresh_token) {
        console.log(`VITE_SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}`);
      }
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  Note: Access tokens expire after 1 hour.');
      if (tokens.refresh_token) {
        console.log('💡 You can use the refresh token to get new access tokens automatically.');
      }
      console.log('\n');

      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ Error:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<html><body>Error: ${err.message}</body></html>`);
      server.close();
      process.exit(1);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🌐 Server started on http://localhost:${PORT}`);
  console.log(`\n🔗 Opening browser...\n`);

  // Open browser (works on macOS, Linux, Windows)
  import('child_process').then(({ exec }) => {
    const command = process.platform === 'win32'
      ? `start ${AUTH_URL}`
      : process.platform === 'darwin'
      ? `open "${AUTH_URL}"`
      : `xdg-open "${AUTH_URL}"`;

    exec(command, (error) => {
      if (error) {
        console.log(`\n⚠️  Could not open browser automatically.`);
        console.log(`\nPlease visit this URL manually:\n`);
        console.log(AUTH_URL);
        console.log('\n');
      }
    });
  }).catch(() => {
    console.log(`\n⚠️  Could not open browser automatically.`);
    console.log(`\nPlease visit this URL manually:\n`);
    console.log(AUTH_URL);
    console.log('\n');
  });
});
