from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import Building, FloorForBuilding, SpacesForFloor, Space
from .database_handler.util import get_database_session
from .spaces import get_space_by_id, remove_space
import os
import logging

RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_BUILDING_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_building(building_model):
    with get_database_session() as session:
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
        for i in range(floors + 1):
            floor = FloorForBuilding(floor_number=i, building_id=building.id)
            session.add(floor)
        session.commit()
        return code, message


def get_buildings():
    with get_database_session() as session:
        buildings = session.query(Building).all()
        for building in buildings:
            yield {
            "id": building.id,
            "building_name": building.building_name,
            "city": building.city,
            "street": building.street,
            "building_number": building.building_number,
            "postal_code": building.postal_code,
            "floors_amount": building.floors_amount
        }


def get_building(building_id):
    with get_database_session() as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        logger.info(f"Building: {building}")
        if building is not None:
            return {
                "id": building.id,
                "building_name": building.building_name,
                "city": building.city,
                "street": building.street,
                "building_number": building.building_number,
                "postal_code": building.postal_code,
                "floors_amount": building.floors_amount
            }
        else:
            return None


def remove_building(building_id):
    with get_database_session() as session:
        # Query for any spaces associated with the building
        spaces = session.query(SpacesForFloor).join(FloorForBuilding).filter(FloorForBuilding.building_id == building_id).all()

        # If there are associated spaces, delete them first
        if spaces:
            for space in spaces:
                remove_space(space.space)
            session.commit()

        # Query for any floors associated with the building
        floors = session.query(FloorForBuilding).filter(FloorForBuilding.building_id == building_id).all()

        # If there are associated floors, delete them first
        if floors:
            for floor in floors:
                # Query for any spaces associated with the floor
                spaces_for_floor = session.query(SpacesForFloor).filter(SpacesForFloor.floor_id == floor.floor_id).all()

                # If there are associated spaces, delete them first
                if spaces_for_floor:
                    for space_for_floor in spaces_for_floor:
                        session.delete(space_for_floor)
                session.delete(floor)
            session.commit()

        # Now, try to delete the building
        building = session.query(Building).filter(Building.id == building_id).first()
        if building:
            session.delete(building)
            try:
                session.commit()
                session.close()
                return RETURN_SUCCESS, 'Building and associated floors and spaces removed'
            except Exception as e:
                session.rollback()
                return RETURN_FAILURE, f'Failed to remove building: {str(e)}'
            finally:
                session.close()
        else:
            session.close()
            return RETURN_FAILURE, 'Building not found'


def get_building_details(building_id):
    with get_database_session() as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        floors = session.query(FloorForBuilding).filter(FloorForBuilding.building_id == building_id).all()
        floors_details = []
        logger.info("Floors: ")
        for floor in floors:
            logger.info(floor.__dict__)
        for floor in floors:
            floor_details = {
                "floor_number": floor.floor_number,
                "number_of_spaces": len([x for x in session.query(SpacesForFloor).filter(SpacesForFloor.floor_id == floor.floor_id).all()]),
                "spaces": []
            }
            # get ids of all spaces on this floor
            spaces_id = [x.space for x in session.query(SpacesForFloor).filter(SpacesForFloor.floor_id == floor.floor_id).all()]
            logger.warn("Spaces: ")
            for id in spaces_id:
                logger.warn(f"Space id: {id}")
                _, space_details = get_space_by_id(id, short=True)
                floor_details["spaces"].append(space_details)

            floors_details.append(floor_details)
        return {
            "building_name": building.building_name,
            "floors": floors_details
        }
