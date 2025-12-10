import { createServerFn } from "@tanstack/react-start";

/**
 * Server endpoint to refresh Spotify access token using refresh token
 * This keeps the client secret secure on the server side
 */
export const refreshSpotifyToken = createServerFn({
	method: "POST",
}).handler(async () => {
	const clientId = process.env.VITE_SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.VITE_SPOTIFY_CLIENT_SECRET;
	const refreshToken = process.env.VITE_SPOTIFY_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		return {
			error: "Missing Spotify credentials",
		};
	}

	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			return {
				error: `Failed to refresh token: ${errorText}`,
			};
		}

		const data = await response.json();
		return {
			access_token: data.access_token,
			expires_in: data.expires_in,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
});
