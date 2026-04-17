from fastapi import APIRouter, HTTPException, Depends

from app.db import database
from app.models import Users
from app.crud.crud_users import get_users_from_db, delete_user, get_user_by_id
from app.dependencies import get_current_user

router_user = APIRouter(prefix="/users", tags=["Users"])

@router_user.get("/")
async def get_all_users():
    rows = await get_users_from_db(database.pool)
    users = [
        Users(id=record["id"], name=record["name"], email=record["email"]) 
        for record in rows
    ]
    
    return users
    
@router_user.get("/me")
async def current_user(current_user: dict = Depends(get_current_user)):
    return {"id": current_user["id"], "name": current_user["name"], "email": current_user["email"]}
    

@router_user.delete("/me")
async def delete_account(current_user: dict = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    await delete_user(current_user["id"])
    return {"message": "User account deleted successfully"}
    
