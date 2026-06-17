from fastapi import FastAPI

from .routes import router

app = FastAPI(title='Payment Processor Service')
app.include_router(router)
