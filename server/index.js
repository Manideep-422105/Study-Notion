const express = require("express");
const app = express();

// Handle uncaught exceptions gracefully
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

const userRoutes = require("./routes/User");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");
const CourseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const fileUpload = require("express-fileupload");
const { cloudnairyconnect } = require("./config/cloudinary");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to the database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
// const whitelist = process.env.CORS_ORIGIN || "https://study-notion-five-pearl.vercel.app";

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Connect to cloudinary
cloudnairyconnect();

// Route handling
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", CourseRoutes);
app.use("/api/v1/contact", require("./routes/ContactUs"));

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Express Error Handler:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// Handle unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
