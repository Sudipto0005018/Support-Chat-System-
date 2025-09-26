require("dotenv").config();
const http = require("http");
const app = require("./app"); 
const mongoose = require("mongoose");
const { initSocket } = require("./socket");

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/support-chat";

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

const io = initSocket(server);


app.set("io", io);

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
