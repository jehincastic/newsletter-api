/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";

import {
  PORT,
} from "./constants";
import { initialize } from "./rabbitMq/publisher";
import router from "./router";
import { CommonResponse } from "./types";

const main = async () => {
  await initialize();
  const app = express();

  app.use(helmet());
  app.use(express.json());

  app.use("/api/v1/", router);
  app.get("*", (_, res) => {
    res.status(404).json({
      status: "FAILED",
      data: "What are you trying to do?",
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err: Error, _: Request, res: Response<CommonResponse<string>>, __: NextFunction) => {
    res.json({
      status: "FAILED",
      data: err.message,
    });
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server Started on Port ${PORT} 🚀`);
  });
};

// eslint-disable-next-line no-console
main().catch(console.error);
