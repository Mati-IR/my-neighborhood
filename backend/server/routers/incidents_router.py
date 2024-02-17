from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewServicemanModel,ServicemanModel
from .logic import new_serviceman, get_all_servicemen, remove_serviceman, update_serviceman
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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