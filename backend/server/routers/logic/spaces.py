from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from ..models import SpaceModel, SpaceToOwnerModel, LeaseAgreementModel, NewLeaseAgreementModel, OccupantModel
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import SpacesForFloor, Space, SpaceType, FloorForBuilding, OwnerOfSpace, Owner, \
    LeaseAgreement, Occupant, OccupantsOfSpace
from .database_handler.util import get_database_session

LENGTH_OF_SHA256 = 64
RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_NOT_FOUND = 404
RETURN_USER_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

OCCUPANT_NAME_LENGTH = OCCUPANT_SURNAME_LENGTH = 45

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_space(space: SpaceModel):
    with get_database_session() as session:
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

        if session.query(FloorForBuilding).filter(FloorForBuilding.floor_number == space.floor,
                                                  FloorForBuilding.building_id == space.building_id).first() is None:
            code = RETURN_NOT_FOUND
            message = "Floor not found"
            session.delete(new_space)
            session.commit()
            return code, message
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
    with get_database_session() as session:
        space = session.query(Space).filter(Space.id == space_id).first()
        floor_id = session.query(SpacesForFloor.floor_id).filter(SpacesForFloor.space == space_id).first()[0]
        building_id = session.query(FloorForBuilding.building_id).filter(FloorForBuilding.floor_id == floor_id).first()[
            0]
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
                "id": space.id,
                "space_number": space.space_number,
                "area": float(space.area),
                "space_type": space.space_type
            }
        logger.info(message)
        session.close()

        return RETURN_SUCCESS, message


def assign_space_to_owner(space_to_owner: SpaceToOwnerModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Space assigned to owner"

        if None in space_to_owner.__dict__.values():
            code = RETURN_FAILURE
            message = "Message corrupted"
            session.close()
            return code, message

        if space_to_owner.share < 0 or space_to_owner.share > 1:
            code = RETURN_FAILURE
            message = "Share must be between 0 and 1"
            session.close()
            return code, message

        sum_of_share = session.query(OwnerOfSpace.share).filter(OwnerOfSpace.space_id == space_to_owner.space_id).all()
        sum_of_share = sum([x[0] for x in sum_of_share])
        sum_of_share = Decimal(sum_of_share).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

        owner_share = Decimal(space_to_owner.share).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

        if sum_of_share + owner_share > 1:
            code = RETURN_FAILURE
            message = "Sum of shares cannot be greater than 1"
            logger.info(f"Sum of shares:{owner_share} + {sum_of_share} = {sum_of_share + owner_share}")
            session.close()
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
            session.close()
            return code, message

        if session.query(OwnerOfSpace).filter(OwnerOfSpace.owner_id == space_to_owner.owner_id,
                                              OwnerOfSpace.space_id == space_to_owner.space_id).first() is not None:
            code = RETURN_USER_ALREADY_EXISTS
            message = "Owner already assigned to space"
            session.close()
            return code, message

        # if date is in the future
        if space_to_owner.purchase_date > datetime.now(timezone.utc):
            code = RETURN_FAILURE
            message = "Purchase date is in the future"
            session.close()
            return code, message

        logger.info(f"Space to owner: {space_to_owner}")

        new_owner_of_space = OwnerOfSpace(space_id=space_to_owner.space_id, share=owner_share,
                                          purchase_date=space_to_owner.purchase_date, owner_id=space_to_owner.owner_id)
        session.add(new_owner_of_space)
        session.commit()
        return code, message


def get_space_categories():
    with get_database_session() as session:
        space_types = session.query(SpaceType).all()
        message = []
        for space_type in space_types:
            message.append({"id": space_type.id, "name": space_type.type_name})
        session.close()
        return RETURN_SUCCESS, message


def remove_space(space_id: int):
    try:
        with get_database_session() as session:
            logger.info(f"Attempting to remove space with ID {space_id}")
            space = session.query(Space).filter_by(id=space_id).first()
            if space:
                # Check for references in spaces_for_floor table
                spaces_for_floor = session.query(SpacesForFloor).filter_by(space=space_id).all()
                # Delete references if they exist
                for space_for_floor in spaces_for_floor:
                    session.delete(space_for_floor)
                # Now delete the space
                session.delete(space)
                session.commit()
                logger.info(f"Space with ID {space_id} and all related records have been removed successfully.")
                return RETURN_SUCCESS, "Space removed successfully."
            else:
                logger.info(f"No space found with ID {space_id}.")
                return RETURN_NOT_FOUND, "Space not found."
    except Exception as e:
        logger.error(f"An error occurred while removing space with ID {space_id}: {e}")
        return RETURN_FAILURE, "Error removing space: " + str(e)


def remove_owner_from_space(owner_id: int, space_id: int):
    try:
        with get_database_session() as session:
            logger.info(f"Attempting to remove owner with ID {owner_id} from space with ID {space_id}")
            owner_of_space = session.query(OwnerOfSpace).filter_by(owner_id=owner_id, space_id=space_id).first()
            if owner_of_space:
                session.delete(owner_of_space)
                session.commit()
                logger.info(f"Owner with ID {owner_id} removed from space with ID {space_id} successfully.")
                return RETURN_SUCCESS, "Owner removed from space successfully."
            else:
                logger.info(f"No owner found with ID {owner_id} for space with ID {space_id}.")
                return RETURN_NOT_FOUND, "Owner not found for space."
    except Exception as e:
        logger.error(f"An error occurred while removing owner with ID {owner_id} from space with ID {space_id}: {e}")
        return RETURN_FAILURE, "Error removing owner from space: " + str(e)


def get_owners_of_space(space_id: int):
    try:
        with get_database_session() as session:
            logger.info(f"Attempting to retrieve owners of space with ID {space_id}")
            owners_of_space = session.query(OwnerOfSpace).filter_by(space_id=space_id).all()
            if owners_of_space:
                owner_list = []
                for owner in owners_of_space:
                    owner_info = session.query(Owner).filter_by(id=owner.owner_id).first()
                    owner_list.append({
                        "id": owner_info.id,
                        "full_name": owner_info.full_name,
                        "phone_number": owner_info.phone_number,
                        "full_address": owner_info.full_address,
                        "share": round(float(owner.share), 2),
                        "purchase_date": owner.purchase_date.isoformat()
                    })
                logger.info(f"Owners of space with ID {space_id} retrieved successfully.")
                return RETURN_SUCCESS, owner_list
            else:
                logger.info(f"No owners found for space with ID {space_id}.")
                return RETURN_NOT_FOUND, "No owners found for space."
    except Exception as e:
        logger.error(f"An error occurred while retrieving owners of space with ID {space_id}: {e}")
        return RETURN_FAILURE, "Error retrieving owners of space: " + str(e)


def create_lease_agreement(lease_agreement: NewLeaseAgreementModel):
    try:
        with get_database_session() as session:
            code = RETURN_SUCCESS
            message = "Lease agreement created"

            if None in lease_agreement.__dict__.values():
                code = RETURN_FAILURE
                message = "Message corrupted"
                return code, message

            if lease_agreement.start_date > lease_agreement.end_date:
                code = RETURN_FAILURE
                message = "Start date is after end date"
                return code, message

            from datetime import date
            existing_lease_agreement = session.query(LeaseAgreement).filter(LeaseAgreement.space_id == lease_agreement.space_id).first()
            if existing_lease_agreement is not None \
                and  ((existing_lease_agreement.start_date >= lease_agreement.start_date and existing_lease_agreement.start <= lease_agreement.end_date) \
                or (existing_lease_agreement.end_date >= lease_agreement.start_date and existing_lease_agreement.end_date <= lease_agreement.end_date)) :
                code = RETURN_USER_ALREADY_EXISTS
                message = "Lease agreement for this space already exists at this time period"
                return code, message

            space = session.query(Space).filter(Space.id == lease_agreement.space_id).first()
            if space is None:
                code = RETURN_NOT_FOUND
                message = "Space not found"
                return code, message

            new_lease_agreement = LeaseAgreement(rent=lease_agreement.rent,
                                                 renter_full_name=lease_agreement.renter_full_name,
                                                 phone_number=lease_agreement.phone_number, email=lease_agreement.email,
                                                 start_date=lease_agreement.start_date, end_date=lease_agreement.end_date,
                                                 space_id=lease_agreement.space_id)
            session.add(new_lease_agreement)
            session.commit()
            return code, message
    except Exception as e:
        logger.error(f"An error occurred while creating lease agreement: {e}")
        return RETURN_FAILURE, "Error creating lease agreement: " + str(e)


def get_lease_agreement(space_id: int):
    try:
        with get_database_session() as session:
            logger.info(f"Attempting to retrieve lease agreement for space with ID {space_id}")
            lease_agreement = session.query(LeaseAgreement).filter_by(space_id=space_id).first()
            if lease_agreement:
                agreement_info = {
                    "id": lease_agreement.id,
                    "rent": float(lease_agreement.rent),
                    "renter_full_name": lease_agreement.renter_full_name,
                    "phone_number": lease_agreement.phone_number,
                    "email": lease_agreement.email,
                    "space_id": lease_agreement.space_id,
                    "start_date": lease_agreement.start_date.isoformat(),
                    "end_date": lease_agreement.end_date.isoformat()
                }
                logger.info(f"Lease agreement for space with ID {space_id} retrieved successfully.")
                return RETURN_SUCCESS, agreement_info
            else:
                logger.info(f"No lease agreement found for space with ID {space_id}.")
                return RETURN_NOT_FOUND, "Lease agreement not found."
    except Exception as e:
        logger.error(f"An error occurred while retrieving lease agreement for space with ID {space_id}: {e}")
        return RETURN_FAILURE, "Error retrieving lease agreement: " + str(e)


def remove_lease_agreement(space_id: int):
    try:
        with get_database_session() as session:
            logger.info(f"Attempting to remove lease agreement for space with ID {space_id}")
            lease_agreement = session.query(LeaseAgreement).filter_by(space_id=space_id).first()
            if lease_agreement:
                session.delete(lease_agreement)
                session.commit()
                logger.info(f"Lease agreement for space with ID {space_id} removed successfully.")
                return RETURN_SUCCESS, "Lease agreement removed successfully."
            else:
                logger.info(f"No lease agreement found for space with ID {space_id}.")
                return RETURN_NOT_FOUND, "Lease agreement not found."
    except Exception as e:
        logger.error(f"An error occurred while removing lease agreement for space with ID {space_id}: {e}")
        return RETURN_FAILURE, "Error removing lease agreement: " + str(e)


def update_lease_agreement(lease_agreement: LeaseAgreementModel):
    try:
        with get_database_session() as session:
            code = RETURN_SUCCESS
            message = "Lease agreement updated"

            if None in lease_agreement.__dict__.values():
                code = RETURN_FAILURE
                message = "Message corrupted"
                return code, message

            if lease_agreement.start_date > lease_agreement.end_date:
                code = RETURN_FAILURE
                message = "Start date is after end date"
                return code, message

            if session.query(LeaseAgreement).filter(LeaseAgreement.id == lease_agreement.id).first() is None:
                code = RETURN_NOT_FOUND
                message = "Lease agreement not found"
                return code, message

            lease_agreement_to_update = session.query(LeaseAgreement).filter_by(id=lease_agreement.id).first()
            lease_agreement_to_update.rent = lease_agreement.rent
            lease_agreement_to_update.renter_full_name = lease_agreement.renter_full_name
            lease_agreement_to_update.phone_number = lease_agreement.phone_number
            lease_agreement_to_update.email = lease_agreement.email
            lease_agreement_to_update.start_date = lease_agreement.start_date
            lease_agreement_to_update.end_date = lease_agreement.end_date
            lease_agreement_to_update.space_id = lease_agreement.space_id
            session.commit()
            return code, message
    except Exception as e:
        logger.error(f"An error occurred while updating lease agreement{lease_agreement}: {e}")
        return RETURN_FAILURE, "Error updating lease agreement: " + str(e)


def get_all_spaces_of_owner(owner_id: int):
    try:
        with get_database_session() as session:
            logger.info(f"Attempting to retrieve all spaces for owner with ID {owner_id}")
            owner_spaces = session.query(OwnerOfSpace).filter_by(owner_id=owner_id).all()
            owner_of_space = session.query(OwnerOfSpace).filter_by(owner_id=owner_id).all()
            if owner_spaces and owner_of_space:
                space_list = []
                for space in owner_spaces:
                    space_info = session.query(Space).filter_by(id=space.space_id).first()
                    space_list.append({
                        "id": space_info.id,
                        "space_number": space_info.space_number,
                        "area": float(space_info.area),
                        "space_type": space_info.space_type,
                        "share": session.query(OwnerOfSpace.share).filter_by(space_id=space_info.id, owner_id=owner_id).first()[0],
                    })
                logger.info(f"Spaces for owner with ID {owner_id} retrieved successfully.")
                return RETURN_SUCCESS, space_list
            else:
                logger.info(f"owner_spaces: {owner_spaces}, owner_of_space: {owner_of_space}")
                logger.info(f"No spaces or owner found for owner with ID {owner_id}.")
                return RETURN_NOT_FOUND, "No spaces found for owner."
    except Exception as e:
        logger.error(f"An error occurred while retrieving spaces for owner with ID {owner_id}: {e}")
        return RETURN_FAILURE, "Error retrieving spaces for owner: " + str(e)

def assign_occupant_to_space(occupant: OccupantModel):
    with get_database_session() as session:
        if None in occupant.__dict__.values():
            return RETURN_FAILURE, "Fill all values"
        if len(occupant.name) > OCCUPANT_NAME_LENGTH or len(occupant.surname) > OCCUPANT_NAME_LENGTH:
            return RETURN_FAILURE, f'Name or surname too long, max {OCCUPANT_NAME_LENGTH} characters allowed'
        
        space = session.query(Space).filter(Space.id == occupant.space_id).first()
        if space is None:
            return RETURN_NOT_FOUND, "Space not found"
        
        new_occupant = Occupant(name=occupant.name, surname=occupant.surname)
        session.add(new_occupant)
        session.flush()
        
        occupant_to_space_association = OccupantsOfSpace(space_id=occupant.space_id, occupant_id=new_occupant.id)
        session.add(occupant_to_space_association)
        session.commit()
        return RETURN_SUCCESS, "Occupant assigned to space"
    
def get_occupants_for_space(space_id: int):
    with get_database_session() as session:
        occupants = session.query(OccupantsOfSpace).filter(OccupantsOfSpace.space_id == space_id).all()
        if not occupants:
            return RETURN_NOT_FOUND, "No occupants found for space"
        occupants_list = []
        for occupant in occupants:
            occupant_info = session.query(Occupant).filter(Occupant.id == occupant.occupant_id).first()
            occupants_list.append({
                "id": occupant_info.id,
                "name": occupant_info.name,
                "surname": occupant_info.surname
            })
        return RETURN_SUCCESS, occupants_list
    
def get_spaces_of_owner(owner_id: int):
    with get_database_session() as session:
        spaces = session.query(OwnerOfSpace).filter(OwnerOfSpace.owner_id == owner_id).all()
        if not spaces:
            return RETURN_NOT_FOUND, "No spaces found for owner"
        space_list = []
        for space in spaces:
            space_info = session.query(Space).filter(Space.id == space.space_id).first()
            space_list.append(space_info.id)
        return RETURN_SUCCESS, space_list
    
def get_all_spaces_ids():
    with get_database_session() as session:
        spaces = session.query(Space).all()
        if not spaces:
            return RETURN_NOT_FOUND, "No spaces found"
        space_list = []
        for space in spaces:
            space_list.append(space.id)
        return RETURN_SUCCESS, space_list