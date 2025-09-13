//Jai shree Ram
// const express=require("express");
import express from "express";
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
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import generateResponse from "./Utils/generateResponses.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
const swaggerDocument = YAML.load("./docs/swagger.yaml");

dotenv.config();
connectedDB();

const app = express();

const server = http.createServer(app);

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
// NEW: Create a new Socket.IO server and attach it to our HTTP server.
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
    cookie: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(errorHandler);
app.use(cookieParser());

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Apply CORS to all requests
app.use(cors(corsOptions));

// app.get("/", (req, res) => {
//   res.send("Api connected and running");
// });
app.use("/api/auth", authRoute);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// Backend/server.js

io.use((socket, next) => {
  console.log("\n--- New Socket Connection Attempt ---");

  try {
    // Step A: Check if the auth object and token exist
    // console.log("1. Handshake auth object:", socket.handshake.auth);
    const token = socket.handshake.auth.token;
    
    if (!token) {
      console.error("Middleware FAIL: No token provided in handshake.");
      return next(new Error("Authentication error: No token provided"));
    }
    // console.log("2. Token received:", token);

    // Step B: Check if your JWT_SECRET is loaded correctly
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("Middleware FAIL: JWT_SECRET is not loaded in .env file!");
        return next(new Error("Server configuration error"));
    }
    console.log("3. JWT_SECRET is loaded.");

    // Step C: Try to verify the token
    const decoded = jwt.verify(token, secret);
    console.log("4. Token verified successfully. Decoded payload:", decoded);

    socket.userId = decoded.id;
    next(); // All good, allow connection!

  } catch (error) {
    // This will catch errors from jwt.verify (e.g., "invalid signature", "jwt expired")
    console.error("Middleware FAIL: Error during token verification.", error.message);
    return next(new Error(`Authentication error: ${error.message}`));
  }
});

io.on("connection", (socket) => {
  console.log(
    `✅ User connected: ${socket.userId} with socket ID: ${socket.id}`
  );
  socket.on("chat message", async (userMessage) => {
    try {
      console.log("received message from user",socket.userId,": ", userMessage);

      // const usermessage = new Message({
      //   userId: socket.userId,
      //   message: userMessage,
      //   sender: "user",
      // });
      //need to save before model build
      const generatedResponse = await generateResponse(userMessage);
      // const botmsg = new Message({
      //   userId: socket.userId,
      //   message: generatedResponse,
      //   sender: "bot",
      // });
      //this one aslo need to save
      socket.emit("chat message", { sender: "bot", text: generatedResponse });
    } catch (error) {
      console.error("Socket Auth Error:", error.message); // 👈 CHECK YOUR TERMINAL FOR THIS
      socket.emit("chat message", {
        sender: "bot",
        text: "Sorry, I encountered an error processing your message.",
      });
    }
    socket.on("disconnect", (reason) => {
      console.log(`❌ User disconnected: ${socket.userId}, Reason: ${reason}`);
    });
  });
});

server.listen(3000, () => {
  console.log("server is running in port 3000");
});
