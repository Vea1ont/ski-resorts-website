from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from app.core.templates import templates

about_router = APIRouter()
@about_router.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})
