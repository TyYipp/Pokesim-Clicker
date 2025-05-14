const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemonController");

// Get all Pokémon
router.get("/", pokemonController.getPokemon);

// Add a new Pokémon
router.post("/", pokemonController.addPokemon);

// Get a Pokémon by ID
router.get("/:id", pokemonController.getPokemonById);

// Update a Pokémon by ID
router.put("/:id", pokemonController.updatePokemon);

// Delete a Pokémon by ID
router.delete("/:id", pokemonController.deletePokemon);

module.exports = router;
