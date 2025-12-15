const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const movieRoutes = require('./routes/movieRoutes');
app.use('/api/movies', movieRoutes);

// API 
app.get('/api/search-movies', async (req, res) => {
  const { genre, year, type } = req.query;
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${genre}&y=${year}&type=${type}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Home Page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.shtml');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});