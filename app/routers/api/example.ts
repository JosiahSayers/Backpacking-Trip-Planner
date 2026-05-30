import { exampleValidator } from "$/validation/example";
import { Router } from "express";
import validate from "express-zod-safe";

export const exampleRouter = Router();

exampleRouter.post("/", validate({ body: exampleValidator }), (req, res) => {
  return res.json({ message: req.body.message });
});

exampleRouter.get("/", validate({ query: exampleValidator }), (req, res) => {
  return res.json({ message: req.query.message });
});
