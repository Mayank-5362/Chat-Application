const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS
app.use(cors());

// Add route for root path
app.get('/', (req, res) => {
  res.send('Chat server is running');
});

// Optional: Serve static files if you have any
// app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

let clients = new Set();

io.on("connection", (socket) => {
  clients.add(socket.id);
  console.log(`Client connected: ${socket.id}, Total clients: ${clients.size}`);
  io.emit("clients-total", clients.size);

  socket.on("disconnect", () => {
    clients.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}, Total clients: ${clients.size}`);
    io.emit("clients-total", clients.size);
  });

  socket.on("message", (data) => {
    console.log(`Message from ${socket.id}:`, data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    console.log(`Feedback from ${socket.id}:`, data);
    socket.broadcast.emit("feedback", data);
  });
});

// Change port from 3000 to 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`💬 Server running on port ${PORT}`));
