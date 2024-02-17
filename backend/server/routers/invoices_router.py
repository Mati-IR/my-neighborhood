from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewUtilityModel, UtilityModel
from .logic import get_all_utilities,create_utility, update_utility, remove_utility
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# CRUD for news
@router.get('/all_utilities')
def get_utilities():
    code, message, utilities = get_all_utilities()
    return JSONResponse(status_code=code, content={"message": message, "utilities": utilities})

@router.post('/create_utility')
def new_utility(utility: NewUtilityModel):
    code, message = create_utility(utility)
    return JSONResponse(status_code=code, content={"message": message})

@router.put('/update_utility')
def update_util(utility: UtilityModel):
    code, message = update_utility(utility)
    return JSONResponse(status_code=code, content={"message": message})

@router.delete("/utility/{utility_id}")
def delete_utility(utility_id: int):
    code, message = remove_utility(utility_id)
    return JSONResponse(status_code=code, content={"message": message})