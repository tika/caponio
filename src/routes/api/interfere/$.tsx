import { handle } from "@interfere/vite/handler";
import { register } from "@interfere/vite/server";
import { createFileRoute } from "@tanstack/react-router";

if (typeof window === "undefined") {
	register().catch((error: unknown) => {
		console.warn("[interfere] register() threw during boot", error);
	});
}

export const Route = createFileRoute("/api/interfere/$")({
	server: {
		handlers: {
			GET: ({ request }) => handle(request),
			POST: ({ request }) => handle(request),
			OPTIONS: ({ request }) => handle(request),
		},
	},
});
