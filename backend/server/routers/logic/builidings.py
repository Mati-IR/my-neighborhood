from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import Building, FloorForBuilding
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


def create_building(building_model):
    code = RETURN_SUCCESS
    message = "Building created"
    building = Building(name=building_model.name, address=building_model.address, city=building_model.city,
                        country=building_model.country, postal_code=building_model.postal_code)
    session.add(building)
    session.commit()
    return code, message
