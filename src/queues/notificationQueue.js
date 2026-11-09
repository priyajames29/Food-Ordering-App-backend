import { Queue } from "bullmq";
import queueConnection from "../config/queueConnection.js";

const notificationQueue = new Queue("notifications", {
  connection: queueConnection,
});

export default notificationQueue;
