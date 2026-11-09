import { Worker } from "bullmq";
import queueConnection from "../config/queueConnection.js";
import { sendEmail } from "../services/emailService.js";

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    console.log("Processing job:", job.name, job.id);

    switch (job.name) {
      case "ORDER_PLACED": {
        const { customerEmail, restaurantEmail, orderId } = job.data;

        // Send confirmation to customer
        await sendEmail({
          to: customerEmail,
          subject: `Order #${orderId} confirmed`,
          text: `Your order #${orderId} has been placed successfully.`,
        });

        // Notify restaurant
        await sendEmail({
          to: restaurantEmail,
          subject: `New order #${orderId}`,
          text: `You have received a new order. Order ID: ${orderId}.`,
        });

        break;
      }

      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection: queueConnection,
    concurrency: 5,
  },
);

notificationWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

notificationWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});

console.log("Notification worker started");
