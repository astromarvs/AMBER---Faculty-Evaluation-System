const bcrypt = require("bcrypt");
const { poolPromise } = require("../config/db");
const jwt = require("jsonwebtoken");

const registerAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      role,
      userName,
      password,
      verificationCode,
    } = req.body;

    if (!userName) {
      return res.status(400).json({ error: "Username is required" });
    }

    const pool = await poolPromise;
    // ✅ Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const isVerified = true;

    // ✅ Insert admin with hashed password
    const insertQuery = `
      INSERT INTO Admin (
        first_name, last_name, email, phone_number, position, role,
        username, password, verify_code, is_verified, date_signed_up 
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE()
      )
    `;

    const values = [
      firstName,
      lastName,
      email,
      phone,
      position,
      role,
      userName,
      hashedPassword,
      verificationCode,
      isVerified,
    ];

    await pool.query(insertQuery, values);

    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin Register Error:", error);
    return res.status(500).json({ error: "Failed to register admin." });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { userName } = req.body;

    const pool = await poolPromise;

    // ✅ Check if the username already exists
    const checkQuery = `
      SELECT TOP 1 1 FROM Admin
      WHERE username = ?
    `;
    const [checkResult] = await pool.query(checkQuery, [userName]);

    if (checkResult) {
      return res.status(409).json({ error: "Username already exists" });
    } else {
      return res.status(200).json({ message: "Username does not exists" });
    }
  } catch (error) {
    console.error("Admin data fetching error:", error);
    return res.status(500).json({ error: "Failed to fetch admin data" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const pool = await poolPromise;
    const query = `
      SELECT 
        id,
        first_name,
        last_name,
        email,
		    phone_number,
		    position,
		    role,
        username,
        password,
		    profile_picture
      FROM Admin
      WHERE username = ?
    `;

    // For ODBC connection pool
    const [admin] = await pool.query(query, [userName]);

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        position: admin.position,
        role: admin.role,
        userName: admin.userName,
        profilePicture: admin.profilePicture
        
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return user data without password
    const { password: _, ...userData } = admin;

    console.log("Result: ", userData)

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      error: "Failed to login",
      details: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  checkUsername,
  loginAdmin,
};
