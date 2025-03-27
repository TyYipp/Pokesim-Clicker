const mongoose = require("mongoose");

// Define the Pokémon Schema
const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  multiplier: { type: Number, required: true },
  image: { type: String, required: true }
});

// Create the Pokémon model
const Pokemon = mongoose.model("Pokemon", pokemonSchema);

module.exports = Pokemon;
