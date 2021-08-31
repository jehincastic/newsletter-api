import express from "express";

import user from "./user";
import newsletter from "./newsletter";

const router = express.Router();

router.all("/ping", (_, res) => {
  res.status(200).json({
    status: "SUCCESS",
    data: "I am alive.",
  });
});

router.use("/user", user);
router.use("/newsletter", newsletter);

router.get("*", (_, res) => {
  res.status(404).json({
    status: "FAILED",
    data: "What are you trying to do?",
  });
});

export default router;
