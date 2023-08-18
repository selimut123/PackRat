import { queueManager } from './queueManager';

export async function processJob(job: any, queueName: string, task: string) {
  // Get the queue for this job type
  const queueData = queueManager.getQueue(queueName);

  if (!queueData) {
    throw new Error(`Queue ${queueName} does not exist`);
  }

  const { queue } = queueData;

  console.log(`Adding job ${job} with task ${task} to queue ${queueName}`)

  // Add the job and task to the queue
  await queue.add({ job, task });
}
