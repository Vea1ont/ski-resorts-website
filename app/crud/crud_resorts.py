from app.db import database
from typing import Dict, Any

async def create_resort(data: Dict[str, Any]):
    
    query= """
        INSERT INTO resorts_card (
            image, 
            name,
            city,
            address,
            length,
            count_trails,
            card_hero_info,
            peak_height,
            beginners,
            medium,
            advanced,
            expert
            
        ) VALUES (
            $1, $2, $3, $4, $5, $6, 
            $7, $8, $9, $10, $11, $12
            )
    """
    async with database.pool.acquire() as conn:
        await conn.execute(
            query,
            data['image'],
            data['name'],
            data['city'],
            data['address'],
            data['length'],
            data['count_trails'],
            data.get('card_hero_info'),
            data['peak_height'],
            data['beginners'],
            data['medium'],
            data['advanced'],
            data['expert']
        )
        
async def fetch_all_resorts():
    query = 'SELECT * FROM "resorts_card"'
    async with database.pool.acquire() as conn:
        return await conn.fetch(query)
    
async def fetch_resort_by_id(resort_id):
    query = 'SELECT * FROM "resorts_card" WHERE id = $1'
    async with database.pool.acquire() as conn:
        return await conn.fetchrow(query, resort_id)
    
async def delete_resort(resort_id):
    query = 'DELETE FROM "resorts_card" WHERE id = $1'
    async with database.pool.acquire() as conn:
        await conn.execute(query, resort_id)
        
async def update_resort(resort_id, **kwargs):
    if not kwargs:
        return  
    
    set_clause = ", ".join([f"{key} = ${index + 2}" for index, key in enumerate(kwargs.keys())])
    query = f'UPDATE "resorts_card" SET {set_clause} WHERE id = $1'
    async with database.pool.acquire() as conn:
        await conn.execute(query, resort_id, *kwargs.values())
        
    
    
