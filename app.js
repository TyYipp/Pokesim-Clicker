const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const upload = require('./middleware/upload'); // Import the upload middleware
const Image = require('./models/Image'); // Import the Image model

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// File Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    // Upload the file to Cloudinary using the Image model's method
    const result = await Image.uploadToCloudinary(req.file.buffer);

    // Save image info (URL and public ID) to the database
    const newImage = new Image({
      url: result.secure_url,  // Cloudinary URL
      public_id: result.public_id,  // Cloudinary public ID
    });
    await newImage.save();

    // Respond with success and image URL
    res.json({
      message: "File uploaded successfully!",
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
