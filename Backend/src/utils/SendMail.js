import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_ID, // must be 'apikey'
    pass: process.env.APP_PASSWORD,
  },
});

export const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: "SkillSwap <noreply@skillswap.app>",
      to,
      subject,
      text,
    });

    console.log("✅ Mail sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Mail sending failed:", error);
    throw error;
  }
};
