from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from app.core.templates import templates

router_news = APIRouter()
@router_news.get("/news", response_class=HTMLResponse)
async def news_page(request: Request):
    return templates.TemplateResponse("news.html", {"request": request, "username": "Suji"})
