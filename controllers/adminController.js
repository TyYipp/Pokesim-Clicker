const User = require('../models/User');
const Pokemon = require('../models/Pokemon');

exports.dashboard = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user info' });
  }

  // Defensive: check userId and username presence
  const user = {
    _id: req.user.userId ? req.user.userId.toString() : null,
    name: req.user.username || '',
    role: req.user.role || '',
    email: req.user.email || '',
  };

  res.render('admin/dashboard', { user });
};

exports.manageUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/manageUsers', { users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Unable to fetch users', details: err.message });
  }
};

exports.managePokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.render('admin/managePokemon', { pokemons });
  } catch (err) {
    console.error('Error fetching Pokémon:', err);
    res.status(500).json({ error: 'Unable to fetch Pokémon', details: err.message });
  }
};
