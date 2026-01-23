import { useLanyard } from "use-lanyard";

export function NowPlaying() {
	const discordId = import.meta.env.VITE_DISCORD_ID;

	if (!discordId) {
		return null;
	}

	const { data } = useLanyard(discordId);

	// Only show when listening to Spotify and spotify data exists
	if (!data?.listening_to_spotify || !data?.spotify) {
		return null;
	}

	const spotify = data.spotify;
	const song = spotify.song;
	const artist = spotify.artist;
	const albumArt = (spotify as any).album_art || (spotify as any).albumArt;

	if (!song || !artist) {
		return null;
	}

	// Truncate text if too long
	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text;
		return `${text.slice(0, maxLength)}...`;
	};

	const displayTitle = truncateText(song, 40);
	const displayArtists = truncateText(artist, 50);

	return (
		<div className="flex items-center h-full text-right gap-4 w-[40vw] md:w-[22vw] lg:w-[30vw]">
			<div className="flex-1 flex flex-col gap-1 min-w-0 max-w-full">
				<p className="text-white text-sm md:text-base leading-tight truncate">
					{displayTitle}
				</p>
				<p className="text-white font-bold leading-tight truncate">
					{displayArtists}
				</p>
			</div>
			{albumArt && (
				<img
					src={albumArt}
					alt={`${song} by ${artist}`}
					className="w-16 h-16 object-cover shrink-0 rounded"
				/>
			)}
		</div>
	);
}
