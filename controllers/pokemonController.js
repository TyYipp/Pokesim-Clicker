const Pokemon = require("../models/Pokemon");

// Get all Pokémon and render view
exports.getPokemon = async (req, res) => {
  console.log("Getting all Pokémon...");
  try {
    const pokemons = await Pokemon.find();
    res.render("admin/managePokemon", { pokemons });
  } catch (err) {
    res.status(500).send("Unable to fetch Pokémon: " + err.message);
  }
};

// Show form to add new Pokémon
exports.showAddForm = (req, res) => {
  res.render("admin/addPokemon");
};

// Handle form POST to add new Pokémon
exports.addPokemon = async (req, res) => {
  console.log("Adding new Pokémon...");
  try {
    const { name, multiplier, image } = req.body;
    const newPokemon = new Pokemon({ name, multiplier, image });
    await newPokemon.save();
    res.redirect("/pokemon"); // Go back to the list after adding
  } catch (err) {
    res.status(500).send("Unable to add Pokémon: " + err.message);
  }
};

// Show form to edit a Pokémon
exports.showEditForm = async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).send("Pokémon not found");
    }
    res.render("admin/editPokemon", { pokemon });
  } catch (err) {
    res.status(500).send("Error loading edit form: " + err.message);
  }
};

// Handle POST to update a Pokémon
exports.updatePokemon = async (req, res) => {
  console.log("Updating Pokémon...");
  try {
    const { name, multiplier, image } = req.body;
    const pokemon = await Pokemon.findByIdAndUpdate(
      req.params.id,
      { name, multiplier, image },
      { new: true, runValidators: true }
    );
    if (!pokemon) {
      return res.status(404).send("Pokémon not found");
    }
    res.redirect("/pokemon");
  } catch (err) {
    res.status(500).send("Unable to update Pokémon: " + err.message);
  }
};

// Delete Pokémon
exports.deletePokemon = async (req, res) => {
  console.log("Deleting Pokémon...");
  try {
    const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
    if (!pokemon) {
      return res.status(404).send("Pokémon not found");
    }
    res.redirect("/pokemon");
  } catch (err) {
    res.status(500).send("Unable to delete Pokémon: " + err.message);
  }
};
