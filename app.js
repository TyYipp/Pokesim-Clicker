const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const exphbs = require("express-handlebars");

const upload = require("./middleware/upload");
const Image = require("./models/Image");  // Image model with uploadToCloudinary method
const userRoutes = require("./routes/userRoutes");
const pokemonRoutes = require("./routes/pokemonRoutes");       // Your normal pokemon API routes (get, add, delete etc.)
const adminRoutes = require("./routes/adminRoutes");
const loginRoute = require("./routes/loginRoutes");
const editUserRoutes = require("./routes/editUser");            // Edit User routes
const editPokemonRoutes = require("./routes/editPokemon");      // Edit Pokemon routes (GET edit form, POST update, POST delete)

dotenv.config();

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "College Now API",
      version: "0.7",
      description: "My teacher made me do this",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./app.js", "./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// File upload route WITHOUT saving to MongoDB
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  try {
    const result = await Image.uploadToCloudinary(req.file.buffer);
    // Do NOT save result to MongoDB, just return the URL and public_id
    res.json({ message: "File uploaded successfully!", url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handlebars setup with prototype access enabled
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Render main views
app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/clicker", (req, res) => res.render("clicker"));

// Routes
app.use("/users", userRoutes);
app.use("/pokemon", pokemonRoutes);           // API style routes for Pokémon
app.use("/admin", adminRoutes);
app.use("/auth", loginRoute);
app.use("/admin", editUserRoutes);              // Edit users admin routes

// Important: Mount editPokemon routes to root or admin based on your URL design
app.use("/", editPokemonRoutes);                 // Edit Pokémon routes with forms (GET /pokemon/:id/edit, POST /pokemon/:id/edit, POST /pokemon/:id/delete)

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;
