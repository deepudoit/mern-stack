const express = require("express");
const router = express.Router();

// @route GET /api/users
// @desc Users test
// @Access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users works" });
});

module.exports = router;
