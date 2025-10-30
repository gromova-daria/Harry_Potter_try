class MediaAPI {
    constructor() {
        this.cache = new Map();
    }

    async makeRequest(url) {
        try {
            console.log('MediaAPI fetching:', url);
            
            // Для продакшена используем прокси
            const finalUrl = window.location.hostname === 'localhost' 
                ? url 
                : `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(finalUrl);
            if (!response.ok) throw new Error(`Request failed: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('MediaAPI request failed:', error);
            throw error;
        }
    }

    async getBookCovers() {
        if (this.cache.has('bookCovers')) {
            return this.cache.get('bookCovers');
        }

        try {
            console.log('Пытаемся загрузить обложки книг');
            const covers = await this.makeRequest('https://potterapi-fedeperin.vercel.app/en/books');
            console.log(`Получили ${covers.length} обложек книг`);
            this.cache.set('bookCovers', covers);
            return covers;
        } catch (error) {
            console.error('Ошибка загрузки обложек:', error);
            // Возвращаем заглушки
            return this.getDefaultBookCovers();
        }
    }

    getDefaultBookCovers() {
        const defaultCovers = [
            { cover: this.getDefaultBookCover() },
            { cover: this.getDefaultBookCover() },
            { cover: this.getDefaultBookCover() },
            { cover: this.getDefaultBookCover() },
            { cover: this.getDefaultBookCover() },
            { cover: this.getDefaultBookCover() },
            { cover: this.getDefaultBookCover() }
        ];
        console.log('Используем обложки по умолчанию');
        return defaultCovers;
    }

    async getMoviePosters() {
        if (this.cache.has('moviePosters')) {
            return this.cache.get('moviePosters');
        }

        try {
            console.log('Пытаемся загрузить постеры фильмов');
            // OMDB API работает без прокси т.к. имеет CORS headers
            const url = `https://www.omdbapi.com/?s=harry%20potter&apikey=6c3a2d45`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('OMDB request failed');
            
            const data = await response.json();
            const posters = data.Search || [];
            console.log(`Получили ${posters.length} постеров фильмов`);

            this.cache.set('moviePosters', posters);
            return posters;
        } catch (error) {
            console.error('Ошибка загрузки постеров:', error);
            // Возвращаем заглушки
            return this.getDefaultMoviePosters();
        }
    }

    getDefaultMoviePosters() {
        const defaultPosters = [
            { Poster: this.getDefaultMoviePoster() },
            { Poster: this.getDefaultMoviePoster() },
            { Poster: this.getDefaultMoviePoster() },
            { Poster: this.getDefaultMoviePoster() },
            { Poster: this.getDefaultMoviePoster() },
            { Poster: this.getDefaultMoviePoster() },
            { Poster: this.getDefaultMoviePoster() },
            { Poster: this.getDefaultMoviePoster() }
        ];
        console.log('Используем постеры по умолчанию');
        return defaultPosters;
    }

    async getBookCoverByIndex(index) {
        const covers = await this.getBookCovers();
        return covers[index]?.cover || this.getDefaultBookCover();
    }

    async getMoviePosterByIndex(index) {
        const posters = await this.getMoviePosters();
        return posters[index]?.Poster || this.getDefaultMoviePoster();
    }

    getDefaultBookCover() {
        return 'image/book-cover-placeholder.jpg';
    }

    getDefaultMoviePoster() {
        return 'image/movie-poster-placeholder.jpg';
    }
}

const mediaAPI = new MediaAPI();
