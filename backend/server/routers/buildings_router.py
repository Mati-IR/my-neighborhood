from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import BuildingModel
from .logic import login, register_admin, register_owner
import logging

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/building", response_model=BuildingModel)
def create_building(building: BuildingModel):
    create_building
    pass
