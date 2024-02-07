from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import BuildingModel
from .logic import create_building as new_building
import logging

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/building", response_model=BuildingModel)
def create_building(building: BuildingModel):
    code, message = new_building(building)
    return JSONResponse(status_code=code, content={"message": message})
