import { checkAuth } from "./auth.js"; 

let isAuthenticated = false;

function toggleDropdown() {
    const menu = document.querySelector('.dropdown-menu');
    const btn = document.querySelector('.dropdown-btn');

    menu.classList.toggle('show');
    btn.classList.toggle('active');
}

const dropdownBtn = document.querySelector('.dropdown-btn');

if (dropdownBtn) {
    dropdownBtn.addEventListener('click', toggleDropdown);
}


function selectOption(element, value) {

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
    });

    element.classList.add('active');
    element.setAttribute('aria-selected', 'true');

    document.getElementById('selected-value').textContent = value;
    document.querySelector('.dropdown-menu').classList.remove('show');
    document.querySelector('.dropdown-btn').classList.remove('active');

    selectedDifficulty = element.dataset.value;

    if (selectedDifficulty === 'Все уровни') {
        selectedDifficulty = null;
    }

    loadResorts(selectedDifficulty);
}
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        selectOption(e.target, e.target.textContent);
    });
});
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown');
    if (!dropdown) return;

    if (!dropdown.contains(event.target)) {
        document.querySelector('.dropdown-menu')?.classList.remove('show');
        document.querySelector('.dropdown-btn')?.classList.remove('active');
    }
});




const template = document.getElementById('resort-card-template');
function createResortCard(resort) {
    if (!template) return null;

    const clone = template.content.cloneNode(true);


    const card = clone.querySelector('.resorts-card');

    if (resort.id) {
        card.dataset.resortId = resort.id;
    }

    card.dataset.resort = JSON.stringify(resort);

    if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
        const button = document.createElement('button');
        button.className = 'open-modal-btn';
        button.textContent = 'Оставить отзыв';
        button.addEventListener('click', () => openModal(resort));
        clone.querySelector('.info-child-2').appendChild(button);
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




async function loadResorts(difficulty = null) {
    const search = searchInput ? searchInput.value : '';

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

const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.input-search');

let selectedDifficulty = null;

if (searchBtn) {
    searchBtn.addEventListener('click', () => loadResorts());
}

if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            loadResorts(selectedDifficulty);
        }
    });
}

const reviewTemplate = document.getElementById('reviews-card-template');
const starTemplate = document.getElementById('star-template');

if (!reviewTemplate) {
    console.error('Шаблон #reviews-card-template не найден!');
}

function createReviewCard(review) {
    const clone = reviewTemplate.content.cloneNode(true);

    // Название курорта
    clone.querySelector('[data-field="review-name"]').textContent = review.resort_name;

    // Локация
    clone.querySelector('[data-field="review-location"]').textContent =
        `${review.resort_city}${review.resort_address ? ', ' + review.resort_address : ''}`;

    // Комментарий
    clone.querySelector('[data-field="review-comment"]').textContent = review.comment;

    // Дата
    clone.querySelector('[data-field="review-date"]').textContent = formatDate(review.created_at);

    // ⭐ Рейтинг
    const starsWrapper = clone.querySelector('[data-field="stars-wrapper"]');
    starsWrapper.innerHTML = '';

    for (let i = 0; i < review.rating; i++) {
        const star = starTemplate.content.cloneNode(true);
        starsWrapper.appendChild(star);
    }

    return clone;
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long'
    });
}


export async function loadReviews() {
    const container = document.querySelector('.profile-card__reviews_grid');
    console.log("Запрос пошел!");

    if (!container) return;

    if (!reviewTemplate || !starTemplate) {
        console.error('Шаблон #reviews-card-template или #star-template не найден!');
        return;
    }

    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/reviews/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const reviews = data.reviews ?? [];

        container.innerHTML = '';

        if (reviews.length === 0) {
            container.innerHTML = '<p>У вас пока нет отзывов</p>';
            return;
        }

        reviews.forEach(review => {
            const card = createReviewCard(review);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

function showAuthMessage(star) {
    const container = star.closest('.rating-container');
    if (!container) return;

    container.classList.add('hidden-stars');
    container.querySelector('.auth-message')?.classList.add('visible');
}

function hideAuthMessage(star) {
    const container = star.closest('.rating-container');
    if (!container) return;

    container.classList.remove('hidden-stars');
    container.querySelector('.auth-message')?.classList.remove('visible');
}


document.addEventListener('click', (e) => {
    const star = e.target.closest('.star-btn');
    if (!star) return; 

    if (!RatingModule.canRate()) {
        showAuthMessage(star); 
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
        
        console.log(`Оценка ${rating} сохранена для курорта ${resortId}`);
    }

    console.log(`Оценка ${rating} для курорта`, container.closest('.resorts-card'));
});

document.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.star-btn');
    if (!star) return;

    const container = star.closest('.rating-container');
    if (!container) return;

    if (!RatingModule.canRate()) {
        showAuthMessage(star);
        return;
    }

    const rating = parseInt(star.dataset.value);
    container.querySelectorAll('.star-btn').forEach(btn => {
        const val = parseInt(btn.dataset.value);
        btn.classList.toggle('active', val <= rating);
    });
});

document.addEventListener('mouseout', (e) => {
    const container = e.target.closest('.rating-container');
    if (!container) return;

    if (container.contains(e.relatedTarget)) return;

    if (!RatingModule.canRate()) {
        hideAuthMessage(container.querySelector('.star-btn'));
        return;
    }

    const card = container.closest('.resorts-card');
    const savedRating = card ? parseInt(card.dataset.userRating) || 0 : 0;

    container.querySelectorAll('.star-btn').forEach(btn => {
        const val = parseInt(btn.dataset.value);
        btn.classList.toggle('active', val <= savedRating);
    });
});





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

    isAuthenticated = event.detail.isAuthenticated; 
        
    const authStatus = isAuthenticated;
    
    if (authStatus) {
        RatingModule.enable();
    } else {
        RatingModule.disable();
    }

    document.querySelectorAll('.resorts-card').forEach(card => {
        const infoChild2 = card.querySelector('.info-child-2');
        let existingBtn = infoChild2.querySelector('.open-modal-btn');
        if (authStatus) {
            if (!existingBtn) {
                const resort = JSON.parse(card.dataset.resort);
                const button = document.createElement('button');
                button.className = 'open-modal-btn';
                button.textContent = 'Оставить отзыв';
                button.addEventListener('click', () => openModal(resort));
                infoChild2.appendChild(button);
            }
        } else {
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    });
});

let currentResort = null;

function closeModal() {
    const modal = document.getElementById("review-modal");
    if (!modal) return;
    modal.classList.remove('open');
}

const closeBtn = document.querySelector('.close-btn');

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

async function submitReview() {
    const comment = document.getElementById("review-comment").value;
    const rating = modalRating;
    const token = localStorage.getItem('access_token');
    console.log("Мой токен:", token);

    if (!rating) {
        alert("Поставьте оценку");
        return;
    }

    const data = {
        product_id: currentResort.id,
        rating: rating,
        comment: comment
    };

    try {
        const response = await fetch("/reviews/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.status === 401) {
            alert("Сессия истекла. Войдите заново.");
            localStorage.removeItem('access_token'); // Удаляем протухший паспорт
            showLogin(); // Показываем форму логина
            return;
        };

        if (response.ok) {
            alert("Отзыв отправлен!");
            closeModal();
        } else {
            alert("Ошибка при отправке");
        }
    } catch (error) {
        console.error(error);
        alert("Ошибка сети");
    }
}

const submitBtn = document.querySelector('.submit-btn');

if (submitBtn) {
    submitBtn.addEventListener('click', submitReview);
}

let modalRating = 0;

document.querySelectorAll('.review-modal .star').forEach((star, index) => {
    star.addEventListener('click', () => {
        modalRating = index + 1;

        document.querySelectorAll('.review-modal .star').forEach((s, i) => {
            s.classList.toggle('active', i < modalRating);
        });
    });
});


function openModal(resort) {
    currentResort = resort;

    modalRating = 0;

    document.querySelectorAll('.review-modal .star').forEach(s => {
        s.classList.remove('active');
    });

    const modal = document.getElementById("review-modal");
    if (modal) {
        modal.classList.add('open');
    }

    document.getElementById("modal-name").innerText = resort.name;
    document.getElementById("modal-height").innerText = "Высота: " + resort.peak_height;
    document.getElementById("modal-rating").innerText = "Рейтинг: " + resort.rating;
    document.getElementById("modal-image").src = resort.image;
}

document.addEventListener('DOMContentLoaded', () => {
    isAuthenticated = checkAuth(); 
    
    if (isAuthenticated) {
        RatingModule.enable();
    }
    
    if (document.getElementById('resorts-container')) {
        loadResorts();
    }
});

// document.addEventListener('DOMContentLoaded', loadResorts);