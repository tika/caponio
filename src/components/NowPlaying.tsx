import { useState, useEffect, useCallback } from "react";

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

	const fetchCurrentlyPlaying = useCallback(async () => {
		const token = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN;

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
	}, []);

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
		<div className="w-full relative overflow-hidden">
			{/* Pixelated background effect */}
			<div
				className="absolute inset-0 bg-cobalt"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pixel' x='0' y='0' width='4' height='4' patternUnits='userSpaceOnUse'%3E%3Crect width='2' height='2' fill='%233527F8'/%3E%3Crect x='2' y='2' width='2' height='2' fill='%232a1fc5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23pixel)'/%3E%3C/svg%3E")`,
					imageRendering: "pixelated",
				}}
			/>
			<div className="relative p-6 flex items-center gap-6">
				<div className="flex-1 flex flex-col gap-1">
					<p className="text-white font-bold text-base leading-tight">
						{track.name}
					</p>
					<p className="text-white font-bold text-3xl leading-tight">
						{artistNames}
					</p>
				</div>
				{albumArtUrl && (
					<img
						src={albumArtUrl}
						alt={`${track.name} by ${artistNames}`}
						className="w-32 h-32 object-cover shrink-0"
					/>
				)}
			</div>
		</div>
	);
}
