const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

const movieList = [
    {
    imdbId: 'tt31193180', // Sinners
    myRating: 10, 
    myReview: 'One of the best movies ever made. Ryan Coogler manages to perfectly weave music, culture, political messaging, and cinemtography together. SO many details.',
    recommendedForAges: '13+', //13+, etc.
    mood: 'Thrilling' // String
    },
  {
    imdbId: 'tt26581740', // Weapons
    myRating: 8.5, 
    myReview: 'This was a great movie, I loved the POV switches, and I was not expecting the twist, yet I feel like it just misses having a satisfying ending',
    recommendedForAges: '18+', //13+, etc.
    mood: 'Thrilling' // String
  },
  {
    imdbId: 'tt5950044', // Superman
    myRating: 10, 
    myReview: 'This was the first superhero movie I have ever seen and I was blown away at the sophistication of the submessaging in the plot. THe action scenes and cinematography pulled it all together!',
    recommendedForAges: '13+', //13+, etc.
    mood: 'Exciting' // String
  },
  {
    imdbId: 'tt0119698', // Princess Mononoke
    myRating: 10, 
    myReview: 'This is my 2nd favorite Studio Ghibli film (my number one only beats this one due to nostalgia). The art is gorgeous, the story is great, I almost went vegan',
    recommendedForAges: '13+', //13+, etc.
    mood: 'Exciting' // String
  },
  {
    imdbId: 'tt0096283', // My Neighbor Totoro
    myRating: 10, 
    myReview: 'Best Studio Ghibli Movie! Everytime I watch it I am transported to the universe and my desire for a Totoro of my own increases. Nostalgia also helps but not needed to enjoy.',
    recommendedForAges: 'All ages', //13+, etc.
    mood: 'Whimsy' // String
  },
  {
    imdbId: 'tt8110652', // Bodies Bodies Bodies
    myRating: 6.5, 
    myReview: 'This movie is SOOO stupid but actually hilarious. You need to go into it knowing it is ridiculous but if you embrace it you will enjoy it',
    recommendedForAges: '18+', //13+, etc.
    mood: 'Whimsy' // String
  },
  {
    imdbId: 'tt20215234', // Conclave
    myRating: 9, 
    myReview: 'I have physically been in the Vatican itself and this movie made me more interested in the topic than flying across the Atlantic did. The drama is insane in this too. Good job to the director for making a slow/non-dynamic story very interesting and moving',
    recommendedForAges: 'All ages', //13+, etc.
    mood: 'Dramatic' // String
  },
  {
    imdbId: 'tt0294870', // Rent
    myRating: 10, 
    myReview: 'Rent is such a good musical and all the songs are fantastic and yeah it is heartbreaking but the songs are all bops',
    recommendedForAges: '13+', //13+, etc.
    mood: 'Whimsy' // String
  },
  {
    imdbId: 'tt9764362', // The Menu
    myRating: 10, 
    myReview: 'I watched this a few years ago so I do not remember details but this movie will keep you on the edge of your seat',
    recommendedForAges: '18+', //13+, etc.
    mood: 'Thrilling' // String
  },
  {
    imdbId: 'tt26304178', // O'Dessa
    myRating: 8, 
    myReview: 'Gender-swapped Orpheus and Eurydice; The whole world is confusing and not developed enough but Sadie Sink\'s performance makes it good',
    recommendedForAges: '13+', //13+, etc.
    mood: 'Whimsy' // String
  },
  {
    imdbId: 'tt9701940', // Fear Street 2
    myRating: 10, 
    myReview: 'The whole triology is good but this one is my favorite! Horror movie set at a camp + suprise ending',
    recommendedForAges: '18+', //13+, etc.
    mood: 'Thrilling' // String
  },
  {
    imdbId: 'tt13560574', // X
    myRating: 10, 
    myReview: 'Another great trilogy - Mia Goth is iconic in all 3 movies',
    recommendedForAges: '18+', //13+, etc.
    mood: 'Thrilling' // String
  }


];

async function fetchMovieData(imdbId) {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`
    );
    return await response.json();
  }
  
  async function seedDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✓ Connected to MongoDB');
      

      await Movie.deleteMany({});
      console.log('✓ Cleared existing movies');
      
      for (const movieData of movieList) {
        console.log(`Fetching data for ${movieData.imdbId}...`);
        const apiData = await fetchMovieData(movieData.imdbId);
        
        if (apiData.Response === 'True') {
       
          const movie = new Movie({
            title: apiData.Title,
            imdbId: apiData.imdbID,
            year: apiData.Year,
            rated: apiData.Rated,
            genre: apiData.Genre.split(', '), 
            director: apiData.Director,
            plot: apiData.Plot,
            posterUrl: apiData.Poster,
            imdbRating: apiData.imdbRating,
            runtime: apiData.Runtime,
            myRating: movieData.myRating,
            myReview: movieData.myReview,
            recommendedForAges: movieData.recommendedForAges,
            mood: movieData.mood
          });
          
          await movie.save();
          console.log(`✓ Added: ${apiData.Title}`);
        } else {
          console.log(`✗ Failed to fetch: ${movieData.imdbId} - ${apiData.Error}`);
        }
        
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      console.log('\n✓ Database seeded successfully!');
      process.exit(0);
    } catch (err) {
      console.error('✗ Error seeding database:', err);
      process.exit(1);
    }
  }
  
  seedDatabase();