const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET filtered movies based on user preferences
router.get('/recommendations', async (req, res) => {
  try {
    const { genre, age, mood } = req.query;
    
    let query = {};
    
    if (genre && genre !== 'any') {
      query.genre = genre;
    }
    
    if (mood && mood !== 'any') {
      query.mood = mood;
    }
    
    let movies = await Movie.find(query);
    
    // Filter by age
    if (age) {
      movies = movies.filter(movie => {
        return isAppropriateForAge(movie.recommendedForAges, parseInt(age));
      });
    }
    
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function isAppropriateForAge(recommendedAge, userAge) {
  if (recommendedAge === 'All ages') return true;
  
  const match = recommendedAge.match(/(\d+)\+/);
  if (match) {
    const minAge = parseInt(match[1]);
    return userAge >= minAge;
  }
  
  return true;
}

// GET - all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ addedAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - new movie
router.post('/', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;