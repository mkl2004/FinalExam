const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imdbId: {
    type: String,
    required: true,
    unique: true
  },
  year: String,
  rated: String,
  genre: [String],
  director: String,
  plot: String,
  posterUrl: String,
  imdbRating: String,
  runtime: String,
  
  myRating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  myReview: {
    type: String,
    required: true
  },
  recommendedForAges: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);