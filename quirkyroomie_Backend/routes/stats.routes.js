// routes/stats.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware.js");

const {
  getKarmaLeaderboard,
  getTopOffenders,
  getComplaintTypeStats,
} = require("../controllers/stats.controller");

router.get("/leaderboard", auth, getKarmaLeaderboard);
router.get("/offenders", auth, getTopOffenders);
router.get("/types", auth, getComplaintTypeStats);

module.exports = router;
