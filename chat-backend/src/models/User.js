const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
});

export const User = mongoose.model("User", userSchema);
