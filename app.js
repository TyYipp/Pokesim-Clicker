const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB (removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/users", userRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
