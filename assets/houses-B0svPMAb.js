import"./navigation-DlLHxie3.js";/* empty css              */class h{constructor(){this.loadingElement=document.getElementById("loading"),this.errorElement=document.getElementById("error"),this.container=document.getElementById("houses-container"),this.houseImages={Gryffindor:"image/houses/gryffindor.png",Slytherin:"image/houses/slytherin.png",Ravenclaw:"image/houses/ravenclaw.png",Hufflepuff:"image/houses/hufflepuff.png"},this.houseDescriptions={Gryffindor:"Gryffindor House is known for courage, bravery, nerve, and chivalry. Its emblematic animal is the lion, and its colors are scarlet and gold. Gryffindor students are daring, determined, and ready to stand up for what is right. They often become leaders and heroes, never afraid to take risks in pursuit of justice and honor.",Slytherin:"Slytherin House values ambition, cunning, leadership, and resourcefulness. Represented by the serpent, its colors are green and silver. Slytherins are determined and strategic, often choosing the most efficient path to achieve greatness. Many influential wizards and witches come from this house, both great and infamous.",Ravenclaw:"Ravenclaw House celebrates intelligence, creativity, learning, and wit. The eagle represents their soaring intellect, and their colors are blue and bronze. Ravenclaws seek knowledge above all else, valuing curiosity and wisdom. Their common room is filled with books and open-minded discussion about the mysteries of magic and life.",Hufflepuff:"Hufflepuff House is known for hard work, patience, loyalty, and fair play. Its animal symbol is the badger, and its colors are yellow and black. Hufflepuffs are kind-hearted, inclusive, and value honesty and friendship. They believe that everyone deserves respect and a fair chance, and their strength lies in their unity and perseverance."}}showLoading(){this.loadingElement&&(this.loadingElement.style.display="block"),this.errorElement&&(this.errorElement.style.display="none"),this.container&&(this.container.innerHTML=""),this.loadMoreContainer&&(this.loadMoreContainer.style.display="none")}showError(e){this.loadingElement&&(this.loadingElement.style.display="none"),this.errorElement&&(this.errorElement.style.display="block",this.errorElement.innerHTML=` ${e}`),this.container&&(this.container.innerHTML=""),this.loadMoreContainer&&(this.loadMoreContainer.style.display="none")}getHouseClass(e){return e&&{Gryffindor:"gryffindor",Slytherin:"slytherin",Hufflepuff:"hufflepuff",Ravenclaw:"ravenclaw"}[e]||""}async getHouseDescription(e){return this.houseDescriptions[e]||"Описание недоступно."}async showHouses(e){this.loadingElement&&(this.loadingElement.style.display="none"),this.errorElement&&(this.errorElement.style.display="none");const s=this.container;s.innerHTML="";for(let i=0;i<e.length;i++){const n=e[i],a=this.getHouseClass(n),o=this.houseImages[n],t=await this.getHouseDescription(n),d=await this.getHouseStudents(n),r=document.createElement("div");r.className="house-section "+(i%2===0?"houses-left":"houses-right"),r.innerHTML=`
                <div class="house-card-wrapper">
                    <div class="house_card ${a}" data-house-name="${n}">
                        <img src="${o}" alt="${n}" class="house_image">
                        <p class="house_name">${n}</p>
                    </div>
                </div>
                <div class="house-description description-container">
                    ${t}
                     <div class="house-stats">
                        ${d}
                    </div>
                </div>
            `,s.appendChild(r)}}async getHouseStudents(e){try{const s=await HPapi.getStudentsByHouse(e.toLowerCase());console.log("Ответ API (allCharacters):",s);const i=s.filter(t=>t.gender==="male").length,n=s.filter(t=>t.gender==="female").length,a=s.filter(t=>t.hogwartsStudent).length,o=s.filter(t=>t.hogwartsStaff).length;return`
                <ul class="header__row">
                <li class="header__row-item">
                    <span>${i}</span>
                    Male
                </li>
                <span></span>
                <li class="header__row-item">
                    <span>${n}</span>
                    Female
                </li>
                <span></span>
                <li class="header__row-item">
                    <span>${a}</span>
                    Students
                </li>
                <span></span>
                <li class="header__row-item">
                    <span>${o}</span>
                    Staff
                </li>
            `}catch(s){return console.error("Ошибка при подсчёте статистики:",s),"<p>Статистика недоступна.</p>"}}async loadAndDisplayHouses(){this.showLoading();try{const e=await HPapi.getAllHouses();console.log(e),this.showHouses(e)}catch{this.showError("Не удалось загрузить факультеты. Проверьте интернет соединение.")}}}document.addEventListener("DOMContentLoaded",function(){new h().loadAndDisplayHouses()});
