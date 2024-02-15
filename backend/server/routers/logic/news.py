from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from ..models import NewsModel, NewNewsModel
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import News, Admin
from .database_handler.util import get_database_session

LENGTH_OF_SHA256 = 64
RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_NOT_FOUND = 404
RETURN_USER_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

NEWS_TITLE_LENGTH = 45
NEWS_DESCRIPTION_LENGTH = 3000

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_news(news_model: NewNewsModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "News created"

        if None in news_model.__dict__.values() or "" in news_model.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if len(news_model.title) > NEWS_TITLE_LENGTH or len(news_model.description) > NEWS_DESCRIPTION_LENGTH:
            code = RETURN_FAILURE
            message = "Title or description length exceeded"
            return code, message

        creator = session.query(Admin).filter(Admin.id == news_model.creator_id).first()
        if creator is None:
            code = RETURN_NOT_FOUND
            message = "Admin not found"
            return code, message

        news = News(title=news_model.title, description=news_model.description,
                    creation_date=news_model.creation_date, creator_id=news_model.creator_id)
        session.add(news)
        session.commit()

        return code, message

def get_all_news():
    code = RETURN_SUCCESS
    message = "News found"
    return_news = []

    with get_database_session() as session:
        news = session.query(News).all()
        if not news:
            code = RETURN_NOT_FOUND
            message = "No news found"
            return code, message, None

        for n in news:
            news_dict = NewsModel(id=n.id, title=n.title, description=n.description, creation_date=n.creation_date, creator_id=n.creator_id).__dict__
            # Convert datetime to string
            news_dict['creation_date'] = news_dict['creation_date'].isoformat()
            return_news.append(news_dict)
        return code, message, return_news

def get_news(news_id: int):
    code = RETURN_SUCCESS
    message = "News found"

    with get_database_session() as session:
        news = session.query(News).filter(News.id == news_id).first()
        if news is None:
            code = RETURN_NOT_FOUND
            message = "News not found"
            return code, message, None

        news_model = NewsModel(id=news.id, title=news.title, description=news.description, creation_date=news.creation_date, creator_id=news.creator_id)
        news_dict = news_model.__dict__
        # Convert datetime to string
        news_dict['creation_date'] = news_dict['creation_date'].isoformat()
        return code, message, news_dict


def delete_news(news_id: int):
    code = RETURN_SUCCESS
    message = "News deleted"

    with get_database_session() as session:
        news = session.query(News).filter(News.id == news_id).first()
        if news is None:
            code = RETURN_NOT_FOUND
            message = "News not found"
            return code, message

        session.delete(news)
        session.commit()
        return code, message

def update_news(news_model: NewsModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "News updated"

        news = session.query(News).filter(News.id == news_model.id).first()
        if news is None:
            code = RETURN_NOT_FOUND
            message = "News not found"
            return code, message

        creator = session.query(Admin).filter(Admin.id == news_model.creator_id).first()
        if creator is None:
            code = RETURN_NOT_FOUND
            message = "Creator not found"
            return code, message

        if news_model.title is not None:
            if len(news_model.title) > NEWS_TITLE_LENGTH:
                code = RETURN_FAILURE
                message = "Title length exceeded"
                return code, message
            news.title = news_model.title
        if news_model.description is not None:
            if len(news_model.description) > NEWS_DESCRIPTION_LENGTH:
                code = RETURN_FAILURE
                message = "Description length exceeded"
                return code, message
            news.description = news_model.description
        if news_model.creation_date is not None:
            news.creation_date = news_model.creation_date
        if news_model.creator_id is not None:
            news.creator_id = news_model.creator_id

        session.commit()
        return code, message
    