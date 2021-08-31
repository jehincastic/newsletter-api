import nodemailer from "nodemailer";

import { FROM_EMAIL, SMPT_URL } from "../constants";

const transporter = nodemailer.createTransport(SMPT_URL);

const sendMail = async (to: string, html: string, subject: string) => {
  const messageInfo = await transporter.sendMail({
    from: `"Newletter 📰" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
  return messageInfo;
};

export default sendMail;
