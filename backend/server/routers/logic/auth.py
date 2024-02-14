from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import OwnerCredential, AdminCredential, Admin, Owner
from .database_handler.util import get_database_session
import os
import logging

LENGTH_OF_SHA256 = 64
RETURN_SUCCESS = 200
RETURN_FAILURE = 400
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
        else:
            user = session.query(Owner).filter(Owner.credentials_id == user_credentials.id).first()
            user_name = user.full_name

        # if previous checks haven't failed and password correct
        if (code is RETURN_SUCCESS
                and user is None
                or user_credentials is None
                or user_credentials.password_hash != password_hash):
            code = RETURN_FAILURE
            message = 'Credentials incorrect'

        return code, user_name, is_admin, message


def register_admin(admin_registration_model):
    with get_database_session() as session:
        # check if email is already in database
        if session.query(AdminCredential.email).filter(AdminCredential.email == admin_registration_model.email).first() is not None:
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
        if session.query(OwnerCredential.email).filter(OwnerCredential.email == owner_registration_model.email).first() is not None:
            return RETURN_USER_ALREADY_EXISTS, 'Email already in use'

        # check if password is long enough
        if len(owner_registration_model.password_hash) != LENGTH_OF_SHA256:
            return RETURN_INCORRECT_LENGTH, 'Password too short'

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
        users = session.query(Owner).all()
        for user in users:
            yield {
                "id": user.id,
                "full_name": user.full_name,
                "phone_number": user.phone_number,
                "full_address": user.full_address
            }
