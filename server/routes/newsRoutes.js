const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { handleNewPostCreatedFromWp } = require("../controllers/newsController");
  
// Route to fetch nutritional data
router.post('/', handleNewPostCreatedFromWp);

module.exports = router;
