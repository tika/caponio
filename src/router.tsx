import { createRouter } from "@tanstack/react-router";
import { init } from "@interfere/vite/init";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

if (typeof window !== "undefined") {
	init();
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
