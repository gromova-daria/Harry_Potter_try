class HarryPotterPhotoAPI {
    constructor() {
        this.cache = new Map();
    }

    async getCharacterPhoto(characterName) {
        if (this.cache.has(characterName)) {
            return this.cache.get(characterName);
        }

        try {
            console.log(` проба поиска персонажа: ${characterName}`);
            
            
            const characterQueries = [
                `${characterName} character`,
                characterName,              
               
                
            ];
            
            for (const query of characterQueries) {
                try {
                    const response = await fetch(
                        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        if (data.thumbnail && data.thumbnail.source) {
                            console.log(`НАЙДЕНО: ${characterName}`);
                            this.cache.set(characterName, data.thumbnail.source);
                            return data.thumbnail.source;
                        }
                    }
                } catch (error) {
                    continue;
                }
            }
            
            console.log(`персонаж не найден: ${characterName}`);
            return null;
            
        } catch (error) {
            console.error(`ошибка посика:`, error);
            return null;
        }
    }

    async getActorPhoto(actorName) {
        if (this.cache.has(actorName)) {
            return this.cache.get(actorName);
        }

        try {
            console.log(`теперь ищем актёра: ${actorName}`);
           
            const response = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(actorName)}`
            );
            
            if (!response.ok) {
                console.log(`актёр не найден: ${actorName}`);
                return null;
            }
            
            const data = await response.json();
            
            if (data.thumbnail && data.thumbnail.source) {
                console.log(`найден актер: ${actorName}`);
                this.cache.set(actorName, data.thumbnail.source);
                return data.thumbnail.source;
            }
            
            return null;
            
        } catch (error) {
            console.error(`ошибка поиска актера:`, error);
            return null;
        }
    }
//серые инициалы теперь будут, если совсем ничего нет
    createGreyCircle(characterName) {
        const initials = characterName.split(' ').map(n => n[0]).join('');
        
        const svg = `
            <svg width="238" height="238" xmlns="http://www.w3.org/2000/svg">
                <circle cx="119" cy="119" r="115" fill="#9CA3AF"/>
                <text x="119" y="130" text-anchor="middle" fill="white" 
                      font-family="Arial" font-size="42" font-weight="bold">
                    ${initials}
                </text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }
}

const hpPhotoAPI = new HarryPotterPhotoAPI();
export { hpPhotoAPI };
