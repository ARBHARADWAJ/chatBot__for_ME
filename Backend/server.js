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

import {errorHandler} from "./Middleware/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

connectedDB();



const swaggerDocument = YAML.load("./docs/swagger.yaml");


const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(errorHandler);


app.use(cors({
    origin: 'http://localhost:5173', // The origin of your frontend app
    credentials: true
}));

app.get("/", (req, res) => {
  res.send("Api connected and running");
});
app.use("/api/auth", authRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("server is running in port 3000");
});
