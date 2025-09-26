const express = require("express");
const router = express.Router();
const ticketCtrl = require("../controllers/ticketController");
const auth = require("../middleware/auth");

router.post("/", auth, ticketCtrl.createTicket);
router.get("/me", auth, ticketCtrl.getTicketsForUser);

// admin
router.get("/", auth, ticketCtrl.getAllTickets);
router.post("/:id/reply", auth, ticketCtrl.replyToTicket);

module.exports = router;
