import type { Handler } from "express";

export const stashRequestMetadata: Handler = (req, res, next) => {
  req.start = new Date().getTime();
  req.id = Bun.randomUUIDv7();
  next();
};
