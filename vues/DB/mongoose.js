const mongoose = require('mongoose');
require('dotenv').config(); // Make sure dotenv is at the top

const mongoURI = process.env.MONGODB_URI; // Fetch URI from environment variables

if (!mongoURI) {
  console.error("MONGODB_URI is not defined in .env file.");
  process.exit(1); // Exit if no URI is found
}

mongoose.connect(mongoURI) // Removed deprecated options
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
