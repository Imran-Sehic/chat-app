require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
import { Message } from "./models/Message.js";
import { User } from "./models/User.js";
import { MongoUrl } from "./utils/constants.js";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

io.on("connection", (socket) => {
  socket.on("chat message", async (msg) => {
    const message = new Message({
      text: msg.text,
      fileUrl: msg.fileUrl,
      username: msg.username,
    });
    await message.save();
    io.emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort("createdAt");
    if (messages) return res.status(201).json({ messages });
    res.status(404).json({ message: "No messages" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/upload", upload.array("files", 10), (req, res) => {
  // Accept up to 10 files
  const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ fileUrls });
});

// Endpoint to handle signup
app.post("/signup", async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const user = new User({ username });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to handle login
app.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Username does not exist" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

server.listen(process.env.PORT, () => {
  console.log(`listening on port: ${process.env.PORT}`);
});
