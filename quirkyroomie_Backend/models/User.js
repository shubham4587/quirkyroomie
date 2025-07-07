
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    flatCode: { type: String, required: true },

    karma: { type: Number, default: 0 },
    badges: [{ type: String }], 

    role: { type: String, default: "flatmate" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);






// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   flatCode: { type: String, required: true },
//   karma: { type: Number, default: 0 },
//   role: { type: String, default: "flatmate" },
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
