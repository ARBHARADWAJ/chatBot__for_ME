//Jai shree Ram
// const express=require("express");
import express from "express";
// const dotenv=require("dotenv");
import dotenv from "dotenv";
// const connectedDB = require("./Config/db").default;
import connectedDB from "./Config/db.js";
// const authRoute=require("./Routes/auth.routes").default;
import authRoute from "./Routes/auth.routes.js";

import cors from "cors";

import helmet from "helmet";

import { errorHandler } from "./Middleware/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import http from "http";

import cookieParser from "cookie-parser";

import { Server } from "socket.io";

connectedDB();

const swaggerDocument = YAML.load("./docs/swagger.yaml");

const app = express();

const server = http.createServer(app);

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
// NEW: Create a new Socket.IO server and attach it to our HTTP server.
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(errorHandler);
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Apply CORS to all requests
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Api connected and running");
});
app.use("/api/auth", authRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// NEW: Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  // This is a simple listener for incoming messages
  socket.on("chat message", (msg) => {
    console.log("Received message:", msg);
    // For now, we just send it right back to all connected clients
    const response = genereteReponse();
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server is running in port 3000");
});
