class HousesDisplay {
    constructor() {
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        this.container = document.getElementById('houses-container');

        this.houseImages = {
            Gryffindor: "image/houses/gryffindor.png",
            Slytherin: "image/houses/slytherin.png",
            Ravenclaw: "image/houses/ravenclaw.png",
            Hufflepuff: "image/houses/hufflepuff.png"
        };

        this.houseDescriptions = {
            Gryffindor: "Gryffindor House is known for courage, bravery, nerve, and chivalry. Its emblematic animal is the lion, and its colors are scarlet and gold. Gryffindor students are daring, determined, and ready to stand up for what is right. They often become leaders and heroes, never afraid to take risks in pursuit of justice and honor.",
            Slytherin: "Slytherin House values ambition, cunning, leadership, and resourcefulness. Represented by the serpent, its colors are green and silver. Slytherins are determined and strategic, often choosing the most efficient path to achieve greatness. Many influential wizards and witches come from this house, both great and infamous.",
            Ravenclaw: "Ravenclaw House celebrates intelligence, creativity, learning, and wit. The eagle represents their soaring intellect, and their colors are blue and bronze. Ravenclaws seek knowledge above all else, valuing curiosity and wisdom. Their common room is filled with books and open-minded discussion about the mysteries of magic and life.",
            Hufflepuff: "Hufflepuff House is known for hard work, patience, loyalty, and fair play. Its animal symbol is the badger, and its colors are yellow and black. Hufflepuffs are kind-hearted, inclusive, and value honesty and friendship. They believe that everyone deserves respect and a fair chance, and their strength lies in their unity and perseverance."
        };
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

    async getHouseDescription(houseName) {
        const description = this.houseDescriptions[houseName];
        return description || 'Описание недоступно.';
    }

    async showHouses(houses) {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        if (this.errorElement) this.errorElement.style.display = 'none';

        const container = this.container;
        container.innerHTML = '';

        for (let index = 0; index < houses.length; index++) {
            const house = houses[index];
            const houseClass = this.getHouseClass(house);
            const imageUrl = this.houseImages[house];
            const desc = await this.getHouseDescription(house);
            const houseStats = await this.getHouseStudents(house);

            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'house-section ' + (index % 2 === 0 ? 'houses-left' : 'houses-right');

            wrapperDiv.innerHTML = `
                <div class="house-card-wrapper">
                    <div class="house_card ${houseClass}" data-house-name="${house}">
                        <img src="${imageUrl}" alt="${house}" class="house_image">
                        <p class="house_name">${house}</p>
                    </div>
                </div>
                <div class="house-description description-container">
                    ${desc}
                     <div class="house-stats">
                        ${houseStats}
                    </div>
                </div>
            `;
            container.appendChild(wrapperDiv);
        }
    }

    async getHouseStudents(houseName) {
        try {
            const allStudents = await HPapi.getStudentsByHouse(houseName.toLowerCase());
            console.log('Ответ API (allCharacters):', allStudents);
    
            const maleCount = allStudents.filter(s => s.gender === 'male').length;
            const femaleCount = allStudents.filter(s => s.gender === 'female').length;
            const hogwartsStudents = allStudents.filter(s => s.hogwartsStudent).length;
            const staff = allStudents.filter(s => s.hogwartsStaff).length;
    
            return `
                <ul class="header__row">
                <li class="header__row-item">
                    <span>${maleCount}</span>
                    Male
                </li>
                <span></span>
                <li class="header__row-item">
                    <span>${femaleCount}</span>
                    Female
                </li>
                <span></span>
                <li class="header__row-item">
                    <span>${hogwartsStudents}</span>
                    Students
                </li>
                <span></span>
                <li class="header__row-item">
                    <span>${staff}</span>
                    Staff
                </li>
            `;
        } catch (error) {
            console.error('Ошибка при подсчёте статистики:', error);
            return '<p>Статистика недоступна.</p>';
        }
    }

    async loadAndDisplayHouses() {
        this.showLoading();
        try {
            const houses = await HPapi.getAllHouses();
            console.log(houses);
            this.showHouses(houses);
        } catch {
            this.showError('Не удалось загрузить факультеты. Проверьте интернет соединение.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const display = new HousesDisplay();
    display.loadAndDisplayHouses();
});