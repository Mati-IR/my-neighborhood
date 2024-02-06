import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_database_session():
    DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
    DATABASE = os.getenv('DATABASE')
    DATABASE_HOST = os.getenv('DATABASE_HOST')
    DATABASE_PORT = os.getenv('DATABASE_PORT')

    # log all the environment variables
    logger.info(f"DATABASE_USERNAME: {DATABASE_USERNAME}")
    logger.info(f"DATABASE_PASSWORD: {DATABASE_PASSWORD}")
    logger.info(f"DATABASE: {DATABASE}")
    logger.info(f"DATABASE_HOST: {DATABASE_HOST}")
    logger.info(f"DATABASE_PORT: {DATABASE_PORT}")

    DATABASE_URL = f"mysql+pymysql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE}"

    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    return Session()
