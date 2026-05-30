import type { Handler } from "express";

export const requestLogger: Handler = (req, res, next) => {
  res.on("finish", () => {
    req.logger.info("Request Log", {
      method: req.method,
      path: req.originalUrl,
      duration: new Date().getTime() - req.start,
      ip: req.ip,
      status: res.statusCode,
      redirectLocation: res.getHeader("location"),
    });
  });

  next();
};
