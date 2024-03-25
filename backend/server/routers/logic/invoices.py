from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import Invoice, InvoicePosition, InvoicesForSpace, Utility, BillingBasis, Space, InvoicesForSpace, OccupantsOfSpace
from ..models import UtilityModel, NewUtilityModel, NewInvoiceModel, WaterMeterReading
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
        
        if len(utility_model.name) > 40 or len(utility_model.unit) > 15:
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
                          billing_basis=utility_model.billing_basis_id,
                          unit=utility_model.unit)
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


def generate_new_random_invoice(new_invoice: NewInvoiceModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = []

        utilies = session.query(Utility).all()

        return_utils = []
        if not utilies:
           return RETURN_FAILURE, "Utilities not found"
        elif session.query(Space).filter(Space.id == new_invoice.space_id).first() is None:
            return RETURN_FAILURE, "Space not found"
        elif session.query(Invoice).filter(Invoice.space_id == new_invoice.space_id, \
                                           Invoice.month == new_invoice.month, \
                                           Invoice.year == new_invoice.year).first() is not None:
            return RETURN_BUILDING_ALREADY_EXISTS, "Invoice for this space and month already exists"

        else:
            # create new invoice
            new_invoice = Invoice(year=new_invoice.year, month=new_invoice.month, space_id=new_invoice.space_id)
            session.add(new_invoice)
            session.commit()

            # populate invoice with random utilities
            for utility in utilies:
                billing_basis = session.query(BillingBasis).filter(BillingBasis.id == utility.billing_basis).first()
                
                basis_multiplier = 0
                if billing_basis is None:
                    return RETURN_FAILURE, "Billing basis not found"
                elif billing_basis.basis == 'Per square meter':
                    basis_multiplier = float(session.query(Space).filter(Space.id == new_invoice.space_id).first().area)
                elif billing_basis.basis == 'Per opccupant':
                    basis_multiplier = session.query(OccupantsOfSpace).filter(OccupantsOfSpace.space_id == new_invoice.space_id).count()
                import random
                return_utils.append({
                    'id': utility.id,
                    'name': utility.name,
                    'amount': float(basis_multiplier),
                    'price_per_unit': float(utility.price_per_unit),
                    'billing_basis': billing_basis.basis,
                    'price': float(utility.price_per_unit) * basis_multiplier

                })
                new_invoice_position = InvoicePosition(utility_id=utility.id, \
                                                       invoice_id=new_invoice.id, \
                                                       price=float(utility.price_per_unit) * return_utils[-1]['amount'])
                session.add(new_invoice_position)
                session.commit()
            association = InvoicesForSpace(space_id=new_invoice.space_id, invoice_id=new_invoice.id)
            session.add(association)
            session.commit()
        return code, return_utils
    
def get_existing_invoice(invoice: NewInvoiceModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = []

        invoice = session.query(Invoice).filter(Invoice.space_id == invoice.space_id, \
                                                Invoice.month == invoice.month, \
                                                Invoice.year == invoice.year).first()
        if invoice is None:
            return RETURN_FAILURE, "Invoice not found"
        else:
            invoice_positions = session.query(InvoicePosition).filter(InvoicePosition.invoice_id == invoice.id).all()
            return_utils = []
            for position in invoice_positions:
                utility = session.query(Utility).filter(Utility.id == position.utility_id).first()
                billing_basis = session.query(BillingBasis).filter(BillingBasis.id == utility.billing_basis).first()
                return_utils.append({
                    'id': utility.id,
                    'name': utility.name,
                    'price': float(position.price),
                    'price_per_unit': float(utility.price_per_unit),
                    'billing_basis': billing_basis.basis,
                    'amount': round(float(position.price) / float(utility.price_per_unit), 2)
                })
        return code, return_utils
    
def new_water_meter_reading(water_meter_reading: WaterMeterReading):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Water meter reading created"

        if None in water_meter_reading.__dict__.values() or "" in water_meter_reading.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if water_meter_reading.date is None:
            code = RETURN_FAILURE
            message = "Please provide date"
            return code, message

        if water_meter_reading.is_cold_water not in [0, 1]:
            code = RETURN_FAILURE
            message = "is_cold_water must be 0 or 1"
            return code, message

        if session.query(Space).filter(Space.id == water_meter_reading.space_id).first() is None:
            code = RETURN_FAILURE
            message = "Space not found"
            return code, message

        water_meter_reading = WaterMeterReading(space_id=water_meter_reading.space_id, \
                                                date=water_meter_reading.date, \
                                                is_cold_water=water_meter_reading.is_cold_water)
        session.add(water_meter_reading)
        session.commit()

        return code, message

def update_water_meter_reading(water_meter_reading: WaterMeterReading):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Water meter reading updated"

        if None in water_meter_reading.__dict__.values() or "" in water_meter_reading.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if water_meter_reading.date is None:
            code = RETURN_FAILURE
            message = "Please provide date"
            return code, message

        if water_meter_reading.is_cold_water not in [0, 1]:
            code = RETURN_FAILURE
            message = "is_cold_water must be 0 or 1"
            return code, message

        water_meter_reading = session.query(WaterMeterReading).filter(WaterMeterReading.id == water_meter_reading.id).first()
        if water_meter_reading is None:
            code = RETURN_FAILURE
            message = "Water meter reading not found"
            return code, message

        water_meter_reading.date = water_meter_reading.date
        water_meter_reading.is_cold_water = water_meter_reading.is_cold_water
        session.commit()

        return code, message
    
def delete_water_meter_reading(water_meter_reading_id: int):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Water meter reading deleted"

        water_meter_reading = session.query(WaterMeterReading).filter(WaterMeterReading.id == water_meter_reading_id).first()
        if water_meter_reading is None:
            code = RETURN_FAILURE
            message = "Water meter reading not found"
            return code, message

        session.delete(water_meter_reading)
        session.commit()

        return code, message
    
def get_water_meter_readings(space_id: int):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = []

        water_meter_readings = session.query(WaterMeterReading).filter(WaterMeterReading.space_id == space_id).all()
        return_utils = []
        if not water_meter_readings:
            return RETURN_FAILURE, "Water meter readings not found"
        else:
            for reading in water_meter_readings:
                return_utils.append({
                    'id': reading.id,
                    'space_id': reading.space_id,
                    'date': reading.date,
                    'is_cold_water': reading.is_cold_water,
                    'liters_reading': reading.liters_reading
                })
        return code, return_utils
    