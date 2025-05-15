const User = require('../models/User');
const Pokemon = require('../models/Pokemon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, username: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get the logged-in user with populated ownedPokemons
exports.getUserWithPokemons = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('ownedPokemons');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a Pokémon to logged-in user's ownedPokemons array
exports.addPokemonToUser = async (req, res) => {
  const { pokemonId } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.ownedPokemons.includes(pokemonId)) {
      user.ownedPokemons.push(pokemonId);
      await user.save();
    }

    res.json({ message: 'Pokémon added to user', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove a Pokémon from logged-in user's ownedPokemons array
exports.removePokemonFromUser = async (req, res) => {
  const { pokemonId } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.ownedPokemons = user.ownedPokemons.filter(
      (id) => id.toString() !== pokemonId
    );

    await user.save();

    res.json({ message: 'Pokémon removed from user', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a random Pokémon to logged-in user's ownedPokemons array
exports.addRandomPokemonToUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const count = await Pokemon.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No Pokémon found in database' });
    }

    const random = Math.floor(Math.random() * count);
    const randomPokemon = await Pokemon.findOne().skip(random);

    if (!randomPokemon) {
      return res.status(404).json({ message: 'Failed to find a random Pokémon' });
    }

    if (!user.ownedPokemons.includes(randomPokemon._id)) {
      user.ownedPokemons.push(randomPokemon._id);
      await user.save();
    }

    res.json({ message: 'Random Pokémon added to user', pokemon: randomPokemon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
