import { createRouter } from "@tanstack/react-router";
import { init } from "@interfere/vite/init";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

if (typeof window !== "undefined") {
	// @ts-expect-error injected global read by @interfere/react config
	globalThis.__INTERFERE_PUBLIC_KEY__ = import.meta.env.VITE_INTERFERE_PUBLIC_KEY;
	init({ enabled: true });
}

// Create a new router instance
export const getRouter = () => {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
	});

	return router;
};
