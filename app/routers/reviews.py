from fastapi import APIRouter, HTTPException
from app.models import ReviewsCreate, ReviewRead
from app.crud.crud_reviews import create_review, get_reviews_by_id, get_reviews_by_product_id, get_reviews_by_user_id, delete_review, update_review_status
from app.dependencies import get_current_user
from fastapi import Depends


router = APIRouter(prefix="/reviews", tags=["Reviews"])

    
@router.post("/")
async def save_review(
    data: ReviewsCreate, 
    user: dict = Depends(get_current_user)
):
    new_review = await create_review(
        user_id=user["id"],
        product_id=data.product_id,
        rating=data.rating,
        comment=data.comment
    )
    return {"message": "Отзыв успешно сохранен", "review": new_review}


@router.get("/")
async def get_user_reviews(
    user: dict = Depends(get_current_user)
):
    reviews = await get_reviews_by_user_id(user["id"])
    return {"reviews": reviews}