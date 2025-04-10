// 🌐 Core dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// 🧩 Local modules
const upload = require("./middleware/upload"); // File upload middleware
const Image = require("./models/Image"); // Mongoose Image model
const userRoutes = require("./Routes/userRoutes"); // ✅ User routes
const pokemonRoutes = require("./Routes/pokemonRoutes"); // ✅ Pokémon routes

// 📦 Load environment variables
dotenv.config();

// 🚀 Initialize app before using it
const app = express();

// 📘 Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "College Now API",
      version: "0.7", // ✅ Fixed semver
      description: "My teacher made me do this",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./app.js", "./routes/*.js"], // ✅ Match all route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🛡️ Middleware
app.use(express.json());
app.use(cors());

// 🔗 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// 📤 File upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const result = await Image.uploadToCloudinary(req.file.buffer);

    const newImage = new Image({
      url: result.secure_url,
      public_id: result.public_id,
    });
    await newImage.save();

    res.json({
      message: "File uploaded successfully!",
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Routes
app.use("/users", userRoutes);
app.use("/pokemon", pokemonRoutes); // ✅ Added Pokémon routes

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
