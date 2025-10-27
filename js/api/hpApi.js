const HPapi = {
    url: 'https://hp-api.onrender.com/api',

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
    }
};