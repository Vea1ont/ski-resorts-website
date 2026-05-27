import { checkAuth } from './auth.js';


console.log("Скрипт успешно загружен!");


function updateDateTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы в JS идут от 0 до 11
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateString = `${day}.${month}.${year}`;
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('current-date').innerHTML = `${dateString} | ${timeString}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);


async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.detail || errorData.message || 'Server error';
        throw new Error(message);
    }
    
    return await response.json();
}



const btnLogIn = document.querySelector('.btn-log-in');
if (btnLogIn) {
    btnLogIn.addEventListener('click', switchMainToLogin);
}

const btnRegister = document.querySelector('.btn-or-register');
if (btnRegister) {
    btnRegister.addEventListener('click', showRegister);
}

const btnOrLogin = document.querySelector('.btn-or-login');
if (btnOrLogin) {
    btnOrLogin.addEventListener('click', showLogin);
}

const btnHeroStart = document.querySelector('.btn-hero-start');
if (btnHeroStart) {
    btnHeroStart.addEventListener('click', switchMainToLogin);
}

function switchMainToLogin() {
    const hero = document.getElementById('hero');
    const log = document.getElementById('log');
    const register = document.getElementById('register');
    
    if (hero && log && register) {
        if (!hero.classList.contains('hidden')) {
            // Показываем форму входа
            hero.classList.add('hidden');
            log.classList.remove('hidden');
            register.classList.add('hidden');
        } else {
            // Возвращаемся на главную
            hero.classList.remove('hidden');
            log.classList.add('hidden');
            register.classList.add('hidden');
        }
    }
}
function switchHeroToTyping() {
    const mainSec = document.getElementById('main-sec');
    const typingSec = document.getElementById('typing-sec');
    
}

function showLogin() {
    const log = document.getElementById('log');
    const register = document.getElementById('register');
    const hero = document.getElementById('hero');


    if (hero && log && register) {
        register.classList.add('hidden');
        log.classList.remove('hidden');
        hero.classList.add('hidden'); 
    }
}

// Функция для переключения между формой входа и формой регистрации
function showRegister() {
    const log = document.getElementById('log');
    const register = document.getElementById('register');
    
    log.classList.toggle('hidden');
    register.classList.toggle('hidden');
}

// Функция для возврата на главную страницу
function showMain() {
    const hero = document.getElementById('hero');
    const log = document.getElementById('log');
    const register = document.getElementById('register');

    hero.classList.remove('hidden');
    log.classList.add('hidden');
    register.classList.add('hidden');
} 

// Функция обработки кнопки входа
const loginSubmitBtn = document.querySelector('.btn-login');

if (loginSubmitBtn) {

    loginSubmitBtn.addEventListener('click', async function() {
        // Получаем значения из полей ввода по их ID
        const email = document.getElementById('in-log').value;    
        const password = document.getElementById('in-pass').value; 
    
        // Валидация: проверяем, что поля не пустые
        if (!email || !password) {
            alert('Please fill in all fields'); // Показываем предупреждение
            return; // Прерываем выполнение функции
        }
    
        try {
            // Отправляем POST запрос на эндпоинт /login с данными пользователя
            const result = await postData('/auth/login', {
                email: email,        // Почта пользователя
                password: password   // Пароль пользователя
            });
            console.log('Login successful: ', result); // Логируем успешный результат
    
            // Сохраняем данные аутентификации в localStorage (браузерное хранилище)
            localStorage.setItem('access_token', result.access_token); // Токен доступа
            localStorage.setItem('user_id', result.user_id);           // ID пользователя
            localStorage.setItem('user_email', result.email);          // Email пользователя
            
            checkAuth();
    
            window.location.href = '/';
        } catch (error) {
            console.error('Login error:', error); 
            if (error.detail) {
                alert('Login failed: ' + error.detail); 
            } else {
                alert('Login failed. Please check your credentials.');
            }
        }
    });
}



// Находим кнопку создания аккаунта и добавляем обработчик клика
const makeAccBtn = document.querySelector('.makeAcc-btn');

if (makeAccBtn) {
    makeAccBtn.addEventListener('click', async function() {
        const name = document.getElementById('nikname').value;     
        const age = document.getElementById('age').value;          
        const password = document.getElementById('pass').value;    
        const confirmPassword = document.getElementById('againpass').value; 
        const email = document.getElementById('email').value;      

        if (!name) {
            alert('Please fill name');
            return;
        }

        if (!password) {
            alert('Please fill password');
            return;
        }

        if (!age) {
            alert('Please fill age');
            return;
        }

        if (!email) {
            alert('Please fill email');
            return;
        }

        if (password !== confirmPassword) {
            alert('Password do not match');
            return;
        }
    
        if (isNaN(age) || age < 0) {
            alert('Please enter a valid age');
            return;
        }

        try {
            // Отправляем POST запрос на эндпоинт /register с данными регистрации
            const result = await postData('/auth/register', {
                name: name,                     
                email: email,                   
                password: password,             
                age: parseInt(age)              
            });

            console.log('Registration successful: ', result); 
            alert('Registration successful! You can log in.'); 

            // После успешной регистрации показываем форму входа
            showLogin();
        } catch (error) {
            console.error('Registration error: ', error);
            if (error.detail) {
                alert('Registration failed: ' + error.detail);
            } else {
                alert('Registration failed. Please try again.');
            }
        }
        });
}

// Находим кнопку выхода и добавляем обработчик клика
const logoutBtn = document.querySelector('.btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('access_token'); 
        localStorage.removeItem('user_id');      
        localStorage.removeItem('user_email');   

        alert('You have been successfully logged out');

        checkAuth();

        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    });
}

const btnProfile = document.querySelector('.btn-profile');

if (btnProfile) {
    btnProfile.addEventListener('click', () => {
        window.location.href = '/profile';
    });
}

document.getElementById('burgerBtn').addEventListener('click', toggleBurger);

function toggleBurger() {
    const btn = document.getElementById('burgerBtn');
    const menu = document.getElementById('mobileMenu');
    btn.classList.toggle('active');
    menu.classList.toggle('open');
}

const btnAbout = document.querySelector('.btn-about');
document.addEventListener('DOMContentLoaded', checkAuth);