const { poolPromise } = require("../config/db");
const jwt = require("jsonwebtoken");

const getSchoolId = async (admin_id) => {
  try {
    const pool = await poolPromise;
    const query = `SELECT id FROM School WHERE admin_id = ?`;
    const result = await pool.query(query, [admin_id]);
    const rows = result;

    //console.log("School query result:", rows); // helpful debug log

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0].id;
  } catch (error) {
    console.error("Get School Error:", error);
    throw error;
  }
};

const addDepartment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminID = decoded.id;

    const schoolId = await getSchoolId(adminID);

    if (!schoolId) {
      return res.status(404).json({ error: "No School found for this Admin" });
    }

    const { deptCode, deptName } = req.body;
    const isDeleted = false;

    const pool = await poolPromise;

    // Use correct parentheses in WHERE clause
    const checkQuery = `
        SELECT 1 FROM Department
        WHERE (dept_code = ? OR dept_name = ?) AND school_id = ?
      `;
    const checkResult = await pool.query(checkQuery, [
      deptCode,
      deptName,
      schoolId,
    ]);

    // ODBC likely returns result as array directly
    if (checkResult.length > 0) {
      return res.status(409).json({ error: "Department already exists!" });
    }

    const insertQuery = `
        INSERT INTO Department (
          dept_code, dept_name, school_id, isDeleted
        )
        VALUES (?, ?, ?, ?)
      `;
    const insertResult = await pool.query(insertQuery, [
      deptCode,
      deptName,
      schoolId,
      isDeleted,
    ]);

    return res.status(201).json({
      message: "Department added successfully",
      resultData: insertResult,
    });
  } catch (error) {
    console.error("Add Department Error:", error);
    return res.status(500).json({ error: "Failed to add department" });
  }
};

const getDepartment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminID = decoded.id;

    const schoolId = await getSchoolId(adminID);

    if (!schoolId) {
      return res.status(404).json({ error: "No school found for this admin" });
    }

    const pool = await poolPromise;
    const query = `SELECT id, dept_code, dept_name FROM Department WHERE school_id = ?`;
    const result = await pool.query(query, [schoolId]);

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No departments found for this school!" });
    }

    res.status(200).json({ departments: result });
  } catch (error) {
    console.error("Get Department Error:", error);
    return res.status(500).json({ error: "Failed to retrieve departments" });
  }
};

module.exports = {
  addDepartment,
  getDepartment,
};
