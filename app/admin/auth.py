from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from fastapi import Response

class AdminAuth(AuthenticationBackend):

    async def login(self, request: Request):
        form = await request.form()

        username = form.get("username")
        password = form.get("password")

        if username == "admin" and password == "1234":
            request.session.update({"token": "admin"})
            return True

        return False


    async def logout(self, request: Request):
        
        response.delete_cookie(key="token")  # <-- имя cookie должно совпадать
        return {"msg": "logged out"}


    async def authenticate(self, request: Request):
        return request.session.get("token") == "admin"