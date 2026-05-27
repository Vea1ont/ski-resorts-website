from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from app.core.templates import templates

contacts_router = APIRouter()
@contacts_router.get("/contacts", response_class=HTMLResponse)
async def contacts(request: Request):
    return templates.TemplateResponse("contacts.html", {"request": request})
