const express = require("express");
const {
  registerAdmin,
  checkUsername,
  loginAdmin
} = require("../controllers/adminController");

const router = express.Router();

// Admin registration
router.post("/register-admin", registerAdmin);

// Username availability check
router.post("/check-username", checkUsername);

// Admin login
router.post("/login", loginAdmin);

module.exports = router;