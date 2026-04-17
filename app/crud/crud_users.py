from app.db import database
from datetime import datetime, timezone

async def create_user(name, hashed_password, email, age):
    created_at = datetime.now(timezone.utc)
    query = """
        INSERT INTO users (name, hashed_password, email, age, created_at)
        VALUES ($1, $2, $3, $4, $5)
    """
    async with database.pool.acquire() as connection:
        await connection.execute(query, name, hashed_password, email, age, created_at)

async def get_user_by_email(email):
    query = "SELECT * FROM users WHERE email = $1"
    async with database.pool.acquire() as connection:
        result = await connection.fetchrow(query, email)
        return result

async def update_last_login(user_id, ip, user_agent):
    query = """
        UPDATE users
        SET last_login = NOW(),
            last_ip_addres = $1,
            last_user_agent = $2
        WHERE id = $3
    """
    async with database.pool.acquire() as connection:
        await connection.execute(query, ip, user_agent, user_id)
        
async def get_users_from_db(pool):
    query = "SELECT id, name, email FROM users"
    async with pool.acquire() as connection:
        rows = await connection.fetch(query)
        return rows
    
async def get_user_by_id(user_id):
    query = "SELECT id, name, email FROM users WHERE id = $1"
    async with database.pool.acquire() as connection:
        user = await connection.fetchrow(query, user_id)
        return user

async def delete_user(user_id):
    query = "DELETE FROM users WHERE id = $1"
    async with database.pool.acquire() as connection:
        await connection.execute(query, user_id)