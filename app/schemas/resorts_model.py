from pydantic import BaseModel

class ResortCreate(BaseModel):
    
    image: str | None = None
    
    name: str
    city: str
    
    address: str | None = None
    card_hero_info: str | None = None

    length: int = 0
    
    count_trails: int = 0
    max_height: int = 0

    beginner: bool = False
    medium: bool = False
    advanced: bool = False
    expert: bool = False