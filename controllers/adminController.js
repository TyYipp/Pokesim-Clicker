const User = require('../models/User');
const Pokemon = require('../models/Pokemon');

exports.dashboard = (req, res) => {
  // Convert ObjectId to string for handlebars
  const user = {
    _id: req.user._id.toString(),
    name: req.user.name,
    role: req.user.role,
    email: req.user.email,
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
