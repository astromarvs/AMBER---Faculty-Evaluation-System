const bcrypt = require("bcrypt");
const { poolPromise } = require("../config/db");

const registerAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      user_name,
      position,
      role
    } = req.body;

    if (!user_name) {
      return res.status(400).json({ error: "Username is required" });
    }

    const pool = await poolPromise;

    // ✅ Check if the username already exists
    const checkQuery = `
      SELECT TOP 1 1 FROM Admin
      WHERE username = ?
    `;
    const [checkResult] = await pool.query(checkQuery, [user_name]);

    if (checkResult) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // ✅ Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const isVerified = false;

    // ✅ Insert admin with hashed password
    const insertQuery = `
      INSERT INTO Admin (
        first_name, last_name, email, password,
        username, date_signed_up,
        position, role, is_verified
      )
      VALUES (
        ?, ?, ?, ?, ?, GETDATE(), ?, ?, ?
      )
    `;

    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,   // 👈 hashed password here
      user_name,
      position || null,
      role || null,
      isVerified
    ];

    await pool.query(insertQuery, values);

    return res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    console.error("Admin Register Error:", error);
    return res.status(500).json({ error: "Failed to register admin." });
  }
};

module.exports = {
  registerAdmin,
};
