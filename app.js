const apiKey = "99e0e9856667065508a808a4376007a9"; // Setze hier deinen API-Schlüssel ein
if (!apiKey) alert("API key is not set. Please set your TMDB API key.");

let type = "movie";
let rating = 6.5; // Set default rating to 6.5
let minYear = 1900; // Set default minYear to 1900
let maxYear = 2025; // Set default maxYear to 2025
let sortBy = "popularity.desc";
let selectedGenres = [];

// Filme abrufen
async function fetchMovies() {
    if (!apiKey) return;

    const genreString = selectedGenres.join(",");
    const votes = document.getElementById("votes").value;
    sortBy = document.getElementById("sort").value;

    const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=en-US&sort_by=${sortBy}&vote_average.gte=${rating}&vote_count.gte=${votes}&primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31&with_genres=${genreString}`;

    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(url);
        const data = await response.json();

        movieList.innerHTML = "";
        for (const movie of data.results) {
            const card = document.createElement("div");
            card.className = "film-card";
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title || movie.name}">
                <h3>${movie.title || movie.name}</h3>
                <p>Rating: ${movie.vote_average}</p>
                <p>${movie.release_date || movie.first_air_date}</p>
            `;
            card.onclick = () => playTrailer(movie.id);
            movieList.appendChild(card);
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        movieList.innerHTML = "<p>Error loading movies. Please try again later.</p>";
    }
}

// Trailer abspielen
async function playTrailer(movieId) {
    const trailerModal = document.getElementById("trailer-modal");
    const trailerFrame = document.getElementById("trailer-frame");

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
        const data = await response.json();
        const trailer = data.results.find(video => video.type === "Trailer");

        if (trailer) {
            trailerFrame.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`;
            trailerModal.style.display = "flex";
        } else {
            alert("No trailer available.");
        }
    } catch (error) {
        console.error("Error loading trailer:", error);
        alert("Error loading trailer.");
    }
}

// Trailer schließen
function stopTrailer() {
    const trailerModal = document.getElementById("trailer-modal");
    const trailerFrame = document.getElementById("trailer-frame");

    trailerFrame.src = "";
    trailerModal.style.display = "none";
}

// Filter- und Sortierlogik
function setType(selectedType) {
    type = selectedType;
    document.getElementById("movies-btn").classList.toggle("active", selectedType === "movie");
    document.getElementById("tv-btn").classList.toggle("active", selectedType === "tv");
    fetchMovies();
}

function changeRating(delta) {
    rating = Math.max(0, Math.min(10, rating + delta));
    document.getElementById("rating-value").textContent = rating.toFixed(1);
    fetchMovies();
}

function updateVotes() {
    const votes = document.getElementById("votes").value;
    document.getElementById("votes-value").textContent = votes;
    fetchMovies();
}

function initializeYearPickers() {
    const minYearPicker = document.getElementById("minYearPicker");
    const maxYearPicker = document.getElementById("maxYearPicker");

    for (let year = 1900; year <= 2025; year++) {
        const optionMin = document.createElement("option");
        const optionMax = document.createElement("option");

        optionMin.value = year;
        optionMin.textContent = year;
        optionMax.value = year;
        optionMax.textContent = year;

        if (year === 1900) optionMin.selected = true; // Standardwert
        if (year === 2025) optionMax.selected = true;

        minYearPicker.appendChild(optionMin);
        maxYearPicker.appendChild(optionMax);
    }
}

function updateYearRange() {
    minYear = parseInt(document.getElementById("minYearPicker").value, 10);
    maxYear = parseInt(document.getElementById("maxYearPicker").value, 10);
    fetchMovies(); // Ergebnisse neu laden
}

function changeYear(target, delta) {
    if (target === "minYear") {
        minYear = Math.max(1900, minYear + delta); // Ensure it doesn't go below 1900
        document.getElementById("minYear-value").textContent = minYear;
    } else if (target === "maxYear") {
        maxYear = Math.min(2025, maxYear + delta); // Ensure it doesn't go above 2025
        document.getElementById("maxYear-value").textContent = maxYear;
    }
    if (minYear > maxYear) {
        minYear = maxYear; // Prevent minYear from being greater than maxYear
        document.getElementById("minYear-value").textContent = minYear;
    }
    fetchMovies(); // Fetch movies again
}

function updateGenres() {
    const genreButtons = document.querySelectorAll(".genre-btn");
    genreButtons.forEach(button => {
        button.addEventListener("click", () => {
            const genreId = button.getAttribute("data-genre");
            if (selectedGenres.includes(genreId)) {
                selectedGenres = selectedGenres.filter(id => id !== genreId);
                button.classList.remove("selected");
            } else {
                selectedGenres.push(genreId);
                button.classList.add("selected");
            }
            fetchMovies();
        });
    });
}

// Initialer Aufruf
initializeYearPickers();
updateGenres();
fetchMovies();
