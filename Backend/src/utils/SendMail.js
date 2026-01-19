import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // ✅ REQUIRED for Gmail on Render
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"SkillSwap Team" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Mail sent successfully");
    console.log("📩 Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Mail sending failed");
    console.error(error);
    throw error; // important so frontend doesn’t fake success
  }
};
