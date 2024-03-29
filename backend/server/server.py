import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request, File, UploadFile, Form, status
import logging
from routers import users_router, buildings_router, spaces_router, news_router, invoices_router, incidents_router, voting_router
from fastapi.middleware.cors import CORSMiddleware

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})
# to access swagger ui, go to http://localhost:8000/docs

app.include_router(users_router.router)
app.include_router(buildings_router.router)
app.include_router(spaces_router.router)
app.include_router(news_router.router)
app.include_router(invoices_router.router)
app.include_router(incidents_router.router)
app.include_router(voting_router.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    logger.info("Starting server...")
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:7999"],  # Ustaw domenę Twojej aplikacji klienta
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Dodaj metody HTTP, które chcesz obsługiwać
    allow_headers=["*"],  # Ustaw nagłówki, które chcesz zezwolić
)
