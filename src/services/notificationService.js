import notificationQueue from "../queues/notificationQueue.js";

export async function queueOrderPlacedNotification({
  customerEmail,
  // restaurantEmail,
  orderId,
}) {
  console.log("starting queue");
  return await notificationQueue.add(
    "ORDER_PLACED",
    {
      customerEmail,
      // restaurantEmail,
      orderId,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  );
}
