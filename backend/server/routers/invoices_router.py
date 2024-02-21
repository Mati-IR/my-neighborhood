from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewUtilityModel, UtilityModel, NewInvoiceModel
from .logic import get_all_utilities,create_utility, get_existing_invoice, update_utility, remove_utility, generate_new_random_invoice
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

@router.get('/new_random_invoice/{space_id}/{year}/{month}')
# http gets cannot have a body, so we are using path parameters
def new_random_invoice(space_id: int, year: int, month: int):
    code, message = generate_new_random_invoice(NewInvoiceModel(space_id=space_id, year=year, month=month))
    return JSONResponse(status_code=code, content={"message": message})


@router.get('/invoice/{space_id}/{year}/{month}')
def get_invoice(space_id: int, year: int, month: int):
    pass
    code, message = get_existing_invoice(NewInvoiceModel(space_id=space_id, year=year, month=month))
    return JSONResponse(status_code=code, content={"message": message})