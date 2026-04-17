import { checkAuth } from './auth.js';

// Объявляем асинхронную функцию postData для отправки POST-запросов на сервер
// url - адрес сервера, data - данные для отправки
console.log("Скрипт успешно загружен!");

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



// Обработчик для кнопки "Log in" в навбаре
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

// Обработчик для кнопки "Get Started" на главной странице
const btnHeroStart = document.querySelector('.btn-hero-start');
if (btnHeroStart) {
    btnHeroStart.addEventListener('click', switchMainToLogin);
}

// Функция для переключения между главной страницей и формами входа/регистрации
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
    
            // Перенаправляем пользователя на главную страницу
            window.location.href = '/';
        } catch (error) {
            // Обрабатываем ошибки при входе
            console.error('Login error:', error); // Логируем ошибку в консоль
            // Показываем разные сообщения в зависимости от типа ошибки
            if (error.detail) {
                alert('Login failed: ' + error.detail); // Если есть детальное описание ошибки
            } else {
                alert('Login failed. Please check your credentials.'); // Стандартное сообщение
            }
        }
    });
}



// Находим кнопку создания аккаунта и добавляем обработчик клика

const makeAccBtn = document.querySelector('.makeAcc-btn');

if (makeAccBtn) {
    makeAccBtn.addEventListener('click', async function() {
        const name = document.getElementById('nikname').value;     // Имя пользователя
        const age = document.getElementById('age').value;          // Возраст
        const password = document.getElementById('pass').value;    // Пароль
        const confirmPassword = document.getElementById('againpass').value; // Подтверждение пароля
        const email = document.getElementById('email').value;      // Email

        // Валидация полей: проверяем каждое поле на заполненность
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

        // Проверяем, совпадают ли пароли
        if (password !== confirmPassword) {
            alert('Password do not match');
            return;
        }
    
        // Проверяем, что возраст - это число и не отрицательный
        if (isNaN(age) || age < 0) {
            alert('Please enter a valid age');
            return;
        }

        try {
            // Отправляем POST запрос на эндпоинт /register с данными регистрации
            const result = await postData('/auth/register', {
                name: name,                     // Имя пользователя
                email: email,                   // Email (обязательное поле)
                password: password,             // Пароль
                age: parseInt(age)              // Возраст как число (преобразуем из строки)
            });

            console.log('Registration successful: ', result); // Логируем успешную регистрацию
            alert('Registration successful! You can log in.'); // Сообщение об успехе

            // После успешной регистрации показываем форму входа
            showLogin();
        } catch (error) {
            // Обрабатываем ошибки при регистрации
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
        localStorage.removeItem('access_token'); // Удаляем токен
        localStorage.removeItem('user_id');      // Удаляем ID пользователя
        localStorage.removeItem('user_email');   // Удаляем email

        // Показываем сообщение об успешном выходе
        alert('You have been successfully logged out');

        // Проверяем и обновляем состояние авторизации
        checkAuth();

        // Если пользователь не на главной странице, перенаправляем его туда
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

const btnAbout = document.querySelector('.btn-about');
// Запускаем проверку авторизации когда DOM полностью загружен
document.addEventListener('DOMContentLoaded', checkAuth);