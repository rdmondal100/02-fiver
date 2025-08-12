const express = require("express");
const router = express.Router();
const { searchPartner } = require("../controllers/partnerController");

const { protect } = require("../middleware/authMiddleware.js");
// Route to fetch nutritional data
router.get("/filter", protect, searchPartner);

module.exports = router;
