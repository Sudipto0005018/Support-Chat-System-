const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  senderType: { type: String, enum: ["user", "bot", "admin"], required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }, 
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Message", MessageSchema);
