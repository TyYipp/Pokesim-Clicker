// 🌐 Core dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const exphbs = require("express-handlebars");

// 🧩 Local modules
const upload = require("./middleware/upload");
const Image = require("./models/Image");
const userRoutes = require("./Routes/userRoutes");
const pokemonRoutes = require("./Routes/pokemonRoutes");

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
      version: "0.7",
      description: "My teacher made me do this",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./app.js", "./routes/*.js"],
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
app.use("/pokemon", pokemonRoutes);

// 🎨 View engine setup for Handlebars
app.engine("handlebars", exphbs.engine({
  defaultLayout: 'main', // Use the 'main' layout by default
}));
app.set("view engine", "handlebars");
app.set("views", "./views");

// 🍓 Sample Handlebars route
app.get("/", (req, res) => {
  const fruits = [
    { name: "Apple", favorite: false },
    { name: "Banana", favorite: false },
    { name: "Cherry", favorite: false },
    { name: "Durian", favorite: true },
  ];
  res.render("fruit", { fruits });
});

// 🚀 New test route
app.get('/test', (req, res) => {
  res.render('test'); // Render the test.handlebars view
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
