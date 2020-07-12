const express = require("express");
const router = express.Router();

// @route GET /api/posts
// @desc Posts test
// @Access Public
router.get("/test", (req, res) => {
  res.json({ msg: "posts works" });
});

module.exports = router;
