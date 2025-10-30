const HPapi = {
    getBaseUrl() {
        return 'https://potterhead-api.vercel.app/api';
    },

    async makeRequest(url, options = {}) {
        try {
            console.log('Fetching:', url);
            
            // Для продакшена используем прокси
            const finalUrl = window.location.hostname === 'localhost' 
                ? url 
                : `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(finalUrl, {
                mode: 'cors',
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    },

    async getAllCharct() {
        console.log('Пытаемся загрузить персонажей');
        try {
            const url = `${this.getBaseUrl()}/characters`;
            const characters = await this.makeRequest(url);
            console.log(`Получили ${characters.length} записей`);
            return characters;
        } catch (error) {
            console.error('Ошибка:', error);
            return await this.getAllCharactersFallback();
        }
    },

    async getAllCharactersFallback() {
        try {
            // Альтернативный API
            const response = await fetch('https://hp-api.onrender.com/api/characters');
            if (!response.ok) throw new Error('Fallback failed');
            
            const data = await response.json();
            console.log(`Fallback: получили ${data.length} персонажей`);
            return data;
        } catch (error) {
            console.error('Fallback also failed:', error);
            return [];
        }
    },

    async getCharacterByName(characterName) {
        console.log(`Ищем персонажа: ${characterName}`);
        try {
            const allCharacters = await this.getAllCharct();
            const character = allCharacters.find(char =>
                char.name && char.name.toLowerCase() === characterName.toLowerCase()
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

    async getAllHouses() {
        console.log('Пытаемся загрузить факультеты');
        try {
            const url = `${this.getBaseUrl()}/houses`;
            const houses = await this.makeRequest(url);
            console.log(`Получили ${houses.length} факультетов`);
            return houses;
        } catch (error) {
            console.error('Ошибка при загрузке факультетов:', error);
            return await this.getAllHousesFallback();
        }
    },

    async getAllHousesFallback() {
        try {
            const houses = [
                { id: "gryffindor", name: "Gryffindor" },
                { id: "slytherin", name: "Slytherin" },
                { id: "hufflepuff", name: "Hufflepuff" },
                { id: "ravenclaw", name: "Ravenclaw" }
            ];
            console.log(`Fallback: возвращаем ${houses.length} факультетов`);
            return houses;
        } catch (error) {
            console.error('Houses fallback failed:', error);
            return [];
        }
    },

    async getStudentsByHouse(houseName) {
        console.log(`Пытаемся загрузить студентов факультета: ${houseName}`);
        try {
            const url = `${this.getBaseUrl()}/houses/${houseName}`;
            const students = await this.makeRequest(url);
            console.log(`Получили ${students.length} студентов факультета ${houseName}`);
            return students;
        } catch (error) {
            console.error('Ошибка при загрузке студентов факультета:', error);
            return await this.getStudentsByHouseFallback(houseName);
        }
    },

    async getStudentsByHouseFallback(houseName) {
        try {
            // Загружаем всех персонажей и фильтруем по факультету
            const allCharacters = await this.getAllCharct();
            const houseStudents = allCharacters.filter(char => 
                char.house && char.house.toLowerCase() === houseName.toLowerCase()
            );
            console.log(`Fallback: нашли ${houseStudents.length} студентов для ${houseName}`);
            return houseStudents;
        } catch (error) {
            console.error('Students fallback failed:', error);
            return [];
        }
    },

    async getBooks() {
        console.log('Пытаемся загрузить книги');
        try {
            const url = `${this.getBaseUrl()}/books`;
            const booksData = await this.makeRequest(url);
            console.log(`Получили ${booksData.length} книг`);

            const bookCovers = await mediaAPI.getBookCovers();

            return booksData.map((book, index) => ({
                ...book,
                cover: bookCovers[index]?.cover || mediaAPI.getDefaultBookCover(),
                id: book.serial || index.toString()
            }));
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
            return await this.getBooksFallback();
        }
    },

    async getBooksFallback() {
        try {
            const books = [
                {
                    id: "1",
                    title: "Harry Potter and the Philosopher's Stone",
                    author: "J.K. Rowling",
                    release_year: "1997",
                    cover: mediaAPI.getDefaultBookCover()
                },
                {
                    id: "2", 
                    title: "Harry Potter and the Chamber of Secrets",
                    author: "J.K. Rowling",
                    release_year: "1998",
                    cover: mediaAPI.getDefaultBookCover()
                }
            ];
            console.log('Fallback: возвращаем книги');
            return books;
        } catch (error) {
            console.error('Books fallback failed:', error);
            return [];
        }
    },

    async getMovies() {
        console.log('Пытаемся загрузить фильмы');
        try {
            const url = `${this.getBaseUrl()}/movies`;
            const moviesData = await this.makeRequest(url);
            console.log(`Получили ${moviesData.length} фильмов`);

            const moviePosters = await mediaAPI.getMoviePosters();

            return moviesData.map((movie, index) => ({
                ...movie,
                poster: moviePosters[index]?.Poster || mediaAPI.getDefaultMoviePoster(),
                id: movie.serial || index.toString()
            }));
        } catch (error) {
            console.error('Ошибка загрузки фильмов:', error);
            return await this.getMoviesFallback();
        }
    },

    async getMoviesFallback() {
        try {
            const movies = [
                {
                    id: "1",
                    title: "Harry Potter and the Philosopher's Stone",
                    release_year: "2001",
                    poster: mediaAPI.getDefaultMoviePoster()
                },
                {
                    id: "2",
                    title: "Harry Potter and the Chamber of Secrets", 
                    release_year: "2002",
                    poster: mediaAPI.getDefaultMoviePoster()
                }
            ];
            console.log('Fallback: возвращаем фильмы');
            return movies;
        } catch (error) {
            console.error('Movies fallback failed:', error);
            return [];
        }
    }
};
