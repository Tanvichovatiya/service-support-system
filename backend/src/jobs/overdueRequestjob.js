import cron from "node-cron";
import processPendingOverdueRequest from "./overduceReqServcies.js";

const startOverdueRequestJob = () => {

  cron.schedule(
    "*/5 * * * *",

    async () => {
      console.log("Pending overdue request cron started");
      try {
        const result = await processPendingOverdueRequest();
        console.log("Pending overdue cron result:", result);
      } catch (error) {
        console.log("crone failed", error);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
   console.log("Pending overdue request cron scheduled");
};

export default startOverdueRequestJob;