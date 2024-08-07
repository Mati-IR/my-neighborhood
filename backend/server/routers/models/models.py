from datetime import datetime, date
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, validator


class SignInRequestModel(BaseModel):
    email: str
    password_hash: str


class AdminRegistrationModel(BaseModel):
    email: str
    password_hash: str
    full_name: str
    phone_number: str
    salary: float
    salary_currency: str


class OwnerRegistrationModel(BaseModel):
    email: str
    password_hash: str
    full_name: str
    phone_number: str
    full_address: str


class OwnerUpdateModel(BaseModel):
    id: int
    full_name: str
    phone_number: str
    full_address: str
    email: str


class AdminUpdateModel(BaseModel):
    id: int
    full_name: str
    phone_number: str
    salary: float
    salary_currency: str
    email: str


class CredentialsModel(BaseModel):
    email: str
    password_hash: str


class BuildingModel(BaseModel):
    building_name: str
    city: str
    street: str
    building_number: str
    postal_code: str
    floors_amount: int


class SpaceModel(BaseModel):
    space_number: str
    area: float
    space_type: int
    floor: int
    building_id: int


class SpaceToOwnerModel(BaseModel):
    space_id: int
    share: float
    purchase_date: datetime
    owner_id: int


class RemoveOwnerFromSpaceModel(BaseModel):
    space_id: int
    owner_id: int


class NewNewsModel(BaseModel):
    title: str
    description: str
    creation_date: datetime
    creator_id: int


class NewsModel(BaseModel):
    id: int
    title: str
    description: str
    creation_date: datetime
    creator_id: int


class NewLeaseAgreementModel(BaseModel):
    rent: float
    renter_full_name: str
    phone_number: str
    email: EmailStr
    space_id: int
    start_date: date
    end_date: date


class LeaseAgreementModel(BaseModel):
    id: int
    rent: float
    renter_full_name: str
    phone_number: str
    email: EmailStr
    space_id: int
    start_date: date
    end_date: date


class NewUtilityModel(BaseModel):
    name: str
    price_per_unit: float
    billing_basis_id: int
    unit: str


class UtilityModel(BaseModel):
    id: int
    name: str
    price_per_unit: float
    billing_basis_id: int
    unit: str


class GetUserModel(BaseModel):
    id: int
    is_admin: bool


class NewServicemanModel(BaseModel):
    full_name: str
    specialties: str
    company_id: str


class ServicemanModel(BaseModel):
    id: int
    full_name: str
    specialties: str
    company_id: str


class NewVotingModel(BaseModel):
    start_date: datetime
    end_date: datetime
    title: str
    description: str
    creator_id: int


class VoteModel(BaseModel):
    owner_id: int
    voting_id: int
    vote: bool
    is_admin: bool


class NewIncidentModel(BaseModel):
    category_id: int
    title: str
    description: str
    location: str
    owner_id: int


class IncidentUpdateModel(BaseModel):
    id: int
    state_id: int
    admin_id: int


class IncidentModel(BaseModel):
    id: int
    category_id: int
    title: str
    description: str
    admin_id: int
    location: str
    creation_date: datetime
    closure_date: datetime
    state: int
    owner_id: int

class OccupantModel(BaseModel):
    name: str
    surname: str
    space_id: int


class NewInvoiceModel(BaseModel):
    space_id: int
    year: int
    month: int

class WaterMeterReadingModel(BaseModel):
    id: Optional[int] = None
    space_id: int
    date: date
    cold_water: float
    hot_water: float
