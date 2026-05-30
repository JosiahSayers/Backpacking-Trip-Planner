import { exampleRouter } from "$/routers/api/example";
import { Router } from "express";

export const apiRouter = Router();

apiRouter.use("/example", exampleRouter);
