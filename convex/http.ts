import { httpRouter } from "convex/server";

const http = httpRouter();

// Coming soon: HTTP endpoints for webhooks
// http.route({
//     path: "/clerk-webhook",
//     method: "POST",
//     handler: clerkWebhook,
// });

// http.route({
//     path: "/stripe-webhook",
//     method: "POST",
//     handler: stripeWebhook,
// });

export default http;
