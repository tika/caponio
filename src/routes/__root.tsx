import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

const siteUrl = import.meta.env.VITE_SITE_URL ?? "";
const ogImage = siteUrl ? `${siteUrl}/opengraph-image.png` : "/opengraph-image.png";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Tika Capon",
				description: "Product Architect & Engineer",
			},
			// Open Graph
			{ property: "og:title", content: "Tika Capon" },
			{ property: "og:description", content: "Product Architect & Engineer" },
			{ property: "og:image", content: ogImage },
			{ property: "og:type", content: "website" },
			// Twitter Card
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Tika Capon" },
			{ name: "twitter:description", content: "Product Architect & Engineer" },
			{ name: "twitter:image", content: ogImage },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Syne:wght@400..800&display=swap"
					rel="stylesheet"
					crossOrigin="anonymous"
				/>
				<script
					type="text/javascript"
					src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,100..900;1,100..900&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="min-h-screen">
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
