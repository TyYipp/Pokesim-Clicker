const express = require('express');
const router = express.Router();
const Pokemon = require('../models/Pokemon');  // Adjust path if needed

// Route to display the edit Pokémon form
router.get('/pokemon/:id/edit', async (req, res) => {
  const { id } = req.params;

  try {
    const pokemon = await Pokemon.findById(id);
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon not found!' });
    }
    // Render the view from admin folder
    res.render('admin/editPokemon', { pokemon });
  } catch (err) {
    console.error('Error fetching Pokémon:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Route to handle updating Pokémon data
router.post('/pokemon/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { name, multiplier, image } = req.body;

  try {
    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      id,
      { name, multiplier, image },
      { new: true, runValidators: true }
    );

    if (!updatedPokemon) {
      return res.status(404).json({ error: 'Pokémon not found!' });
    }

    res.redirect('/pokemon');  // Redirect to your manage page
  } catch (err) {
    console.error('Error updating Pokémon:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Route to handle Pokémon deletion
router.post('/pokemon/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Pokemon.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Pokémon not found!' });
    }
    res.redirect('/pokemon');  // Redirect to your manage page
  } catch (err) {
    console.error('Error deleting Pokémon:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
