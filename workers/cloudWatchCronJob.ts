import "dotenv/config";
import nodeCron, { CronJob } from "node-cron";
import Bottleneck from "bottleneck";
import getCloudWatchData from "./getCloudWatchData";

const jobBottleneck = new Bottleneck({
  maxConcurrent: 1,
  minTime: 0,
});

const runJob = async (trackerId: number | undefined): Promise<void> => {
  console.log("Scheduling CloudWatch job.");
  await jobBottleneck.schedule(async () => {
    try {
      console.log("Running CloudWatch job.");
      await getCloudWatchData(trackerId);
      console.log("Completed CloudWatch job.");
    } catch (err) {
      console.error(`Error running job ${err}`);
    }
  });
};

// run on 5th minute of every hour
const cronJob: CronJob = nodeCron.schedule("5 * * * *", () =>
  runJob(undefined)
);
console.log("Cron job scheduled for the 5th minute of every hour.");

export default { runJob, cronJob };
