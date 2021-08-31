import amqp from "amqplib";

import {
  EMAIL_QUEUE,
  FAILURE_QUEUE,
  RABBITMQ_URL,
} from "../constants";

let ch: amqp.Channel;
let conn: amqp.Connection;

export const initialize = async () => {
  conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(EMAIL_QUEUE, { durable: true });
  await channel.assertQueue(FAILURE_QUEUE, { durable: true });
  ch = channel;
};

export const publishToQueue = (queueName: string, data: string) => {
  ch.sendToQueue(queueName, Buffer.from(data), { deliveryMode: true });
};

process.once("SIGINT", () => {
  ch.close();
  conn.close();
  // eslint-disable-next-line no-console
  console.log("Closing rabbitmq channel");
});
