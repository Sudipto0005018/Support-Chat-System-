const BotNode = require("../models/BotNode");

exports.getNode = async (req, res) => {
  const { id } = req.params;
  const node = await BotNode.findById(id).lean();
  if (!node) return res.status(404).json({ message: "Not found" });
  res.json(node);
};

exports.getRoot = async (req, res) => {
  const root = await BotNode.findOne().sort({ createdAt: 1 });
  if (!root) return res.status(404).json({ message: "No bot flow configured" });
  res.json(root);
};


// in controllers/botController.js
exports.createNode = async (req, res) => {
  const node = new BotNode(req.body);
  await node.save();
  res.json(node);
};
