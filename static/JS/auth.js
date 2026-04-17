export function isTokenvalid(token) {
    try {
        // Для JWT токенов: разбиваем токен по точкам и берем вторую часть (payload)
        // atob() - декодирует base64 строку
        // JSON.parse() - преобразует JSON строку в объект
        const payload = JSON.parse(atob(token.split('.')[1]));
          // Проверяем, что время действия токена не истекло
        // payload.exp - время окончания действия в секундах, умножаем на 1000 для миллисекунд
        return payload.exp * 1000 > Date.now();
        // Если произошла ошибка при разборе токена - считаем его невалидным
    } catch (e) {  
        return false;
    }
}

export function checkAuth() {
    console.log("checkAuth called");
    let token = localStorage.getItem('access_token');

    const userButtonsContainer = document.querySelector('.user-buttons-container');
    const btnLogIn = document.querySelector('.btn-log-in');

    const isAuthenticated = !!token;

    if (!btnLogIn || !userButtonsContainer) return;

    if (token && !isTokenvalid(token)) {
        localStorage.removeItem('access_token');
        token = null;
    };

    if (token) {
        // Авторизован
        userButtonsContainer.classList.remove('hidden');
        btnLogIn.classList.add('hidden');
    } else {
        // Не авторизован
        userButtonsContainer.classList.add('hidden');
        btnLogIn.classList.remove('hidden');
        
        if (window.location.pathname === '/profile') {
            window.location.href = '/';
        }
    }

    document.dispatchEvent(new CustomEvent('auth:changed', {
        detail: { isAuthenticated: isAuthenticated }
    }));

    return isAuthenticated;
}