import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { User } from "../entity/User";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILHOG_HOST,
  port: 1025,
});

export async function sendEmail(
  user: User,
  subject: string,
  text: string
): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", user.email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
