const express = require("express");
const {
    addDepartment,
    getDepartment
} = require("../controllers/departmentController");

const router = express.Router();

router.post("/add-department", addDepartment);
router.get("/get-department", getDepartment);

module.exports = router;