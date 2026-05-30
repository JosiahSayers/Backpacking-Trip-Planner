import type { WorkerOptions } from "bullmq";

export const defaultWorkerOptions: WorkerOptions = {
  connection: {
    url: "localhost",
    port: 6379,
  },
  autorun: false,
  concurrency: 5,
};
