import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request, File, UploadFile, Form, status
import logging
from routers import users_router


# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})
# to access swagger ui, go to http://localhost:8000/docs

app.include_router(users_router.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    logger.info("Starting server...")
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
