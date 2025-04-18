const express = require("express");
const { sendEmail } = require("../utils/mailer.js");

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const response = await sendEmail(req.body); // Pass the entire body here
    res.status(200).json({ success: true, message: response.message });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
