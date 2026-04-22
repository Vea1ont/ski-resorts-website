Ski Resorts Russia

Веб-платформа для поиска и обзора горнолыжных курортов России. Проект объединяет информацию о трассах от Кавказа до Сибири, помогая райдерам выбрать идеальное место для катания.

![Main Preview](https://github.com/Vea1ont/ski-resorts-website/blob/main/static/screenshots/main.png?raw=true) 

Текущий функционал
- **Интерактивный каталог:** Просмотр списка курортов с описанием, локацией и ключевыми характеристиками.
  ![Catalog Preview](https://github.com/Vea1ont/ski-resorts-website/blob/main/static/screenshots/catalog.png?raw=true) 
- **Фильтрация по уровням:** Удобная сортировка курортов по сложности трасс (Начинающий, Средний, Продвинутый, Эксперт).
- **Поиск:** Поиск по названию курорта или региону.
- **Инфо-карточки:** Детальные данные: высота курорта, количество трасс и общая протяженность километров.
- **Система рейтинга:** UI-компонент для оценки курорта (в процессе интеграции с БД).
- **Страница админа:** Отдельная страница для администратора для удобного добавления новых курортов в каталог.

Стек технологий
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL, SQLAlchemy (ORM)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)

##  Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone [https://github.com/Vea1ont/ski-resorts-website.git](https://github.com/Vea1ont/ski-resorts-website.git)
   cd ski-resorts-website

2. **Настройте виртуальное окружение**
     python -m venv venv
     source venv/bin/activate  # Для Linux/macOS
     # или
     venv\Scripts\activate # Для Windows

3. **Устновите зависимости**
     pip install -r requirements.txt

4. **Найстройте базу данных**
     Создайте БД PostgreSQL и укажите параметры подключения в .env файле (или в конфиге).
5. **Uvicorn**
   uvicorn app.main:app --reload
    
