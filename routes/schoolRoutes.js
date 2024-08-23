const express = require("express");
const router = express.Router();

// Import controllers
const {addSchool,listSchools} = require("../controllers/school"); 


router.post("/addSchool", addSchool);

router.get("/listSchools", listSchools);

module.exports = router;
