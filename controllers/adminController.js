const User = require("../models/User");
const Pokemon = require("../models/Pokemon");

exports.dashboard = (req, res) => {
  // Logic for the admin dashboard page
  // You can add additional logic here to display user stats or other info for admins
  res.render("admin/dashboard", { user: req.user }); // 'req.user' will be set by the 'isAuthenticated' middleware
};

exports.manageUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users
    res.render("admin/manageUsers", { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Unable to fetch users", details: err.message });
  }
};

exports.managePokemon = async (req, res) => {
  try {
    const pokemons = await Pokemon.find(); // Retrieve all pokemons
    res.render("admin/managePokemon", { pokemons });
  } catch (err) {
    console.error("Error fetching Pokémon:", err);
    res.status(500).json({ error: "Unable to fetch Pokémon", details: err.message });
  }
};
