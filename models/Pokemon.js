const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    multiplier: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'pokemon', // force Mongoose to use this exact collection name
  }
);

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
