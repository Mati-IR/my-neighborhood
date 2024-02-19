from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import IncidentCategory, Serviceman
from ..models import NewServicemanModel, ServicemanModel
from .database_handler.util import get_database_session
import os
import logging

RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_NOT_FOUND = 404
RETURN_BUILDING_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411


def new_serviceman(serviceman_model: NewServicemanModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Serviceman created"

        if None in serviceman_model.__dict__.values() or "" in serviceman_model.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if len(serviceman_model.full_name) > 100 \
                or len(serviceman_model.specialties) > 100 \
                or len(serviceman_model.company_id) > 45:
            code = RETURN_FAILURE
            message = "Data lengths incorrect"
            return code, message

        serviceman = Serviceman(full_name=serviceman_model.full_name, specialties=serviceman_model.specialties,
                                company_id=serviceman_model.company_id)

        session.add(serviceman)
        session.commit()
        return code, message


def get_all_servicemen():
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Servicemen found"
        servicemen = session.query(Serviceman).all()
        if not servicemen:
            code = RETURN_FAILURE
            message = "Servicemen not found"
        else:
            message = []
            for serviceman in servicemen:
                message.append({
                    'id': serviceman.id,
                    'full_name': serviceman.full_name,
                    'specialties': serviceman.specialties,
                    'company_id': serviceman.company_id
                })
        return code, message


def remove_serviceman(serviceman_id: int):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Serviceman removed"

        serviceman = session.query(Serviceman).filter(Serviceman.id == serviceman_id).first()
        if serviceman is None:
            code = RETURN_NOT_FOUND
            message = "Serviceman not found"
            return code, message

        session.delete(serviceman)
        session.commit()
        return code, message

def update_serviceman(updated_serviceman: ServicemanModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Serviceman updated"

        if None in updated_serviceman.__dict__.values() or "" in updated_serviceman.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if len(updated_serviceman.full_name) > 100 \
                or len(updated_serviceman.specialties) > 100 \
                or len(updated_serviceman.company_id) > 45:
            code = RETURN_FAILURE
            message = "Data lengths incorrect"
            return code, message

        serviceman = session.query(Serviceman).filter(Serviceman.id == updated_serviceman.id).first()
        if serviceman is None:
            code = RETURN_FAILURE
            message = "Serviceman not found"
            return code, message

        serviceman.full_name = updated_serviceman.full_name
        serviceman.specialties = updated_serviceman.specialties
        serviceman.company_id = updated_serviceman.company_id
        session.commit()

        return code, message
    
def get_all_incident_categories():
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Incident categories found"
        categories = session.query(IncidentCategory).all()
        if not categories:
            code = RETURN_FAILURE
            message = "Incident categories not found"
        else:
            message = []
            for category in categories:
                message.append({
                    'id': category.id,
                    'name': category.name
                })
        return code, message


