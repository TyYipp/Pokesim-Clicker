const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemonController");

// List all Pokémon and render
router.get("/", pokemonController.getPokemon);

// Show form to add a new Pokémon
router.get("/add", pokemonController.showAddForm);

// Handle form submission to add a new Pokémon
router.post("/add", pokemonController.addPokemon);

// Show form to edit a Pokémon by id
router.get("/edit/:id", pokemonController.showEditForm);

// Handle update of a Pokémon by id
router.post("/edit/:id", pokemonController.updatePokemon);

// Handle delete of a Pokémon by id
router.post("/delete/:id", pokemonController.deletePokemon);

module.exports = router;
