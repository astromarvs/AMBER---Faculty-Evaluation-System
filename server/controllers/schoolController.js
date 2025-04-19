const { poolPromise } = require("../config/db");
const jwt = require("jsonwebtoken");

const addSchool = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin_id = decoded.id;

    const { schoolName, schoolPhone, address, schoolType, schoolPicture } =
      req.body;

    if (!admin_id) {
      return res
        .status(400)
        .json({ error: "Invalid token: No admin_id found" });
    }

    const pool = await poolPromise;

    // In addSchool controller:
    const checkQuery = `SELECT school_name FROM School WHERE school_name = ?`; // Removed admin_id check
    const existingSchool = await pool.query(checkQuery, [schoolName]);

    if (existingSchool.length > 0) {
      return res.status(409).json({ error: "School name already exists" });
    }

    // Convert Base64 to binary
    let schoolPictureBinary = null;
    if (schoolPicture) {
      schoolPictureBinary = Buffer.from(schoolPicture, "base64");
    }

    const insertQuery = `
        INSERT INTO School (school_name, school_phone, address, school_type, school_picture, admin_id)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
    await pool.query(insertQuery, [
      schoolName,
      schoolPhone,
      address,
      schoolType,
      schoolPictureBinary, // Store the binary data
      admin_id,
    ]);

    return res.status(201).json({ message: "School added successfully" });
  } catch (error) {
    console.error("Add School Error:", error);
    return res.status(500).json({ error: "Failed to add school" });
  }
};

const getSchool = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin_id = decoded.id;

    if (!admin_id) {
      return res
        .status(400)
        .json({ error: "Invalid token: No admin_id found" });
    }

    const pool = await poolPromise;
    const query = `SELECT id, school_name, school_phone, address, school_type, school_picture FROM School WHERE admin_id = ?`;
    const result = await pool.query(query, [admin_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "No School found for this Admin" });
    }

    const school = result[0];

    // Convert VARBINARY (Buffer) to base64
    if (school.school_picture) {
      // Ensure it's a Buffer (some SQL drivers return raw binary)
      const imageBuffer = Buffer.isBuffer(school.school_picture)
        ? school.school_picture
        : Buffer.from(school.school_picture);

      school.school_picture = imageBuffer.toString("base64");
    }

    res.json(school);
  } catch (error) {
    console.error("Get School Error:", error);
    return res.status(500).json({ error: "Failed to retrieve School" });
  }
};

const updateSchool = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin_id = decoded.id;
  
      if (!admin_id) {
        return res.status(400).json({ error: "Invalid token: No admin_id found" });
      }
  
      const { schoolName, schoolPhone, address, schoolType, schoolPicture } = req.body;
      const pool = await poolPromise;
  
      // Check if school exists for this admin
      const checkQuery = `SELECT id FROM School WHERE admin_id = ?`;
      const [existingSchool] = await pool.query(checkQuery, [admin_id]);
  
      if (!existingSchool) {
        return res.status(404).json({ error: "No school found for this admin" });
      }
  
      // Build SET clauses and parameters
      const setClauses = [];
      const params = [];
      
      if (schoolName !== undefined) {
        setClauses.push("school_name = ?");
        params.push(schoolName);
      }
      if (schoolPhone !== undefined) {
        setClauses.push("school_phone = ?");
        params.push(schoolPhone);
      }
      if (address !== undefined) {
        setClauses.push("address = ?");
        params.push(address);
      }
      if (schoolType !== undefined) {
        setClauses.push("school_type = ?");
        params.push(schoolType);
      }
      if (schoolPicture !== undefined) {
        setClauses.push("school_picture = ?");
        params.push(schoolPicture ? Buffer.from(schoolPicture, "base64") : null);
      }
  
      if (setClauses.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }
  
      // Add WHERE condition parameters
      params.push(admin_id);
  
      // SQL Server compatible query
      const updateQuery = `
        UPDATE School 
        SET ${setClauses.join(", ")}
        WHERE admin_id = ?
      `;
  
      await pool.query(updateQuery, params);
  
      return res.status(200).json({ message: "School updated successfully" });
    } catch (error) {
      console.error("Update School Error:", error);
      return res.status(500).json({ error: "Failed to update school" });
    }
  };

module.exports = {
  addSchool,
  getSchool,
  updateSchool,
};
