from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import OwnerCredential, AdminCredential, Admin, Owner
from .database_handler.util import get_database_session
import os
import logging

LENGTH_OF_SHA256 = 64
RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_USER_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

session = get_database_session()
logger.info('Database session status: ' + str(session))