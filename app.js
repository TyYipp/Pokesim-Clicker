const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import the user routes
const userRoutes = require('./routes/userRoutes');

dotenv.config();  // Load environment variables

const app = express();
app.use(express.json());  // Middleware to parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the user routes for all /users endpoints
app.use('/users', userRoutes);  // This tells Express to use routes in userRoutes.js for all /users endpoints

// Handle 404 errors for unknown routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
