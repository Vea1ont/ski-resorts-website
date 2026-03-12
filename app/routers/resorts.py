from fastapi import APIRouter, HTTPException, UploadFile
from app.crud.crud_resorts import (create_resort, fetch_all_resorts, 
                                    fetch_resort_by_id, update_resort, 
                                    delete_resort)
from app.schemas.resorts_model import ResortCreate

import shutil
import uuid
from pathlib import Path

router_resorts = APIRouter(prefix="/resorts", tags=["Resorts"])

UPLOAD_DIR = Path("static/images/")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router_resorts.get("/")
async def get_all_resorts(
    difficulty: str | None = None,
    search: str | None = None
    ):
    resorts = await fetch_all_resorts()
    
    resorts = [dict(r) for r in resorts]
    
    if difficulty == "beginners":
        resorts = [r for r in resorts if r["beginner"]]
    elif difficulty == "medium":
        resorts = [r for r in resorts if r["medium"]]
    elif difficulty == "advanced":
        resorts = [r for r in resorts if r["advanced"]]
    elif difficulty == "expert":
        resorts = [r for r in resorts if r["expert"]]
    
    if search:
        search = search.lower()
        resorts = [
            r for r in resorts
            if search in r["name"].lower() 
            or search in r["city"].lower()
        ]
        
    return resorts

@router_resorts.get("/{resort_id}")
async def get_resort(resort_id: int):
    resort = await fetch_resort_by_id(resort_id)
    if not resort:
        raise HTTPException(status_code=404, detail="Resort not found")
    return resort

@router_resorts.post("/")
async def create_new_resort(
    image: UploadFile,
    data: ResortCreate
    ):
    
    file_extension = image.filename.split(".")[-1].lower()
    if file_extension not in ["jpg", "jpeg", "png", "webp"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    resort_data = data.model_dump()
    resort_data["image"] = f"static/images/{unique_filename}"
        
    image_db_path = f"static/images/{unique_filename}"
    
    
    await create_resort(**resort_data)
    
    return {"message": "Resort created successfully"}

@router_resorts.delete("/{resort_id}")
async def delete_resort_by_id(resort_id: int):
    resort = await fetch_resort_by_id(resort_id)
    if not resort:
        raise HTTPException(status_code=404, detail="Resort not found")
    await delete_resort(resort_id)
    return {"message": "Resort deleted successfully"}