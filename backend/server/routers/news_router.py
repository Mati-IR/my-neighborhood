from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewNewsModel, NewsModel
from .logic import create_news as create_news_logic, get_all_news as get_all_news_logic, get_news as get_news_logic, delete_news as delete_news_logic, update_news as update_news_logic
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# CRUD for news
@router.post("/news", response_model=NewNewsModel)
def new_post(news: NewNewsModel):
    code, message = create_news_logic(news)
    return JSONResponse(status_code=code, content={"message": message})

@router.get("/all_news")
def get_all_news():
    code, message, news = get_all_news_logic()
    return JSONResponse(status_code=code, content={"message": message, "news": news})

@router.get("/news/{news_id}")
def get_news(news_id: int):
    code, message, news = get_news_logic(news_id)
    return JSONResponse(status_code=code, content={"message": message, "news": news})

@router.delete("/news/{news_id}")
def delete_news(news_id: int):
    code, message = delete_news_logic(news_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.put("/news")
def update_news(news: NewsModel):
    code, message = update_news_logic(news)
    return JSONResponse(status_code=code, content={"message": message})

