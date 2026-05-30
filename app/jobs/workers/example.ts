import { defaultWorkerOptions } from "$/jobs/workers/default-options";
import { Worker } from "bullmq";

export const EXAMPLE_WORKER = "example_worker";

export interface ExampleWorkerData {
  message: string;
}

export const exampleWorker = new Worker<ExampleWorkerData>(
  EXAMPLE_WORKER,
  async (job) => {
    console.log(job.data.message);
  },
  defaultWorkerOptions,
);
