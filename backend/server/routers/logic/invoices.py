from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import Invoice, InvoicePosition, InvoicesForSpace, Utility, BillingBasis
from ..models import UtilityModel, NewUtilityModel
from .database_handler.util import get_database_session
import os
import logging

RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_BUILDING_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_all_utilities():
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Utilities found"
        utilities = session.query(Utility).all()
        return_utils = []
        if not utilities:
            code = RETURN_FAILURE
            message = "Utilities not found"
        else:
            for utility in utilities:
                return_utils.append({
                    'id': utility.id,
                    'name': utility.name,
                    'price_per_unit': float(utility.price_per_unit),
                    'unit': utility.unit
                })
        return code, message, return_utils


def is_utility_correct(utility_model: UtilityModel):
    if None in utility_model.__dict__.values() or "" in utility_model.__dict__.values():
        return False
    if utility_model.price_per_unit <= 0:
        return False
    if len(utility_model.name) > 40 or len(utility_model.unit) > 10:
        return False
    return True


def create_utility(utility_model: NewUtilityModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Utility created"

        if None in utility_model.__dict__.values() or "" in utility_model.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if utility_model.price_per_unit <= 0:
            code = RETURN_FAILURE
            message = "price_per_unit must be greater than 0"
            return code, message

        if session.query(Utility).filter(Utility.name == utility_model.name).first() is not None:
            code = RETURN_BUILDING_ALREADY_EXISTS
            message = "Utility with this name already exists"
            return code, message
        
        if len(utility_model.name) > 40:
            code = RETURN_INCORRECT_LENGTH
            message = "Name of utility is too long"
            return code, message
        
        billing_basis_ids = session.query(BillingBasis.id).all()
        billing_basis_ids = [id[0] for id in billing_basis_ids]
        if utility_model.billing_basis_id not in billing_basis_ids:
            code = RETURN_FAILURE
            message = "Billing basis not found"
            return code, message

        price_per_unit = Decimal(utility_model.price_per_unit).quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        logger.info(price_per_unit)
        utility = Utility(name=utility_model.name,
                          price_per_unit=price_per_unit,
                          billing_basis=utility_model.billing_basis_id)
        session.add(utility)
        session.commit()

        return code, message

def update_utility(utility_model: UtilityModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Utility updated"

        if None in utility_model.__dict__.values() or "" in utility_model.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if utility_model.price_per_unit <= 0:
            code = RETURN_FAILURE
            message = "price_per_unit must be greater than 0"
            return code, message

        utility = session.query(Utility).filter(Utility.id == utility_model.id).first()
        if utility is None:
            code = RETURN_FAILURE
            message = "Utility not found"
            return code, message

        utility.name = utility_model.name
        utility.price_per_unit = Decimal(utility_model.price_per_unit).quantize(Decimal('0.00'),
                                                                                 rounding=ROUND_HALF_UP)
        utility.unit = utility_model.unit
        session.commit()

        return code, message

def remove_utility(utility_id: int):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Utility deleted"

        utility = session.query(Utility).filter(Utility.id == utility_id).first()
        if utility is None:
            code = RETURN_FAILURE
            message = "Utility not found"
            return code, message

        session.delete(utility)
        session.commit()

        return code, message


    