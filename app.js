const apiKey = '99e0e9856667065508a808a4376007a9';
const baseUrl = 'https://api.themoviedb.org/3/discover/movie';

async function fetchMovies() {
    const rating = document.getElementById('rating').value || 5.5;
    const votes = document.getElementById('votes').value || 10000;
    const minYear = document.getElementById('minYear').value || "2000";
    const maxYear = document.getElementById('maxYear').value || "2023";
    const sort = document.getElementById('sort').value || 'popularity.desc';

    const genres = Array.from(document.querySelectorAll('.genre-button.selected'))
        .map(btn => btn.dataset.genre)
        .join(',');

    const type = document.querySelector('.type-button.selected').dataset.type;

    const url = `${baseUrl}?api_key=${apiKey}&language=en-US&sort_by=${sort}&vote_average.gte=${rating}&vote_count.gte=${votes}&primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31&with_genres=${genres}&with_original_language=en&type=${type}`;

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
        movieList.innerHTML = `<p>Error fetching data: ${error.message}. Please try again later.</p>`;
    }
}

function toggleVotes() {
    const collapsible = document.querySelector('.collapsible');
    const arrow = document.getElementById('votes-arrow');
    collapsible.classList.toggle('open');
    arrow.classList.toggle('rotated'); // Die CSS-Klasse "rotated" sorgt für die Drehung
}


document.querySelectorAll('.genre-button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('selected');
        fetchMovies();
    });
});

document.querySelectorAll('.type-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        fetchMovies();
    });
});

['rating', 'votes', 'minYear', 'maxYear', 'sort'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        updateFilterValues();
        fetchMovies();
    });
});

function updateFilterValues() {
    document.getElementById('rating-value').textContent = document.getElementById('rating').value;
    document.getElementById('votes-value').textContent = document.getElementById('votes').value;
}

updateFilterValues();
fetchMovies();
