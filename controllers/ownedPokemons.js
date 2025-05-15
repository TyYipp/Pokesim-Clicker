const User = require('../models/User');

// Get user by ID with ownedPokemons populated
exports.getUserWithPokemons = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('ownedPokemons');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a Pokémon to the logged-in user's ownedPokemons
exports.addPokemonToUser = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { pokemonId } = req.body;

    const user = await User.findById(userId).populate('ownedPokemons');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.ownedPokemons.some(p => p._id.toString() === pokemonId)) {
      return res.status(400).json({ message: 'Pokémon already owned' });
    }

    user.ownedPokemons.push(pokemonId);
    await user.save();

    await user.populate('ownedPokemons').execPopulate();

    res.json({ message: 'Pokémon added to user', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove a Pokémon from the logged-in user's ownedPokemons
exports.removePokemonFromUser = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { pokemonId } = req.body;

    const user = await User.findById(userId).populate('ownedPokemons');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.ownedPokemons = user.ownedPokemons.filter(
      p => p._id.toString() !== pokemonId
    );

    await user.save();

    await user.populate('ownedPokemons').execPopulate();

    res.json({ message: 'Pokémon removed from user', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
