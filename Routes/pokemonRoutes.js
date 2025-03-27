const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemonController");

router.get("/", pokemonController.getPokemon); // Get all Pokémon (paginated)
router.post("/", pokemonController.addPokemon); // Add new Pokémon
router.get("/:id", pokemonController.getPokemonById); // Get single Pokémon by ID
router.delete("/:id", pokemonController.deletePokemon); // Delete Pokémon

module.exports = router;
