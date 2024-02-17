from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from ..models import CredentialsModel, OwnerUpdateModel, AdminUpdateModel
from .database_handler.tables_models import OwnerCredential, AdminCredential, Admin, Owner
from .database_handler.util import get_database_session
import os
import logging

LENGTH_OF_SHA256 = 64
RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_NOT_FOUND = 404
RETURN_USER_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# returns if login successful, user, is user admin and message
def login(email, password_hash):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        is_admin = False
        message = "User"
        user_credentials = session.query(OwnerCredential).filter(OwnerCredential.email == email).first()
        user = None
        user_name = ""
        user_id = None

        # is user_credentials in database
        if user_credentials is None:
            user_credentials = session.query(AdminCredential).filter(AdminCredential.email == email).first()
            if user_credentials is None:
                code = RETURN_FAILURE
                message = "User not found"
            else:
                is_admin = True
                message = "Admin"
                user = session.query(Admin).filter(Admin.credentials_id == user_credentials.id).first()
                user_name = user.full_name
                user_id = user.id
        else:
            user = session.query(Owner).filter(Owner.credentials_id == user_credentials.id).first()
            user_name = user.full_name
            user_id = user.id

        # if previous checks haven't failed and password correct
        if (code is RETURN_SUCCESS
                and user is None
                or user_credentials is None
                or user_credentials.password_hash != password_hash):
            code = RETURN_FAILURE
            message = 'Credentials incorrect'

        return code, user_name, user_id, is_admin, message


def register_admin(admin_registration_model):
    with get_database_session() as session:
        # check if email is already in database
        if session.query(AdminCredential.email).filter(
                AdminCredential.email == admin_registration_model.email).first() is not None:
            return RETURN_USER_ALREADY_EXISTS, 'Email already in use'

        # check if password is long enough
        if len(admin_registration_model.password_hash) != LENGTH_OF_SHA256:
            return RETURN_INCORRECT_LENGTH, 'Password too short'

        from iso4217 import Currency
        try:
            Currency(admin_registration_model.salary_currency)
        except:
            return RETURN_FAILURE, 'Currency not found'

        # add admin to database
        new_credential = AdminCredential(email=admin_registration_model.email,
                                         password_hash=admin_registration_model.password_hash)
        session.add(new_credential)
        session.flush()  # This ensures new_credential.id is available immediately after the add, without needing to commit first

        # Now, directly use new_credential.id for the credentials field
        session.add(Admin(
            full_name=admin_registration_model.full_name,
            phone_number=admin_registration_model.phone_number,
            salary=admin_registration_model.salary,
            salary_currency=admin_registration_model.salary_currency,
            credentials_id=new_credential.id))  # Use the ID directly
        session.commit()
        return RETURN_SUCCESS, 'Admin registered'


def register_owner(owner_registration_model):
    with get_database_session() as session:
        # check if email is already in database
        if session.query(OwnerCredential.email).filter(
                OwnerCredential.email == owner_registration_model.email).first() is not None:
            return RETURN_USER_ALREADY_EXISTS, 'Email already in use'

        # check if password is long enough
        if len(owner_registration_model.password_hash) != LENGTH_OF_SHA256:
            return RETURN_INCORRECT_LENGTH, 'Password\'s hash length incorrect'

        # add owner to database
        new_credential = OwnerCredential(email=owner_registration_model.email,
                                         password_hash=owner_registration_model.password_hash)
        session.add(new_credential)
        session.flush()  # This ensures new_credential.id is available immediately after the add, without needing to commit first

        # Now, directly use new_credential.id for the credentials field
        session.add(Owner(
            full_name=owner_registration_model.full_name,
            phone_number=owner_registration_model.phone_number,
            full_address=owner_registration_model.full_address,
            credentials_id=new_credential.id))  # Use the ID directly
        session.commit()
        return RETURN_SUCCESS, 'Owner registered'


def get_all_owners():
    with get_database_session() as session:
        return_list = []
        users = session.query(Owner).all()
        if not users:
            return RETURN_NOT_FOUND, 'No owners found'
        for user in users:
            return_list.append( {
                'id': user.id,
                'full_name': user.full_name,
                'phone_number': user.phone_number,
                'full_address': user.full_address,
                'email': session.query(OwnerCredential.email).filter(OwnerCredential.id == user.credentials_id).first()[0]
            })

        return RETURN_SUCCESS, return_list

def get_all_admins():
    with get_database_session() as session:
        return_list = []
        users = session.query(Admin).all()
        if not users:
            return RETURN_NOT_FOUND, 'No admins found'
        for user in users:
            return_list.append( {
                'id': user.id,
                'full_name': user.full_name,
                'phone_number': user.phone_number,
                'salary': float(user.salary),
                'salary_currency': user.salary_currency,
                'email': session.query(AdminCredential.email).filter(AdminCredential.id == user.credentials_id).first()[0]
            })

        return RETURN_SUCCESS, return_list


def get_user_by_id(user_id, is_admin):
    with get_database_session() as session:
        if is_admin:
            user = session.query(Admin).filter(Admin.id == user_id).first()
            if user is None:
                return RETURN_NOT_FOUND, 'Admin not found'
            return RETURN_SUCCESS, {
                'id': user.id,
                'full_name': user.full_name,
                'phone_number': user.phone_number,
                'salary': float(user.salary),
                'salary_currency': user.salary_currency,
                'email': session.query(AdminCredential.email).filter(AdminCredential.id == user.credentials_id).first()[0]
            }
        else:
            user = session.query(Owner).filter(Owner.id == user_id).first()
            if user is None:
                return RETURN_NOT_FOUND, 'Owner not found'
            return RETURN_SUCCESS, {
                'id': user.id,
                'full_name': user.full_name,
                'phone_number': user.phone_number,
                'full_address': user.full_address,
                'email': session.query(OwnerCredential.email).filter(OwnerCredential.id == user.credentials_id).first()[0]
            }

def update_credentials(credentials: CredentialsModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Credentials updated"

        if len(credentials.password_hash) != LENGTH_OF_SHA256:
            return RETURN_INCORRECT_LENGTH, 'Password\'s hash length incorrect'

        user_credentials = session.query(OwnerCredential).filter(OwnerCredential.email == credentials.email).first()
        if user_credentials is None:
            user_credentials = session.query(AdminCredential).filter(AdminCredential.email == credentials.email).first()
            if user_credentials is None:
                code = RETURN_FAILURE
                message = "User not found"
                return code, message

        user_credentials.email = credentials.email
        user_credentials.password_hash = credentials.password_hash
        session.commit()

        return code, message


def update_owner(owner_model: OwnerUpdateModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "User updated"

        user = session.query(Owner).filter(Owner.id == owner_model.id).first()
        if user is None:
            code = RETURN_FAILURE
            message = "User not found"
            return code, message

        credentials = session.query(OwnerCredential).filter(OwnerCredential.id == user.credentials_id).first()
        if credentials is None:
            code = RETURN_FAILURE
            message = "Credentials not found"
            return code, message

        user.full_name = owner_model.full_name
        user.phone_number = owner_model.phone_number
        user.full_address = owner_model.full_address
        credentials.email = owner_model.email
        session.commit()
        return code, message


def update_admin(admin_model: AdminUpdateModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "User updated"

        user = session.query(Admin).filter(Admin.id == admin_model.id).first()
        if user is None:
            code = RETURN_FAILURE
            message = "User not found"
            return code, message

        credentials = session.query(AdminCredential).filter(AdminCredential.id == user.credentials_id).first()
        if credentials is None:
            code = RETURN_FAILURE
            message = "Credentials not found"
            return code, message

        user.full_name = admin_model.full_name
        user.phone_number = admin_model.phone_number
        user.salary = admin_model.salary
        user.salary_currency = admin_model.salary_currency
        credentials.email = admin_model.email
        session.commit()
        return code, message
