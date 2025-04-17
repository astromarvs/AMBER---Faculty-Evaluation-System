const express = require("express");
const {
    getSchools
} = require("../controllers/schoolController")


const router = express.Router();

router.get("/get-schools", getSchools)

module.exports = router;