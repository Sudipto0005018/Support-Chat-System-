const express = require("express");
const router = express.Router();
const botCtrl = require("../controllers/botController");
const auth = require("../middleware/auth");

router.get("/root", botCtrl.getRoot);
router.get("/node/:id", botCtrl.getNode);
router.post("/", auth, botCtrl.createNode);

module.exports = router;
