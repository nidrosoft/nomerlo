import { cronJobs } from "convex/server";

const crons = cronJobs();

// Coming soon: Scheduled jobs
// crons.daily(
//     "send-rent-reminders",
//     { hourUTC: 14, minuteUTC: 0 },
//     internal.notifications.sendRentReminders
// );

// crons.daily(
//     "process-late-fees",
//     { hourUTC: 6, minuteUTC: 0 },
//     internal.payments.processLateFees
// );

export default crons;
