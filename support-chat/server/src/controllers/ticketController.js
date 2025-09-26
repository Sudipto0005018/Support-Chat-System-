const Ticket = require("../models/Ticket");
const { getIO } = require("../socket");

exports.createTicket = async (req, res) => {
  const { subject, text } = req.body;
  const ticket = new Ticket({
    user: req.user._id,
    subject,
    messages: [{ senderType: "user", senderId: req.user._id, text }],
  });
  await ticket.save();


  try {
    const io = getIO();
    io.to("admins").emit("ticket_created", {
      ticketId: ticket._id,
      subject,
      userId: req.user._id,
    });

    io.to(`user:${req.user._id}`).emit("ticket_created", ticket);
  } catch (e) {
    console.log("Socket emit err", e);
  }

  res.json(ticket);
};

exports.getTicketsForUser = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id }).sort({
    updatedAt: -1,
  });
  res.json(tickets);
};


exports.getAllTickets = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const tickets = await Ticket.find().populate("user").sort({ updatedAt: -1 });
  res.json(tickets);
};

exports.replyToTicket = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const t = await Ticket.findById(id);
  if (!t) return res.status(404).json({ message: "Not found" });
  t.messages.push({ senderType: "admin", senderId: req.user._id, text });
  t.status = "pending";
  await t.save();

  const io = getIO();
  io.to(`user:${t.user}`).emit("ticket_reply", {
    ticketId: t._id,
    text,
    from: "admin",
  });
  io.to("admins").emit("ticket_updated", t);

  res.json(t);
};
