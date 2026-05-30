import { logger } from "$/utils/logger";
import type { Handler } from "express";

export const attachLogger: Handler = (req, res, next) => {
  req.logger = logger.child({ requestId: req.id });
  next();
};
