import uvicorn

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from app.db import database


from app.routers import auth
from app.routers import profile
from app.routers import catalog
from app.routers import resorts

from app.core.templates import templates


# logfire.configure()


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# logfire.instrument_fastapi(app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8001"], # параметр, в котором вы разрешаете 
    # конкретным доменам(фронтендам) обращаться к бэкенду
    allow_credentials=True, # параметр, в котором вы разрешаете 
    # передачу учетных данных(credentials) от фронтенда к бэкенду(Coockies, tokens, HTTP authentication)
    allow_methods=["GET", "POST", "PUT", "DELETE"], # параметр, определяющий какие HTTP 
    # методы могут испольвать фронтенд-приложения при обращении к вашему бэкенду
    allow_headers=["Content-type", "Authorization"], 
)
#app.include_router(файл.py.название роутера)
app.include_router(auth.router)
app.include_router(profile.router_profile)
app.include_router(catalog.router_tour)
app.include_router(resorts.router_resorts)

# templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

@app.on_event("startup")
async def startup():
    await database.connect()  # ← Инициализация пула при запуске

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()  # ← Корректное закрытие


    
    
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=True)