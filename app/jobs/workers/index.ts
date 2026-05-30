import { exampleWorker } from "$/jobs/workers/example";
import { logger } from "$/utils/logger";
import type { Worker } from "bullmq";

const workers: Worker[] = [exampleWorker];

workers.forEach((worker) => worker.run());

process.on("SIGINT", async () => {
  logger.info("Gracefully stopping workers...");
  await Promise.allSettled(workers.map((worker) => worker.close()));
  process.exit();
});
