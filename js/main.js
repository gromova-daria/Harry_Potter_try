class CharacterDisplay {
    constructor() {
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        this.container = document.getElementById('characters-container');
        this.loadMoreContainer = document.getElementById('load-more-container');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.modal = document.getElementById('character-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        
        this.allCharacters = [];
        this.currentIndex = 0;
        this.charactersPerPage = 12;
        this.photoCache = new Map();
        
        this.initEvents();
    }
    
    initEvents() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreCharacters();
            });
        }
      
        if (this.modal) {
            const closeBtn = this.modal.querySelector('.cross');
            
            closeBtn.addEventListener('click', () => this.closeModal());
            if (this.modalOverlay) {
                this.modalOverlay.addEventListener('click', () => this.closeModal());
            }
                    
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeModal();
            });
        }
    }

    showLoading() {
        if (this.loadingElement) this.loadingElement.style.display = 'block';
        if (this.errorElement) this.errorElement.style.display = 'none';
        if (this.container) this.container.innerHTML = '';
        if (this.loadMoreContainer) this.loadMoreContainer.style.display = 'none';
    }
    
    showError(message) {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        if (this.errorElement) {
            this.errorElement.style.display = 'block';
            this.errorElement.innerHTML = ` ${message}`;
        }
        if (this.container) this.container.innerHTML = '';
        if (this.loadMoreContainer) this.loadMoreContainer.style.display = 'none';
    }

    getHouseClass(house) {
        if (!house) return '';
        const houseMap = {
            'Gryffindor': 'gryffindor',
            'Slytherin': 'slytherin', 
            'Hufflepuff': 'hufflepuff',
            'Ravenclaw': 'ravenclaw'
        };
        return houseMap[house] || '';
    }

    async getCharacterImage(character) {
        if (this.photoCache.has(character.name)) {
            return this.photoCache.get(character.name);
        }
        
        if (character.image && character.image !== '') {
            this.photoCache.set(character.name, character.image);
            return character.image;
        }
        
        if (character.actor && character.actor !== 'Unknown actor' && character.actor !== '') {
            try {
                const actorPhoto = await wikipediaPhotoAPI.getActorPhoto(character.actor);
                if (actorPhoto) {
                    this.photoCache.set(character.name, actorPhoto);
                    return actorPhoto;
                }
            } catch (error) {
                console.error(`Wikipedia error for ${character.name}:`, error);
            }
        }
        
        const greyCircle = wikipediaPhotoAPI.createGreyCircle(character.name);
        this.photoCache.set(character.name, greyCircle);
        return greyCircle;
    }

    async showCharacters(characters) {
        this.loadingElement.style.display = 'none';
        this.errorElement.style.display = 'none';
        
        const charactersPromises = characters.map(async (character) => {
            const houseClass = this.getHouseClass(character.house);
            const imageUrl = await this.getCharacterImage(character);
            
            return `
                <div class="grid_content ${houseClass}" data-character-name="${character.name}">
                    <div class="grid_img-container">
                        <img src="${imageUrl}" 
                             alt="${character.name}" 
                             class="grid_img">
                    </div>
                    <div class="grid_divider"></div>
                    <p class="grid_name">${character.name}</p>
                    <p class="grid_house">${character.house || 'Unknown'}</p>
                    <p class="grid_actor">${character.actor || 'Unknown actor'}</p>
                </div>
            `;
        });
        
        const charactersHTML = await Promise.all(charactersPromises);
        this.container.innerHTML = charactersHTML.join('');
        
        // Добавляем обработчики клика на карточки
        this.addCardClickHandlers();
    }
    
    async showMoreCharacters() {
        const nextCharacters = this.allCharacters.slice(
            this.currentIndex, 
            this.currentIndex + this.charactersPerPage
        );
        
        const charactersPromises = nextCharacters.map(async (character) => {
            const houseClass = this.getHouseClass(character.house);
            const imageUrl = await this.getCharacterImage(character);
            
            return `
                <div class="grid_content ${houseClass}" data-character-name="${character.name}">
                    <div class="grid_img-container">
                        <img src="${imageUrl}" 
                             alt="${character.name}" 
                             class="grid_img">
                    </div>
                    <div class="grid_divider"></div>
                    <p class="grid_name">${character.name}</p>
                    <p class="grid_house">${character.house || 'Unknown'}</p>
                    <p class="grid_actor">${character.actor || 'Unknown actor'}</p>
                </div>
            `;
        });
        
        const charactersHTML = await Promise.all(charactersPromises);
        this.container.innerHTML += charactersHTML.join('');
        this.currentIndex += this.charactersPerPage;
        
       
        this.addCardClickHandlers();
        
        this.checkIfMoreCharacters();
    }
    
    addCardClickHandlers() {
        
        this.container.querySelectorAll('.grid_content').forEach(card => {
            card.addEventListener('click', (e) => {
                const characterName = card.dataset.characterName;
                this.openModal(characterName);
            });
        });
    }
    
 openModal(characterName) {
   
    const character = this.allCharacters.find(char => 
        char.name === characterName
    );
    
    if (!character) return;
    
    
    this.fillModalWithData(character);
    

    this.modal.style.display = 'block';
    if (this.modalOverlay) {
        this.modalOverlay.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';
}
    
   fillModalWithData(character) {
    
    document.getElementById('modal-name').textContent = character.name;
    
    
    document.getElementById('modal-birth').textContent = `Date of birth: ${character.dateOfBirth || 'Unknown'}`;
    document.getElementById('modal-patronus').textContent = `Patronus: ${character.patronus || 'Unknown'}`;
    

    const wandInfo = document.getElementById('modal-wand');
    if (character.wand && (character.wand.wood || character.wand.core || character.wand.length)) {
        wandInfo.innerHTML = `
            <div>wood: ${character.wand.wood || 'Unknown'}</div>
            <div>core: ${character.wand.core || 'Unknown'}</div>
            <div>length: ${character.wand.length || 'Unknown'}</div>
        `;
    } else {
        wandInfo.innerHTML = '<div>No wand information</div>';
    }
    
   
    const alternateNames = document.getElementById('modal-alternate-names');
    if (character.alternate_names && character.alternate_names.length > 0) {
        alternateNames.innerHTML = `<div>${character.alternate_names.join(', ')}</div>`;
    } else {
        alternateNames.innerHTML = '<div>No alternate names</div>';
    }
    
  
    this.setModalImage(character);
}


async setModalImage(character) {
    const modalImage = document.getElementById('modal-image');
    
  
    let imageUrl;
    
   
    if (this.photoCache.has(character.name)) {
        imageUrl = this.photoCache.get(character.name);
    } else if (character.image && character.image !== '') {
        imageUrl = character.image;
        this.photoCache.set(character.name, character.image);
    } else if (character.actor && character.actor !== 'Unknown actor' && character.actor !== '') {
        try {
            const actorPhoto = await wikipediaPhotoAPI.getActorPhoto(character.actor);
            if (actorPhoto) {
                imageUrl = actorPhoto;
                this.photoCache.set(character.name, actorPhoto);
            }
        } catch (error) {
            console.error(`Wikipedia error for ${character.name}:`, error);
        }
    }
    
  
    if (imageUrl) {
        modalImage.src = imageUrl;
    } else {
    
        const circleSvg = wikipediaPhotoAPI.createGreyCircle(character.name);
        modalImage.src = circleSvg;
    }
    modalImage.alt = character.name;
}
    
  



closeModal() {
    if (this.modal) {
        this.modal.style.display = 'none';
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'none';
        }
        document.body.style.overflow = '';
    }
}
    
    checkIfMoreCharacters() {
        if (this.currentIndex >= this.allCharacters.length) {
            if (this.loadMoreContainer) this.loadMoreContainer.style.display = 'none';
        } else {
            if (this.loadMoreContainer) this.loadMoreContainer.style.display = 'block';
        }
    }
    
    loadMoreCharacters() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.disabled = true;
            this.loadMoreBtn.textContent = 'Loading...';
        }
        
        setTimeout(() => {
            this.showMoreCharacters();
            
            if (this.loadMoreBtn) {
                this.loadMoreBtn.disabled = false;
                this.loadMoreBtn.textContent = 'Load More Characters';
            }
        }, 500);
    }
    
    async loadAndDisplayCharacters() {
        this.showLoading();
        
        try {
            const characters = await HPapi.getAllCharct();
            this.allCharacters = characters;
            this.currentIndex = 0;
            
            this.showCharacters(characters.slice(0, this.charactersPerPage));
            this.currentIndex = this.charactersPerPage;
            
            this.checkIfMoreCharacters();
            
        } catch (error) {
            this.showError('Не удалось загрузить персонажей. Проверьте интернет соединение.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const display = new CharacterDisplay();
    display.loadAndDisplayCharacters();
});