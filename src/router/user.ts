import express, { NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { User } from "@prisma/client";

import {
  RequestType,
  ResponseType,
  UserType,
} from "../types";
import handleValidationErrors from "../utils/validator";
import prisma from "../lib/prisma";

const router = express.Router();

router.post("/new",
  body("email").isEmail().normalizeEmail().withMessage("Invalid Email Address"),
  body("age").isNumeric().withMessage("Age must be a number").toInt(),
  body("firstName").isLength({ min: 3 }).withMessage("First Name must be atleast 6 chars.").escape(),
  body("lastName").isLength({ min: 3 }).withMessage("Last Name must be atleast 3 chars.").escape(),
  async (
    req: RequestType<{}, UserType, {}>,
    res: ResponseType<User>,
    next: NextFunction,
  ) => {
    try {
      const {
        email,
        age,
        firstName,
        lastName,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return handleValidationErrors(next, errors.array());
      }
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          age,
        },
      });
      return res.json({
        status: "SUCCESS",
        data: user,
      });
    } catch (err) {
      if (err.code === "P2002") {
        return next(new Error("Email Already taken."));
      }
      // eslint-disable-next-line no-console
      console.error(err);
      return next(new Error("Server Error"));
    }
  });

export default router;
