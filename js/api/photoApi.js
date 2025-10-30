class HarryPotterPhotoAPI {
    constructor() {
        this.cache = new Map();
    }

    async makeRequest(url) {
        try {
            console.log('PhotoAPI fetching:', url);
            
            // Wikipedia блокирует CORS, поэтому всегда используем прокси
            const finalUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(finalUrl);
            if (!response.ok) throw new Error(`Request failed: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('PhotoAPI request failed:', error);
            throw error;
        }
    }

    async getCharacterPhoto(characterName) {
        const cacheKey = `character_${characterName}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            console.log(`Поиск фото персонажа: ${characterName}`);
            
            const characterQueries = [
                `${characterName} (Harry Potter)`,
                characterName,
                `${characterName} character`
            ];
            
            for (const query of characterQueries) {
                try {
                    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
                    const data = await this.makeRequest(url);
                    
                    if (data.thumbnail && data.thumbnail.source) {
                        console.log(`Нашли фото для: ${characterName}`);
                        this.cache.set(cacheKey, data.thumbnail.source);
                        return data.thumbnail.source;
                    }
                } catch (error) {
                    console.log(`Запрос "${query}" не удался, пробуем следующий...`);
                    continue;
                }
            }
            
            console.log(`Фото для ${characterName} не найдено, используем заглушку`);
            const placeholder = this.createGreyCircle(characterName);
            this.cache.set(cacheKey, placeholder);
            return placeholder;
            
        } catch (error) {
            console.error(`Ошибка поиска фото для ${characterName}:`, error);
            const placeholder = this.createGreyCircle(characterName);
            this.cache.set(cacheKey, placeholder);
            return placeholder;
        }
    }

    async getActorPhoto(actorName) {
        const cacheKey = `actor_${actorName}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            console.log(`Поиск фото актера: ${actorName}`);
            
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(actorName)}`;
            const data = await this.makeRequest(url);
            
            if (data.thumbnail && data.thumbnail.source) {
                console.log(`Нашли фото актера: ${actorName}`);
                this.cache.set(cacheKey, data.thumbnail.source);
                return data.thumbnail.source;
            }
            
            console.log(`Фото актера ${actorName} не найдено, используем заглушку`);
            const placeholder = this.createGreyCircle(actorName);
            this.cache.set(cacheKey, placeholder);
            return placeholder;
            
        } catch (error) {
            console.error(`Ошибка поиска фото актера ${actorName}:`, error);
            const placeholder = this.createGreyCircle(actorName);
            this.cache.set(cacheKey, placeholder);
            return placeholder;
        }
    }

    createGreyCircle(characterName) {
        const initials = characterName.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        
        const svg = `
            <svg width="238" height="238" xmlns="http://www.w3.org/2000/svg">
                <circle cx="119" cy="119" r="115" fill="#6B7280"/>
                <text x="119" y="130" text-anchor="middle" fill="white" 
                      font-family="Arial, sans-serif" font-size="42" font-weight="bold">
                    ${initials}
                </text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }

    // Очистка кэша при необходимости
    clearCache() {
        this.cache.clear();
        console.log('PhotoAPI cache cleared');
    }
}

const hpPhotoAPI = new HarryPotterPhotoAPI();
