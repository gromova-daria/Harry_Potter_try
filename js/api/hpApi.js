const HPapi = {
    url: 'https://potterhead-api.vercel.app/api',

    async getAllCharct() {
        console.log('Пытаемся загрузить персонажей');
        try {
            const response = await fetch(`${this.url}/characters`);
            if (!response.ok) {
                throw new Error('Не удалось загрузить данные');
            }
            const characters = await response.json();
            console.log(`Получили ${characters.length} записей`);
            return characters;
        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }
    },

    async getCharacterByName(characterName) {
        console.log(`Ищем персонажа: ${characterName}`);
        try {

            const allCharacters = await this.getAllCharct();
            const character = allCharacters.find(char =>
                char.name.toLowerCase() === characterName.toLowerCase()
            );

            if (character) {
                console.log(`Нашли персонажа: ${character.name}`);
                return character;
            } else {
                console.log(`Персонаж ${characterName} не найден`);
                return null;
            }
        } catch (error) {
            console.error('Ошибка при поиске персонажа:', error);
            return null;
        }
    },

    async getBooks() {
        console.log('Пытаемся загрузить книги');
        try {
            const response = await fetch(`${this.url}/books`);
            if (!response.ok) {
                throw new Error('Не удалось загрузить данные');
            }
            const booksData = await response.json();
            console.log(`Получили ${booksData.length} книг`);

            const bookCovers = await mediaAPI.getBookCovers();

            return booksData.map((book, index) => ({
                ...book,
                cover: bookCovers[index]?.cover || mediaAPI.getDefaultBookCover(),
                id: book.serial || index.toString()
            }));
        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }
    },

    async getMovies() {
        console.log('Пытаемся загрузить фильмы');
        try {
            const response = await fetch(`${this.url}/movies`);
            if (!response.ok) {
                throw new Error('Не удалось загрузить данные');
            }
            const moviesData = await response.json();
            console.log(`Получили ${moviesData.length} фильмов`);

            const moviePosters = await mediaAPI.getMoviePosters();

            return moviesData.map((movie, index) => ({
                ...movie,
                poster: moviePosters[index]?.Poster || mediaAPI.getDefaultMoviePoster(),
                id: movie.serial || index.toString()
            }));
        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }
    }
};
