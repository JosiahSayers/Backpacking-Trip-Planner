import { attachLogger } from "$/middleware/attach-logger";
import { requestLogger } from "$/middleware/request-logger";
import { stashRequestMetadata } from "$/middleware/stash-request-meta";
import { stashSession } from "$/middleware/stash-session";
import { apiRouter } from "$/routers/api";
import { frontendRouter } from "$/routers/frontend";
import { healthRouter } from "$/routers/health";
import { auth } from "$/utils/auth";
import { toNodeHandler } from "better-auth/node";
import express from "express";

export const app = express();
app.use(stashRequestMetadata, attachLogger, requestLogger, stashSession);

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.disable("x-powered-by");

app.use(express.json());

app.use(healthRouter);
app.use("/api", apiRouter);

if (process.env.NODE_ENV !== "production") {
  app.use(frontendRouter); // Needs to be the final router
} else {
  app.use(express.static("/usr/src/app/dist/frontend"));
  // SPA fallback: any non-API route that doesn't match a static asset
  // should serve index.html so client-side routing (wouter) can take over.
  app.get("{*path}", (_req, res) => {
    res.sendFile("/usr/src/app/dist/frontend/index.html");
  });
}
