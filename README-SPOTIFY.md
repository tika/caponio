# Spotify Now Playing Setup Guide

This guide will help you set up the Spotify "Now Playing" component using your Client ID and Client Secret.

## Prerequisites

- A Spotify app created at [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
- Your **Client ID** and **Client Secret** from the Spotify app

## Quick Setup (Recommended)

### Step 1: Configure Redirect URI

1. Go to your Spotify app settings: [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click "Edit Settings"
3. Add this Redirect URI: `http://localhost:3001/callback`
4. Save changes

### Step 2: Get Your Tokens

Run the helper script to get your access token:

```bash
CLIENT_ID=your_client_id CLIENT_SECRET=your_client_secret node scripts/get-spotify-token.js
```

Or create a `.env.local` file first:

```bash
# .env.local
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
```

Then run:
```bash
node scripts/get-spotify-token.js
```

The script will:
1. Open your browser for Spotify authorization
2. After you authorize, it will exchange the code for tokens
3. Display your tokens in the terminal

### Step 3: Add Tokens to Environment

Copy the tokens from the terminal output and add them to your `.env.local` file:

```bash
# .env.local
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
VITE_SPOTIFY_ACCESS_TOKEN=your_access_token_here
VITE_SPOTIFY_REFRESH_TOKEN=your_refresh_token_here  # Optional but recommended
```

### Step 4: Restart Your Dev Server

```bash
pnpm dev
```

The component will now automatically fetch and display your currently playing track!

## How It Works

### Access Token (Required)
- Used to authenticate API requests
- Expires after **1 hour**
- Must be refreshed periodically

### Refresh Token (Optional but Recommended)
- Used to get new access tokens automatically
- Doesn't expire (unless revoked)
- If you provide `VITE_SPOTIFY_REFRESH_TOKEN` along with `VITE_SPOTIFY_CLIENT_ID` and `VITE_SPOTIFY_CLIENT_SECRET`, the component will automatically refresh expired tokens

### Automatic Token Refresh

If you've set up all three environment variables:
- `VITE_SPOTIFY_CLIENT_ID`
- `VITE_SPOTIFY_CLIENT_SECRET`
- `VITE_SPOTIFY_REFRESH_TOKEN`

The component will automatically refresh expired access tokens using a secure server endpoint. This means you won't need to manually update your access token every hour!

## Manual Token Refresh (If Needed)

If your access token expires and you don't have a refresh token set up, you can:

1. Run the helper script again to get a new token
2. Or use Spotify's Web API Console: [https://developer.spotify.com/console/get-users-currently-playing-track/](https://developer.spotify.com/console/get-users-currently-playing-track/)

## Troubleshooting

### "Spotify access token not configured"
- Make sure `.env.local` exists and contains `VITE_SPOTIFY_ACCESS_TOKEN`
- Restart your dev server after adding environment variables

### "Invalid or expired access token"
- Your access token has expired (they last 1 hour)
- If you have a refresh token set up, it should refresh automatically
- Otherwise, run the helper script again to get a new token

### "Failed to fetch currently playing track"
- Make sure Spotify is playing on a device
- Check that you've authorized the required scopes (`user-read-currently-playing`, `user-read-playback-state`)

### Script won't open browser
- Manually visit the URL shown in the terminal
- Or check that port 3001 is available

## Security Notes

- **Never commit** `.env.local` to git (it's already in `.gitignore`)
- Keep your `CLIENT_SECRET` secure
- Access tokens expire after 1 hour for security
- Refresh tokens should be kept secret

## Alternative: Manual Token Method

If you prefer not to use the script, you can get a token manually:

1. Visit: `https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3001/callback&scope=user-read-currently-playing%20user-read-playback-state`
2. Replace `YOUR_CLIENT_ID` with your actual client ID
3. Authorize the app
4. Copy the `code` from the redirect URL
5. Exchange it for tokens using curl or Postman (see Spotify API docs)

The helper script automates this process for you!
