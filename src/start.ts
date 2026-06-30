import { interfereRequestMiddleware } from "@interfere/vite/tanstack-start";
import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => ({
	requestMiddleware: [interfereRequestMiddleware],
}));
