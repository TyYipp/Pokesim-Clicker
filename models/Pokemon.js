const mongoose = require('mongoose');

// Define the Pokemon Schema
const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  multiplier: { type: Number, required: true },
  image: { type: String, required: true }
});

// Create the Pokemon model
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
