from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from .database_handler.tables_models import Incident, IncidentCategory, Serviceman, Space, Owner, IncidentState
from ..models import NewServicemanModel, ServicemanModel, NewIncidentModel, IncidentModel
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
            code = RETURN_NOT_FOUND
            message = "Incident categories not found"
        else:
            message = []
            for category in categories:
                message.append({
                    'id': category.id,
                    'name': category.name
                })
        return code, message

def new_incident(incident_model: NewIncidentModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Incident created"

        if None in incident_model.__dict__.values() or "" in incident_model.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message
        
        category = session.query(IncidentCategory).filter(IncidentCategory.id == incident_model.category_id).first()
        if category is None:
            code = RETURN_NOT_FOUND
            message = "Category not found"
            return code, message

        if 0 in [len(incident_model.description), len(incident_model.title)] or \
        len(incident_model.description) > 3000 or len(incident_model.title) > 100:
            code = RETURN_INCORRECT_LENGTH
            message = "Data lengths incorrect"
            return code, message
        
        owner = session.query(Owner).filter(Owner.id == incident_model.owner_id).first()
        if owner is None:
            code = RETURN_NOT_FOUND
            message = "Owner not found"
            return code, message
        
        incident_state = session.query(IncidentState.id).filter(IncidentState.name == 'Created').first()[0]
        from datetime import datetime
        incident = Incident(category_id=incident_model.category_id, title=incident_model.title, description=incident_model.description,
                            location=incident_model.location, creation_date=datetime.now(), state=incident_state,
                            owner_id=incident_model.owner_id)

        session.add(incident)
        session.commit()
        return code, message
    

def get_all_incidents():
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Incidents found"
        incidents = session.query(Incident).all()
        if not incidents:
            code = RETURN_NOT_FOUND
            message = "Incidents not found"
        else:
            message = []
            for incident in incidents:
                message.append({
                    'id': incident.id,
                    'category_id': incident.category_id,
                    'title': incident.title,
                    'description': incident.description,
                    'admin_id': incident.admin_id,
                    'space_id': incident.space_id,
                    'creation_date': incident.creation_date.isoformat(),
                    'closure_date': incident.closure_date.isoformat() if incident.closure_date is not None else None,
                    'state': incident.state,
                    'owner_id': incident.owner_id
                })
        return code, message
    

def update_incident(updated_incident: IncidentModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Incident updated"

        if None in updated_incident.__dict__.values() or "" in updated_incident.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message
        
        admin = session.query(Owner).filter(Owner.id == updated_incident.admin_id).first()
        if admin is None:
            code = RETURN_FAILURE
            message = "Existing admin must be assigned to ticket"
            return code, message

        if len(updated_incident.description) > 3000 or len(updated_incident.title) > 100:
            code = RETURN_INCORRECT_LENGTH
            message = "Data lengths incorrect"
            return code, message

        incident = session.query(Incident).filter(Incident.id == updated_incident.id).first()
        if incident is None:
            code = RETURN_FAILURE
            message = "Incident not found"
            return code, message

        incident.category_id = updated_incident.category_id
        incident.title = updated_incident.title
        incident.description = updated_incident.description
        incident.admin_id = updated_incident.admin_id
        incident.location = updated_incident.location
        incident.creation_date = updated_incident.creation_date
        incident.closure_date = updated_incident.closure_date
        incident.state = updated_incident.state
        incident.owner_id = updated_incident.owner_id
        session.commit()

        return code, message

def remove_incident(incident_id: int):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Incident removed"

        incident = session.query(Incident).filter(Incident.id == incident_id).first()
        if incident is None:
            code = RETURN_NOT_FOUND
            message = "Incident not found"
            return code, message

        session.delete(incident)
        session.commit()
        return code, message
    
def get_incidents_for_user(user_id: int):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Incidents found"
        incidents = session.query(Incident).filter(Incident.owner_id == user_id).all()
        if not incidents:
            code = RETURN_NOT_FOUND
            message = "Incidents not found"
        else:
            message = []
            for incident in incidents:
                message.append({
                    'id': incident.id,
                    'category_id': incident.category_id,
                    'title': incident.title,
                    'description': incident.description,
                    'admin_id': incident.admin_id,
                    'location': incident.location,
                    'creation_date': incident.creation_date.isoformat(),
                    'closure_date': incident.closure_date.isoformat() if incident.closure_date is not None else None,
                    'state': incident.state,
                    'owner_id': incident.owner_id
                })
        return code, message
    
def get_all_incident_states():
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Incident states found"
        states = session.query(IncidentState).all()
        if not states:
            code = RETURN_NOT_FOUND
            message = "Incident states not found"
        else:
            message = []
            for state in states:
                message.append({
                    'id': state.id,
                    'name': state.name
                })
        return code, message