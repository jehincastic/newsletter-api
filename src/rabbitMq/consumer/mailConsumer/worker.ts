/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config();

import amqp from "amqplib";
import handlebars from "handlebars";

import {
  EMAIL_PREFETCH,
  EMAIL_QUEUE,
  FAILURE_QUEUE,
  RABBITMQ_URL,
} from "../../../constants";
import { CsvType } from "../../../types";
import prisma from "../../../lib/prisma";
import sendMail from "../../../utils/sendMail";

const publishToQueue = (
  queueName: string,
  data: string,
  ch: amqp.Channel,
) => {
  ch.sendToQueue(queueName, Buffer.from(data), { deliveryMode: true });
};

const processQueueData = async (
  msg: amqp.ConsumeMessage,
  channel: amqp.Channel,
): Promise<boolean> => {
  const amqpMessage = msg.content.toString();
  try {
    const newsletterData = JSON.parse(amqpMessage) as CsvType;
    const user = await prisma.user.findFirst({
      where: {
        email: newsletterData.Email,
      },
    });
    if (user) {
      const userName = `${user.firstName} ${user.lastName}`;
      const source = newsletterData.Content;
      const template = handlebars.compile(source);
      const html = template({
        name: userName,
        age: user.age,
      });
      const info = await sendMail(user.email, html, newsletterData.Name);
      await prisma.logs.create({
        data: {
          mail: user.email,
          status: "SUCCESS",
          newsletter: newsletterData.Name,
          messageId: info.messageId,
        },
      });
      return true;
    }
    throw new Error("Invalid Email...");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    publishToQueue(
      FAILURE_QUEUE,
      JSON.stringify({
        data: amqpMessage,
        message: err.message,
      }),
      channel,
    );
    return false;
  } finally {
    channel.ack(msg);
  }
};

const main = async () => {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(EMAIL_QUEUE, { durable: true });
  await channel.assertQueue(FAILURE_QUEUE, { durable: true });
  await channel.prefetch(EMAIL_PREFETCH);
  channel.consume(EMAIL_QUEUE, (message) => {
    // eslint-disable-next-line no-console
    console.log("message received...");
    if (message) {
      processQueueData(message, channel);
    }
  }, { noAck: false });
  // eslint-disable-next-line no-console
  console.log("Sarted Worker...");
};

// eslint-disable-next-line no-console
main().catch(console.error);
