from app.db import database

from typing import Dict, Any

async def create_review(user_id: int, product_id: int, rating: int, comment: str):
    query = """
        INSERT INTO reviews (user_id, product_id, rating, comment)
        VALUES ($1, $2, $3, $4)
    """
    print(f"DEBUG SQL: user={user_id}, prod={product_id}, rate={rating}, comment='{comment}' type={type(comment)}")
    async with database.pool.acquire() as conn:
        await conn.execute(query, int(user_id), int(product_id), int(rating), str(comment))
        
        
async def get_reviews_by_id(review_id: int):
    query = 'SELECT * FROM reviews WHERE id = $1'
    async with database.pool.acquire() as conn:
        return await conn.fetchrow(query, review_id)
    
async def get_reviews_by_product_id(product_id: int):
    query = 'SELECT * FROM reviews WHERE product_id = $1'
    async with database.pool.acquire() as conn:
        return await conn.fetch(query, product_id)

async def get_reviews_by_user_id(user_id: int):
    query = """
        SELECT 
            r.id,
            r.product_id,
            r.rating,
            r.comment,
            r.created_at,
            r.is_approved,
            res.name as resort_name,
            res.city as resort_city,
            res.address as resort_address,
            res.image as resort_image
        FROM reviews r
        JOIN resorts_card res ON r.product_id = res.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    """
    async with database.pool.acquire() as conn:
        records = await conn.fetch(query, user_id)
        return [dict(record) for record in records]
    
async def delete_review(review_id: int):
    query = 'DELETE FROM reviews WHERE id = $1'
    async with database.pool.acquire() as conn:
        await conn.execute(query, review_id)

async def update_review_status(review_id: int, is_approved: bool):
    query = 'UPDATE reviews SET is_approved = $1 WHERE id = $2'
    async with database.pool.acquire() as conn:
        await conn.execute(query, is_approved, review_id)