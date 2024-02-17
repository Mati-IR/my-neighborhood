from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import SignInRequestModel, AdminRegistrationModel, OwnerRegistrationModel, CredentialsModel, OwnerUpdateModel, AdminUpdateModel, GetUserModel
from .logic import login, register_admin, register_owner, get_all_owners, update_credentials, update_owner, update_admin, get_all_admins,get_user_by_id
import logging

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post('/login', response_model=SignInRequestModel)
def sign_in(user_details: SignInRequestModel):
    code, user, user_id, is_admin, message = login(user_details.email, user_details.password_hash)
    return JSONResponse(status_code=code, content={'user': user, 'is_admin': is_admin,
                                                   'user_id': user_id, 'message': message})


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
    code, message = list(get_all_owners())
    return JSONResponse(status_code=code, content={'message': message})


@router.get('/get_all_admins')
def get_all():
    code, message = list(get_all_admins())
    return JSONResponse(status_code=code, content={'message': message})


@router.get('/user/{user_id}/{is_admin}')
def get_user(user_id: int, is_admin: bool):
    code, message = get_user_by_id(user_id, is_admin)
    return JSONResponse(status_code=code, content={'message': message})


@router.put('/update_credentials')
def put_credentials(credentials: CredentialsModel):
    code, message = update_credentials(credentials)
    return JSONResponse(status_code=code, content={'message': message})


@router.put('/update_owner')
def put_owner(owner: OwnerUpdateModel):
    code, message = update_owner(owner)
    return JSONResponse(status_code=code, content={'message': message})


@router.put('/update_admin')
def put_admin(admin: AdminUpdateModel):
    code, message = update_admin(admin)
    return JSONResponse(status_code=code, content={'message': message})