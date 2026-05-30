import { Router } from "express";
import { HealthChecks } from "$/utils/health-checks";

export const healthRouter = Router();

healthRouter.get("/health", async (req, res) => {
  const healthChecks = await HealthChecks.run();

  return res.status(healthChecks.failures ? 500 : 200).json(healthChecks);
});

healthRouter.get("/ready", (req, res) => res.sendStatus(200));
