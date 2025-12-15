// Handle form submission
document.getElementById('preferenceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const genre = document.getElementById('genre').value;
    const age = document.getElementById('age').value;
    const mood = document.getElementById('mood').value;
    
    await getRecommendations(genre, age, mood);
  });
  
  // Fetch recommendations from backend
  async function getRecommendations(genre, age, mood) {
    try {
      const resultsSection = document.getElementById('resultsSection');
      resultsSection.style.display = 'block';
      document.getElementById('moviesGrid').innerHTML = '<div class="loading">Finding movies...</div>';
      
      let url = `/api/movies/recommendations?age=${age}`;
      if (genre && genre !== '') url += `&genre=${encodeURIComponent(genre)}`;
      if (mood && mood !== '') url += `&mood=${encodeURIComponent(mood)}`;
      
      const response = await fetch(url);
      const movies = await response.json();
      
      displayMovies(movies);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      document.getElementById('moviesGrid').innerHTML = 
        '<div class="no-results"><p>Error loading movies. Please try again.</p></div>';
    }
  }
  
  // Display movies in grid
  function displayMovies(movies) {
    const grid = document.getElementById('moviesGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    if (movies.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <p>No movies found matching your preferences.</p>
        </div>
      `;
      resultsCount.textContent = '';
      return;
    }
    
    resultsCount.textContent = `Found ${movies.length} movie${movies.length !== 1 ? 's' : ''} for you!`;
    
    grid.innerHTML = '';
    
    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      
      movieCard.innerHTML = `
        <img src="${movie.posterUrl !== 'N/A' ? movie.posterUrl : 'https://via.placeholder.com/280x420'}" 
             alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          
          <div class="movie-meta">
            <span class="meta-item">${movie.year}</span>
            <span class="meta-item">${movie.rated}</span>
            <span class="meta-item">⭐ ${movie.imdbRating}</span>
          </div>
          
          <div class="movie-genres">
            ${movie.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
          </div>
          
          <p class="movie-plot">${movie.plot}</p>
          
          <div class="my-review-section">
            <div class="review-header">
              <span class="review-label">My Review</span>
              <span class="my-rating">★ ${movie.myRating}/10</span>
            </div>
            <p class="my-review-text">"${movie.myReview}"</p>
          </div>
        </div>
      `;
      
      grid.appendChild(movieCard);
    });
  }