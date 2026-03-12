from fastapi import APIRouter, Request
from app.core.templates import templates

router_tour = APIRouter(prefix="/catalog", tags=["Catalog"])

@router_tour.get("/")
def catalog_page(request: Request):
    return templates.TemplateResponse(
        "catalog.html",
        {"request": request}
    )