from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import SpaceModel, SpaceToOwnerModel
from .logic import create_space as new_space, get_space_by_id, assign_space_to_owner as assign_space, get_space_categories as get_all_space_categories
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/get_space_by_id/{space_id}")
def get_space(space_id: int):
    code, message = get_space_by_id(space_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.get("/get_space_categories")
def get_space_categories():
    code, message = get_all_space_categories()
    return JSONResponse(status_code=code, content={"message": message})

@router.post("/create_space")
def create_space(floor: SpaceModel):
    code, message = new_space(floor)
    return JSONResponse(status_code=code, content={"message": message})
@router.post("/assign_space_to_owner")
def assign_space_to_owner(space_to_owner: SpaceToOwnerModel):
    code, message = assign_space(space_to_owner)
    return JSONResponse(status_code=code, content={"message": message})