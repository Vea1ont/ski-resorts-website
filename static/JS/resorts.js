


function toggleDropdown() {
    const menu = document.querySelector('.dropdown-menu');
    const btn = document.querySelector('.dropdown-btn');

    menu.classList.toggle('show');
    btn.classList.toggle('active');
}


function selectOption(element, value) {

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
    });

    element.classList.add('active');
    element.setAttribute('aria-selected', 'true');

    document.getElementById('selected-value').textContent = value;
    document.getElementById('dropdown-menu').classList.remove('show');
    document.querySelector('.dropdown-btn').classList.remove('active');

    selectedDifficulty = element.dataset.value;

    if (selectedDifficulty === 'Все уровни') {
        selectedDifficulty = null;
    }

    loadResorts(selectedDifficulty);
}

document.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.dropdown');
  if (!dropdown.contains(event.target)) {
    document.querySelector('.dropdown-menu').classList.remove('show');
    document.querySelector('.dropdown-btn').classList.remove('active');
  }
});




const template = document.getElementById('resort-card-template');

if (!template) {
    console.error('Шаблон #resort-card-template не найден в HTML!');
}



function createResortCard(resort) {

    const clone = template.content.cloneNode(true);


    const card = clone.querySelector('.resorts-card');

    if (resort.id) {
        card.dataset.resortId = resort.id;
    }

    clone.querySelector('[data-field="image"]').alt = resort.name;
    clone.querySelector('[data-field="card-name"]').textContent = resort.name;
    clone.querySelector('[data-field="location"]').textContent = `${resort.city}${resort.address ? ', ' + resort.address : ''}`;
    clone.querySelector('[data-field="peak-height"]').textContent = resort.peak_height;
    clone.querySelector('[data-field="length"]').textContent = resort.length;
    clone.querySelector('[data-field="trail-count"]').textContent = resort.count_trails;
    clone.querySelector('[data-field="hero-info"]').textContent = resort.card_hero_info;

    const levelsContainer = clone.querySelector('.resorts-levels');

    if (resort.expert) {
        levelsContainer.innerHTML += `<span class="level-badge level-expert">Эксперт</span>`;
    }

    if (resort.advanced) {
        levelsContainer.innerHTML += `<span class="level-badge level-advanced">Продвинутый</span>`;
    }

    if (resort.medium) {
        levelsContainer.innerHTML += `<span class="level-badge level-medium">Средний</span>`;
    }


    if (resort.beginners) {
        levelsContainer.innerHTML += `<span class="level-badge level-beginner">Начинающий</span>`;
    }
    
    const imgElement = clone.querySelector('[data-field="image"]');
    
    if (resort.image) {
        imgElement.src = resort.image;
        imgElement.alt = resort.name;
    } else {
        imgElement.alt = resort.name; 
        
        const placeholder = document.createElement('div');
        placeholder.classList.add('resort-image-placeholder');
        
        placeholder.innerHTML = `
            <div class="placeholder-text-main">Изображения нет</div>
            <div class="placeholder-text-sub">но мы его скоро добавим</div>
        `;

        imgElement.replaceWith(placeholder);
    }
    

    return clone;
}

const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.input-search');

let selectedDifficulty = null;

searchBtn.addEventListener('click', () => loadResorts());

async function loadResorts(difficulty = null) {

    const search = searchInput.value

    let url = '/resorts/';
    const params = [];

    if (difficulty) {
        params.push(`difficulty=${difficulty}`)
    }

    if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
    }
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    

    const container = document.getElementById('resorts-container');

    try {
        const response = await fetch(url);
        const resorts = await response.json();

        container.innerHTML = '';

        if (resorts.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="95" cy="85" r="55" fill="none" stroke="black" stroke-width="12"/>
                        
                        <rect x="120" y="125" width="14" height="50" fill="black" transform="rotate(135 137 150)"/>
                        
                        <circle cx="80" cy="75" r="8" fill="black"/>
                        <circle cx="110" cy="75" r="8" fill="black"/>
                        
                        <path d="M 70 110 Q 95 95 120 110" fill="none" stroke="black" stroke-width="8" stroke-linecap="round"/>
                    </svg>
                    <p>По вашему запросу ничего не найдено</p>
                </div>
            `;
            return;
        }

        resorts.forEach(resort => {
            const card = createResortCard(resort);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading resorts:', error);
    }
}

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        loadResorts(selectedDifficulty);
    }
});



document.addEventListener('DOMContentLoaded', () => {
    // 1. Проверяем текущий статус (если scripts.js уже выполнил checkAuth)
    if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
        RatingModule.enable();
    }
    
    // 2. Загружаем курорты
    loadResorts();
});


document.addEventListener('click', (e) => {
    const star = e.target.closest('.star-btn');
    if (!star) return; 

    if (!RatingModule.canRate()) {
        showAuthTooltip(star); // Показываем "Авторизуйтесь"
        return;
    }
    const container = star.closest('.rating-container');

    const card = container.closest('.resorts-card');


    const rating = parseInt(star.dataset.value);
    if (!container) return;

    container.querySelectorAll('.star-btn').forEach(btn => {
        const val = parseInt(btn.dataset.value);
        if (val <= rating) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (card) {
        const resortId = card.dataset.resortId;
        
        localStorage.setItem(`resort_rating_${resortId}`, rating);
        
        card.dataset.userRating = rating;
        
        console.log(`✅ Оценка ${rating} сохранена для курорта ${resortId}`);
    }

    console.log(`Оценка ${rating} для курорта`, container.closest('.resorts-card'));
});

document.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.star-btn');
    if (!star) return;
    if (!RatingModule.canRate()) {
        showAuthTooltip(star); // Показываем "Авторизуйтесь"
        return;
    }

    const rating = parseInt(star.dataset.value);
    const container = star.closest('.rating-container');
    if (!container) return;

    container.querySelectorAll('.star-btn').forEach(btn => {
        const val = parseInt(btn.dataset.value);
        btn.classList.toggle('active', val <= rating);
    });
}, true); 

document.addEventListener('mouseout', (e) => {
    const star = e.target.closest('.star-btn');
    if (!star) return;

    if (!RatingModule.canRate()) {
        hideAuthTooltip(); // Добавьте эту функцию, если есть
        return;
    }

    const container = star.closest('.rating-container');
    if (!container) return;

    const card = container.closest('.resorts-card');
    
    // 🔥 Получаем сохранённую оценку
    const savedRating = card ? parseInt(card.dataset.userRating) || 0 : 0;

    // 🔥 Возвращаем звёзды к сохранённому состоянию
    container.querySelectorAll('.star-btn').forEach(btn => {
        const val = parseInt(btn.dataset.value);
        btn.classList.toggle('active', val <= savedRating);
    });
}, true);

function hideAuthTooltip() {
    const tooltip = document.querySelector('.auth-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

const RatingModule = {
    enabled: false,

    enable() {
        this.enabled = true;
        this.restoreSavedRatings();
    },

    disable() {
        this.enabled = false;
        document.querySelectorAll('.star-btn.active').forEach(btn => {
            btn.classList.remove('active')
        });
    },

    canRate() {
        return this.enabled;
    },

    restoreSavedRatings() {
        document.querySelectorAll('.resorts-card').forEach(card => {
            const resortId = card.dataset.resortId;
            if (!resortId) return;
            
            const saved = localStorage.getItem(`resort_rating_${resortId}`);
            if (saved) {
                const rating = parseInt(saved);
                const container = card.querySelector('.rating-container');
                if (container) {
                    container.querySelectorAll('.star-btn').forEach(btn => {
                        const val = parseInt(btn.dataset.value);
                        btn.classList.toggle('active', val <= rating);
                    });
                }
            }
        });
    }
};


document.addEventListener('auth:changed', (event) => {
    const authStatus = event.detail.isAuthenticated;
    
    if (authStatus) {
        RatingModule.enable();
    } else {
        RatingModule.disable();
    }
});


// document.addEventListener('DOMContentLoaded', loadResorts);