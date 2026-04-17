from fastapi import Depends, HTTPException, status

from app.crud.crud_users import get_user_by_id
from app.security import decode_token
from app.security import auth2_scheme
from app.security import decode_token


async def get_current_user(token: str = Depends(auth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        if payload is None:
            raise credentials_exception
        print(f"DEBUG PAYLOAD: {payload}")
        user_id = payload.get("user_id") 
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="ID не найден в токене")
            
        user = await get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except Exception as e:
        raise HTTPException(status_code=401)