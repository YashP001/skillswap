import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (to, subject, text) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "SkillSwap",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("✅ Mail sent via Brevo API:", response.data.messageId);
  } catch (error) {
    console.error("❌ Brevo API mail failed:", error.response?.data || error.message);
    throw error;
  }
};
