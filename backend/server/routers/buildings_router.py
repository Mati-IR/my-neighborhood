from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import BuildingModel
from .logic import create_building as new_building, get_buildings, get_building as get_building_by_id, remove_building
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/building", response_model=BuildingModel)
def create_building(building: BuildingModel):
    code, message = new_building(building)
    return JSONResponse(status_code=code, content={"message": message})


@router.get("/all_buildings")
def get_all_buildings():
    buildings = list(get_buildings())
    logger.info(buildings)
    return JSONResponse(status_code=200, content={"buildings": buildings})


@router.get("/building/{building_id}")
def get_building(building_id: int):
    buildings = list(get_building_by_id(building_id))
    logger.info(buildings)
    if not buildings:
        return JSONResponse(status_code=404, content={"message": "Building not found"})
    return JSONResponse(status_code=200, content={"building": buildings})


@router.delete("/building/{building_id}")
def delete_building(building_id: int):
    code, message = remove_building(building_id)
    return JSONResponse(status_code=code, content={"message": message})