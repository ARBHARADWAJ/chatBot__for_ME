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
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import generateResponse from "./Utils/generateResponses.js";
import jwt from "jsonwebtoken";
import {
  createChatSession,
  handleChatMessages,
  loadChatSessions,
  loadChatMessages,
} from "./Controller/chat.controller.js";
import chatRoute from "./Routes/chat.Routes.js";
import { connectRedis } from "./Config/redis.js";

// import { load } from "yamljs";

dotenv.config();
connectedDB();
connectRedis();

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
// app.use("/api/chat", chatRoute);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// Backend/server.js
export const apikeyforgoogleapi = () => {
  return process.env.GOOGLE_API_KEY;
};

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error("Middleware FAIL: No token provided in handshake.");
      return next(new Error("Authentication error: No token provided"));
    }
    const secret = process.env.JWT_SECRET;
    // console.log(secret, "here is it ");

    if (!secret) {
      console.error("Middleware FAIL: JWT_SECRET is not loaded in .env file!");
      return next(new Error("Server configuration error"));
    }
    const decoded = jwt.verify(token, secret);
    socket.userId = decoded.id;
    next();
    // All good, allow connection!
  } catch (error) {
    console.error(
      "Middleware FAIL: Error during token verification.",
      error.message
    );
    return next(new Error(`Authentication error: ${error.message}`));
  }
});

io.on("connection", (socket) => {
  console.log(
    `✅ User connected: ${socket.userId} with socket ID: ${socket.id}`
  );
  // socket.on("chat message", async (userMessage) => {
  //   try {
  //     console.log(
  //       "received message from user",
  //       socket.userId,
  //       ": ",
  //       userMessage
  //     );

  //     const usermessage = new Message({
  //       userId: socket.userId,
  //       message: userMessage,
  //       sender: "user",
  //     });

  //     //need to save before model build
  //     const generatedResponse = await generateResponse(userMessage);

  //     const botmsg = new Message({
  //       userId: socket.userId,
  //       message: generatedResponse,
  //       sender: "bot",
  //     });
  //     //this one aslo need to save
  //     socket.emit("chat message", { sender: "bot", text: generatedResponse });
  //   } catch (error) {
  //     console.error("Socket Auth Error:", error.message); // 👈 CHECK YOUR TERMINAL FOR THIS
  //     socket.emit("chat message", {
  //       sender: "bot",
  //       text: "Sorry, I encountered an error processing your message.",
  //     });
  //   }
  //   socket.on("disconnect", (reason) => {
  //     console.log(`❌ User disconnected: ${socket.userId}, Reason: ${reason}`);
  //   });
  // });
  socket.on("create_new_chat", (data) => createChatSession(socket, data));
  socket.on("chat message", (data) => {
    handleChatMessages(socket, data);
  });
  socket.on("load_sessions", (data) => {
    loadChatSessions(socket, data);
  });
  socket.on("load_messages", (data) => {
    loadChatMessages(socket, data);
  });
});

server.listen(3000, () => {
  console.log("server is running in port 3000");
});


// Chat session schema (for reference)
// chatSessionId: {
//   type: String, // <-- change from ObjectId to String
//   required: true,
// }
