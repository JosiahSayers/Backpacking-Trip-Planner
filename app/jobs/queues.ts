import { EXAMPLE_WORKER, type ExampleWorkerData } from "$/jobs/workers/example";
import { Queue } from "bullmq";

export const exampleQueue = new Queue<ExampleWorkerData>(EXAMPLE_WORKER);

export const allQueues = [exampleQueue];
