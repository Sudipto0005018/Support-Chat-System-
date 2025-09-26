const mongoose = require("mongoose");
const OptionSchema = new mongoose.Schema({
  label: String, 
  nextNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BotNode",
    default: null,
  },
  createTicket: { type: Boolean, default: false },
});
const BotNodeSchema = new mongoose.Schema({
  title: String,
  message: String, 
  options: [OptionSchema],
  isTerminal: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("BotNode", BotNodeSchema);
