from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from ..models import SpaceModel, SpaceToOwnerModel
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import SpacesForFloor, Space, SpaceType, FloorForBuilding, OwnerOfSpace, Owner
from .database_handler.util import get_database_session

LENGTH_OF_SHA256 = 64
RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_NOT_FOUND = 404
RETURN_USER_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# class Space(Base):
#     __tablename__ = 'space'
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     space_number = Column(String(10))
#     area = Column(DECIMAL)
#     space_type = Column(Integer, ForeignKey('space_type.id'))
#     space_type_relation = relationship("SpaceType", backref="spaces")

# class SpacesForFloor(Base):
#     __tablename__ = 'spaces_for_floor'
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     floor_id = Column(Integer, ForeignKey('floor_for_building.floor_id'))
#     space = Column(Integer, ForeignKey('space.id'))
#     floor = relationship("FloorForBuilding", backref="spaces_for_floor")
#     space_relation = relationship("Space", backref="spaces_for_floor")

def create_space(space: SpaceModel):
    session = get_database_session()
    code = RETURN_SUCCESS
    message = "Space created"

    if None in space.__dict__.values():
        code = RETURN_FAILURE
        message = "Message corrupted"
        return code, message

    if space.area < 0:
        code = RETURN_FAILURE
        message = "Area must be greater than 0"
        return code, message

    if space.building_id not in [x[0] for x in session.query(FloorForBuilding.building_id).all()]:
        code = RETURN_NOT_FOUND
        message = "Building not found"
        return code, message

    # get all space numbers for building_id
    space_numbers = session.query(Space.space_number).join(SpacesForFloor).join(FloorForBuilding).filter(
        FloorForBuilding.building_id == space.building_id).all()
    space_numbers = [x[0] for x in space_numbers]

    if space.space_number in space_numbers:
        code = RETURN_USER_ALREADY_EXISTS
        message = "Space with this number already exists"
        return code, message

    space_type = session.query(SpaceType.id).filter(SpaceType.id == space.space_type).first()
    if space_type is None:
        code = RETURN_NOT_FOUND
        message = "Space type not found"
        return code, message

    # create space
    new_space = Space(space_number=space.space_number, area=space.area, space_type=space_type.id)
    session.add(new_space)
    session.flush()

    # create space for floor
    floor_id = session.query(FloorForBuilding.floor_id) \
        .filter(FloorForBuilding.building_id == space.building_id,
                FloorForBuilding.floor_number == space.floor) \
        .first()[0]
    space_for_floor = SpacesForFloor(floor_id=floor_id, space=new_space.id)
    session.add(space_for_floor)
    session.commit()
    
    return code, message

def get_space_by_id(space_id, short=False):
    session = get_database_session()
    space = session.query(Space).filter(Space.id == space_id).first()
    floor_id = session.query(SpacesForFloor.floor_id).filter(SpacesForFloor.space == space_id).first()[0]
    building_id = session.query(FloorForBuilding.building_id).filter(FloorForBuilding.floor_id == floor_id).first()[0]
    logger.info(f"Floor id: {floor_id}")

    if space is None:
        return RETURN_NOT_FOUND, "Space not found"
    if not short:
        message = {
            "space_number": space.space_number,
            "area": float(space.area),
            "space_type": space.space_type,
            "floor": floor_id,
            "building_id": building_id
        }
    else:
        message = {
            "space_number": space.space_number,
            "area": float(space.area),
            "space_type": space.space_type
        }
    logger.info(message)
    return RETURN_SUCCESS, message


def assign_space_to_owner(space_to_owner: SpaceToOwnerModel):
    session = get_database_session()
    code = RETURN_SUCCESS
    message = "Space assigned to owner"

    if None in space_to_owner.__dict__.values():
        code = RETURN_FAILURE
        message = "Message corrupted"
        return code, message

    if space_to_owner.share < 0 or space_to_owner.share > 1:
        code = RETURN_FAILURE
        message = "Share must be between 0 and 1"
        return code, message

    # if owner does not exist
    if session.query(Owner).filter(Owner.id == space_to_owner.owner_id).first() is None:
        code = RETURN_NOT_FOUND
        message = "Owner not found"
        return code, message

    # if space does not exist
    if session.query(Space).filter(Space.id == space_to_owner.space_id).first() is None:
        code = RETURN_NOT_FOUND
        message = "Space not found"
        return code, message

    if session.query(OwnerOfSpace).filter(OwnerOfSpace.space_id == space_to_owner.space_id).first() is not None:
        code = RETURN_USER_ALREADY_EXISTS
        message = "Space already assigned to owner"
        return code, message

    if session.query(OwnerOfSpace).filter(OwnerOfSpace.owner_id == space_to_owner.owner_id).first() is not None:
        code = RETURN_USER_ALREADY_EXISTS
        message = "Owner already assigned to space"
        return code, message

    # if date is in the future
    if space_to_owner.purchase_date > datetime.now(timezone.utc):
        code = RETURN_FAILURE
        message = "Purchase date is in the future"
        return code, message

    logger.info(f"Space to owner: {space_to_owner}")

    new_owner_of_space = OwnerOfSpace(space_id=space_to_owner.space_id, share=space_to_owner.share,
                                      purchase_date=space_to_owner.purchase_date, owner_id=space_to_owner.owner_id)
    session.add(new_owner_of_space)
    session.commit()
    return code, message

def get_space_categories():
    session = get_database_session()
    space_types = session.query(SpaceType).all()
    message = []
    for space_type in space_types:
        message.append({ "id": space_type.id, "name": space_type.type_name })
    return RETURN_SUCCESS, message
