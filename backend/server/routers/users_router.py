from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import SignInRequestModel, AdminRegistrationModel, OwnerRegistrationModel
from .logic import login, register_admin, register_owner, get_all_owners
import logging

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post('/login', response_model=SignInRequestModel)
def sign_in(user_details: SignInRequestModel):
    code, user, is_admin, message = login(user_details.email, user_details.password_hash)
    return JSONResponse(status_code=code, content={'user': user,
                                                   'is_admin': is_admin, 'message': message})


@router.post('/register_admin')
def register_adm(admin: AdminRegistrationModel):
    code, message = register_admin(admin)
    return JSONResponse(status_code=code, content={'message': message})


@router.post('/register_owner')
def register_own(owner: OwnerRegistrationModel):
    code, message = register_owner(owner)
    return JSONResponse(status_code=code, content={'message': message})


@router.get('/get_all_owners')
def get_all():
    message = list(get_all_owners())
    return JSONResponse(status_code=200, content={'message': message})