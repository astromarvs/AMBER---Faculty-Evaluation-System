const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const { poolPromise } = require("../config/db");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"AMBER Faculty Evaluation System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return { message: "Email sent successfully!" };
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send email.");
  }
};

module.exports = { sendEmail };
