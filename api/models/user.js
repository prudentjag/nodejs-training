const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: /[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
