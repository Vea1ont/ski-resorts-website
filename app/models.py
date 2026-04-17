from pydantic import BaseModel, EmailStr, Field

class Users(BaseModel):
    id: int
    name: str
    email: str
    
class Register(BaseModel):
    name: str
    password: str
    email: EmailStr
    age: int
    
class LogIn(BaseModel):
    email: str
    password: str
    
class ReviewsCreate(BaseModel):
    product_id: int
    rating: int = Field(ge=1, le=5)  
    comment: str

class ReviewRead(ReviewsCreate):
    id: int
    is_approved: bool
    
    class Config:
        from_attributes = True