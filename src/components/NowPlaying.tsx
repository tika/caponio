import { useCallback, useEffect, useState } from "react";
import { refreshSpotifyToken } from "@/routes/api/spotify/refresh";

interface SpotifyTrack {
	name: string;
	artists: Array<{ name: string }>;
	album: {
		name: string;
		images: Array<{ url: string; height: number; width: number }>;
	};
}

interface CurrentlyPlayingResponse {
	is_playing: boolean;
	item: SpotifyTrack | null;
}

export function NowPlaying() {
	const [track, setTrack] = useState<SpotifyTrack | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(
		import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN || null,
	);

	// Function to refresh token if available
	const refreshTokenIfNeeded = useCallback(async () => {
		// Only try to refresh if we have a refresh token endpoint configured
		// (which means CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN are set server-side)
		try {
			const result = await refreshSpotifyToken();
			if (result.access_token) {
				setAccessToken(result.access_token);
				return result.access_token;
			}
		} catch {
			// Refresh endpoint not available or failed, that's okay
		}
		return null;
	}, []);

	const fetchCurrentlyPlaying = useCallback(async () => {
		let token = accessToken;

		// If no token, try to refresh
		if (!token) {
			token = await refreshTokenIfNeeded();
		}

		if (!token) {
			setError("Spotify access token not configured");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				"https://api.spotify.com/v1/me/player/currently-playing",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.status === 204) {
				// No content - nothing is playing
				setTrack(null);
				setError(null);
				setLoading(false);
				return;
			}

			if (!response.ok) {
				if (response.status === 401) {
					// Token expired, try to refresh
					const newToken = await refreshTokenIfNeeded();
					if (newToken) {
						// Retry with new token
						const retryResponse = await fetch(
							"https://api.spotify.com/v1/me/player/currently-playing",
							{
								headers: {
									Authorization: `Bearer ${newToken}`,
								},
							},
						);
						if (retryResponse.ok && retryResponse.status !== 204) {
							const retryData: CurrentlyPlayingResponse =
								await retryResponse.json();
							if (retryData.item) {
								setTrack(retryData.item);
								setError(null);
								setLoading(false);
								return;
							}
						}
					}
					setError("Invalid or expired access token");
				} else {
					setError("Failed to fetch currently playing track");
				}
				setLoading(false);
				return;
			}

			const data: CurrentlyPlayingResponse = await response.json();
			if (data.item) {
				setTrack(data.item);
				setError(null);
			} else {
				setTrack(null);
			}
			setLoading(false);
		} catch {
			setError("Error connecting to Spotify API");
			setLoading(false);
		}
	}, [accessToken, refreshTokenIfNeeded]);

	useEffect(() => {
		// Initial fetch
		fetchCurrentlyPlaying();

		// Poll every 3 seconds
		const interval = setInterval(() => {
			fetchCurrentlyPlaying();
		}, 3000);

		return () => clearInterval(interval);
	}, [fetchCurrentlyPlaying]);

	if (loading) {
		return null; // Don't show anything while loading
	}

	if (error || !track) {
		return null; // Don't show component if there's an error or nothing playing
	}

	const artistNames = track.artists.map((artist) => artist.name).join(", ");
	const albumArtUrl =
		track.album.images.length > 0
			? track.album.images.reduce((prev, curr) =>
					curr.height > prev.height ? curr : prev,
				).url
			: null;

	return (
		<div className="flex items-center h-full text-right gap-4 ">
			<div className="flex-1 flex flex-col gap-1 min-w-0">
				<p className="text-white text-sm md:text-base leading-tight truncate">
					{track.name}
				</p>
				<p className="text-white font-bold leading-tight truncate">
					{artistNames}
				</p>
			</div>
			{albumArtUrl && (
				<img
					src={albumArtUrl}
					alt={`${track.name} by ${artistNames}`}
					className="w-16 h-16 object-cover shrink-0 rounded"
				/>
			)}
		</div>
	);
}
