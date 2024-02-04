import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request, File, UploadFile, Form, status
import logging


# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

if __name__ == "__main__":
    logger.info("Starting server...")
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
