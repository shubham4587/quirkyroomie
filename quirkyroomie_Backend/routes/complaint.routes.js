// routes/complaint.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  createComplaint,
  getAllComplaints,
  voteComplaint,
  getTrendingComplaints,
  resolveComplaint,          
} = require("../controllers/complaint.controller");

/* CRUD + Voting + Resolution routes */
router.post("/", auth, createComplaint);
router.get("/", auth, getAllComplaints);
router.post("/:id/vote", auth, voteComplaint);
router.put("/:id/resolve", auth, resolveComplaint);     
router.get("/trending", auth, getTrendingComplaints);

module.exports = router;






// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth.middleware.js");
// const {
//   createComplaint,
//   getAllComplaints
// } = require("../controllers/complaint.controller");

// router.post("/", auth, createComplaint);        
// router.get("/", auth, getAllComplaints);        

// module.exports = router;
