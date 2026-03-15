import asyncpg
import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

class Postgres:
    def __init__(self, database_url):
        self.database_url = database_url
        self.pool = None  #  Инициализируем как None
    
    async def connect(self):
        self.pool = await asyncpg.create_pool(self.database_url)  # Создаём пул
    
    async def disconnect(self):
        if self.pool:  # Проверяем существование
            await self.pool.close()
database = Postgres(DATABASE_URL)

admin_engine = create_engine(DATABASE_URL)

Base = declarative_base()