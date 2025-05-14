const Pokemon = require("../models/Pokemon");

// Get all Pokémon
exports.getPokemon = async (req, res) => {
  console.log("Getting all Pokémon..."); // Debugging log
  try {
    const pokemon = await Pokemon.find();
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch Pokémon" });
  }
};

// Add a new Pokémon
exports.addPokemon = async (req, res) => {
  console.log("Adding new Pokémon..."); // Debugging log
  try {
    const { name, multiplier, image } = req.body;
    const newPokemon = new Pokemon({ name, multiplier, image });
    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (err) {
    res.status(500).json({ error: "Unable to add Pokémon" });
  }
};

// Get Pokémon by ID
exports.getPokemonById = async (req, res) => {
  console.log("Getting Pokémon by ID..."); // Debugging log
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon not found" });
    }
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch Pokémon by ID" });
  }
};

// Update Pokémon by ID
exports.updatePokemon = async (req, res) => {
  console.log("Updating Pokémon..."); // Debugging log
  try {
    const pokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon not found" });
    }
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: "Unable to update Pokémon" });
  }
};

// Delete Pokémon by ID
exports.deletePokemon = async (req, res) => {
  console.log("Deleting Pokémon..."); // Debugging log
  try {
    const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon not found" });
    }
    res.json({ message: "Pokémon deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Unable to delete Pokémon" });
  }
};
