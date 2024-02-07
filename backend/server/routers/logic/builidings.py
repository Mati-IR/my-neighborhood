from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import Building, FloorForBuilding
from .database_handler.util import get_database_session
import os
import logging

RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_BUILDING_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

session = get_database_session()
logger.info('Database session status: ' + str(session))


def create_building(building_model):
    code = RETURN_SUCCESS
    message = "Building created"

    if None in building_model.__dict__.values() or "" in building_model.__dict__.values():
        code = RETURN_FAILURE
        message = "Please fill all the fields"
        return code, message

    if building_model.floors_amount < 1:
        code = RETURN_FAILURE
        message = "Number of floors must be greater than 0"
        return code, message

    if session.query(Building.building_name).filter(Building.building_name == building_model.building_name).first() is not None:
        code = RETURN_BUILDING_ALREADY_EXISTS
        message = "Building with this name already exists"
        return code, message

    # if building with the same city, street and building number already exists
    if session.query(Building).filter(Building.city == building_model.city,
                                      Building.street == building_model.street,
                                      Building.building_number == building_model.building_number).first() is not None:
        code = RETURN_BUILDING_ALREADY_EXISTS
        message = "Building with this address already exists"
        return code, message



    building = Building(building_name=building_model.building_name, city=building_model.city, street=building_model.street,
                        building_number=building_model.building_number, postal_code=building_model.postal_code,
                        floors_amount=building_model.floors_amount)
    session.add(building)
    session.flush()

    floors = building_model.floors_amount
    for i in range(floors):
        floor = FloorForBuilding(floor_number=i + 1, building_id=building.id)
        session.add(floor)
    session.commit()
    return code, message
