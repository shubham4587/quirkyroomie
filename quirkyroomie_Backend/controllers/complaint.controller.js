// controllers/complaint.controller.js
const Complaint          = require("../models/Complaint");
const User               = require("../models/User");
const generatePunishment = require("../utils/punishmentGenerator");

/* ------------------- constants ------------------- */
const KARMA_REWARD = 10;

/* ------------- CREATE COMPLAINT ------------------ */
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, type, severity } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      type,
      severity,
      createdBy: req.user.userId,
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------- GET ACTIVE COMPLAINTS ------------- */
exports.getAllComplaints = async (_req, res) => {
  try {
    const list = await Complaint.find({ resolved: false, archived: false })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------- VOTING ---------------------- */
exports.voteComplaint = async (req, res) => {
  try {
    const { voteType } = req.body;            // "upvote" | "downvote"
    const { id }      = req.params;
    const userId      = req.user.userId;

    const c = await Complaint.findById(id);
    if (!c) return res.status(404).json({ message: "Complaint not found" });

    const up   = c.upvotedBy.includes(userId);
    const down = c.downvotedBy.includes(userId);

    if (voteType === "upvote") {
      if (up) return res.status(400).json({ message: "Already upvoted" });
      if (down) { c.downvotedBy.pull(userId); c.votes += 1; }
      c.upvotedBy.push(userId);  c.votes += 1;

    } else if (voteType === "downvote") {
      if (down) return res.status(400).json({ message: "Already downvoted" });
      if (up)   { c.upvotedBy.pull(userId);   c.votes -= 1; }
      c.downvotedBy.push(userId); c.votes -= 1;

    } else {
      return res.status(400).json({ message: "Invalid voteType" });
    }

    /*  auto‑archive */
    if (c.votes <= -3) c.archived = true;

    /*  punishment trigger (NEW) */
    if (c.votes >= 10 && !c.punishment) {
      c.punishment = generatePunishment();
    }

    await c.save();
    res.status(200).json({
      message:     "Vote registered",
      votes:       c.votes,
      archived:    c.archived,
      punishment:  c.punishment || null,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------ TRENDING COMPLAINTS ---------------- */
exports.getTrendingComplaints = async (_req, res) => {
  try {
    const top = await Complaint.find({ resolved: false, archived: false })
      .sort({ votes: -1, createdAt: -1 })
      .limit(5);

    res.status(200).json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------- RESOLVE  + KARMA ------------------ */
exports.resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const me     = req.user.userId;

    const c = await Complaint.findById(id);
    if (!c)              return res.status(404).json({ message: "Complaint not found" });
    if (c.resolved)      return res.status(400).json({ message: "Already resolved" });

    c.resolved   = true;
    c.resolvedBy = me;
    c.resolvedAt = new Date();
    await c.save();

    const user = await User.findByIdAndUpdate(
      me,
      { $inc: { karma: KARMA_REWARD } },
      { new: true }
    ).select("name karma badges");

    res.status(200).json({
      message: "Complaint resolved",
      karmaAwarded: KARMA_REWARD,
      user,
      complaint: c,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};










// const Complaint = require("../models/Complaint.js");

// // POST: Create complaint
// exports.createComplaint = async (req, res) => {
//   try {
//     const { title, description, type, severity } = req.body;

//     const newComplaint = await Complaint.create({
//       title,
//       description,
//       type,
//       severity,
//       createdBy: req.user.userId,
//     });

//     res.status(201).json(newComplaint);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET: All active complaints
// exports.getAllComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find({ resolved: false }).populate("createdBy", "name email");
//     res.status(200).json(complaints);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
