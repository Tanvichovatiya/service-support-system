import startOverdueRequestJob from "./overdueRequestjob.js";

export const startJobs = () => {
  startOverdueRequestJob()

  console.log(
    "All background jobs started",
  );
};