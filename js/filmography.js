class FilmographyModalManager {
    constructor() {
        this.bookModal = document.getElementById('book-modal');
        this.movieModal = document.getElementById('movie-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.allBooks = [];
        this.allMovies = [];

        this.initModalEvents();
    }

    initModalEvents() {
        const closeButtons = document.querySelectorAll('.modal_window .cross');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        this.modalOverlay.addEventListener('click', () => this.closeAllModals());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });
    }

    closeAllModals() {
        this.bookModal.style.display = 'none';
        this.movieModal.style.display = 'none';
        this.modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    openBookModal(bookId) {
        const book = this.allBooks.find(b => b.id === bookId);
        if (!book) return;

        this.fillBookModal(book);
        this.bookModal.style.display = 'block';
        this.modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    openMovieModal(movieId) {
        const movie = this.allMovies.find(m => m.id === movieId);
        if (!movie) return;

        this.fillMovieModal(movie);
        this.movieModal.style.display = 'block';
        this.modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    fillBookModal(book) {
        document.getElementById('book-title').textContent = book.title;
        document.getElementById('book-serial').textContent = `Serial: #${book.serial || 'Unknown'}`;
        document.getElementById('book-release').textContent = `Release Date: ${book.release_date || 'Unknown'}`;
        document.getElementById('book-pages').textContent = `Pages: ${book.pages || 'Unknown'}`;

        const bookImage = document.getElementById('book-image');
        bookImage.src = book.cover || mediaAPI.getDefaultBookCover();
        bookImage.alt = book.title;

        const description = document.getElementById('book-description');
        description.innerHTML = `<div>${book.summary || 'No description available'}</div>`;
    }

    fillMovieModal(movie) {
        document.getElementById('movie-title').textContent = movie.title;
        document.getElementById('movie-release').textContent = `Release Date: ${movie.release_date || 'Unknown'}`;
        document.getElementById('movie-runtime').textContent = `Runtime: ${movie.running_time || 'Unknown'}`;
        document.getElementById('movie-rating').textContent = `Rating: ${movie.rating || 'Unknown'}`;

        const movieImage = document.getElementById('movie-image');
        movieImage.src = movie.poster || mediaAPI.getDefaultMoviePoster();
        movieImage.alt = movie.title;

        const directors = document.getElementById('movie-directors');
        if (movie.directors && movie.directors.length > 0) {
            directors.innerHTML = movie.directors.map(director => `<div>${director}</div>`).join('');
        } else {
            directors.innerHTML = '<div>No director information available</div>';
        }

        const boxOffice = document.getElementById('movie-boxoffice');
        let boxOfficeHTML = '';
        if (movie.budget) boxOfficeHTML += `<div>Budget: ${movie.budget}</div>`;
        if (movie.box_office) boxOfficeHTML += `<div>Box Office: ${movie.box_office}</div>`;
        boxOffice.innerHTML = boxOfficeHTML || '<div>No financial information available</div>';
    }

    addBookClickHandlers() {
        const booksTrack = document.querySelector('.books-track');
        booksTrack.querySelectorAll('.filmography-item').forEach(card => {
            card.addEventListener('click', () => {
                const bookId = card.dataset.bookId;
                this.openBookModal(bookId);
            });
        });
    }

    addMovieClickHandlers() {
        const moviesTrack = document.querySelector('.movies-track');
        moviesTrack.querySelectorAll('.filmography-item').forEach(card => {
            card.addEventListener('click', () => {
                const movieId = card.dataset.movieId;
                this.openMovieModal(movieId);
            });
        });
    }

    setBooksData(books) {
        this.allBooks = books;
    }

    setMoviesData(movies) {
        this.allMovies = movies;
    }
}

function initCarousel(trackSelector, prevSelector, nextSelector) {
    const track = document.querySelector(trackSelector);
    const items = track.querySelectorAll('.filmography-item');
    const prevBtn = document.querySelector(prevSelector);
    const nextBtn = document.querySelector(nextSelector);

    if (!track || items.length === 0) return;

    let currentIndex = 0;

    function getItemsToShow() {
        if (window.innerWidth <= 768) {
            return 2;
        } else {
            return 4;
        }
    }

    let itemsToShow = getItemsToShow();
    let maxIndex = Math.max(0, items.length - itemsToShow);

    function updateCarousel() {
        const itemWidth = items[0].offsetWidth + 40;
        const translateX = -currentIndex * itemWidth;
        track.style.transform = `translateX(${translateX}px)`;
        updateButtons();
    }

    function updateButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        }

        if (nextBtn) {
            nextBtn.disabled = currentIndex >= maxIndex;
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        }
    }

    function handleResize() {
        const newItemsToShow = getItemsToShow();
        if (newItemsToShow !== itemsToShow) {
            itemsToShow = newItemsToShow;
            maxIndex = Math.max(0, items.length - itemsToShow);

            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            updateCarousel();
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    window.addEventListener('resize', handleResize);

    updateCarousel();
}

document.addEventListener('DOMContentLoaded', async function () {
    const modalManager = new FilmographyModalManager();

    try {
        const books = await HPapi.getBooks();
        const booksTrack = document.querySelector('.books-track');
        modalManager.setBooksData(books);

        if (books && books.length > 0) {
            booksTrack.innerHTML = books.map(book => `
                <div class="filmography-item" data-book-id="${book.id}">
                    <div class="filmography-card">
                        <div class="filmography-image">
                            <img src="${book.cover}" alt="${book.title}" 
                                 onerror="this.src='${mediaAPI.getDefaultBookCover()}'">
                        </div>
                    </div>
                    <div class="filmography-info-block">
                        <h3 class="filmography-name">${book.title}</h3>
                        <p class="filmography-details">Book #${book.serial || 'Unknown'} • ${book.release_date ? new Date(book.release_date).getFullYear() : 'Unknown'}</p>
                    </div>
                </div>
            `).join('');

            modalManager.addBookClickHandlers();
        } else {
            booksTrack.innerHTML = '<div class="loading-error">Failed to load books</div>';
        }

        const movies = await HPapi.getMovies();
        const moviesTrack = document.querySelector('.movies-track');
        modalManager.setMoviesData(movies);

        if (movies && movies.length > 0) {
            moviesTrack.innerHTML = movies.map(movie => `
                <div class="filmography-item" data-movie-id="${movie.id}">
                    <div class="filmography-card">
                        <div class="filmography-image">
                            <img src="${movie.poster}" alt="${movie.title}"
                                 onerror="this.src='${mediaAPI.getDefaultMoviePoster()}'">
                        </div>
                    </div>
                    <div class="filmography-info-block">
                        <h3 class="filmography-name">${movie.title}</h3>
                        <p class="filmography-details">Movie #${movie.serial || 'Unknown'} • ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</p>
                    </div>
                </div>
            `).join('');

            modalManager.addMovieClickHandlers();
        } else {
            moviesTrack.innerHTML = '<div class="loading-error">Failed to load movies</div>';
        }

        setTimeout(() => {
            initCarousel('.books-track', '.books-prev', '.books-next');
            initCarousel('.movies-track', '.movies-prev', '.movies-next');
        }, 100);

    } catch (error) {
        console.error('Data loading error:', error);
    }
});