// models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    /*  Basic info */
    title:       { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["Noise", "Cleanliness", "Bills", "Pets", "Other"],
      default: "Other",
    },
    severity: {
      type: String,
      enum: ["Mild", "Annoying", "Major", "Nuclear"],
      default: "Mild",
    },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    /*  Voting */
    votes:       { type: Number, default: 0 },
    upvotedBy:   [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    /* Resolution */
    resolved:   { type: Boolean, default: false },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },

    /*  Archive */
    archived: { type: Boolean, default: false },

    /*  Punishment (NEW) */
    punishment: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
