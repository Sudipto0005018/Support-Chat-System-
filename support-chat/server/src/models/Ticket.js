const mongoose = require("mongoose");
const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "pending", "resolved", "closed"],
    default: "open",
  },
  messages: [
    {
      senderType: { type: String, enum: ["user", "admin"], required: true },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
TicketSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("Ticket", TicketSchema);
