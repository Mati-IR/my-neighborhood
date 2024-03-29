from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewServicemanModel, ServicemanModel, NewIncidentModel, IncidentModel, IncidentUpdateModel
from .logic import new_serviceman, get_all_servicemen, remove_serviceman, get_incident_staff, update_serviceman, assign_serviceman_to_incident, get_all_incident_states, get_incidents_for_user, get_all_incident_categories, new_incident, remove_incident, get_all_incidents, update_incident
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

@router.post('/assign_serviceman/{incident_id}/{serviceman_id}')
def assign_serviceman(incident_id: int, serviceman_id: int):
    code, message = assign_serviceman_to_incident(incident_id, serviceman_id)


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
def put_incident(incident: IncidentUpdateModel):
    code, message =update_incident(incident)
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/all_incident_categories')
def get_incident_categories():
    code, message = get_all_incident_categories()
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/all_incident_states')
def get_incident_states():
    code, message = get_all_incident_states()
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/incident_staff/{incident_id}')
def incident_staff(incident_id: int):
    code, message = get_incident_staff(incident_id)
    return JSONResponse(status_code=code, content={"message": message})