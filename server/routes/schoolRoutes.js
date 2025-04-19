const express = require("express");
const {
    getSchool,
    addSchool,
    updateSchool
} = require("../controllers/schoolController")


const router = express.Router();

router.get("/get-school", getSchool)
router.post("/add-school", addSchool)
router.put("/update-school", updateSchool)

module.exports = router;