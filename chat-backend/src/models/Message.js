const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  fileUrl: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);
