from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import SpaceModel
from .logic import create_space as new_space, get_space_by_id, get_spaces_by_floor, get_spaces_by_building
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/create_space")
def create_space(floor: SpaceModel):
    code, message = new_space(floor)
    return JSONResponse(status_code=code, content={"message": message})

@router.get("/get_space_by_id/{space_id}")
def get_space(space_id: int):
    code, message = get_space_by_id(space_id)
    return JSONResponse(status_code=code, content={"message": message})

