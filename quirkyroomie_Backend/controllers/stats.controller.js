// controllers/stats.controller.js
const User = require("../models/User.js");
const Complaint = require("../models/Complaint.js");

/* 🏆 Top Karma Leaderboard */
exports.getKarmaLeaderboard = async (req, res) => {
  try {
    const flatCode = req.user.flatCode;

    const users = await User.find({ flatCode })
      .sort({ karma: -1 })
      .select("name email karma badges")
      .limit(5);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 🚨 Most Complained-About Users */
exports.getTopOffenders = async (req, res) => {
  try {
    const flatCode = req.user.flatCode;

    const complaints = await Complaint.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      { $match: { "userInfo.flatCode": flatCode } },
      {
        $group: {
          _id: "$createdBy",
          name: { $first: "$userInfo.name" },
          email: { $first: "$userInfo.email" },
          totalComplaints: { $sum: 1 },
        },
      },
      { $sort: { totalComplaints: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*  Top Complaint Types */
exports.getComplaintTypeStats = async (req, res) => {
  try {
    const flatCode = req.user.flatCode;

    const stats = await Complaint.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      { $match: { "userInfo.flatCode": flatCode } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
