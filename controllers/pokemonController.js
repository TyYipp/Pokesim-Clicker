const Pokemon = require("../models/Pokemon");

// Get Pokémon with pagination & optional search
exports.getPokemon = async (req, res) => {
    const page = parseInt(req.query.p) || 1;
    const limit = 1; // Pokémon per page
    const search = req.query.name || ''; 

    try {
        const query = search ? { name: new RegExp(search, 'i') } : {}; // Case-insensitive search
        const total = await Pokemon.countDocuments(query);
        const pokemonList = await Pokemon.find(query)
            .sort({ name: 1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            pokemon: pokemonList
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new Pokémon
exports.addPokemon = async (req, res) => {
    try {
        const { name, multiplier, image } = req.body;
        const newPokemon = new Pokemon({ name, multiplier, image });
        await newPokemon.save();
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single Pokémon by ID
exports.getPokemonById = async (req, res) => {
    try {
        const pokemon = await Pokemon.findById(req.params.id);
        if (!pokemon) return res.status(404).json({ message: "Pokémon not found" });
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Pokémon by ID
exports.deletePokemon = async (req, res) => {
    try {
        const deletedPokemon = await Pokemon.findByIdAndDelete(req.params.id);
        if (!deletedPokemon) return res.status(404).json({ message: "Pokémon not found" });
        res.json({ message: "Pokémon deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
