import logger from "../Utils/loggers.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const errorHandler2 = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl}-> ${err.message}`);
  res.status(500).json({ message: err.message });
};

export { errorHandler, errorHandler2 };
