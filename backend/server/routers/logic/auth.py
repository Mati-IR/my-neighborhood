from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import Credential, Admin, Owner
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

session = get_database_session()
logger.info('Database session status: ' + str(session))


# returns if login successful, user, is user admin and message
def login(email, password_hash):
    user = session.query(Credential).filter(Credential.email == email).first()

    # is user in database
    if user is None:
        return False, None, None, 'User not found'

    # is password correct
    if user.password_hash != password_hash:
        return False, None, None, 'Password incorrect'

    # check if email is in Admin table
    if user.email in session.query(Admin.email).all():
        return True, user, True, 'Admin'

    return True, user, False, 'User'


def register_admin(admin_registration_model):
    # check if email is already in database
    if session.query(Credential.email).filter(Credential.email == admin_registration_model.email).first() is not None:
        return RETURN_USER_ALREADY_EXISTS, 'Email already in use'

    # check if password is long enough
    if len(admin_registration_model.password_hash) != LENGTH_OF_SHA256:
        return RETURN_INCORRECT_LENGTH, 'Password too short'

    # add admin to database
    new_credential = Credential(email=admin_registration_model.email,
                                password_hash=admin_registration_model.password_hash)
    session.add(new_credential)
    session.flush()  # This ensures new_credential.id is available immediately after the add, without needing to commit first

    # Now, directly use new_credential.id for the credentials field
    session.add(Admin(
        full_name=admin_registration_model.full_name,
        phone_number=admin_registration_model.phone_number,
        salary=admin_registration_model.salary,
        credentials=new_credential))  # Use the ID directly
    session.commit()
    return RETURN_SUCCESS, 'Admin registered'


def register_owner(owner_registration_model):
    # check if email is already in database
    if session.query(Credential.email).filter(Credential.email == owner_registration_model.email).first() is not None:
        return RETURN_USER_ALREADY_EXISTS, 'Email already in use'

    # check if password is long enough
    if len(owner_registration_model.password_hash) != LENGTH_OF_SHA256:
        return RETURN_INCORRECT_LENGTH, 'Password too short'

    # add owner to database
    new_credential = Credential(email=owner_registration_model.email,
                                password_hash=owner_registration_model.password_hash)
    session.add(new_credential)
    session.flush()  # This ensures new_credential.id is available immediately after the add, without needing to commit first

    # Now, directly use new_credential.id for the credentials field
    session.add(Owner(
        full_name=owner_registration_model.full_name,
        phone_number=owner_registration_model.phone_number,
        full_address=owner_registration_model.full_address,
        email=owner_registration_model.email,
        credentials=new_credential.id))  # Use the ID directly
    session.commit()
    return RETURN_SUCCESS, 'Owner registered'
