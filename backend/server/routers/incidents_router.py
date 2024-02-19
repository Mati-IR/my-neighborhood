from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewServicemanModel, ServicemanModel, NewIncidentModel, IncidentModel
from .logic import new_serviceman, get_all_servicemen, remove_serviceman, update_serviceman, get_incidents_for_user, get_all_incident_categories, new_incident, remove_incident, get_all_incidents, update_incident
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



# Serviceman CRUD
@router.post('/serviceman')
def post_serviceman(serviceman: NewServicemanModel):
    code, message = new_serviceman(serviceman)
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/all_servicemen')
def get_servicemen():
    code, message = get_all_servicemen()
    return JSONResponse(status_code=code, content={"message": message})

@router.delete("/serviceman/{serviceman_id}")
def delete_serviceman(serviceman_id: int):
    code, message = remove_serviceman(serviceman_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.put("/serviceman")
def put_serviceman(serviceman: ServicemanModel):
    code, message = update_serviceman(serviceman)
    return JSONResponse(status_code=code, content={"message": message})

# Incidents CRUD
@router.post('/incident')
def post_incident(incident: NewIncidentModel):
    code, message = new_incident(incident)
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/all_incidents')
def get_incidents():
    code, message = get_all_incidents()
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/incident_for_user/{user_id}')
def incidents_for_user(user_id: int):
    code, message = get_incidents_for_user(user_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.delete("/incident/{incident_id}")
def delete_incident(incident_id: int):
    code, message = remove_incident(incident_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.put("/incident")
def put_incident(incident: IncidentModel):
    code, message =update_incident(incident)
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/all_incident_categories')
def get_incident_categories():
    code, message = get_all_incident_categories()
    return JSONResponse(status_code=code, content={"message": message})