
class WikipediaPhotoAPI {
    constructor() {
        this.cache = new Map();
    }

    async getActorPhoto(actorName) {
       
        if (this.cache.has(actorName)) {
            return this.cache.get(actorName);
        }

        try {
            console.log(`Поиск по википедии: ${actorName}`);
            
            const response = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(actorName)}`
            );
            
            if (!response.ok) {
                console.log(`не нашла: ${actorName}`);
                return null;
            }
            
            const data = await response.json();
            
            if (data.thumbnail && data.thumbnail.source) {
                console.log(`нашла: ${actorName}`);
                this.cache.set(actorName, data.thumbnail.source);
                return data.thumbnail.source;
            }
            
            return null;
            
        } catch (error) {
            console.error(`ошибка ${actorName}:`, error);
            return null;
        }
    }

   
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


const wikipediaPhotoAPI = new WikipediaPhotoAPI();