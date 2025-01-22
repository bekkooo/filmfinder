const apiKey = '99e0e9856667065508a808a4376007a9';
const baseUrl = 'https://api.themoviedb.org/3/discover/movie';

async function fetchMovies() {
    const rating = document.getElementById('rating').value;
    const year = document.getElementById('year').value;
    const runtime = document.getElementById('runtime').value;
    const genres = Array.from(document.getElementById('genres').selectedOptions).map(opt => opt.value);
    const language = document.getElementById('language').value;

    const url = `${baseUrl}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&vote_average.gte=${rating}&primary_release_year=${year}&with_genres=${genres.join(',')}&with_original_language=${language}&with_runtime.gte=${runtime}`;
    console.log("Fetching data from:", url);

    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '<div class="loader">Loading...</div>';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const data = await response.json();
        const movies = data.results || [];
        movieList.innerHTML = '';

        if (movies.length === 0) {
            movieList.innerHTML = '<p>No results found. Try adjusting the filters.</p>';
        } else {
            movies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>Rating: ${movie.vote_average || 'N/A'}</p>
                    <p>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                `;
                movieList.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        movieList.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
}

// Events for instant filtering
['rating', 'year', 'runtime', 'genres', 'language'].forEach(id => {
    const element = document.getElementById(id);
    element.addEventListener(id === 'genres' ? 'change' : 'input', fetchMovies);
});

// Initial fetch on page load
fetchMovies();
