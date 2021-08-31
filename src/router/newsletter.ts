import express, { NextFunction } from "express";
import multer from "multer";
import { unlink } from "fs/promises";

import processCsv from "../utils/processCsv";
import {
  RequestType,
  ResponseType,
} from "../types";

const router = express.Router();
const upload = multer({
  dest: "csv_files/",
  // eslint-disable-next-line consistent-return
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      return cb(new Error("Only .csv format allowed!"));
    }
  },
  limits: { fileSize: 1000000 },
});

router.post("/",
  upload.single("csv_file"),
  async (
    req: RequestType<{}, {}, {}>,
    res: ResponseType<string>,
    next: NextFunction,
  ) => {
    try {
      // eslint-disable-next-line no-console
      const fileName = req?.file?.path;
      if (fileName) {
        await processCsv(fileName);
        await unlink(fileName).catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
        return res.json({
          status: "SUCCESS",
          data: "Email Added to Queue.",
        });
      }
      throw new Error("Invalid Input...");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return next(new Error("Server Error"));
    }
  });

export default router;
